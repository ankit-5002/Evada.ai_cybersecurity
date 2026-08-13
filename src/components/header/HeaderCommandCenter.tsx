"use client";

import { ArrowRight, Bell, CheckCheck, FileText, Plus, Radar, Search, ShieldAlert, Target, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import OperationOrbit from "@/components/header/OperationOrbit";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import {
  getDashboardOverview,
  listDashboardNotifications,
  markAllDashboardNotificationsRead,
  markDashboardNotificationsRead,
  searchDashboard,
  type DashboardNotification,
  type DashboardOperation,
  type DashboardSearchResult,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";

type HeaderCommandCenterProps = {
  canCreateAsset: boolean;
  canStartScan: boolean;
  showCreateAsset: boolean;
  showNotifications: boolean;
};

const kindIcons = { asset: Target, scan: Radar, finding: ShieldAlert, report: FileText };

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function toneDot(tone: DashboardNotification["tone"]) {
  if (tone === "error") return "bg-rose-500";
  if (tone === "warning") return "bg-amber-500";
  if (tone === "success") return "bg-[#2ECE82]";
  return "bg-cyan-500";
}

export default function HeaderCommandCenter({ canCreateAsset, canStartScan, showCreateAsset, showNotifications }: HeaderCommandCenterProps) {
  const router = useLoadingRouter();
  const { activeWorkspace } = useWorkspace();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<DashboardSearchResult[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [operations, setOperations] = useState<DashboardOperation[]>([]);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const averageProgress = operations.length
    ? Math.round(operations.reduce((total, operation) => total + operation.progress, 0) / operations.length)
    : 0;
  const scanCount = operations.filter((operation) => operation.kind === "scan").length;
  const reportCount = operations.filter((operation) => operation.kind === "report").length;

  const refreshStatus = useCallback(async () => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    const [overviewResult, notificationResult] = await Promise.allSettled([
      getDashboardOverview(token, activeWorkspace.id),
      showNotifications ? listDashboardNotifications(token, activeWorkspace.id, 8) : Promise.resolve(null),
    ]);
    if (overviewResult.status === "fulfilled") setOperations(overviewResult.value.operations);
    if (notificationResult.status === "fulfilled" && notificationResult.value) {
      setNotifications(notificationResult.value.results);
      setUnread(notificationResult.value.unread);
    }
  }, [activeWorkspace, showNotifications]);

  const refreshNotifications = useCallback(async () => {
    const token = getAccessToken();
    if (!token || !activeWorkspace || !showNotifications) return;
    try {
      const response = await listDashboardNotifications(token, activeWorkspace.id, 8);
      setNotifications(response.results);
      setUnread(response.unread);
    } catch {
      // Keep the existing snapshot visible while a background refresh is unavailable.
    }
  }, [activeWorkspace, showNotifications]);

  useEffect(() => {
    setOperations([]);
    setNotifications([]);
    setUnread(0);
    void refreshStatus();
    const timer = window.setInterval(() => void refreshStatus(), 15000);
    return () => window.clearInterval(timer);
  }, [refreshStatus]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || !activeWorkspace) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    const timer = window.setTimeout(async () => {
      const token = getAccessToken();
      if (!token) return;
      setSearching(true);
      try {
        const response = await searchDashboard(token, activeWorkspace.id, trimmed);
        setSearchResults(response.results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 260);
    return () => window.clearTimeout(timer);
  }, [activeWorkspace, query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      setSearchOpen(false);
      setNotificationOpen(false);
      setOperationsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const openResult = (result: DashboardSearchResult) => {
    setQuery("");
    setSearchOpen(false);
    router.push(result.href);
  };

  const openNotification = async (notification: DashboardNotification) => {
    const token = getAccessToken();
    if (token && activeWorkspace && !notification.read) {
      setNotifications((current) => current.map((item) => item.notification_key === notification.notification_key ? { ...item, read: true } : item));
      setUnread((current) => Math.max(0, current - 1));
      try { await markDashboardNotificationsRead(token, activeWorkspace.id, [notification.notification_key]); } catch { void refreshStatus(); }
    }
    setNotificationOpen(false);
    router.push(notification.href);
  };

  const markAllRead = async () => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnread(0);
    try { await markAllDashboardNotificationsRead(token, activeWorkspace.id); } catch { void refreshStatus(); }
  };

  return (
    <div ref={rootRef} className="flex min-w-0 flex-nowrap items-center gap-2">
      <div className="hidden items-center gap-2 lg:flex">
        {canCreateAsset && showCreateAsset ? <button type="button" onClick={() => router.push("/assets/new")} className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-[11px] font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-[#2ECE82]/40"><Plus className="h-4 w-4 text-[#16A86E]" />Add asset</button> : null}
        {canStartScan ? <button type="button" onClick={() => router.push("/scans/new-scan")} className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-[11px] font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-[#2ECE82]/40"><Radar className="h-4 w-4 text-[#16A86E]" />Start scan</button> : null}
      </div>

      <div className="relative hidden xl:block">
        <div className={`flex h-9 w-[210px] items-center gap-2 rounded-full border bg-slate-50 px-3 transition 2xl:w-[280px] ${searchOpen ? "border-[#2ECE82] ring-2 ring-[#2ECE82]/10" : "border-slate-200"}`}>
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder="Search Assets, Scans, Findings, Reports" className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-slate-800 outline-none placeholder:text-slate-400" />
          {query ? <button type="button" onClick={() => { setQuery(""); setSearchResults([]); }} aria-label="Clear search"><X className="h-3.5 w-3.5 text-slate-400" /></button> : null}
        </div>
        {searchOpen && query.trim().length >= 2 ? <div className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-[420px] overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="border-b border-slate-100 px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Workspace search</div>
          {searching ? <div className="grid gap-2 p-4">{[1,2,3].map((item) => <div key={item} className="h-12 animate-pulse rounded-[8px] bg-slate-100" />)}</div> : searchResults.length ? <div className="max-h-[370px] divide-y divide-slate-100 overflow-y-auto">{searchResults.map((result) => { const Icon = kindIcons[result.kind]; return <button key={`${result.kind}-${result.id}`} type="button" onClick={() => openResult(result)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-slate-50 text-[#0891B2] ring-1 ring-slate-100"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[12px] font-black text-slate-950">{result.title}</span><span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-500">{result.subtitle}</span></span><span className="rounded-full bg-slate-50 px-2 py-1 text-[8px] font-black uppercase text-slate-500">{result.kind}</span></button>; })}</div> : <div className="p-7 text-center text-[12px] font-bold text-slate-500">No matching tenant records.</div>}
        </div> : null}
      </div>

      <div className="relative">
        <button type="button" onClick={() => { setOperationsOpen((current) => !current); setNotificationOpen(false); setSearchOpen(false); }} className={`relative grid h-9 w-9 place-items-center rounded-full border bg-white transition ${operations.length ? "border-cyan-200 shadow-[0_8px_22px_rgba(6,182,212,0.14)]" : "border-slate-200"}`} aria-label={`${operations.length} background operation${operations.length === 1 ? "" : "s"}`} aria-expanded={operationsOpen}>
          <OperationOrbit active={Boolean(operations.length)} count={operations.length} progress={averageProgress} />
          {operations.length ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cyan-600 px-1 text-[9px] font-black text-white">{operations.length}</span> : null}
        </button>
        {operationsOpen ? <div className="fixed inset-x-3 top-[5.25rem] z-50 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.65rem)] sm:w-[430px]">
          <div className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4 bg-[#071514] px-4 py-4 text-white">
            <OperationOrbit active={Boolean(operations.length)} count={operations.length} progress={averageProgress} size="large" />
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase text-[#04D9FF]">Tenant job control</p>
              <p className="mt-1 text-[17px] font-black">{operations.length ? "Background work is active" : "All background work is clear"}</p>
              <p className="mt-1 text-[10px] font-semibold leading-relaxed text-white/55">{operations.length ? `${scanCount} scan job${scanCount === 1 ? "" : "s"} and ${reportCount} report job${reportCount === 1 ? "" : "s"} are running.` : "No scanner containers or report renderers are waiting."}</p>
            </div>
          </div>
          {operations.length ? <div className="max-h-[360px] divide-y divide-slate-100 overflow-y-auto">{operations.map((operation) => { const Icon = operation.kind === "scan" ? Radar : FileText; return <button key={`${operation.kind}-${operation.id}`} type="button" onClick={() => { setOperationsOpen(false); router.push(operation.href); }} className="grid w-full grid-cols-[36px_minmax(0,1fr)_auto] gap-3 px-4 py-3 text-left transition hover:bg-cyan-50/35"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-slate-50 text-cyan-700 ring-1 ring-slate-100"><Icon className="h-4 w-4" /></span><span className="min-w-0"><span className="flex items-center justify-between gap-3"><span className="truncate text-[11px] font-black text-slate-950">{operation.title}</span><span className="text-[10px] font-black text-cyan-700">{operation.progress}%</span></span><span className="mt-1 block truncate text-[9px] font-bold text-slate-500">{operation.subject}</span><span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#2ECE82] transition-all" style={{ width: `${operation.progress}%` }} /></span><span className="mt-1.5 block text-[8px] font-black uppercase text-slate-400">{operation.stage.replaceAll("_", " ")}</span></span><ArrowRight className="mt-2 h-4 w-4 text-slate-300" /></button>; })}</div> : <div className="grid place-items-center gap-2 px-6 py-7 text-center"><OperationOrbit active={false} size="compact" /><p className="text-[12px] font-black text-slate-800">No active operations</p><p className="max-w-xs text-[10px] font-semibold leading-relaxed text-slate-500">New Web/TLS scans and VAPT report generation will appear here automatically.</p></div>}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[9px] font-semibold leading-relaxed text-slate-500">Scanner jobs run in isolated containers. Report jobs render immutable snapshots. Navigating away does not stop either job.</div>
        </div> : null}
      </div>

      {showNotifications ? <div className="relative">
        <button type="button" onClick={() => { const opening = !notificationOpen; setNotificationOpen(opening); setOperationsOpen(false); setSearchOpen(false); if (opening) void refreshNotifications(); }} className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:text-[#0891B2]" aria-label={`${unread} unread notifications`}>
          <Bell className="h-4 w-4" />
          {unread ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white">{unread > 99 ? "99+" : unread}</span> : null}
        </button>
        {notificationOpen ? <div className="fixed inset-x-3 top-[5.25rem] z-50 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.65rem)] sm:w-[410px]"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><p className="text-[13px] font-black text-slate-950">Notifications</p><p className="text-[10px] font-semibold text-slate-500">{unread} unread tenant event{unread === 1 ? "" : "s"}</p></div>{unread ? <button type="button" onClick={() => void markAllRead()} className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#16865C]"><CheckCheck className="h-4 w-4" />Mark all read</button> : null}</div>{notifications.length ? <div className="max-h-[min(430px,calc(100dvh-10rem))] divide-y divide-slate-100 overflow-y-auto overscroll-contain">{notifications.map((notification) => <button key={notification.notification_key} type="button" onClick={() => void openNotification(notification)} className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${notification.read ? "bg-white" : "bg-cyan-50/35"}`}><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot(notification.tone)}`} /><span className="min-w-0 flex-1"><span className="block text-[11px] font-black text-slate-950">{notification.title}</span><span className="mt-0.5 block line-clamp-2 text-[10px] font-semibold leading-relaxed text-slate-500">{notification.message || notification.object_name}</span></span><span className="shrink-0 text-[9px] font-black text-slate-400">{relativeTime(notification.created_at)}</span></button>)}</div> : <div className="p-7 text-center text-[12px] font-bold text-slate-500">No tenant notifications yet.</div>}<button type="button" onClick={() => { setNotificationOpen(false); router.push("/notifications"); }} className="flex h-11 w-full items-center justify-center gap-2 border-t border-slate-100 text-[11px] font-black text-[#0891B2]">Open notification center <ArrowRight className="h-3.5 w-3.5" /></button></div> : null}
      </div> : null}
    </div>
  );
}
