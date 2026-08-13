"use client";

import { Bell, CheckCheck, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceSkeleton } from "@/components/workspace/WorkspaceSkeleton";
import { ApiError, listDashboardNotifications, markAllDashboardNotificationsRead, markDashboardNotificationsRead, type DashboardNotification } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function toneClasses(tone: DashboardNotification["tone"]) {
  if (tone === "error") return "bg-rose-500 ring-rose-100";
  if (tone === "warning") return "bg-amber-500 ring-amber-100";
  if (tone === "success") return "bg-[#2ECE82] ring-emerald-100";
  return "bg-cyan-500 ring-cyan-100";
}

export default function NotificationsWorkspace() {
  const router = useLoadingRouter();
  const { activeWorkspace } = useWorkspace();
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (background = false) => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    if (background) setRefreshing(true); else setLoading(true);
    try {
      const response = await listDashboardNotifications(token, activeWorkspace.id, 10, unreadOnly, page);
      setNotifications(response.results);
      setUnread(response.unread);
      setPages(response.pages);
      setTotal(response.total);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : "Notifications are temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeWorkspace, page, unreadOnly]);

  useEffect(() => { void load(); }, [load]);

  const openNotification = async (notification: DashboardNotification) => {
    const token = getAccessToken();
    if (token && activeWorkspace && !notification.read) {
      setNotifications((current) => current.map((item) => item.notification_key === notification.notification_key ? { ...item, read: true } : item));
      setUnread((current) => Math.max(0, current - 1));
      try { await markDashboardNotificationsRead(token, activeWorkspace.id, [notification.notification_key]); } catch { void load(true); }
    }
    router.push(notification.href);
  };

  const markAll = async () => {
    const token = getAccessToken();
    if (!token || !activeWorkspace) return;
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnread(0);
    try { await markAllDashboardNotificationsRead(token, activeWorkspace.id); } catch { void load(true); }
  };

  if (loading) return <WorkspaceSkeleton metrics={4} rows={8} />;

  return (
    <div className="grid gap-4">
      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Tenant event stream</p><h2 className="mt-1 text-[24px] font-black text-slate-950">Notification center</h2><p className="mt-1 text-[12px] font-semibold text-slate-500">Asset, scan, Finding and report lifecycle events for {activeWorkspace?.name}.</p></div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => { setPage(1); setUnreadOnly((current) => !current); }} className={`h-10 rounded-[8px] border px-3 text-[11px] font-black ${unreadOnly ? "border-[#2ECE82] bg-[#E8FFF3] text-[#16865C]" : "border-slate-200 bg-white text-slate-600"}`}>{unreadOnly ? "Unread only" : "All events"}</button>{unread ? <button type="button" onClick={() => void markAll()} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-[11px] font-black text-[#16865C]"><CheckCheck className="h-4 w-4" />Mark all read</button> : null}<button type="button" onClick={() => void load(true)} disabled={refreshing} className="grid h-10 w-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /></button></div>
      </section>
      {error ? <div className="rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-[12px] font-bold text-rose-700">{error}</div> : null}
      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#071010] text-[#2ECE82]"><Bell className="h-5 w-5" /></span><div><h3 className="text-[15px] font-black text-slate-950">Security and workflow events</h3><p className="text-[10px] font-semibold text-slate-500">{unread} unread</p></div></div><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase text-slate-500 ring-1 ring-slate-100">Tenant scoped</span></div>
        {notifications.length ? <div className="divide-y divide-slate-100">{notifications.map((notification) => <button key={notification.notification_key} type="button" onClick={() => void openNotification(notification)} className={`grid w-full gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[12px_minmax(0,1fr)_130px] sm:items-center ${notification.read ? "bg-white" : "bg-cyan-50/30"}`}><span className={`h-2.5 w-2.5 rounded-full ring-4 ${toneClasses(notification.tone)}`} /><span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="text-[12px] font-black text-slate-950">{notification.title}</span><span className="rounded-full bg-slate-50 px-2 py-0.5 text-[8px] font-black uppercase text-slate-500 ring-1 ring-slate-100">{notification.kind}</span>{!notification.read ? <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[8px] font-black uppercase text-cyan-700 ring-1 ring-cyan-100">new</span> : null}</span><span className="mt-1 block text-[10px] font-semibold leading-relaxed text-slate-500">{notification.message || notification.object_name}</span></span><span className="text-[9px] font-bold text-slate-400 sm:text-right">{formatDate(notification.created_at)}</span></button>)}</div> : <div className="grid min-h-[280px] place-items-center p-8 text-center"><div><Bell className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-[13px] font-black text-slate-800">No notifications found</p><p className="mt-1 text-[11px] font-semibold text-slate-500">New tenant lifecycle events will appear here.</p></div></div>}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3"><span className="text-[10px] font-black text-slate-500">{total} event{total === 1 ? "" : "s"}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 disabled:opacity-35" aria-label="Previous notifications page"><ChevronLeft className="h-4 w-4" /></button><span className="min-w-12 text-center text-[10px] font-black text-slate-700">{page}/{pages}</span><button type="button" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page >= pages} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 disabled:opacity-35" aria-label="Next notifications page"><ChevronRight className="h-4 w-4" /></button></div></div>
      </section>
    </div>
  );
}
