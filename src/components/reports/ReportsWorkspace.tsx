"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson2,
  FileText,
  Filter,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceRowsSkeleton, WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import WorkspaceGuidePage from "@/components/guides/WorkspaceGuidePage";
import {
  ApiError,
  createReport,
  deleteReport,
  getReport,
  getReportArtifacts,
  listAssets,
  listReports,
  retryReport,
  type Asset,
  type FindingSeverity,
  type ReportArtifact,
  type ReportEvent,
  type ReportSnapshot,
  type ReportStatus,
  type ReportType,
  type VaptReport,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";


const EMPTY_SUMMARY = { active: 0, ready: 0, failed: 0, expired: 0, this_month: 0 };
const REPORT_TYPES: Array<{ value: ReportType; label: string; helper: string }> = [
  { value: "full_vapt", label: "Full VAPT", helper: "Executive summary, scope and all technical Findings" },
  { value: "executive", label: "Executive", helper: "Board-ready posture and critical priorities" },
  { value: "technical", label: "Technical", helper: "Detailed Findings, evidence and remediation" },
  { value: "retest", label: "Retest", helper: "Closure and recurrence evidence after remediation" },
];
const ACTIVE_REPORT_STATUSES: ReportStatus[] = ["queued", "generating", "retrying"];


function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function statusClass(status: ReportStatus) {
  if (status === "ready") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "failed" || status === "expired") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "retrying") return "bg-violet-50 text-violet-700 ring-violet-100";
  if (status === "generating") return "bg-cyan-50 text-cyan-700 ring-cyan-100";
  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function severityClass(severity: FindingSeverity) {
  if (severity === "critical") return "bg-rose-100 text-rose-800 ring-rose-200";
  if (severity === "high") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (severity === "medium") return "bg-amber-50 text-amber-800 ring-amber-100";
  if (severity === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  return "bg-cyan-50 text-cyan-700 ring-cyan-100";
}

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ring-1 ${className}`}>{children}</span>;
}

function Notice({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3 rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-[11px] font-bold text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{children}</div>;
}

function Skeleton() {
  return <WorkspaceRowsSkeleton />;
}

function ReportProgress({ report }: { report: VaptReport }) {
  const active = ACTIVE_REPORT_STATUSES.includes(report.status);
  return <div className="grid gap-2"><div className="flex items-center justify-between gap-3 text-[9px] font-black uppercase text-slate-500"><span>{titleCase(report.stage)}</span><span>{report.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${report.status === "failed" ? "bg-rose-500" : "bg-[#2ECE82]"} ${active ? "animate-pulse" : ""}`} style={{ width: `${Math.max(3, report.progress)}%` }} /></div></div>;
}

function ReportsList() {
  const router = useRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [rows, setRows] = useState<VaptReport[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [pagination, setPagination] = useState({ page: 1, page_size: 10, total: 0, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportStatus, setReportStatus] = useState<"" | ReportStatus>("");
  const [reportType, setReportType] = useState<"" | ReportType>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedOrganizationRef = useRef<number | null>(null);
  const canCreate = activeWorkspace?.permissions.actions.reports?.includes("create") ?? false;

  const load = useCallback(async (quiet = false) => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    const organizationChanged = loadedOrganizationRef.current !== activeOrganizationId;
    if (!quiet && organizationChanged) {
      setRows([]);
      setLoading(true);
    }
    try {
      const response = await listReports(access, activeOrganizationId, { page, page_size: 10, search, status: reportStatus || undefined, report_type: reportType || undefined });
      setRows(response.results);
      setSummary(response.summary);
      setPagination(response.pagination);
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load VAPT Reports."));
    } finally {
      if (!quiet) {
        loadedOrganizationRef.current = activeOrganizationId;
        setLoading(false);
      }
    }
  }, [activeOrganizationId, page, reportStatus, reportType, search]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { setPage(1); }, [search, reportStatus, reportType, activeOrganizationId]);
  useEffect(() => {
    if (!rows.some((report) => ACTIVE_REPORT_STATUSES.includes(report.status))) return;
    const timer = window.setInterval(() => void load(true), 2500);
    return () => window.clearInterval(timer);
  }, [load, rows]);

  if (loading && rows.length === 0) return <WorkspaceSkeleton rows={6} />;

  const metrics = [
    { label: "Generating", value: summary.active, helper: "background jobs", tone: "bg-amber-50 text-amber-700 ring-amber-100", Icon: LoaderCircle },
    { label: "Ready", value: summary.ready, helper: "signed download", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", Icon: ShieldCheck },
    { label: "This month", value: summary.this_month, helper: "immutable snapshots", tone: "bg-cyan-50 text-cyan-700 ring-cyan-100", Icon: CalendarDays },
    { label: "Failed", value: summary.failed, helper: "retry available", tone: "bg-rose-50 text-rose-700 ring-rose-100", Icon: AlertCircle },
  ];

  return <div className="grid min-w-0 gap-4">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase text-[#0891B2]">Immutable security deliverables</p><h2 className="mt-1 text-[24px] font-black leading-tight text-slate-950">VAPT Reports</h2><p className="mt-1 max-w-3xl text-[11px] font-semibold leading-relaxed text-slate-500">Generate fixed PDF and JSON evidence packets from tenant Assets and normalized Findings.</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => void load()} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>{canCreate ? <button type="button" onClick={() => router.push("/reports/new")} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[11px] font-black text-white"><Plus className="h-4 w-4 text-[#2ECE82]" />Generate report</button> : null}</div></div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, helper, tone, Icon }) => <article key={label} className="flex min-h-[78px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-3.5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.03)]"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${tone}`}><Icon className={`h-4.5 w-4.5 ${label === "Generating" && value ? "animate-spin" : ""}`} /></span><div className="min-w-0"><p className="text-[9px] font-black uppercase text-slate-500">{label}</p><div className="mt-1 flex items-baseline gap-2"><span className="text-[22px] font-black leading-none text-slate-950">{value}</span><span className="truncate text-[9px] font-bold text-slate-400">{helper}</span></div></div></article>)}</section>
    <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="grid gap-2 border-b border-slate-100 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1fr)_180px_180px_auto]"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or requester" className="h-10 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-bold outline-none focus:border-[#2ECE82]" /></label><select value={reportStatus} onChange={(event) => setReportStatus(event.target.value as "" | ReportStatus)} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All status</option>{(["queued", "generating", "retrying", "ready", "failed", "expired"] as ReportStatus[]).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select><select value={reportType} onChange={(event) => setReportType(event.target.value as "" | ReportType)} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All report types</option>{REPORT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><span className="hidden h-10 items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 lg:flex"><Filter className="h-3.5 w-3.5" />Tenant scoped</span></div>
      {loading ? <div className="p-4"><Skeleton /></div> : rows.length === 0 ? <div className="grid min-h-[300px] place-items-center p-6 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><FileText className="h-5 w-5" /></span><h3 className="mt-4 text-[15px] font-black text-slate-950">No VAPT Reports yet</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Create the first immutable report from this workspace&apos;s real Findings.</p>{canCreate ? <button type="button" onClick={() => router.push("/reports/new")} className="mt-4 inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#071010] px-3 text-[10px] font-black text-white"><Plus className="h-3.5 w-3.5 text-[#2ECE82]" />Generate report</button> : null}</div></div> : <><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[980px] text-left"><thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500"><tr><th className="px-4 py-3">Report</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3">Findings</th><th className="px-4 py-3">Lifecycle</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Open</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((report) => <tr key={report.id} className="text-[11px] font-bold text-slate-600 hover:bg-slate-50/80"><td className="max-w-[300px] px-4 py-3"><p className="truncate font-black text-slate-950">{report.title}</p><p className="mt-1 truncate text-[9px] text-slate-400">{report.requested_by_email}</p></td><td className="px-4 py-3 font-black text-slate-800">{titleCase(report.report_type)}</td><td className="px-4 py-3"><p className="font-black text-slate-800">{report.summary.asset_count ?? 0} Assets</p><p className="mt-0.5 text-[9px] text-slate-400">{titleCase(report.scope_type)}</p></td><td className="px-4 py-3"><div className="flex items-center gap-1"><span className="rounded-full bg-rose-50 px-2 py-1 text-[9px] font-black text-rose-700">{report.summary.severity_counts?.critical ?? 0} C</span><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-black text-orange-700">{report.summary.severity_counts?.high ?? 0} H</span><span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-700">{report.summary.severity_counts?.medium ?? 0} M</span></div></td><td className="min-w-[180px] px-4 py-3"><Badge className={statusClass(report.status)}>{titleCase(report.status)}</Badge><div className="mt-2"><ReportProgress report={report} /></div></td><td className="px-4 py-3 text-[10px] text-slate-500">{formatDate(report.created_at)}</td><td className="px-4 py-3 text-right"><button type="button" onClick={() => router.push(`/reports/${report.id}`)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600" title="Open report"><ArrowRight className="h-4 w-4" /></button></td></tr>)}</tbody></table></div><div className="grid gap-2 p-3 md:hidden">{rows.map((report) => <button key={report.id} type="button" onClick={() => router.push(`/reports/${report.id}`)} className="grid gap-3 rounded-[8px] border border-slate-200 p-3 text-left"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[12px] font-black text-slate-950">{report.title}</p><p className="mt-1 text-[9px] font-bold text-slate-500">{titleCase(report.report_type)} | {report.summary.finding_count ?? 0} Findings</p></div><ArrowRight className="h-4 w-4 text-slate-400" /></div><Badge className={statusClass(report.status)}>{titleCase(report.status)}</Badge><ReportProgress report={report} /></button>)}</div></>}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-500"><span>{pagination.total} Reports</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-16 text-center font-black text-slate-700">{page} / {pagination.total_pages}</span><button type="button" disabled={page >= pagination.total_pages} onClick={() => setPage((value) => value + 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>
    </section>
  </div>;
}

function ReportBuilder() {
  const router = useRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", report_type: "full_vapt" as ReportType, scope_type: "workspace" as "workspace" | "selected_assets",
    asset_ids: [] as string[], formats: ["pdf", "json"] as Array<"pdf" | "json">,
    include_resolved: true, include_false_positives: false, date_from: "", date_to: "",
  });
  const canCreate = activeWorkspace?.permissions.actions.reports?.includes("create") ?? false;

  useEffect(() => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setLoadingAssets(true);
    void listAssets(access, activeOrganizationId, { page_size: 100 }).then((response) => {
      setAssets(response.results.filter((asset) => asset.status !== "archived"));
      setError("");
    }).catch((requestError) => setError(errorMessage(requestError, "Could not load Assets for report scope."))).finally(() => setLoadingAssets(false));
  }, [activeOrganizationId]);

  const selectedAssets = useMemo(() => assets.filter((asset) => form.scope_type === "workspace" || form.asset_ids.includes(asset.id)), [assets, form.asset_ids, form.scope_type]);
  const estimatedFindings = selectedAssets.reduce((total, asset) => total + Object.values(asset.finding_counts || {}).reduce((sum, count) => sum + count, 0), 0);

  const toggleAsset = (assetId: string) => setForm((current) => ({ ...current, asset_ids: current.asset_ids.includes(assetId) ? current.asset_ids.filter((id) => id !== assetId) : [...current.asset_ids, assetId] }));
  const toggleFormat = (format: "pdf" | "json") => setForm((current) => {
    if (current.formats.includes(format) && current.formats.length === 1) return current;
    return { ...current, formats: current.formats.includes(format) ? current.formats.filter((item) => item !== format) : [...current.formats, format] };
  });

  if (loadingAssets) return <WorkspaceSkeleton detail />;

  const submit = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !canCreate) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await createReport(access, activeOrganizationId, {
        title: form.title, report_type: form.report_type, scope_type: form.scope_type,
        asset_ids: form.scope_type === "selected_assets" ? form.asset_ids : [], formats: form.formats,
        include_resolved: form.include_resolved, include_false_positives: form.include_false_positives,
        date_from: form.date_from || null, date_to: form.date_to || null,
      });
      router.push(`/reports/${response.result.id}`);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not queue this report."));
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="grid min-w-0 gap-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => router.push("/reports")} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700"><ArrowLeft className="h-4 w-4" />Reports</button><Badge className="bg-emerald-50 text-emerald-700 ring-emerald-100"><ShieldCheck className="h-3 w-3" />Immutable snapshot</Badge></div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      <div className="grid gap-4">
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><p className="text-[10px] font-black uppercase text-[#0891B2]">Report identity</p><h2 className="mt-1 text-[24px] font-black text-slate-950">Generate VAPT Report</h2><p className="mt-1 text-[11px] font-semibold text-slate-500">The selected tenant data is copied into an immutable snapshot before the worker starts.</p><label className="mt-4 grid gap-1.5"><span className="text-[9px] font-black uppercase text-slate-500">Report title</span><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Q3 Customer Portal VAPT Assessment" maxLength={240} className="h-11 rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-[12px] font-bold outline-none focus:border-[#2ECE82]" /></label></article>
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><h3 className="text-[16px] font-black text-slate-950">Report type</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{REPORT_TYPES.map((item) => <button key={item.value} type="button" onClick={() => setForm((current) => ({ ...current, report_type: item.value }))} className={`rounded-[8px] border p-3 text-left transition ${form.report_type === item.value ? "border-[#2ECE82] bg-emerald-50 ring-1 ring-[#2ECE82]/25" : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="flex items-start justify-between gap-2"><p className="text-[12px] font-black text-slate-950">{item.label}</p>{form.report_type === item.value ? <CheckCircle2 className="h-4 w-4 text-[#16A86E]" /> : null}</div><p className="mt-1 text-[10px] font-semibold leading-relaxed text-slate-500">{item.helper}</p></button>)}</div></article>
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-[16px] font-black text-slate-950">Asset scope</h3><p className="mt-1 text-[10px] font-semibold text-slate-500">Reports never cross the active tenant boundary.</p></div><div className="inline-flex rounded-[8px] border border-slate-200 bg-slate-50 p-1"><button type="button" onClick={() => setForm((current) => ({ ...current, scope_type: "workspace", asset_ids: [] }))} className={`h-8 rounded-[6px] px-3 text-[9px] font-black ${form.scope_type === "workspace" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Entire workspace</button><button type="button" onClick={() => setForm((current) => ({ ...current, scope_type: "selected_assets" }))} className={`h-8 rounded-[6px] px-3 text-[9px] font-black ${form.scope_type === "selected_assets" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Selected Assets</button></div></div>{loadingAssets ? <div className="mt-3 h-28 animate-pulse rounded-[8px] bg-slate-100" /> : assets.length === 0 ? <div className="mt-3 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-[10px] font-bold text-amber-800">No Assets are available. <Link href="/assets/new" className="underline">Add and verify an Asset first.</Link></div> : form.scope_type === "selected_assets" ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{assets.map((asset) => <button key={asset.id} type="button" onClick={() => toggleAsset(asset.id)} className={`flex items-start gap-3 rounded-[8px] border p-3 text-left ${form.asset_ids.includes(asset.id) ? "border-[#2ECE82] bg-emerald-50" : "border-slate-200 bg-white"}`}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border ${form.asset_ids.includes(asset.id) ? "border-[#16A86E] bg-[#16A86E] text-white" : "border-slate-300"}`}>{form.asset_ids.includes(asset.id) ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}</span><span className="min-w-0"><span className="block truncate text-[11px] font-black text-slate-950">{asset.name}</span><span className="mt-1 block truncate font-mono text-[9px] text-slate-500">{asset.canonical_target}</span></span></button>)}</div> : <div className="mt-3 rounded-[8px] border border-emerald-100 bg-emerald-50 p-3 text-[10px] font-bold text-emerald-800">All {assets.length} current Asset(s) will be captured.</div>}</article>
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><h3 className="text-[16px] font-black text-slate-950">Evidence filters and outputs</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-slate-500">Finding date from</span><input type="date" value={form.date_from} onChange={(event) => setForm((current) => ({ ...current, date_from: event.target.value }))} className="h-10 rounded-[8px] border border-slate-200 px-3 text-[10px] font-bold" /></label><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-slate-500">Finding date to</span><input type="date" value={form.date_to} onChange={(event) => setForm((current) => ({ ...current, date_to: event.target.value }))} className="h-10 rounded-[8px] border border-slate-200 px-3 text-[10px] font-bold" /></label></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => setForm((current) => ({ ...current, include_resolved: !current.include_resolved }))} className={`flex items-center justify-between rounded-[8px] border p-3 text-left ${form.include_resolved ? "border-[#2ECE82] bg-emerald-50" : "border-slate-200"}`}><span><span className="block text-[11px] font-black text-slate-950">Include resolved</span><span className="mt-1 block text-[9px] font-semibold text-slate-500">Preserve remediation history</span></span><CheckCircle2 className={`h-4 w-4 ${form.include_resolved ? "text-[#16A86E]" : "text-slate-300"}`} /></button><button type="button" onClick={() => setForm((current) => ({ ...current, include_false_positives: !current.include_false_positives }))} className={`flex items-center justify-between rounded-[8px] border p-3 text-left ${form.include_false_positives ? "border-[#2ECE82] bg-emerald-50" : "border-slate-200"}`}><span><span className="block text-[11px] font-black text-slate-950">Include false positives</span><span className="mt-1 block text-[9px] font-semibold text-slate-500">Show analyst exclusions</span></span><CheckCircle2 className={`h-4 w-4 ${form.include_false_positives ? "text-[#16A86E]" : "text-slate-300"}`} /></button></div><div className="mt-3 flex flex-wrap gap-2">{(["pdf", "json"] as const).map((format) => <button key={format} type="button" onClick={() => toggleFormat(format)} className={`inline-flex h-10 items-center gap-2 rounded-[8px] border px-3 text-[10px] font-black uppercase ${form.formats.includes(format) ? "border-[#2ECE82] bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500"}`}>{format === "pdf" ? <FileText className="h-4 w-4" /> : <FileJson2 className="h-4 w-4" />}{format}</button>)}</div></article>
      </div>
      <aside className="grid gap-4 xl:sticky xl:top-24"><article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-4 text-white shadow-[0_14px_34px_rgba(7,16,16,0.16)]"><p className="text-[9px] font-black uppercase text-[#04D9FF]">Snapshot preview</p><h3 className="mt-1 text-[20px] font-black">{form.title || "Untitled VAPT Report"}</h3><p className="mt-1 text-[10px] font-semibold text-white/55">{REPORT_TYPES.find((item) => item.value === form.report_type)?.label}</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-[8px] bg-white/[0.06] p-3"><p className="text-[9px] font-black uppercase text-white/45">Assets</p><p className="mt-1 text-[22px] font-black">{selectedAssets.length}</p></div><div className="rounded-[8px] bg-white/[0.06] p-3"><p className="text-[9px] font-black uppercase text-white/45">Current risk records</p><p className="mt-1 text-[22px] font-black">{estimatedFindings}</p></div></div><div className="mt-3 grid gap-2 text-[10px] font-bold text-white/70"><div className="flex items-center justify-between"><span>Formats</span><span>{form.formats.join(" + ").toUpperCase()}</span></div><div className="flex items-center justify-between"><span>Retention</span><span>{activeWorkspace?.report_retention_days ?? 365} days</span></div><div className="flex items-center justify-between"><span>Scope</span><span>{form.scope_type === "workspace" ? "Workspace" : "Selected"}</span></div></div><button type="button" disabled={submitting || loadingAssets || !canCreate || form.title.trim().length < 3 || selectedAssets.length === 0} onClick={() => void submit()} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[11px] font-black text-[#071010] disabled:cursor-not-allowed disabled:opacity-45">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}{submitting ? "Capturing snapshot" : "Generate report"}</button></article><article className="rounded-[8px] border border-slate-200 bg-white p-4"><h3 className="text-[13px] font-black text-slate-950">Generation flow</h3><div className="mt-3 grid gap-3">{["Capture tenant snapshot", "Queue report worker", "Render PDF and JSON", "Store immutable artifacts", "Create signed downloads"].map((label, index) => <div key={label} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] font-black text-slate-600">{index + 1}</span><span className="text-[10px] font-bold text-slate-600">{label}</span></div>)}</div></article></aside>
    </section>
  </div>;
}

function ReportDetail({ reportId }: { reportId: string }) {
  const router = useRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [report, setReport] = useState<VaptReport | null>(null);
  const [events, setEvents] = useState<ReportEvent[]>([]);
  const [artifacts, setArtifacts] = useState<ReportArtifact[]>([]);
  const [snapshot, setSnapshot] = useState<ReportSnapshot | null>(null);
  const [links, setLinks] = useState<Array<ReportArtifact & { download_url: string; expires_in: number }>>([]);
  const [previewPage, setPreviewPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const canDownload = activeWorkspace?.permissions.actions.reports?.includes("download") ?? false;
  const canExecute = activeWorkspace?.permissions.actions.reports?.includes("execute") ?? false;
  const canDelete = activeWorkspace?.permissions.actions.reports?.includes("delete") ?? false;

  const load = useCallback(async (quiet = false) => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    if (!quiet) setLoading(true);
    try {
      const response = await getReport(access, activeOrganizationId, reportId);
      setReport(response.result);
      setEvents(response.events);
      setArtifacts(response.artifacts);
      setSnapshot(response.snapshot);
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load this report."));
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [activeOrganizationId, reportId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => setPreviewPage(1), [reportId]);
  useEffect(() => {
    if (!report || !ACTIVE_REPORT_STATUSES.includes(report.status)) return;
    const timer = window.setInterval(() => void load(true), 2000);
    return () => window.clearInterval(timer);
  }, [load, report]);

  const prepareDownloads = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setWorking(true);
    try {
      const response = await getReportArtifacts(access, activeOrganizationId, reportId);
      setLinks(response.results);
      setError("");
      await load(true);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not prepare report downloads."));
    } finally {
      setWorking(false);
    }
  };

  const retry = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setWorking(true);
    try {
      await retryReport(access, activeOrganizationId, reportId);
      setLinks([]);
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not retry this report."));
    } finally {
      setWorking(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove this report from the workspace catalogue?")) return;
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setWorking(true);
    try {
      await deleteReport(access, activeOrganizationId, reportId);
      router.push("/reports");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not remove this report."));
      setWorking(false);
    }
  };

  if (loading) return <WorkspaceSkeleton detail />;
  if (!report) return <div className="grid gap-4"><button type="button" onClick={() => router.push("/reports")} className="inline-flex h-9 w-fit items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black"><ArrowLeft className="h-4 w-4" />Reports</button><Notice>{error || "Report not found."}</Notice></div>;

  const counts = snapshot?.severity_counts || { informational: 0, low: 0, medium: 0, high: 0, critical: 0 };
  const previewFindings = snapshot?.findings_preview || [];
  const previewPages = Math.max(1, Math.ceil(previewFindings.length / 10));
  return <div data-report-detail data-preview-page={previewPage} className="grid min-w-0 gap-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => router.push("/reports")} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700"><ArrowLeft className="h-4 w-4" />Reports</button><div className="flex flex-wrap gap-2">{report.status === "failed" && canExecute ? <button type="button" disabled={working} onClick={() => void retry()} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-violet-200 bg-violet-50 px-3 text-[10px] font-black text-violet-700"><RotateCcw className="h-4 w-4" />Retry snapshot</button> : null}{report.status === "ready" && canDownload ? <button type="button" disabled={working} onClick={() => void prepareDownloads()} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#071010] px-3 text-[10px] font-black text-white"><Download className="h-4 w-4 text-[#2ECE82]" />Prepare downloads</button> : null}{canDelete && !ACTIVE_REPORT_STATUSES.includes(report.status) ? <button type="button" disabled={working} onClick={() => void remove()} className="grid h-9 w-9 place-items-center rounded-[8px] border border-rose-200 bg-rose-50 text-rose-700" title="Remove report"><Trash2 className="h-4 w-4" /></button> : null}</div></div>
    {error ? <Notice>{error}</Notice> : null}
    {previewPages > 1 ? <div className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2"><div><p className="text-[10px] font-black text-slate-800">Finding preview</p><p className="text-[9px] font-semibold text-slate-500">10 snapshot records per page</p></div><div className="flex items-center gap-2"><button type="button" disabled={previewPage <= 1} onClick={() => setPreviewPage((page) => Math.max(1, page - 1))} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-35" aria-label="Previous Finding preview page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-14 text-center text-[10px] font-black text-slate-700">{previewPage} / {previewPages}</span><button type="button" disabled={previewPage >= previewPages} onClick={() => setPreviewPage((page) => Math.min(previewPages, page + 1))} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-35" aria-label="Next Finding preview page"><ChevronRight className="h-4 w-4" /></button></div></div> : null}
    <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]"><div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px]"><div><div className="flex flex-wrap items-center gap-2"><Badge className={statusClass(report.status)}>{ACTIVE_REPORT_STATUSES.includes(report.status) ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}{titleCase(report.status)}</Badge><Badge className="bg-slate-100 text-slate-600 ring-slate-200">{titleCase(report.report_type)}</Badge></div><h2 className="mt-3 text-[25px] font-black text-slate-950">{report.title}</h2><p className="mt-1 text-[11px] font-semibold text-slate-500">Requested by {report.requested_by_email} on {formatDate(report.created_at)}</p><div className="mt-4 max-w-2xl"><ReportProgress report={report} /></div>{report.error_detail ? <div className="mt-4 rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-[10px] font-bold text-rose-800">{report.error_detail}</div> : null}</div><div className="rounded-[8px] border border-[#2ECE82]/20 bg-[#071010] p-4 text-white"><p className="text-[9px] font-black uppercase text-[#04D9FF]">Snapshot integrity</p><p className="mt-2 break-all font-mono text-[10px] font-bold text-white/70">{report.snapshot_hash}</p><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-[8px] bg-white/[0.06] p-2.5"><p className="text-[8px] font-black uppercase text-white/40">Attempts</p><p className="mt-1 text-[18px] font-black">{report.attempt_count}</p></div><div className="rounded-[8px] bg-white/[0.06] p-2.5"><p className="text-[8px] font-black uppercase text-white/40">Downloads</p><p className="mt-1 text-[18px] font-black">{report.download_count}</p></div></div><p className="mt-3 text-[9px] font-semibold text-white/50">Retained until {formatDate(report.retention_expires_at)}</p></div></div></article>
    {links.length ? <section className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3"><div className="flex flex-wrap items-center gap-2"><span className="mr-auto text-[10px] font-black text-emerald-900">Signed links expire in {links[0]?.expires_in ?? 0} seconds.</span>{links.map((artifact) => <a key={artifact.format} href={artifact.download_url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-white px-3 text-[10px] font-black uppercase text-emerald-800 ring-1 ring-emerald-200">{artifact.format === "pdf" ? <FileText className="h-4 w-4" /> : <FileJson2 className="h-4 w-4" />}Download {artifact.format}</a>)}</div></section> : null}
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start"><div className="grid gap-4"><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{(["critical", "high", "medium", "low", "informational"] as FindingSeverity[]).map((severity) => <article key={severity} className="rounded-[8px] border border-slate-200 bg-white p-3"><Badge className={severityClass(severity)}>{titleCase(severity)}</Badge><p className="mt-3 text-[24px] font-black text-slate-950">{counts[severity] ?? 0}</p><p className="text-[9px] font-bold text-slate-400">snapshot Findings</p></article>)}</section><article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[15px] font-black text-slate-950">Snapshot scope</h3><p className="mt-1 text-[10px] font-semibold text-slate-500">{snapshot?.assets.length ?? 0} immutable Asset record(s)</p></div><div className="grid gap-2 p-3 sm:grid-cols-2">{snapshot?.assets.map((asset) => <div key={asset.id} className="rounded-[8px] border border-slate-200 bg-slate-50 p-3"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-black text-slate-950">{asset.name}</p><Badge className={severityClass((asset.risk === "unknown" ? "informational" : asset.risk) as FindingSeverity)}>{asset.risk}</Badge></div><p className="mt-1 truncate font-mono text-[9px] text-slate-500">{asset.target}</p></div>)}</div></article><article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[15px] font-black text-slate-950">Finding preview</h3><p className="mt-1 text-[10px] font-semibold text-slate-500">Showing up to 50 records from the issued snapshot</p></div>{snapshot?.findings_preview.length ? <div className="divide-y divide-slate-100">{snapshot.findings_preview.map((finding) => <div key={finding.id} className="grid gap-2 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"><div className="min-w-0"><p className="text-[11px] font-black text-slate-950">{finding.title}</p><p className="mt-1 truncate text-[9px] font-semibold text-slate-500">{finding.asset_name} | {finding.asset_target}</p><p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-relaxed text-slate-500">{finding.remediation || finding.description}</p></div><div className="flex flex-wrap gap-1.5"><Badge className={severityClass(finding.severity)}>{titleCase(finding.severity)}</Badge><Badge className="bg-slate-100 text-slate-600 ring-slate-200">{titleCase(finding.status)}</Badge></div></div>)}</div> : <div className="grid min-h-[180px] place-items-center p-4 text-center"><p className="text-[11px] font-bold text-slate-500">No Findings matched this report scope.</p></div>}</article></div><aside className="grid gap-4 xl:sticky xl:top-24"><article className="rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[15px] font-black text-slate-950">Artifacts</h3></div><div className="grid gap-2 p-3">{artifacts.length ? artifacts.map((artifact) => <div key={artifact.format} className="flex items-center gap-3 rounded-[8px] border border-slate-200 p-3"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">{artifact.format === "pdf" ? <FileText className="h-4 w-4" /> : <FileJson2 className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase text-slate-800">{artifact.format}</p><p className="mt-0.5 text-[9px] font-semibold text-slate-400">{formatBytes(artifact.size_bytes)}</p></div><CheckCircle2 className="h-4 w-4 text-[#16A86E]" /></div>) : <p className="p-2 text-[10px] font-semibold text-slate-500">Artifacts appear after the report worker finishes.</p>}</div></article><article className="rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[15px] font-black text-slate-950">Lifecycle</h3></div><div className="grid gap-0 p-3">{events.map((event, index) => <div key={`${event.event_type}-${event.created_at}-${index}`} className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-2 pb-4 last:pb-0"><div className="relative"><span className={`relative z-10 grid h-6 w-6 place-items-center rounded-full ${event.status === "failed" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{event.status === "failed" ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}</span>{index < events.length - 1 ? <span className="absolute left-1/2 top-6 h-full w-px -translate-x-1/2 bg-slate-200" /> : null}</div><div><p className="text-[10px] font-black text-slate-900">{titleCase(event.event_type.replace("report.", ""))}</p><p className="mt-1 text-[9px] font-semibold leading-relaxed text-slate-500">{event.message}</p><p className="mt-1 text-[8px] font-bold text-slate-400">{formatDate(event.created_at)}</p></div></div>)}</div></article></aside></section>
  </div>;
}

export default function ReportsWorkspace() {
  const pathname = usePathname();
  if (pathname === "/reports/guide") return <WorkspaceGuidePage guideId="reports" />;
  if (pathname === "/reports/new") return <ReportBuilder />;
  const match = pathname.match(/^\/reports\/([0-9a-f-]+)$/i);
  if (match) return <ReportDetail reportId={match[1]} />;
  return <ReportsList />;
}
