"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  LockKeyhole,
  RefreshCw,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import OperationOrbit from "@/components/header/OperationOrbit";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import { ApiError, getDashboardOverview, type DashboardOverview } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";

const severityTone: Record<string, string> = {
  critical: "bg-rose-50 text-rose-700 ring-rose-100",
  high: "bg-orange-50 text-orange-700 ring-orange-100",
  medium: "bg-amber-50 text-amber-700 ring-amber-100",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  informational: "bg-cyan-50 text-cyan-700 ring-cyan-100",
};

const severityVisual = {
  critical: { label: "Critical", color: "#E11D48" },
  high: { label: "High", color: "#F97316" },
  medium: { label: "Medium", color: "#F4B41A" },
  low: { label: "Low", color: "#20B778" },
  informational: { label: "Informational", color: "#06B6D4" },
} as const;

function formatTime(value: string | null) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusTone(status: string) {
  if (["succeeded", "ready", "verified", "resolved"].includes(status)) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (["failed", "timed_out", "critical"].includes(status)) return "bg-rose-50 text-rose-700 ring-rose-100";
  if (["queued", "running", "uploading", "generating", "retrying", "in_progress"].includes(status)) return "bg-cyan-50 text-cyan-700 ring-cyan-100";
  return "bg-slate-50 text-slate-600 ring-slate-200";
}

function percentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function riskGradient(findings: DashboardOverview["summary"]["findings"], total: number) {
  if (!total) return "conic-gradient(#E2E8F0 0deg 360deg)";

  let cursor = 0;
  const stops = SEVERITY_ORDER.map((severity) => {
    const start = cursor;
    cursor += (findings[severity] / total) * 360;
    return `${severityVisual[severity].color} ${start}deg ${cursor}deg`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function OverviewWorkspace() {
  const router = useLoadingRouter();
  const { activeWorkspace } = useWorkspace();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (background = false) => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    if (background) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await getDashboardOverview(token, activeWorkspace.id);
      setData(response);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Overview data is temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    setData(null);
    void load();
  }, [load]);

  useEffect(() => {
    if (!data?.operations.length) return;
    const timer = window.setInterval(() => void load(true), 10000);
    return () => window.clearInterval(timer);
  }, [data?.operations.length, load]);

  const severityTotal = useMemo(() => {
    if (!data) return 0;
    return ["critical", "high", "medium", "low", "informational"].reduce(
      (total, severity) => total + data.summary.findings[severity as keyof typeof data.summary.findings],
      0,
    );
  }, [data]);

  if (loading && !data) return <WorkspaceSkeleton metrics={5} rows={6} detail />;

  if (!data) {
    return (
      <section className="grid min-h-[360px] place-items-center rounded-[8px] border border-rose-100 bg-rose-50/60 p-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-600" />
          <h2 className="mt-3 text-[18px] font-black text-slate-950">Overview unavailable</h2>
          <p className="mt-1 text-[13px] font-semibold text-slate-600">{error}</p>
          <button type="button" onClick={() => void load()} className="mt-5 inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </section>
    );
  }

  const summaryCards = [
    { module: "assets", label: "Active assets", value: data.summary.assets.active, helper: `${data.summary.assets.pending} pending verification`, Icon: Database, href: "/assets", tone: "text-cyan-700 bg-cyan-50 ring-cyan-100" },
    { module: "scans", label: "Scans", value: data.summary.scans.total, helper: `${data.summary.scans.active} currently running`, Icon: ScanLine, href: "/scans", tone: "text-blue-700 bg-blue-50 ring-blue-100" },
    { module: "findings", label: "Active findings", value: data.summary.findings.active, helper: `${data.summary.findings.critical + data.summary.findings.high} critical or high`, Icon: ShieldAlert, href: "/findings", tone: "text-rose-700 bg-rose-50 ring-rose-100" },
    { module: "reports", label: "Ready reports", value: data.summary.reports.ready, helper: `${data.summary.reports.active} generating`, Icon: FileText, href: "/reports", tone: "text-emerald-700 bg-emerald-50 ring-emerald-100" },
    { module: "team_rbac", label: "Team seats", value: `${data.summary.team.active}/${data.summary.team.limit || "-"}`, helper: `${data.summary.team.pending} setup pending`, Icon: Users, href: "/team", tone: "text-violet-700 bg-violet-50 ring-violet-100" },
  ].filter((item) => activeWorkspace?.permissions.modules.includes(item.module));
  const canViewScans = activeWorkspace?.permissions.modules.includes("scans");
  const canViewFindings = activeWorkspace?.permissions.modules.includes("findings");

  return (
    <div className="grid min-w-0 gap-4">
      {error ? <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-bold text-amber-800">Showing the latest loaded data. {error}</div> : null}

      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Live tenant posture</p>
          <h2 className="mt-1 text-[24px] font-black text-slate-950">{data.organization.name}</h2>
          <p className="mt-1 text-[12px] font-semibold text-slate-500">Real Assets, Scans, Findings, Reports and Team state from this workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          {data.operations.length ? (
            <button type="button" onClick={() => router.push(data.operations[0].href)} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-cyan-100 bg-cyan-50/55 px-2.5 text-left text-cyan-800 transition hover:border-cyan-200 hover:bg-cyan-50" aria-label={`Open ${data.operations.length} active background operation${data.operations.length === 1 ? "" : "s"}`}>
              <OperationOrbit active count={data.operations.length} progress={Math.round(data.operations.reduce((total, operation) => total + operation.progress, 0) / data.operations.length)} size="compact" />
              <span><strong className="block text-[10px] font-black leading-none">{data.operations.length} running</strong><span className="mt-1 block text-[8px] font-bold text-cyan-700/70">Background work</span></span>
            </button>
          ) : null}
          <span className="rounded-full bg-[#E8FFF3] px-3 py-1.5 text-[10px] font-black uppercase text-[#16865C] ring-1 ring-emerald-100">{data.organization.plan_code}</span>
          <button type="button" onClick={() => void load(true)} disabled={refreshing} className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-[#16A86E] disabled:opacity-50" aria-label="Refresh overview">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      <section className={`grid gap-2.5 sm:grid-cols-2 ${summaryCards.length >= 5 ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"}`}>
        {summaryCards.map((item) => (
          <button key={item.label} type="button" onClick={() => router.push(item.href)} className="group flex min-h-[88px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white p-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-[#2ECE82]/45">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[8px] ring-1 ${item.tone}`}><item.Icon className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">{item.label}</span>
              <span className="mt-1 block text-[24px] font-black leading-none text-slate-950">{item.value}</span>
              <span className="mt-1 block truncate text-[10px] font-bold text-slate-400">{item.helper}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[#16A86E]" />
          </button>
        ))}
      </section>

      {data.operations.length ? (
        <section className="overflow-hidden rounded-[8px] border border-cyan-100 bg-cyan-50/35 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <OperationOrbit active count={data.operations.length} progress={Math.round(data.operations.reduce((total, operation) => total + operation.progress, 0) / data.operations.length)} size="compact" />
              <div><h3 className="text-[14px] font-black text-slate-950">Background operations</h3><p className="text-[10px] font-semibold text-slate-500">Live scanner and report progress.</p></div>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase text-cyan-700 ring-1 ring-cyan-100">{data.operations.length} active</span>
          </div>
          <div className="grid divide-y divide-cyan-100 xl:grid-cols-2 xl:divide-x xl:divide-y-0">
            {data.operations.map((operation) => (
              <button key={`${operation.kind}-${operation.id}`} type="button" onClick={() => router.push(operation.href)} className="grid gap-3 px-4 py-3 text-left transition hover:bg-white/70 sm:grid-cols-[minmax(0,1fr)_170px] sm:items-center">
                <span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate text-[11px] font-black text-slate-950">{operation.title}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ring-1 ${statusTone(operation.status)}`}>{operation.status.replaceAll("_", " ")}</span></span><span className="mt-0.5 block truncate text-[9px] font-bold text-slate-500">{operation.subject}</span></span>
                <span className="grid gap-1"><span className="flex justify-between text-[8px] font-black uppercase text-slate-500"><span>{operation.stage.replaceAll("_", " ")}</span><span>{operation.progress}%</span></span><span className="h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-cyan-100"><span className="block h-full rounded-full bg-[#2ECE82] transition-all" style={{ width: `${operation.progress}%` }} /></span></span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {canViewFindings || canViewScans ? (
        <section className={`grid items-start gap-4 ${canViewFindings && canViewScans ? "xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]" : ""}`}>
          {canViewFindings ? (
            <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <div><h3 className="text-[16px] font-black text-slate-950">Risk posture</h3><p className="text-[11px] font-semibold text-slate-500">Live severity distribution across active Findings.</p></div>
                <button type="button" onClick={() => router.push("/findings")} className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#0891B2]">Open Findings <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
              <div className="grid gap-5 p-4 md:grid-cols-[210px_minmax(0,1fr)] md:items-center">
                <div className="grid place-items-center">
                  <button type="button" onClick={() => router.push("/findings")} className="relative grid h-[168px] w-[168px] place-items-center rounded-full transition hover:scale-[1.02]" style={{ background: riskGradient(data.summary.findings, severityTotal) }} aria-label={`Open ${severityTotal} active Findings`}>
                    <span className="absolute inset-[24px] grid place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(226,232,240,.9)]">
                      <span className="text-center"><span className="block text-[30px] font-black leading-none text-slate-950">{severityTotal}</span><span className="mt-1 block text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">Active findings</span></span>
                    </span>
                  </button>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-500"><ShieldCheck className="h-4 w-4 text-[#16A86E]" /> {data.summary.findings.resolved} resolved</div>
                </div>
                <div className="grid gap-3">
                  {SEVERITY_ORDER.map((severity) => {
                    const value = data.summary.findings[severity];
                    const share = percentage(value, severityTotal);
                    return (
                      <button key={severity} type="button" onClick={() => router.push(`/findings?severity=${severity}`)} className="group grid grid-cols-[94px_minmax(80px,1fr)_54px] items-center gap-3 text-left">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-700"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityVisual[severity].color }} />{severityVisual[severity].label}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full transition-all group-hover:brightness-95" style={{ width: `${share}%`, backgroundColor: severityVisual[severity].color }} /></span>
                        <span className="text-right text-[11px] font-black text-slate-950">{value} <span className="text-[8px] text-slate-400">{share}%</span></span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid border-t border-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-slate-100">
                <div className="px-4 py-3"><p className="text-[9px] font-black uppercase text-slate-400">Average risk</p><p className="mt-1 text-[18px] font-black text-slate-950">{data.summary.assets.average_risk_score.toFixed(0)}<span className="text-[10px] text-slate-400"> / 100</span></p></div>
                <div className="border-t border-slate-100 px-4 py-3 sm:border-t-0"><p className="text-[9px] font-black uppercase text-slate-400">At-risk assets</p><p className="mt-1 text-[18px] font-black text-rose-600">{data.summary.assets.at_risk}</p></div>
                <div className="border-t border-slate-100 px-4 py-3 sm:border-t-0"><p className="text-[9px] font-black uppercase text-slate-400">In review</p><p className="mt-1 text-[18px] font-black text-cyan-700">{data.summary.findings.in_review}</p></div>
              </div>
            </article>
          ) : null}

          {canViewScans ? (
            <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
              <div className="border-b border-slate-100 px-4 py-3"><h3 className="text-[16px] font-black text-slate-950">Scan health</h3><p className="text-[11px] font-semibold text-slate-500">Current scanner lifecycle distribution.</p></div>
              <div className="p-4">
                <div className="flex items-end justify-between gap-4"><div><p className="text-[9px] font-black uppercase tracking-[0.08em] text-slate-400">All scans</p><p className="mt-1 text-[30px] font-black leading-none text-slate-950">{data.summary.scans.total}</p></div><button type="button" onClick={() => router.push("/scans")} className="text-[10px] font-black text-[#0891B2]">View history</button></div>
                <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100" aria-label="Scan status distribution">
                  <span className="bg-[#20B778]" style={{ width: `${percentage(data.summary.scans.succeeded, data.summary.scans.total)}%` }} />
                  <span className="bg-[#06B6D4]" style={{ width: `${percentage(data.summary.scans.active, data.summary.scans.total)}%` }} />
                  <span className="bg-[#E11D48]" style={{ width: `${percentage(data.summary.scans.failed, data.summary.scans.total)}%` }} />
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    { label: "Succeeded", value: data.summary.scans.succeeded, color: "#20B778" },
                    { label: "In progress", value: data.summary.scans.active, color: "#06B6D4" },
                    { label: "Needs attention", value: data.summary.scans.failed, color: "#E11D48" },
                  ].map((item) => <div key={item.label} className="flex h-9 items-center justify-between rounded-[8px] bg-slate-50 px-3"><span className="flex items-center gap-2 text-[10px] font-bold text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><span className="text-[13px] font-black text-slate-950">{item.value}</span></div>)}
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100">
                <button type="button" onClick={() => router.push("/reports")} className="px-4 py-3 text-left transition hover:bg-slate-50"><p className="text-[9px] font-black uppercase text-slate-400">Ready reports</p><p className="mt-1 text-[18px] font-black text-emerald-700">{data.summary.reports.ready}</p></button>
                <button type="button" onClick={() => router.push("/assets")} className="px-4 py-3 text-left transition hover:bg-slate-50"><p className="text-[9px] font-black uppercase text-slate-400">Verified assets</p><p className="mt-1 text-[18px] font-black text-slate-950">{data.summary.assets.active}</p></button>
              </div>
            </article>
          ) : null}
        </section>
      ) : null}

      {canViewScans || canViewFindings ? <section className={`grid items-start gap-4 ${canViewScans && canViewFindings ? "xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]" : ""}`}>
        {canViewScans ? <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><h3 className="text-[16px] font-black">Recent scans</h3><p className="text-[11px] font-semibold text-slate-500">Latest scanner activity in this tenant.</p></div><button type="button" onClick={() => router.push("/scans")} className="text-[11px] font-black text-[#0891B2]">View all</button></div>
          {data.recent_scans.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-[9px] font-black uppercase tracking-[0.08em] text-slate-500"><tr><th className="px-4 py-3">Scan</th><th className="px-4 py-3">Asset</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Findings</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-slate-100">{data.recent_scans.map((scan) => <tr key={scan.id} onClick={() => router.push(`/scans/${scan.id}`)} className="cursor-pointer text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"><td className="px-4 py-3"><p className="font-black text-slate-950">{scan.name}</p><p className="mt-0.5 text-[9px] uppercase text-slate-400">{scan.scanner}</p></td><td className="px-4 py-3"><p className="font-black text-slate-800">{scan.asset_name}</p><p className="max-w-[230px] truncate text-[9px] text-slate-400">{scan.target}</p></td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ring-1 ${statusTone(scan.status)}`}>{scan.status}</span></td><td className="px-4 py-3 font-black text-slate-950">{scan.findings_count}</td><td className="px-4 py-3 text-[10px]">{formatTime(scan.completed_at || scan.created_at)}</td></tr>)}</tbody></table></div> : <div className="p-8 text-center text-[12px] font-bold text-slate-500">No scans have been created for this workspace.</div>}
        </article> : null}

        {canViewFindings ? <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><h3 className="text-[16px] font-black">Priority findings</h3><p className="text-[11px] font-semibold text-slate-500">Highest-impact work first.</p></div><button type="button" onClick={() => router.push("/findings")} className="text-[11px] font-black text-[#0891B2]">Open queue</button></div>
          {data.priority_findings.length ? <div className="divide-y divide-slate-100">{data.priority_findings.map((finding) => <button key={finding.id} type="button" onClick={() => router.push(`/findings/${finding.id}`)} className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"><span className={`mt-0.5 rounded-full px-2 py-1 text-[8px] font-black uppercase ring-1 ${severityTone[finding.severity]}`}>{finding.severity}</span><span className="min-w-0 flex-1"><span className="block line-clamp-2 text-[11px] font-black text-slate-950">{finding.title}</span><span className="mt-1 block truncate text-[9px] font-bold text-slate-400">{finding.asset_name} - {finding.occurrence_count} observation{finding.occurrence_count === 1 ? "" : "s"}</span></span><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" /></button>)}</div> : <div className="flex min-h-[160px] items-center justify-center gap-2 p-6 text-[12px] font-bold text-slate-500"><CheckCircle2 className="h-5 w-5 text-[#16A86E]" /> No active Findings.</div>}
        </article> : null}
      </section> : null}

      <section className="grid items-start gap-4 lg:grid-cols-2">
        {activeWorkspace?.permissions.modules.includes("ai_pentester") ? (
          <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-[#071514] text-white shadow-[0_12px_32px_rgba(5,20,18,0.12)]">
            <div className="grid gap-4 p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
              <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#12332B] text-[#2ECE82] ring-1 ring-emerald-400/20"><BrainCircuit className="h-5 w-5" /></span>
              <div><span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-cyan-300"><Clock3 className="h-3.5 w-3.5" /> Preview capability</span><h3 className="mt-1 text-[16px] font-black">AI Pentester</h3><p className="mt-1 text-[10px] font-semibold leading-5 text-slate-300">The workflow interface is available. Live AI orchestration and execution workers are not connected yet.</p></div>
              <button type="button" onClick={() => router.push("/ai-pentester")} className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-white/15 px-3 text-[10px] font-black transition hover:border-[#2ECE82]/50 hover:bg-white/5">Open preview <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
          </article>
        ) : null}
        {activeWorkspace?.permissions.modules.includes("network_agent") ? (
          <article className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="grid gap-4 p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
              <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100"><Bot className="h-5 w-5" /></span>
              <div><span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400"><LockKeyhole className="h-3.5 w-3.5" /> Integration pending</span><h3 className="mt-1 text-[16px] font-black text-slate-950">Network Agent</h3><p className="mt-1 text-[10px] font-semibold leading-5 text-slate-500">Agent setup screens are available. Enrollment, heartbeat and live device telemetry remain disconnected.</p></div>
              <button type="button" onClick={() => router.push("/network-agent")} className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-slate-200 px-3 text-[10px] font-black text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700">Open preview <ArrowRight className="h-3.5 w-3.5" /></button>
            </div>
          </article>
        ) : null}
      </section>

      <p className="text-right text-[9px] font-bold text-slate-400">Updated {formatTime(data.generated_at)}</p>
    </div>
  );
}

const SEVERITY_ORDER = ["critical", "high", "medium", "low", "informational"] as const;
