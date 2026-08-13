"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileJson2,
  Filter,
  Globe2,
  History,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceRowsSkeleton, WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import WorkspaceGuidePage from "@/components/guides/WorkspaceGuidePage";
import {
  ApiError,
  getFinding,
  getFindingEvidence,
  listAssets,
  listFindings,
  updateFinding,
  type Asset,
  type Finding,
  type FindingEvent,
  type FindingInstance,
  type FindingObservation,
  type FindingSeverity,
  type FindingStatus,
  type ScanArtifact,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";


const EMPTY_SUMMARY = { active: 0, resolved: 0, accepted_risk: 0, false_positive: 0, critical: 0, high: 0, medium: 0, low: 0, informational: 0 };

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function severityClass(severity: FindingSeverity) {
  if (severity === "critical") return "bg-rose-100 text-rose-800 ring-rose-200";
  if (severity === "high") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (severity === "medium") return "bg-amber-50 text-amber-800 ring-amber-100";
  if (severity === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  return "bg-cyan-50 text-cyan-700 ring-cyan-100";
}

function statusClass(status: FindingStatus) {
  if (status === "resolved") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "false_positive") return "bg-slate-100 text-slate-600 ring-slate-200";
  if (status === "accepted_risk") return "bg-violet-50 text-violet-700 ring-violet-100";
  if (status === "in_progress") return "bg-cyan-50 text-cyan-700 ring-cyan-100";
  if (status === "reopened") return "bg-orange-50 text-orange-700 ring-orange-100";
  return "bg-rose-50 text-rose-700 ring-rose-100";
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

function FindingsList() {
  const router = useRouter();
  const { activeOrganizationId } = useWorkspace();
  const [rows, setRows] = useState<Finding[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [pagination, setPagination] = useState({ page: 1, page_size: 10, total: 0, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<"" | FindingSeverity>("");
  const [findingStatus, setFindingStatus] = useState<"" | FindingStatus>("");
  const [scanner, setScanner] = useState<"" | "web-app" | "tls">("");
  const [assetFilter, setAssetFilter] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [filtersReady, setFiltersReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const assetRailRef = useRef<HTMLElement>(null);
  const loadedOrganizationRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (!filtersReady) return;
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    const organizationChanged = loadedOrganizationRef.current !== activeOrganizationId;
    if (organizationChanged) {
      setRows([]);
      setLoading(true);
    }
    try {
      const response = await listFindings(access, activeOrganizationId, { page, page_size: 10, search, severity: severity || undefined, status: findingStatus || undefined, scanner: scanner || undefined, asset_id: assetFilter || undefined });
      setRows(response.results);
      setSummary(response.summary);
      setPagination(response.pagination);
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load Findings."));
    } finally {
      loadedOrganizationRef.current = activeOrganizationId;
      setLoading(false);
    }
  }, [activeOrganizationId, assetFilter, filtersReady, findingStatus, page, scanner, search, severity]);

  useEffect(() => {
    setAssetFilter(new URLSearchParams(window.location.search).get("asset_id") || "");
    setFiltersReady(true);
  }, []);
  useEffect(() => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setAssetsLoading(true);
    void listAssets(access, activeOrganizationId, { page_size: 100 })
      .then((response) => setAssets(response.results.filter((asset) => asset.status !== "archived")))
      .catch(() => setAssets([]))
      .finally(() => setAssetsLoading(false));
  }, [activeOrganizationId]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { setPage(1); }, [search, severity, findingStatus, scanner, assetFilter, activeOrganizationId]);

  const metrics = [
    { label: "Active", value: summary.active, helper: "needs a decision", tone: "bg-rose-50 text-rose-700 ring-rose-100", Icon: ShieldAlert },
    { label: "Critical / High", value: summary.critical + summary.high, helper: `${summary.critical} critical`, tone: "bg-orange-50 text-orange-700 ring-orange-100", Icon: AlertCircle },
    { label: "In review", value: rows.filter((row) => row.status === "in_progress").length, helper: "current page", tone: "bg-cyan-50 text-cyan-700 ring-cyan-100", Icon: UserRound },
    { label: "Resolved", value: summary.resolved, helper: "clean retests", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", Icon: ShieldCheck },
  ];

  const selectedAsset = assets.find((asset) => asset.id === assetFilter) || null;
  const findingCount = (asset: Asset) => Object.values(asset.finding_counts || {}).reduce((total, count) => total + count, 0);
  const chooseAsset = (assetId: string) => {
    setAssetFilter(assetId);
    router.replace(assetId ? `/findings?asset_id=${assetId}` : "/findings");
  };
  const moveAssetRail = (direction: -1 | 1) => {
    const rail = assetRailRef.current?.lastElementChild;
    rail?.scrollBy({ left: direction * rail.clientWidth * 0.82, behavior: "smooth" });
  };

  if (loading && rows.length === 0 && assetsLoading) return <WorkspaceSkeleton rows={7} />;

  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase text-[#0891B2]">Normalized security results</p><h2 className="mt-1 text-[24px] font-black leading-tight text-slate-950">Findings</h2><p className="mt-1 max-w-3xl text-[11px] font-semibold leading-relaxed text-slate-500">Start with an Asset, then review its deduplicated Web and TLS evidence, workflow and remediation.</p></div><button type="button" onClick={() => void load()} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, helper, tone, Icon }) => <article key={label} className="flex min-h-[78px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-3.5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.03)]"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${tone}`}><Icon className="h-4.5 w-4.5" /></span><div className="min-w-0"><p className="text-[9px] font-black uppercase text-slate-500">{label}</p><div className="mt-1 flex items-baseline gap-2"><span className="text-[22px] font-black leading-none text-slate-950">{value}</span><span className="truncate text-[9px] font-bold text-slate-400">{helper}</span></div></div></article>)}</section>
    <section ref={assetRailRef} className="min-w-0 border-y border-slate-200 py-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-[14px] font-black text-slate-950">Assets in this workspace</h3><p className="mt-0.5 text-[10px] font-semibold text-slate-500">Choose one Asset to keep large Finding inventories focused.</p></div><div className="flex items-center gap-1.5">{selectedAsset ? <button type="button" onClick={() => chooseAsset("")} className="h-8 rounded-[8px] border border-slate-200 bg-white px-3 text-[9px] font-black text-slate-600">Show all Assets</button> : null}<button type="button" onClick={() => moveAssetRail(-1)} title="Previous Assets" aria-label="Previous Assets" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => moveAssetRail(1)} title="Next Assets" aria-label="Next Assets" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500"><ChevronRight className="h-4 w-4" /></button></div></div>
      {assetsLoading ? <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-2.5 overflow-hidden">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-[8px] bg-slate-100" />)}</div> : <div className="grid snap-x snap-mandatory grid-flow-col gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ gridAutoColumns: "minmax(220px, calc((100% - 1.875rem) / 4))" }}><button type="button" onClick={() => chooseAsset("")} className={`snap-start rounded-[8px] border p-3 text-left transition ${!assetFilter ? "border-[#2ECE82] bg-emerald-50/50" : "border-slate-200 bg-white hover:border-[#2ECE82]/45"}`}><div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-slate-900 text-[#2ECE82]"><Globe2 className="h-4 w-4" /></span><Badge className="bg-slate-100 text-slate-600 ring-slate-200">All</Badge></div><p className="mt-3 text-[12px] font-black text-slate-950">All Assets</p><p className="mt-1 text-[9px] font-bold text-slate-500">Workspace-wide Finding view</p></button>{assets.map((asset) => { const count = findingCount(asset); return <button key={asset.id} type="button" onClick={() => chooseAsset(asset.id)} className={`snap-start rounded-[8px] border p-3 text-left transition ${assetFilter === asset.id ? "border-[#2ECE82] bg-emerald-50/50" : "border-slate-200 bg-white hover:border-[#2ECE82]/45"}`}><div className="flex items-start justify-between gap-2"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100"><Globe2 className="h-4 w-4" /></span><span className="text-[18px] font-black text-slate-950">{count}</span></div><p className="mt-3 truncate text-[12px] font-black text-slate-950">{asset.name}</p><div className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-[9px] font-bold text-slate-500">{titleCase(asset.risk)} risk</span><span className="text-[9px] font-black text-orange-600">{(asset.finding_counts.critical || 0) + (asset.finding_counts.high || 0)} priority</span></div></button>; })}</div>}
    </section>
    <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2.5"><div><h3 className="text-[13px] font-black text-slate-950">{selectedAsset ? selectedAsset.name : "All Findings"}</h3><p className="mt-0.5 text-[9px] font-semibold text-slate-500">{selectedAsset ? selectedAsset.canonical_target : "Every current Asset in this tenant"}</p></div><span className="text-[10px] font-black text-slate-500">{pagination.total} records</span></div>
      <div className="grid gap-2 border-b border-slate-100 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_160px_170px_150px_auto]"><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search finding, Asset, CVE or CWE" className="h-10 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] font-bold outline-none focus:border-[#2ECE82]" /></label><select value={severity} onChange={(event) => setSeverity(event.target.value as "" | FindingSeverity)} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All severity</option>{(["critical", "high", "medium", "low", "informational"] as FindingSeverity[]).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select><select value={findingStatus} onChange={(event) => setFindingStatus(event.target.value as "" | FindingStatus)} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All workflow</option>{(["open", "in_progress", "reopened", "accepted_risk", "false_positive", "resolved"] as FindingStatus[]).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select><select value={scanner} onChange={(event) => setScanner(event.target.value as "" | "web-app" | "tls")} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All scanners</option><option value="web-app">Web App</option><option value="tls">TLS/SSL</option></select><span className="hidden h-10 items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-400 lg:flex"><Filter className="h-3.5 w-3.5" />Tenant scoped</span></div>
      {loading ? <div className="p-4"><Skeleton /></div> : rows.length === 0 ? <div className="grid min-h-[280px] place-items-center p-6 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><ShieldCheck className="h-5 w-5" /></span><h3 className="mt-4 text-[15px] font-black text-slate-950">No Findings match this view</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Successful Web and TLS scans will normalize their evidence here.</p></div></div> : <><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[980px] text-left"><thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500"><tr><th className="px-4 py-3">Finding</th><th className="px-4 py-3">Severity</th><th className="px-4 py-3">Workflow</th><th className="px-4 py-3">Asset</th><th className="px-4 py-3">Last seen</th><th className="px-4 py-3 text-right">Open</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((finding) => <tr key={finding.id} className="text-[11px] font-bold text-slate-600 hover:bg-slate-50/80"><td className="max-w-[360px] px-4 py-3"><p className="truncate font-black text-slate-950">{finding.title}</p><p className="mt-1 font-mono text-[9px] text-slate-400">{finding.engine_name} · {finding.engine_rule_id}</p></td><td className="px-4 py-3"><Badge className={severityClass(finding.severity)}>{titleCase(finding.severity)}</Badge></td><td className="px-4 py-3"><Badge className={statusClass(finding.status)}>{titleCase(finding.status)}</Badge></td><td className="max-w-[260px] px-4 py-3"><p className="truncate font-black text-slate-800">{finding.asset_name}</p><p className="mt-0.5 truncate font-mono text-[9px] text-slate-400">{finding.asset_target}</p></td><td className="px-4 py-3 text-[10px] text-slate-500">{formatDate(finding.last_seen_at)}</td><td className="px-4 py-3 text-right"><button type="button" onClick={() => router.push(`/findings/${finding.id}`)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600" title="Open Finding"><ArrowRight className="h-4 w-4" /></button></td></tr>)}</tbody></table></div><div className="grid gap-2 p-3 md:hidden">{rows.map((finding) => <button type="button" key={finding.id} onClick={() => router.push(`/findings/${finding.id}`)} className="grid gap-3 rounded-[8px] border border-slate-200 p-3 text-left"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[12px] font-black text-slate-950">{finding.title}</p><p className="mt-1 truncate text-[10px] font-bold text-slate-500">{finding.asset_name}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-slate-400" /></div><div className="flex flex-wrap gap-2"><Badge className={severityClass(finding.severity)}>{titleCase(finding.severity)}</Badge><Badge className={statusClass(finding.status)}>{titleCase(finding.status)}</Badge></div></button>)}</div></>}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-500"><span>{pagination.total} Findings</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-16 text-center font-black text-slate-700">{page} / {pagination.total_pages}</span><button type="button" disabled={page >= pagination.total_pages} onClick={() => setPage((value) => value + 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>
    </section>
  </div>;
}

function FindingDetail({ findingId }: { findingId: string }) {
  const router = useRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [finding, setFinding] = useState<Finding | null>(null);
  const [instances, setInstances] = useState<FindingInstance[]>([]);
  const [events, setEvents] = useState<FindingEvent[]>([]);
  const [observations, setObservations] = useState<FindingObservation[]>([]);
  const [artifacts, setArtifacts] = useState<ScanArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ status: "open" as FindingStatus, severity: "informational" as FindingSeverity, assigned_to_email: "", due_at: "", decision_reason: "" });
  const canManage = activeWorkspace?.permissions.actions.findings?.includes("manage") ?? false;
  const canDownload = activeWorkspace?.permissions.actions.findings?.includes("download") ?? false;

  const load = useCallback(async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setLoading(true);
    try {
      const response = await getFinding(access, activeOrganizationId, findingId);
      setFinding(response.result);
      setInstances(response.instances);
      setEvents(response.events);
      setObservations(response.observations);
      setArtifacts(response.artifacts);
      setForm({ status: response.result.status, severity: response.result.severity, assigned_to_email: response.result.assigned_to_email, due_at: response.result.due_at ? response.result.due_at.slice(0, 10) : "", decision_reason: "" });
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load this Finding."));
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId, findingId]);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !finding) return;
    setSaving(true);
    try {
      const payload: Parameters<typeof updateFinding>[3] = {
        severity: form.severity,
        assigned_to_email: form.assigned_to_email,
        due_at: form.due_at ? new Date(`${form.due_at}T23:59:59`).toISOString() : null,
        decision_reason: form.decision_reason,
      };
      if (form.status !== finding.status && form.status !== "resolved" && form.status !== "reopened") payload.status = form.status;
      await updateFinding(access, activeOrganizationId, finding.id, payload);
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not update the Finding."));
    } finally {
      setSaving(false);
    }
  };

  const downloadEvidence = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !finding) return;
    setDownloading(true);
    try {
      const response = await getFindingEvidence(access, activeOrganizationId, finding.id);
      response.results.forEach((artifact, index) => window.setTimeout(() => window.open(artifact.download_url, "_blank", "noopener,noreferrer"), index * 150));
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not create evidence download links."));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <WorkspaceSkeleton detail />;
  if (!finding) return <Notice>{error || "Finding not found."}</Notice>;
  const reasonRequired = ((form.status === "accepted_risk" || form.status === "false_positive") && form.status !== finding.status) || form.severity !== finding.severity;

  return <div data-finding-detail className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><Link href="/findings" className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Findings</Link><div className="mt-3 flex flex-wrap items-center gap-2"><h2 className="max-w-4xl text-[23px] font-black text-slate-950">{finding.title}</h2><Badge className={severityClass(finding.severity)}>{titleCase(finding.severity)}</Badge><Badge className={statusClass(finding.status)}>{titleCase(finding.status)}</Badge></div><p className="mt-2 font-mono text-[10px] font-bold text-slate-400">{finding.engine_name} · {finding.engine_rule_id} · {finding.id}</p></div><button type="button" onClick={() => router.push(`/scans/new-scan?asset=${finding.asset_id}&scanner=${finding.scanner}`)} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[11px] font-black text-white"><RotateCcw className="h-4 w-4 text-[#2ECE82]" />Retest</button></div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px] xl:items-start">
      <div className="grid gap-4">
        <section className="rounded-[8px] border border-slate-200 bg-white"><div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4">{[{ label: "Asset", value: finding.asset_name, Icon: Globe2 }, { label: "Occurrences", value: String(finding.occurrence_count), Icon: History }, { label: "First seen", value: formatDate(finding.first_seen_at), Icon: CalendarClock }, { label: "Last seen", value: formatDate(finding.last_seen_at), Icon: RefreshCw }].map(({ label, value, Icon }) => <div key={label} className="min-w-0"><div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><Icon className="h-3.5 w-3.5 text-[#0891B2]" />{label}</div><p className="mt-2 break-words text-[11px] font-black text-slate-800">{value}</p></div>)}</div><div className="grid gap-5 p-4 lg:grid-cols-2"><div><h3 className="text-[12px] font-black text-slate-950">What was observed</h3><p className="mt-2 text-[11px] font-semibold leading-6 text-slate-600">{finding.description || "The scanner did not provide a description."}</p></div><div><h3 className="text-[12px] font-black text-slate-950">Recommended remediation</h3><p className="mt-2 text-[11px] font-semibold leading-6 text-slate-600">{finding.remediation || "Review the attached scanner evidence and validate the affected configuration."}</p></div></div></section>
        <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h3 className="text-[14px] font-black text-slate-950">Affected locations</h3><p className="mt-0.5 text-[10px] font-semibold text-slate-500">Instances from the most recent observation.</p></div><Badge className="bg-slate-100 text-slate-600 ring-slate-200">{instances.length}</Badge></div>{instances.length ? <div className="divide-y divide-slate-100">{instances.map((instance) => <div key={instance.id} className="grid gap-2 p-4 sm:grid-cols-[90px_minmax(0,1fr)]"><div><span className="rounded-[6px] bg-slate-100 px-2 py-1 font-mono text-[9px] font-black text-slate-700">{instance.http_method || "TARGET"}</span></div><div className="min-w-0"><p className="break-all font-mono text-[10px] font-bold text-slate-700">{instance.location}</p>{instance.parameter ? <p className="mt-1 text-[10px] font-semibold text-slate-500">Parameter: {instance.parameter}</p> : null}{instance.evidence ? <p className="mt-2 break-words rounded-[8px] bg-slate-50 p-2 font-mono text-[9px] leading-relaxed text-slate-500">{instance.evidence}</p> : null}</div></div>)}</div> : <p className="p-4 text-[11px] font-semibold text-slate-500">This rule applies to the Asset configuration rather than a specific URL.</p>}</section>
        <section className="rounded-[8px] border border-slate-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h3 className="text-[14px] font-black text-slate-950">Stored evidence</h3><p className="mt-0.5 text-[10px] font-semibold text-slate-500">Private artifacts from the latest scan.</p></div>{canDownload && artifacts.length ? <button type="button" disabled={downloading} onClick={() => void downloadEvidence()} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 px-3 text-[10px] font-black text-slate-700">{downloading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}Download evidence</button> : null}</div><div className="grid gap-2 p-4 sm:grid-cols-2">{artifacts.map((artifact) => <div key={artifact.id} className="flex min-w-0 items-center gap-3 rounded-[8px] bg-slate-50 p-3"><FileJson2 className="h-4 w-4 shrink-0 text-[#0891B2]" /><div className="min-w-0"><p className="text-[10px] font-black text-slate-800">{titleCase(artifact.artifact_type)}</p><p className="mt-0.5 truncate font-mono text-[8px] text-slate-400">{artifact.storage_key}</p></div></div>)}</div></section>
      </div>
      <aside className="grid gap-4 xl:sticky xl:top-24">
        {canManage ? <section className="rounded-[8px] border border-[#2ECE82]/25 bg-[#071010] p-4 text-white"><p className="text-[10px] font-black uppercase text-[#04D9FF]">Workflow controls</p><h3 className="mt-2 text-[18px] font-black">Triage Finding</h3><div className="mt-4 grid gap-3"><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-white/45">Status</span><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof form.status }))} className="h-10 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-[11px] font-black text-white">{finding.status === "resolved" ? <option className="text-slate-950" value="resolved">Resolved by clean retest</option> : null}{finding.status === "reopened" ? <option className="text-slate-950" value="reopened">Reopened by scanner</option> : null}<option className="text-slate-950" value="open">Open</option><option className="text-slate-950" value="in_progress">In Progress</option><option className="text-slate-950" value="accepted_risk">Accepted Risk</option><option className="text-slate-950" value="false_positive">False Positive</option></select></label><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-white/45">Effective severity</span><select value={form.severity} onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value as FindingSeverity }))} className="h-10 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-[11px] font-black text-white">{(["critical", "high", "medium", "low", "informational"] as FindingSeverity[]).map((value) => <option className="text-slate-950" key={value} value={value}>{titleCase(value)}</option>)}</select></label><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-white/45">Assignee email</span><input value={form.assigned_to_email} onChange={(event) => setForm((current) => ({ ...current, assigned_to_email: event.target.value }))} className="h-10 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-[11px] font-bold text-white outline-none" /></label><label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-white/45">Due date</span><input type="date" value={form.due_at} onChange={(event) => setForm((current) => ({ ...current, due_at: event.target.value }))} className="h-10 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-[11px] font-bold text-white outline-none" /></label>{reasonRequired ? <label className="grid gap-1.5"><span className="text-[9px] font-black uppercase text-white/45">Decision reason</span><textarea value={form.decision_reason} onChange={(event) => setForm((current) => ({ ...current, decision_reason: event.target.value }))} rows={3} className="resize-none rounded-[8px] border border-white/10 bg-white/[0.08] p-3 text-[11px] font-semibold text-white outline-none" /></label> : null}<button type="button" disabled={saving || (reasonRequired && !form.decision_reason.trim())} onClick={() => void save()} className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] text-[11px] font-black text-[#071010] disabled:opacity-45">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Save workflow</button></div></section> : null}
        <section className="rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[14px] font-black text-slate-950">Finding history</h3></div><div className="max-h-[520px] overflow-y-auto p-4">{events.map((event, index) => <div key={event.id} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3"><div className="flex flex-col items-center"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2ECE82] ring-4 ring-emerald-50" />{index < events.length - 1 ? <span className="min-h-12 w-px flex-1 bg-slate-200" /> : null}</div><div className="pb-4"><p className="text-[10px] font-black text-slate-800">{titleCase(event.event_type.replace("finding.", ""))}</p><p className="mt-1 text-[9px] font-semibold leading-relaxed text-slate-500">{event.message}</p><p className="mt-1 text-[8px] font-bold text-slate-400">{formatDate(event.created_at)}</p></div></div>)}</div></section>
        {observations.length ? <section className="rounded-[8px] border border-slate-200 bg-white p-4"><div className="flex items-center gap-2"><Tag className="h-4 w-4 text-[#0891B2]" /><h3 className="text-[13px] font-black text-slate-950">Observed in {observations.length} scan{observations.length === 1 ? "" : "s"}</h3></div>{finding.last_scan_id ? <Link href={`/scans/${finding.last_scan_id}`} className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-[#0891B2]">Open latest scan<ExternalLink className="h-3 w-3" /></Link> : null}</section> : null}
      </aside>
    </section>
  </div>;
}

export default function FindingsWorkspace() {
  const pathname = usePathname();
  if (pathname === "/findings/guide") return <WorkspaceGuidePage guideId="findings" />;
  const findingId = pathname.startsWith("/findings/") ? pathname.slice("/findings/".length).split("/")[0] : "";
  return findingId ? <FindingDetail findingId={findingId} /> : <FindingsList />;
}
