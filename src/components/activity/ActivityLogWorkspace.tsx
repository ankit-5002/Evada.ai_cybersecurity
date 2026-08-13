"use client";

import { Activity, AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Database, FileText, LogIn, LogOut, RefreshCw, ScanLine, Search, ShieldCheck, Users } from "lucide-react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import { ApiError, getAuthenticationActivity, listDashboardActivity, type AuthenticationActivityDay, type AuthenticationActivityResponse, type DashboardActivityEvent, type DashboardActivityResponse } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";
import { useCallback, useEffect, useState } from "react";

const emptySummary: DashboardActivityResponse["summary"] = { total: 0, today: 0, user_actions: 0, system_events: 0, needs_attention: 0 };

function eventIcon(kind: DashboardActivityEvent["kind"]) {
  if (kind === "asset") return Database;
  if (kind === "scan") return ScanLine;
  if (kind === "finding") return ShieldCheck;
  if (kind === "report") return FileText;
  if (kind === "team") return Users;
  return Activity;
}

function statusTone(status: string) {
  if (["failed", "failure", "timed_out", "cancelled"].includes(status)) return "bg-rose-50 text-rose-700 ring-rose-100";
  if (["warning", "pending", "queued", "expired"].includes(status)) return "bg-amber-50 text-amber-700 ring-amber-100";
  if (["success", "succeeded", "ready", "verified", "resolved", "active"].includes(status)) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  return "bg-cyan-50 text-cyan-700 ring-cyan-100";
}

function titleCase(value: string) {
  return value.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function CalendarDay({ day, selected, onSelect }: { day: AuthenticationActivityDay; selected: boolean; onSelect: () => void }) {
  const hasLogin = day.login_count > 0;
  const hasLogout = day.logout_count > 0;
  const tone = hasLogin && hasLogout
    ? "bg-[linear-gradient(135deg,#34d399_50%,#22d3ee_50%)] text-slate-950"
    : hasLogin
      ? "bg-emerald-400 text-emerald-950"
      : hasLogout
        ? "bg-cyan-400 text-cyan-950"
        : "bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-200";
  const label = `${day.weekday}: ${day.login_count} login${day.login_count === 1 ? "" : "s"}, ${day.logout_count} logout${day.logout_count === 1 ? "" : "s"}`;
  return (
    <button type="button" onClick={onSelect} title={label} aria-label={label} className={`relative min-h-12 rounded-[6px] p-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${tone} ${selected ? "ring-2 ring-slate-950 ring-offset-2" : ""}`}>
      <span className="text-[11px] font-black">{new Date(`${day.date}T12:00:00`).getDate()}</span>
      {day.active ? <span className="absolute bottom-1.5 right-1.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[7px] font-black text-slate-800">{day.login_count + day.logout_count}</span> : null}
      {day.is_today ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-950" /> : null}
    </button>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-[3px] ${tone}`} />{label}</span>;
}

function SecurityCount({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-[6px] bg-white/[0.06] p-3"><p className="text-[8px] font-black uppercase text-white/40">{label}</p><p className={`mt-1 text-[22px] font-black ${tone}`}>{value}</p></div>;
}

export default function ActivityLogWorkspace() {
  const router = useLoadingRouter();
  const { activeWorkspace } = useWorkspace();
  const [events, setEvents] = useState<DashboardActivityEvent[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [actor, setActor] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [controlPlaneAvailable, setControlPlaneAvailable] = useState(true);
  const [authenticationActivity, setAuthenticationActivity] = useState<AuthenticationActivityResponse | null>(null);
  const [authenticationLoading, setAuthenticationLoading] = useState(true);
  const [authenticationError, setAuthenticationError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const load = useCallback(async (background = false) => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    if (background) setRefreshing(true); else setLoading(true);
    try {
      const response = await listDashboardActivity(token, activeWorkspace.id, { page, page_size: 10, q: search.trim(), kind, actor });
      setEvents(response.results);
      setSummary(response.summary);
      setTotal(response.total);
      setPages(response.pages);
      setControlPlaneAvailable(response.control_plane_available);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Activity is temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeWorkspace, actor, kind, page, search]);

  const loadAuthenticationActivity = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setAuthenticationLoading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const response = await getAuthenticationActivity(token, timezone);
      setAuthenticationActivity(response);
      setSelectedDate((current) => current || response.today);
      setAuthenticationError("");
    } catch (loadError) {
      setAuthenticationError(loadError instanceof ApiError ? loadError.message : "Login activity is temporarily unavailable.");
    } finally {
      setAuthenticationLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [load, search]);

  useEffect(() => {
    void loadAuthenticationActivity();
  }, [loadAuthenticationActivity]);

  if (loading) return <WorkspaceSkeleton metrics={5} rows={10} />;

  const metrics = [
    { label: "Workspace events", value: summary.total, helper: "tenant ledger", Icon: Activity, tone: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
    { label: "Successful logins", value: authenticationActivity?.summary.logins ?? 0, helper: "last 30 days", Icon: LogIn, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { label: "Logouts", value: authenticationActivity?.summary.logouts ?? 0, helper: "manual or automatic", Icon: LogOut, tone: "bg-blue-50 text-blue-700 ring-blue-100" },
    { label: "Active days", value: authenticationActivity?.summary.active_days ?? 0, helper: "verified access", Icon: CalendarDays, tone: "bg-violet-50 text-violet-700 ring-violet-100" },
    { label: "Attention", value: summary.needs_attention, helper: "operational review", Icon: AlertTriangle, tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  ];
  const selectedDay = authenticationActivity?.days.find((day) => day.date === selectedDate) || null;
  const calendarOffset = authenticationActivity?.days.length
    ? new Date(`${authenticationActivity.days[0].date}T12:00:00`).getDay()
    : 0;

  const refreshAll = async () => {
    await Promise.all([load(true), loadAuthenticationActivity()]);
  };

  return (
    <div className="grid gap-4">
      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Immutable workspace ledger</p><h2 className="mt-1 text-[24px] font-black text-slate-950">Activity Log</h2><p className="mt-1 text-[12px] font-semibold text-slate-500">Real Asset, scan, Finding, report and team events for {activeWorkspace?.name}.</p></div>
        <button type="button" onClick={() => void refreshAll()} disabled={refreshing || authenticationLoading} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><RefreshCw className={`h-4 w-4 ${refreshing || authenticationLoading ? "animate-spin" : ""}`} />Refresh</button>
      </section>

      {!controlPlaneAvailable ? <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] font-bold text-amber-800">Tenant events are current. Team events are temporarily unavailable from the control plane.</div> : null}
      {error ? <div className="rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-[12px] font-bold text-rose-700">{error}</div> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ label, value, helper, Icon, tone }) => <article key={label} className="rounded-[8px] border border-slate-200 bg-white p-3 shadow-[0_8px_22px_rgba(15,23,42,0.035)]"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-[8px] ring-1 ${tone}`}><Icon className="h-4 w-4" /></span><div><p className="text-[9px] font-black uppercase text-slate-500">{label}</p><p className="mt-1 text-[22px] font-black leading-none text-slate-950">{value}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{helper}</p></div></div></article>)}
      </section>

      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div><p className="text-[13px] font-black text-slate-950">Your login activity</p><p className="mt-0.5 text-[10px] font-semibold text-slate-500">Successful login and logout records for this EVADA identity. No IP, location, or browser fingerprint is stored.</p></div>
          {authenticationActivity ? <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-black text-slate-500 ring-1 ring-slate-200">{authenticationActivity.range_start} to {authenticationActivity.range_end}</span> : null}
        </div>
        {authenticationError ? <div className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-[11px] font-bold text-rose-700">{authenticationError}</div> : null}
        {authenticationLoading && !authenticationActivity ? (
          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_260px]"><div className="grid grid-cols-7 gap-2">{Array.from({ length: 35 }, (_, index) => <span key={index} className="h-12 animate-pulse rounded-[6px] bg-slate-100" />)}</div><div className="h-48 animate-pulse rounded-[8px] bg-slate-100" /></div>
        ) : authenticationActivity ? (
          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div>
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[8px] font-black uppercase text-slate-400">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => <span key={label}>{label}</span>)}</div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: calendarOffset }, (_, index) => <span key={`blank-${index}`} aria-hidden="true" />)}
                {authenticationActivity.days.map((day) => <CalendarDay key={day.date} day={day} selected={day.date === selectedDate} onSelect={() => setSelectedDate(day.date)} />)}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[9px] font-bold text-slate-500"><Legend tone="bg-emerald-400" label="Login" /><Legend tone="bg-cyan-400" label="Logout" /><Legend tone="bg-[linear-gradient(135deg,#34d399_50%,#22d3ee_50%)]" label="Both" /><Legend tone="bg-slate-200" label="No event" /></div>
            </div>
            <aside className="rounded-[8px] bg-[#071513] p-4 text-white">
              <p className="text-[9px] font-black uppercase text-cyan-300">Selected day</p>
              <p className="mt-1 text-[18px] font-black">{selectedDay ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(`${selectedDay.date}T12:00:00`)) : "Choose a day"}</p>
              <div className="mt-3 grid grid-cols-2 gap-2"><SecurityCount label="Logins" value={selectedDay?.login_count ?? 0} tone="text-emerald-300" /><SecurityCount label="Logouts" value={selectedDay?.logout_count ?? 0} tone="text-cyan-300" /></div>
              <div className="mt-3 border-t border-white/10 pt-3">
                {selectedDay?.events.length ? <div className="grid gap-2">{selectedDay.events.map((event, index) => <div key={`${event.occurred_at}-${index}`} className="flex items-center justify-between gap-3 rounded-[6px] bg-white/[0.06] px-3 py-2"><div><p className="text-[10px] font-black capitalize">{event.type}</p><p className="mt-0.5 text-[8px] font-bold capitalize text-white/45">{event.reason.replaceAll("_", " ")}</p></div><span className="text-[9px] font-black text-white/70">{new Intl.DateTimeFormat("en", { timeStyle: "short" }).format(new Date(event.occurred_at))}</span></div>)}</div> : <p className="py-5 text-center text-[10px] font-semibold text-white/45">No login or logout event on this day.</p>}
              </div>
              <div className="mt-3 border-t border-white/10 pt-3"><p className="text-[8px] font-black uppercase text-white/35">Last successful login</p><p className="mt-1 text-[10px] font-bold text-white/75">{authenticationActivity.summary.last_login_at ? formatDate(authenticationActivity.summary.last_login_at) : "Not recorded"}</p></div>
            </aside>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3"><div><p className="text-[13px] font-black text-slate-950">Workspace event ledger</p><p className="mt-0.5 text-[10px] font-semibold text-slate-500">Assets, scans, Findings, reports, team and system lifecycle events.</p></div><div className="flex gap-2 text-[9px] font-black"><span className="rounded-full bg-slate-50 px-2.5 py-1 text-slate-500 ring-1 ring-slate-200">{summary.user_actions} user</span><span className="rounded-full bg-slate-50 px-2.5 py-1 text-slate-500 ring-1 ring-slate-200">{summary.system_events} system</span></div></div>
        <div className="grid gap-2 border-b border-slate-100 bg-slate-50 p-3 lg:grid-cols-[minmax(240px,1fr)_180px_160px_44px]">
          <label className="flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search event, object, actor or message" className="min-w-0 flex-1 bg-transparent text-[11px] font-bold text-slate-800 outline-none" /></label>
          <select value={kind} onChange={(event) => { setPage(1); setKind(event.target.value); }} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All event types</option><option value="asset">Assets</option><option value="scan">Scans</option><option value="finding">Findings</option><option value="report">Reports</option><option value="team">Team</option><option value="organization">Organization</option></select>
          <select value={actor} onChange={(event) => { setPage(1); setActor(event.target.value); }} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700"><option value="">All actors</option><option value="user">User</option><option value="system">System</option></select>
          <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-500"><Activity className="h-4 w-4" /></span>
        </div>

        {events.length ? <div className="divide-y divide-slate-100">{events.map((event) => { const Icon = eventIcon(event.kind); return <button key={event.event_key} type="button" onClick={() => event.href && router.push(event.href)} className="grid w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 md:grid-cols-[42px_minmax(220px,1.2fr)_minmax(180px,1fr)_140px_150px] md:items-center"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-slate-50 text-[#0891B2] ring-1 ring-slate-100"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-[12px] font-black text-slate-950">{titleCase(event.event_type)}</span><span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-500">{event.message || event.object_name}</span></span><span className="min-w-0"><span className="block truncate text-[11px] font-black text-slate-800">{event.object_name || titleCase(event.kind)}</span><span className="mt-0.5 block truncate text-[9px] font-bold uppercase text-slate-400">{event.kind}</span></span><span className={`w-fit rounded-full px-2 py-1 text-[9px] font-black uppercase ring-1 ${statusTone(event.status)}`}>{titleCase(event.status || "info")}</span><span className="min-w-0 md:text-right"><span className="block truncate text-[10px] font-black text-slate-600">{event.actor_email || titleCase(event.actor_type)}</span><span className="mt-0.5 block text-[9px] font-bold text-slate-400">{formatDate(event.created_at)}</span></span></button>; })}</div> : <div className="grid min-h-[280px] place-items-center p-8 text-center"><div><Activity className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-[13px] font-black text-slate-800">No activity matches these filters</p><p className="mt-1 text-[11px] font-semibold text-slate-500">New tenant and team lifecycle events appear here automatically.</p></div></div>}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3"><span className="text-[10px] font-black text-slate-500">{total} matching event{total === 1 ? "" : "s"}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 disabled:opacity-35" aria-label="Previous activity page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-12 text-center text-[10px] font-black text-slate-700">{page}/{pages}</span><button type="button" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page >= pages} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 disabled:opacity-35" aria-label="Next activity page"><ChevronRight className="h-4 w-4" /></button></div></div>
      </section>
    </div>
  );
}
