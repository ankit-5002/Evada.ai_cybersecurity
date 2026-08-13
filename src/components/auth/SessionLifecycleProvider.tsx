"use client";

import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { logout, touchAuthenticationSession, type AuthenticationSession } from "@/lib/auth-api";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredAuthenticationSession,
  setStoredAuthenticationSession,
  subscribeAuthSession,
} from "@/lib/auth-session";

const TOUCH_INTERVAL_MS = 60_000;

function secondsUntil(value: string) {
  return Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 1000));
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function SessionLifecycleProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<AuthenticationSession | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [extending, setExtending] = useState(false);
  const lastTouchAt = useRef(0);
  const ending = useRef(false);

  const endSession = useCallback(async (reason: "manual" | "idle_timeout" | "absolute_timeout") => {
    if (ending.current) return;
    ending.current = true;
    const refresh = getRefreshToken();
    try {
      if (refresh) await logout(refresh, reason);
    } catch {
      // The local session must still close if the API or token is unavailable.
    }
    if (typeof window !== "undefined") {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (!currentPath.startsWith("/login")) window.sessionStorage.setItem("evada.returnTo", currentPath);
      if (reason !== "manual") window.sessionStorage.setItem("evada.authNotice", "Your EVADA session ended. Please sign in again.");
    }
    clearAuthSession();
    window.location.assign("/login");
  }, []);

  const extendSession = useCallback(async () => {
    const access = getAccessToken();
    if (!access || extending) return;
    setExtending(true);
    try {
      const response = await touchAuthenticationSession(access);
      setStoredAuthenticationSession(response.session);
      setSession(response.session);
      lastTouchAt.current = Date.now();
    } catch {
      // Centralized authentication handling redirects when refresh is no longer valid.
    } finally {
      setExtending(false);
    }
  }, [extending]);

  useEffect(() => {
    const sync = () => setSession(getStoredAuthenticationSession());
    sync();
    return subscribeAuthSession(sync);
  }, []);

  useEffect(() => {
    if (!session) return;

    const registerActivity = () => {
      if (Date.now() - lastTouchAt.current < TOUCH_INTERVAL_MS) return;
      void extendSession();
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "submit"];
    events.forEach((eventName) => window.addEventListener(eventName, registerActivity, { passive: true }));
    return () => events.forEach((eventName) => window.removeEventListener(eventName, registerActivity));
  }, [extendSession, session]);

  useEffect(() => {
    if (!session) return;
    const evaluate = () => {
      const idleRemaining = secondsUntil(session.idle_expires_at);
      const absoluteRemaining = secondsUntil(session.absolute_expires_at);
      const nextRemaining = Math.min(idleRemaining, absoluteRemaining);
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) void endSession(absoluteRemaining <= idleRemaining ? "absolute_timeout" : "idle_timeout");
    };
    evaluate();
    const timer = window.setInterval(evaluate, 1_000);
    return () => window.clearInterval(timer);
  }, [endSession, session]);

  const warningVisible = Boolean(session && remainingSeconds > 0 && remainingSeconds <= session.warning_seconds);

  return (
    <>
      {children}
      {warningVisible ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-[#03110f]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="session-warning-title">
          <section className="w-full max-w-[460px] overflow-hidden rounded-[8px] border border-amber-300/30 bg-[#071513] text-white shadow-[0_30px_100px_rgba(2,15,13,0.5)]">
            <div className="flex items-start gap-4 border-b border-white/10 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/25"><Clock3 className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="text-[10px] font-black uppercase text-cyan-300">Session protection</p><h2 id="session-warning-title" className="mt-1 text-[22px] font-black">Your session is about to end</h2><p className="mt-2 text-[12px] font-semibold leading-relaxed text-white/65">EVADA signs out inactive sessions to protect tenant data. Your background scan and report jobs will continue.</p></div>
            </div>
            <div className="flex items-center justify-between gap-4 bg-white/[0.04] px-5 py-4">
              <div><p className="text-[9px] font-black uppercase text-white/45">Time remaining</p><p className="mt-1 font-mono text-[24px] font-black text-amber-300">{formatCountdown(remainingSeconds)}</p></div>
              <ShieldCheck className="h-8 w-8 text-emerald-300/70" />
            </div>
            <div className="grid grid-cols-2 gap-3 p-5">
              <button type="button" onClick={() => void endSession("manual")} className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/[0.04] text-[12px] font-black text-white/75 transition hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button>
              <button type="button" onClick={() => void extendSession()} disabled={extending} className="h-11 rounded-[8px] bg-[#2ECE82] text-[12px] font-black text-[#03110f] transition hover:bg-[#45d994] disabled:opacity-60">{extending ? "Extending..." : "Stay signed in"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
