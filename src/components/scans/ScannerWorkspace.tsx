"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Braces,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Clock3,
  Code2,
  Database,
  FileJson2,
  FileText,
  Globe2,
  History,
  LoaderCircle,
  LockKeyhole,
  Network,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Zap,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceRowsSkeleton, WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import GuideButton from "@/components/guides/GuideButton";
import WorkspaceGuidePage from "@/components/guides/WorkspaceGuidePage";
import {
  ApiError,
  cancelScan,
  createScan,
  getScan,
  listAssets,
  listScanners,
  listScans,
  retryScanNormalization,
  type Asset,
  type Scan,
  type ScanArtifact,
  type ScanEvent,
  type ScannerCode,
  type ScannerDefinition,
  type ScanListResponse,
  type ScanStatus,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";


const FALLBACK_SCANNERS: ScannerDefinition[] = [
  { code: "web-app", name: "Web App Scanner", description: "Passive OWASP ZAP baseline assessment for verified web applications.", available: true, asset_types: ["web_application"], profile: "baseline" },
  { code: "api", name: "API Scanner", description: "Validate REST endpoints, authentication flows and API attack surface.", available: false, asset_types: ["api_endpoint"] },
  { code: "database", name: "Database Scanner", description: "Assess database exposure, configuration and service risk.", available: false, asset_types: ["hostname"] },
  { code: "os-port", name: "OS / Port Scanner", description: "Fingerprint hosts, ports and reachable services.", available: false, asset_types: ["hostname"] },
  { code: "sharepoint", name: "SharePoint Scanner", description: "Review SharePoint permissions, sharing and exposed content.", available: false, asset_types: ["web_application"] },
  { code: "tls", name: "TLS/SSL Scanner", description: "Assess certificates, protocols, ciphers and transport posture.", available: true, asset_types: ["web_application", "api_endpoint", "hostname"], profile: "baseline" },
  { code: "hybrid-sos", name: "Hybrid SOS Scanner", description: "Coordinate application, host and transport checks.", available: false, asset_types: ["web_application", "api_endpoint", "hostname"] },
  { code: "sast-dast", name: "SAST/DAST Scanner", description: "Combine source-aware and dynamic assessment plans.", available: false, asset_types: ["web_application"] },
];

const SCANNER_ICONS = {
  "web-app": Globe2,
  api: Braces,
  database: Database,
  "os-port": Server,
  sharepoint: Network,
  tls: ShieldCheck,
  "hybrid-sos": Sparkles,
  "sast-dast": Code2,
};

const SCANNER_GUIDES = {
  "web-app": "scanner-web-app",
  api: "scanner-api",
  database: "scanner-database",
  "os-port": "scanner-os-port",
  sharepoint: "scanner-sharepoint",
  tls: "scanner-tls",
  "hybrid-sos": "scanner-hybrid",
  "sast-dast": "scanner-sast-dast",
} as const;

const EMPTY_SUMMARY: ScanListResponse["summary"] = { total: 0, active: 0, succeeded: 0, failed: 0 };
const TERMINAL = new Set<ScanStatus>(["succeeded", "failed", "cancelled", "timed_out"]);

function titleCase(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not started";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function statusClass(status: ScanStatus) {
  if (status === "succeeded") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (status === "failed" || status === "timed_out") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (status === "cancelled" || status === "cancel_requested") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-cyan-50 text-cyan-700 ring-cyan-100";
}

function scannerTone(code: ScannerCode) {
  if (code === "web-app") return "bg-cyan-50 text-cyan-700 ring-cyan-100";
  if (code === "tls") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (code === "database" || code === "os-port") return "bg-amber-50 text-amber-700 ring-amber-100";
  if (code === "sharepoint" || code === "api") return "bg-blue-50 text-blue-700 ring-blue-100";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ring-1 ${className}`}>{children}</span>;
}

function Notice({ tone = "error", children }: { tone?: "error" | "info" | "success"; children: ReactNode }) {
  const classes = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : tone === "info" ? "border-cyan-200 bg-cyan-50 text-cyan-800" : "border-rose-200 bg-rose-50 text-rose-800";
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? ShieldQuestion : AlertTriangle;
  return <div className={`flex items-start gap-3 rounded-[8px] border px-4 py-3 text-[12px] font-bold leading-relaxed ${classes}`}><Icon className="mt-0.5 h-4 w-4 shrink-0" /><div>{children}</div></div>;
}

function Skeleton() {
  return <WorkspaceRowsSkeleton />;
}

function ScanMetrics({ summary }: { summary: ScanListResponse["summary"] }) {
  const metrics = [
    { label: "Total scans", value: summary.total, helper: "tenant history", Icon: History, tone: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
    { label: "In progress", value: summary.active, helper: "worker lifecycle", Icon: LoaderCircle, tone: "bg-amber-50 text-amber-700 ring-amber-100" },
    { label: "Succeeded", value: summary.succeeded, helper: "evidence stored", Icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { label: "Needs attention", value: summary.failed, helper: "failed or timed out", Icon: AlertTriangle, tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  ];
  return <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((item) => <div key={item.label} className="flex min-h-20 items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.03)]"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${item.tone}`}><item.Icon className={`h-4.5 w-4.5 ${item.label === "In progress" && item.value > 0 ? "animate-spin" : ""}`} /></span><div className="min-w-0"><p className="text-[11px] font-black uppercase text-slate-500">{item.label}</p><div className="mt-1 flex items-baseline gap-2"><span className="text-[23px] font-black leading-none text-slate-950">{item.value}</span><span className="truncate text-[10px] font-bold text-slate-400">{item.helper}</span></div></div></div>)}</div>;
}

function ScannerCards({ scanners, selected, onSelect, compact = false, twoRows = false }: { scanners: ScannerDefinition[]; selected?: ScannerCode; onSelect?: (code: ScannerCode) => void; compact?: boolean; twoRows?: boolean }) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * 0.82, behavior: "smooth" });

  return <div className="grid min-w-0 gap-2">
    {scanners.length > 4 && !twoRows ? <div className="flex justify-end gap-1.5"><button type="button" onClick={() => move(-1)} title="Previous scanner adapters" aria-label="Previous scanner adapters" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-950"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => move(1)} title="Next scanner adapters" aria-label="Next scanner adapters" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#2ECE82]/50 hover:text-slate-950"><ChevronRight className="h-4 w-4" /></button></div> : null}
    <div ref={twoRows ? undefined : railRef} className={twoRows ? "grid min-w-0 gap-2.5 sm:grid-cols-2 xl:grid-cols-4" : "grid min-w-0 snap-x snap-mandatory grid-flow-col gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"} style={twoRows ? undefined : { gridAutoColumns: "minmax(220px, calc((100% - 1.875rem) / 4))" }}>
      {scanners.map((scanner) => {
        const Icon = SCANNER_ICONS[scanner.code];
        const active = scanner.code === selected;
        return <article key={scanner.code} className={`relative snap-start overflow-hidden ${compact ? "min-h-24" : "min-h-[132px]"} rounded-[8px] border transition ${active ? "border-[#2ECE82] bg-emerald-50/40 shadow-[0_12px_30px_rgba(46,206,130,0.12)]" : "border-slate-200 bg-white"} ${scanner.available && onSelect ? "hover:border-[#2ECE82]/55 hover:shadow-[0_12px_26px_rgba(15,23,42,0.06)]" : "cursor-default"}`}>
          <button type="button" disabled={!scanner.available || !onSelect} onClick={() => onSelect?.(scanner.code)} className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2ECE82]" aria-label={`Select ${scanner.name}`} />
          <div className="pointer-events-none relative z-[1] p-3.5">
            <div className="flex items-start justify-between gap-3 pr-10"><span className={`grid h-10 w-10 place-items-center rounded-[8px] ring-1 ${scannerTone(scanner.code)}`}><Icon className="h-4.5 w-4.5" /></span>{scanner.available ? <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-100">Ready</Badge> : <Badge className="bg-slate-100 text-slate-500 ring-slate-200"><LockKeyhole className="h-3 w-3" />Locked</Badge>}</div>
            <p className="mt-3 text-[13px] font-black text-slate-950">{scanner.name}</p>
            {!compact ? <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-relaxed text-slate-500">{scanner.description}</p> : null}
          </div>
          <GuideButton guideId={SCANNER_GUIDES[scanner.code]} label={`${scanner.name} help`} compact className="absolute right-3 top-3 z-10" />
        </article>;
      })}
    </div>
  </div>;
}

function ScanHistory() {
  const router = useRouter();
  const { activeOrganizationId } = useWorkspace();
  const [scanners, setScanners] = useState(FALLBACK_SCANNERS);
  const [rows, setRows] = useState<Scan[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [pagination, setPagination] = useState({ page: 1, page_size: 10, total: 0, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ScanStatus>("");
  const [scannerFilter, setScannerFilter] = useState<"" | ScannerCode>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadedOrganizationRef = useRef<number | null>(null);

  const load = useCallback(async (quiet = false) => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    const organizationChanged = loadedOrganizationRef.current !== activeOrganizationId;
    if (!quiet && organizationChanged) {
      setRows([]);
      setLoading(true);
    }
    setError("");
    try {
      const [scanResponse, scannerResponse] = await Promise.all([
        listScans(access, activeOrganizationId, { page, page_size: 10, search: search.trim(), status: statusFilter || undefined, scanner: scannerFilter || undefined }),
        listScanners(access, activeOrganizationId),
      ]);
      setRows(scanResponse.results);
      setSummary(scanResponse.summary);
      setPagination(scanResponse.pagination);
      setScanners(scannerResponse.results);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load scan history."));
    } finally {
      if (!quiet) {
        loadedOrganizationRef.current = activeOrganizationId;
        setLoading(false);
      }
    }
  }, [activeOrganizationId, page, scannerFilter, search, statusFilter]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!rows.some((scan) => !TERMINAL.has(scan.status))) return;
    const timer = window.setInterval(() => void load(true), 5000);
    return () => window.clearInterval(timer);
  }, [load, rows]);

  if (loading && rows.length === 0) return <WorkspaceSkeleton rail rows={5} />;

  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase text-[#0891B2]">Scanner operations</p><h2 className="mt-1 text-[25px] font-black leading-tight text-slate-950">Scanner Engine</h2><p className="mt-1 max-w-3xl text-[12px] font-semibold leading-relaxed text-slate-500">Run isolated Web and TLS assessments against ownership-verified Assets. Raw evidence is stored for the Findings pipeline.</p></div><div className="flex items-center gap-2"><GuideButton guideId="scanner-engine" compact /><button type="button" onClick={() => router.push("/scans/new-scan")} className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white"><Zap className="h-4 w-4 text-[#2ECE82]" />New scan</button></div></div>
    <ScanMetrics summary={summary} />
    <section className="border-y border-slate-200 py-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-[14px] font-black text-slate-950">Scanner adapters</h3><p className="mt-0.5 text-[11px] font-semibold text-slate-500">Two operational adapters; six held behind explicit release gates.</p></div><Badge className="bg-cyan-50 text-cyan-700 ring-cyan-100">2 of 8 ready</Badge></div><ScannerCards scanners={scanners} compact /></section>
    {error ? <Notice>{error}</Notice> : null}
    <section className="rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 p-4"><label className="flex h-10 min-w-[220px] flex-1 items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3 focus-within:border-[#2ECE82] focus-within:bg-white"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search scans, Assets or targets" className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-slate-900 outline-none" /></label><select value={scannerFilter} onChange={(event) => { setScannerFilter(event.target.value as "" | ScannerCode); setPage(1); }} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700"><option value="">All scanners</option>{scanners.map((scanner) => <option key={scanner.code} value={scanner.code}>{scanner.name}</option>)}</select><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as "" | ScanStatus); setPage(1); }} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[12px] font-black text-slate-700"><option value="">All status</option>{(["queued", "running", "uploading", "succeeded", "failed", "cancelled", "timed_out"] as ScanStatus[]).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select><button type="button" onClick={() => void load()} className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600" title="Refresh scan history"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button></div>
      {loading ? <div className="p-4"><Skeleton /></div> : rows.length === 0 ? <div className="grid min-h-[260px] place-items-center p-6 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100"><ShieldQuestion className="h-5 w-5" /></span><h3 className="mt-4 text-[15px] font-black text-slate-950">No scans match this view</h3><p className="mt-1 text-[12px] font-semibold text-slate-500">Start with an active verified Asset and one of the available adapters.</p></div></div> : <div className="overflow-x-auto"><table className="w-full min-w-[940px] border-collapse text-left"><thead><tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500"><th className="px-4 py-3">Scan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Asset / target</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Open</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((scan) => { const Icon = SCANNER_ICONS[scan.scanner]; return <tr key={scan.id} className="text-[12px] font-bold text-slate-700 hover:bg-slate-50/80"><td className="px-4 py-3"><div className="flex items-center gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${scannerTone(scan.scanner)}`}><Icon className="h-4 w-4" /></span><div><p className="font-black text-slate-950">{scan.scanner_name}</p><p className="mt-0.5 font-mono text-[10px] text-slate-400">{scan.id.slice(0, 8)}</p></div></div></td><td className="px-4 py-3"><Badge className={statusClass(scan.status)}>{!TERMINAL.has(scan.status) ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}{titleCase(scan.status)}</Badge></td><td className="max-w-[320px] px-4 py-3"><p className="font-black text-slate-800">{scan.asset_name}</p><p className="mt-0.5 truncate font-mono text-[10px] text-slate-500">{scan.target}</p></td><td className="px-4 py-3"><div className="w-32"><div className="mb-1 flex justify-between text-[10px]"><span>{titleCase(scan.stage)}</span><span>{scan.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#2ECE82] transition-all" style={{ width: `${scan.progress}%` }} /></div></div></td><td className="px-4 py-3 text-[11px] text-slate-500">{formatDate(scan.created_at)}</td><td className="px-4 py-3 text-right"><button type="button" onClick={() => router.push(`/scans/${scan.id}`)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600" title="Open scan"><ArrowRight className="h-4 w-4" /></button></td></tr>; })}</tbody></table></div>}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold text-slate-500"><span>{pagination.total} scans</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-16 text-center font-black text-slate-700">{page} / {pagination.total_pages}</span><button type="button" disabled={page >= pagination.total_pages} onClick={() => setPage((value) => value + 1)} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>
    </section>
  </div>;
}

function NewScan() {
  const router = useRouter();
  const { activeOrganizationId } = useWorkspace();
  const [scanners, setScanners] = useState(FALLBACK_SCANNERS);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [scannerCode, setScannerCode] = useState<ScannerCode>("web-app");
  const [assetId, setAssetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    Promise.all([listScanners(access, activeOrganizationId), listAssets(access, activeOrganizationId, { status: "active", page_size: 100 })])
      .then(([scannerResponse, assetResponse]) => {
        setScanners(scannerResponse.results);
        setAssets(assetResponse.results.filter((asset) => asset.verification_status === "verified"));
        const requestedAsset = new URLSearchParams(window.location.search).get("asset");
        const requestedScanner = new URLSearchParams(window.location.search).get("scanner") as ScannerCode | null;
        if (requestedScanner && scannerResponse.results.some((scanner) => scanner.code === requestedScanner && scanner.available)) setScannerCode(requestedScanner);
        if (requestedAsset && assetResponse.results.some((asset) => asset.id === requestedAsset && asset.status === "active")) setAssetId(requestedAsset);
      })
      .catch((requestError) => setError(errorMessage(requestError, "Could not load verified Assets.")))
      .finally(() => setLoading(false));
  }, [activeOrganizationId]);

  const selectedScanner = scanners.find((scanner) => scanner.code === scannerCode) || scanners[0];
  const compatibleAssets = useMemo(() => assets.filter((asset) => selectedScanner?.asset_types.includes(asset.asset_type)), [assets, selectedScanner]);
  const effectiveAssetId = compatibleAssets.some((asset) => asset.id === assetId) ? assetId : "";
  const selectedAsset = compatibleAssets.find((asset) => asset.id === effectiveAssetId) || null;

  const start = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !selectedAsset || !selectedScanner?.available) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await createScan(access, activeOrganizationId, { asset_id: selectedAsset.id, scanner: scannerCode });
      router.push(`/scans/${response.result.id}`);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not queue this scan."));
      setSubmitting(false);
    }
  };

  if (loading) return <WorkspaceSkeleton rail detail />;
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/scans" className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Scan history</Link><p className="mt-3 text-[10px] font-black uppercase text-[#0891B2]">Verified target workflow</p><h2 className="mt-1 text-[25px] font-black text-slate-950">New scan</h2><p className="mt-1 text-[12px] font-semibold text-slate-500">Choose an available adapter and an ownership-verified Asset. Targets cannot be typed or overridden here.</p></div><Badge className="bg-emerald-50 text-emerald-700 ring-emerald-100"><ShieldCheck className="h-3 w-3" />Authorization enforced</Badge></div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="border-y border-slate-200 py-4"><div className="mb-3"><h3 className="text-[14px] font-black text-slate-950">1. Choose a scanner</h3><p className="mt-0.5 text-[11px] font-semibold text-slate-500">Unavailable adapters are visible so the product roadmap stays clear, but cannot be selected.</p></div><ScannerCards scanners={scanners} selected={scannerCode} onSelect={(code) => { setScannerCode(code); setAssetId(""); }} twoRows /></section>
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><h3 className="text-[14px] font-black text-slate-950">2. Select verified Asset</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">Only active Assets compatible with {selectedScanner?.name} are listed.</p>{compatibleAssets.length ? <label className="mt-4 grid gap-2"><span className="text-[11px] font-black uppercase text-slate-500">Asset</span><select value={effectiveAssetId} onChange={(event) => setAssetId(event.target.value)} className="h-12 rounded-[8px] border border-slate-200 bg-white px-3 text-[13px] font-black text-slate-800 outline-none focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/20"><option value="">Select an Asset</option>{compatibleAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name} - {asset.canonical_target}</option>)}</select></label> : <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 p-4"><p className="text-[12px] font-black text-amber-900">No compatible verified Asset</p><p className="mt-1 text-[11px] font-semibold leading-relaxed text-amber-800">Add and verify an Asset before starting this scanner.</p><Link href="/assets/new" className="mt-3 inline-flex items-center gap-2 text-[11px] font-black text-amber-900">Add Asset<ArrowRight className="h-3.5 w-3.5" /></Link></div>}
        {selectedAsset ? <div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-[8px] bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">Target</p><p className="mt-1 break-all font-mono text-[10px] font-bold text-slate-700">{selectedAsset.canonical_target}</p></div><div className="rounded-[8px] bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">Environment</p><p className="mt-1 text-[11px] font-black text-slate-700">{titleCase(selectedAsset.environment)}</p></div><div className="rounded-[8px] bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">Ownership</p><p className="mt-1 text-[11px] font-black text-emerald-700">Verified</p></div></div> : null}
      </div>
      <aside className="rounded-[8px] border border-[#2ECE82]/25 bg-[#071010] p-4 text-white"><p className="text-[10px] font-black uppercase text-[#04D9FF]">3. Queue execution</p><h3 className="mt-2 text-[18px] font-black">Baseline profile</h3><div className="mt-4 grid gap-2">{["Verified Asset snapshot", "Resource-limited container", "Private MinIO evidence", "Tenant-scoped history"].map((item) => <div key={item} className="flex items-center gap-2 text-[11px] font-bold text-white/72"><CheckCircle2 className="h-3.5 w-3.5 text-[#2ECE82]" />{item}</div>)}</div><button type="button" disabled={!selectedAsset || submitting} onClick={() => void start()} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2ECE82] px-4 text-[12px] font-black text-[#071010] disabled:cursor-not-allowed disabled:opacity-45">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}{submitting ? "Queuing scan" : "Start scan"}</button><p className="mt-3 text-[10px] font-semibold leading-relaxed text-white/48">The scanner runs in the background. Leaving this page does not stop the job.</p></aside>
    </section>
  </div>;
}

function ScanDetail({ scanId }: { scanId: string }) {
  const router = useRouter();
  const { activeOrganizationId, activeWorkspace } = useWorkspace();
  const [scan, setScan] = useState<Scan | null>(null);
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [artifacts, setArtifacts] = useState<ScanArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (quiet = false) => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    if (!quiet) setLoading(true);
    try {
      const response = await getScan(access, activeOrganizationId, scanId);
      setScan(response.result);
      setEvents(response.events);
      setArtifacts(response.artifacts);
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not load this scan."));
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [activeOrganizationId, scanId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const normalizationActive = scan && ["pending", "queued", "running", "retrying"].includes(scan.normalization_status);
    if (!scan || (TERMINAL.has(scan.status) && !normalizationActive)) return;
    const timer = window.setInterval(() => void load(true), 3000);
    return () => window.clearInterval(timer);
  }, [load, scan]);

  const cancel = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !scan) return;
    setCancelling(true);
    try {
      const response = await cancelScan(access, activeOrganizationId, scan.id);
      setScan(response.result);
      await load(true);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not cancel this scan."));
    } finally {
      setCancelling(false);
    }
  };

  const retryNormalization = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !scan) return;
    setRetrying(true);
    try {
      const response = await retryScanNormalization(access, activeOrganizationId, scan.id);
      setScan(response.result);
      await load(true);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not retry Findings normalization."));
    } finally {
      setRetrying(false);
    }
  };

  if (loading) return <WorkspaceSkeleton detail />;
  if (!scan) return <Notice>{error || "Scan not found."}</Notice>;
  const Icon = SCANNER_ICONS[scan.scanner];
  const alertSummary = scan.summary.alerts as Record<string, number> | undefined;
  const canExecute = activeWorkspace?.permissions.actions.scans?.includes("execute") ?? false;
  const canViewFindings = activeWorkspace?.permissions.actions.findings?.includes("view") ?? false;
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/scans" className="inline-flex items-center gap-2 text-[11px] font-black text-[#0891B2]"><ArrowLeft className="h-3.5 w-3.5" />Scan history</Link><div className="mt-3 flex flex-wrap items-center gap-2"><h2 className="text-[23px] font-black text-slate-950">{scan.scanner_name}</h2><Badge className={statusClass(scan.status)}>{!TERMINAL.has(scan.status) ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}{titleCase(scan.status)}</Badge></div><p className="mt-1 font-mono text-[10px] font-bold text-slate-500">{scan.id}</p></div>{!TERMINAL.has(scan.status) && scan.status !== "cancel_requested" ? <button type="button" disabled={cancelling} onClick={() => void cancel()} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-rose-200 bg-rose-50 px-4 text-[11px] font-black text-rose-700"><CircleStop className="h-4 w-4" />{cancelling ? "Requesting" : "Cancel scan"}</button> : null}</div>
    {error ? <Notice>{error}</Notice> : null}
    <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"><div className="flex flex-wrap items-center gap-4"><span className={`grid h-12 w-12 place-items-center rounded-[8px] ring-1 ${scannerTone(scan.scanner)}`}><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3 text-[11px] font-black text-slate-600"><span>{titleCase(scan.stage)}</span><span>{scan.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#2ECE82] transition-all duration-500" style={{ width: `${scan.progress}%` }} /></div><p className="mt-2 truncate font-mono text-[10px] font-bold text-slate-500">{scan.target}</p></div></div></section>
    {scan.error_detail ? <Notice>{scan.error_detail}</Notice> : null}
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] xl:items-start">
      <div className="grid gap-4"><div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">{[
        { label: "Asset", value: scan.asset_name }, { label: "Profile", value: titleCase(scan.profile) }, { label: "Started", value: formatDate(scan.started_at) }, { label: "Completed", value: formatDate(scan.completed_at) },
      ].map((item) => <div key={item.label} className="min-h-20 rounded-[8px] border border-slate-200 bg-white p-3"><p className="text-[9px] font-black uppercase text-slate-400">{item.label}</p><p className="mt-2 break-words text-[11px] font-black leading-relaxed text-slate-800">{item.value}</p></div>)}</div>
        <div className="rounded-[8px] border border-slate-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h3 className="text-[14px] font-black text-slate-950">Result summary</h3><p className="mt-0.5 text-[11px] font-semibold text-slate-500">Raw evidence is preserved and normalized into deduplicated tenant Findings.</p></div><div className="flex items-center gap-2"><Badge className={scan.normalization_status === "complete" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : scan.normalization_status === "failed" ? "bg-rose-50 text-rose-700 ring-rose-100" : "bg-cyan-50 text-cyan-700 ring-cyan-100"}>{["queued", "running", "retrying"].includes(scan.normalization_status) ? <LoaderCircle className="h-3 w-3 animate-spin" /> : null}{titleCase(scan.normalization_status)}</Badge>{canViewFindings && scan.normalization_status === "complete" ? <button type="button" onClick={() => router.push("/findings")} className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-slate-200 px-2.5 text-[9px] font-black text-slate-700">{scan.findings_count} Findings<ArrowRight className="h-3 w-3" /></button> : null}{canExecute && scan.normalization_status === "failed" ? <button type="button" disabled={retrying} onClick={() => void retryNormalization()} className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-rose-200 bg-rose-50 px-2.5 text-[9px] font-black text-rose-700">{retrying ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}Retry</button> : null}</div></div>{scan.normalization_error_detail ? <p className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-700">{scan.normalization_error_detail}</p> : null}<div className="grid gap-2.5 p-4 sm:grid-cols-2 lg:grid-cols-5">{alertSummary ? Object.entries(alertSummary).map(([label, value]) => <div key={label} className="rounded-[8px] bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">{label}</p><p className="mt-1 text-[20px] font-black text-slate-900">{value}</p></div>) : Object.entries(scan.summary).filter(([, value]) => typeof value === "string" || typeof value === "number").slice(0, 5).map(([label, value]) => <div key={label} className="rounded-[8px] bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">{titleCase(label)}</p><p className="mt-1 break-words text-[12px] font-black text-slate-900">{String(value)}</p></div>)}</div></div>
        <div className="rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h3 className="text-[14px] font-black text-slate-950">Stored evidence</h3></div>{artifacts.length ? <div className="divide-y divide-slate-100">{artifacts.map((artifact) => <div key={artifact.id} className="flex items-center gap-3 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">{artifact.artifact_type === "html_report" ? <FileText className="h-4 w-4" /> : <FileJson2 className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-black text-slate-800">{titleCase(artifact.artifact_type)}</p><p className="mt-0.5 truncate font-mono text-[9px] text-slate-400">{artifact.storage_key}</p></div><span className="text-[10px] font-black text-slate-500">{formatBytes(artifact.size_bytes)}</span></div>)}</div> : <p className="p-4 text-[11px] font-semibold text-slate-500">Evidence appears here after the worker uploads scanner output.</p>}</div>
      </div>
      <aside className="rounded-[8px] border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#0891B2]" /><h3 className="text-[14px] font-black text-slate-950">Lifecycle</h3></div></div><div className="p-4">{events.length ? <div className="grid gap-0">{events.map((event, index) => <div key={event.id} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3"><div className="flex flex-col items-center"><span className={`mt-0.5 h-3 w-3 rounded-full ring-4 ${event.status === "succeeded" ? "bg-[#2ECE82] ring-emerald-50" : event.status === "failed" ? "bg-rose-500 ring-rose-50" : "bg-cyan-500 ring-cyan-50"}`} />{index < events.length - 1 ? <span className="min-h-12 w-px flex-1 bg-slate-200" /> : null}</div><div className="pb-4"><div className="flex items-center justify-between gap-2"><p className="text-[11px] font-black text-slate-800">{titleCase(event.stage)}</p><span className="text-[9px] font-bold text-slate-400">{event.progress}%</span></div><p className="mt-1 text-[10px] font-semibold leading-relaxed text-slate-500">{event.message}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{formatDate(event.created_at)}</p></div></div>)}</div> : <p className="text-[11px] font-semibold text-slate-500">No lifecycle events recorded.</p>}</div></aside>
    </section>
  </div>;
}

function ScannerWorkspaceContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const scannerGuideIds = Object.values(SCANNER_GUIDES) as string[];
  const selectedGuide = topic && scannerGuideIds.includes(topic) ? topic as (typeof SCANNER_GUIDES)[keyof typeof SCANNER_GUIDES] : "scanner-engine";
  if (pathname === "/scans/guide") return <WorkspaceGuidePage guideId={selectedGuide} />;
  if (pathname === "/scans/new-scan") return <NewScan />;
  const scanId = pathname.startsWith("/scans/") ? pathname.slice("/scans/".length).split("/")[0] : "";
  if (scanId) return <ScanDetail scanId={scanId} />;
  return <ScanHistory />;
}

export default function ScannerWorkspace() {
  return <Suspense fallback={<WorkspaceSkeleton rail rows={5} />}><ScannerWorkspaceContent /></Suspense>;
}
