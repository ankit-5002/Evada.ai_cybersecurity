"use client";

import { ArrowRight, Check, CheckCircle2, Copy, Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { PasswordChecklist } from "@/components/auth/AuthControls";
import { generateStrongPassword, isStrongPassword } from "@/components/auth/passwordRules";
import { ApiError, completeTeamSetup, previewTeamSetup, type TeamSetupPreview } from "@/lib/auth-api";

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  assets: "Assets",
  scans: "Scans",
  findings: "Findings",
  reports: "Reports",
  ai_pentester: "AI Pentester",
  knowledge_base: "Knowledge Base",
  network_agent: "Network Agent",
  activity_log: "Activity Log",
  notifications: "Notifications",
  billing_usage: "Billing",
  team_rbac: "Team",
  organization_settings: "Organization Settings",
};

export default function TeamAccessSetupClient() {
  const router = useLoadingRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [preview, setPreview] = useState<TeamSetupPreview | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "invalid" | "complete">("loading");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token) {
      setStatus("invalid");
      setError("This account setup link is missing its secure token.");
      return;
    }
    void previewTeamSetup(token)
      .then((response) => {
        if (!active) return;
        setPreview(response);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setStatus("invalid");
        setError(requestError instanceof ApiError ? requestError.message : "This account setup link is invalid or expired.");
      });
    return () => { active = false; };
  }, [token]);

  const ready = useMemo(() => isStrongPassword(password) && password === confirmPassword, [confirmPassword, password]);

  const useStrongPassword = () => {
    const next = generateStrongPassword();
    setPassword(next);
    setConfirmPassword(next);
    setShowPassword(true);
    setCopied(false);
  };

  const copyPassword = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, [password]);

  const submit = async () => {
    if (!ready || !token) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await completeTeamSetup(token, password, confirmPassword);
      setStatus("complete");
      window.sessionStorage.setItem("evada.loginEmail", response.email);
      window.sessionStorage.setItem("evada.authNotice", JSON.stringify({ kind: "success", title: "Workspace access ready", message: response.message }));
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not complete account setup.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="Team access" title="Join your EVADA workspace." description="Confirm the assigned workspace and permission profile, then create a private password to activate your access.">
      <div className="evada-dark-panel relative flex min-h-[560px] w-full max-w-[540px] overflow-hidden rounded-[8px] p-5 text-white sm:min-h-[600px] sm:p-6 lg:min-h-[620px] lg:p-7">
        <div className="relative z-10 flex min-w-0 w-full flex-col justify-center">
          {status === "loading" ? <div className="text-center"><LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[#2ECE82]" /><h1 className="mt-5 text-[24px] font-black">Checking secure setup</h1><p className="mt-2 text-[13px] font-semibold text-white/55">Validating the one-time account link.</p></div> : null}

          {status === "invalid" ? <div className="min-w-0 w-full text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-rose-400/20 bg-rose-500/10 text-rose-300"><XCircle className="h-8 w-8" /></span><p className="mt-5 text-[10px] font-black uppercase text-rose-300">Setup unavailable</p><h1 className="mt-2 text-[26px] font-black">Link cannot be used</h1><p className="mx-auto mt-3 max-w-sm break-words text-[13px] font-semibold leading-relaxed text-white/58">{error}</p><p className="mx-auto mt-4 w-full max-w-sm break-words rounded-[8px] border border-white/10 bg-white/[0.04] p-3 text-[11px] font-semibold leading-relaxed text-white/48">Ask the workspace Owner or Admin to send a fresh account setup link.</p></div> : null}

          {status === "complete" ? <div className="text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#2ECE82]/25 bg-[#2ECE82]/10 text-[#2ECE82]"><CheckCircle2 className="h-8 w-8" /></span><p className="mt-5 text-[10px] font-black uppercase text-[#2ECE82]">Access activated</p><h1 className="mt-2 text-[26px] font-black">Your workspace is ready</h1><p className="mx-auto mt-3 max-w-sm text-[13px] font-semibold leading-relaxed text-white/58">Email verified, password secured, and assigned permissions activated.</p><button type="button" onClick={() => router.push("/login")} className="evada-bracket-button mx-auto mt-6 min-h-11 w-[min(100%,360px)] text-[13px]">Continue to login<ArrowRight className="h-4 w-4" /></button></div> : null}

          {status === "ready" && preview ? <div>
            <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#04D9FF]">Secure account setup</p><h1 className="mt-2 text-[25px] font-black">Create your password</h1><p className="mt-2 text-[12px] font-semibold text-white/55">This link can be completed once.</p></div>
            <div className="mt-5 grid gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 text-[11px]"><div className="flex justify-between gap-3 border-b border-white/8 pb-2"><span className="font-bold text-white/45">Workspace</span><strong className="text-right text-white">{preview.setup.organization.name}</strong></div><div className="flex justify-between gap-3 border-b border-white/8 pb-2"><span className="font-bold text-white/45">Email</span><strong className="break-all text-right text-white">{preview.setup.email}</strong></div><div className="flex justify-between gap-3"><span className="font-bold text-white/45">Profile</span><strong className="capitalize text-[#2ECE82]">{preview.setup.role}</strong></div></div>
            <div className="mt-3 flex flex-wrap gap-1.5">{preview.setup.permissions.modules.map((module) => <span key={module} className="rounded-full border border-[#2ECE82]/16 bg-[#2ECE82]/8 px-2.5 py-1 text-[9px] font-black text-[#B7FFD9]">{moduleLabels[module] || module}</span>)}</div>
            <div className="mt-5 grid gap-3">
              <label className="grid gap-1.5 text-[10px] font-black uppercase text-white/55">Password<div className="relative"><KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#04D9FF]" /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="h-11 w-full rounded-[8px] border border-white/12 bg-white/[0.06] pl-10 pr-20 text-[13px] font-bold normal-case text-white outline-none focus:border-[#2ECE82]" /><div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1"><button type="button" onClick={() => setShowPassword((value) => !value)} title={showPassword ? "Hide password" : "Show password"} className="grid h-8 w-8 place-items-center text-white/55">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button type="button" onClick={() => void copyPassword()} disabled={!password} title="Copy password" className="grid h-8 w-8 place-items-center text-white/55 disabled:opacity-30"><Copy className="h-4 w-4" /></button></div></div></label>
              <label className="grid gap-1.5 text-[10px] font-black uppercase text-white/55">Confirm password<input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="h-11 rounded-[8px] border border-white/12 bg-white/[0.06] px-3 text-[13px] font-bold normal-case text-white outline-none focus:border-[#2ECE82]" /></label>
              <div className="flex flex-wrap gap-2"><button type="button" onClick={useStrongPassword} className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#2ECE82]/20 bg-[#2ECE82]/10 px-3 text-[10px] font-black text-[#B7FFD9]"><ShieldCheck className="h-4 w-4" />Use strong password</button>{copied ? <span className="inline-flex h-9 items-center gap-1 text-[10px] font-black text-[#2ECE82]"><Check className="h-4 w-4" />Copied</span> : null}</div>
              <PasswordChecklist password={password} variant="dark" />
              {confirmPassword && password !== confirmPassword ? <p className="text-[10px] font-bold text-rose-300">Passwords do not match.</p> : null}
              {error ? <p className="rounded-[8px] border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-[11px] font-bold text-rose-200">{error}</p> : null}
              <button type="button" onClick={() => void submit()} disabled={!ready || submitting} className="evada-bracket-button mt-1 min-h-11 w-full text-[13px] disabled:cursor-not-allowed disabled:opacity-35">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}Verify and activate</button>
            </div>
          </div> : null}
        </div>
      </div>
    </AuthShell>
  );
}
