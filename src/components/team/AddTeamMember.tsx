"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  LoaderCircle,
  MailCheck,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { addTeamMember, ApiError, checkTeamMemberEmail, type TeamMemberAvailability } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

const modules = [
  ["assets", "Assets"],
  ["scans", "Scans"],
  ["findings", "Findings"],
  ["reports", "Reports"],
  ["ai_pentester", "AI Pentester"],
  ["knowledge_base", "Knowledge Base"],
  ["network_agent", "Network Agent"],
  ["activity_log", "Activity Log"],
  ["notifications", "Notifications"],
] as const;

const roleOptions = [
  { id: "viewer", label: "Viewer", detail: "Read-only access to operational modules.", Icon: Eye },
  { id: "admin", label: "Admin", detail: "Full operations without ownership controls.", Icon: UserCog },
  { id: "custom", label: "Custom", detail: "Full actions only in selected modules.", Icon: SlidersHorizontal },
] as const;

const durationOptions = [
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
  { value: null, label: "Permanent" },
] as const;

export default function AddTeamMember() {
  const router = useLoadingRouter();
  const { activeWorkspace, activeOrganizationId } = useWorkspace();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"viewer" | "admin" | "custom">("viewer");
  const [duration, setDuration] = useState<number | null>(30);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [availability, setAvailability] = useState<TeamMemberAvailability | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canGrantAdmin = activeWorkspace?.role === "owner";
  const formReady = useMemo(
    () => fullName.trim().length >= 2 && email.includes("@") && availability?.available && (role !== "custom" || selectedModules.length > 0),
    [availability, email, fullName, role, selectedModules.length],
  );

  const checkEmail = async () => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !email.includes("@")) return;
    setChecking(true);
    setError("");
    setAvailability(null);
    try {
      setAvailability(await checkTeamMemberEmail(access, activeOrganizationId, email.trim()));
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not check this email.");
    } finally {
      setChecking(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const access = getAccessToken();
    if (!access || !activeOrganizationId || !formReady) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await addTeamMember(access, activeOrganizationId, {
        full_name: fullName.trim(),
        email: email.trim(),
        role,
        custom_modules: role === "custom" ? selectedModules : [],
        access_duration_days: duration,
      });
      window.sessionStorage.setItem("evada.teamNotice", response.message);
      router.push("/team");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not add this team member.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeWorkspace || !["owner", "admin"].includes(activeWorkspace.role)) {
    return <section className="rounded-[8px] border border-rose-100 bg-white p-8 text-center"><ShieldCheck className="mx-auto h-9 w-9 text-rose-500" /><h2 className="mt-4 text-[22px] font-black">Owner or Admin access required</h2><button type="button" onClick={() => router.replace("/dashboard")} className="mt-5 rounded-[8px] bg-[#071010] px-4 py-2.5 text-[12px] font-black text-white">Return to dashboard</button></section>;
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3"><button type="button" onClick={() => router.push("/team")} title="Back to team" className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-slate-200 text-slate-600"><ArrowLeft className="h-4 w-4" /></button><div><p className="text-[10px] font-black uppercase text-[#0891B2]">Secure member onboarding</p><h2 className="mt-1 text-[24px] font-black text-slate-950">Add team member</h2><p className="mt-1 max-w-2xl text-[12px] font-semibold leading-relaxed text-slate-500">EVADA sends a one-time account setup link. The member verifies the email and chooses their own password; no password is visible to the workspace owner.</p></div></div>
        <div className="rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-black text-emerald-700">{activeWorkspace.name}</div>
      </section>

      {error ? <div className="rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-[12px] font-bold text-rose-700">{error}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(310px,0.6fr)] xl:items-start">
        <div className="grid gap-4">
          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#071010] text-[#2ECE82]"><MailCheck className="h-5 w-5" /></span><div><h3 className="text-[16px] font-black">Member identity</h3><p className="text-[11px] font-semibold text-slate-500">Check eligibility before assigning workspace access.</p></div></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1.5 text-[10px] font-black uppercase text-slate-500">Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} required placeholder="Team member name" className="h-11 rounded-[8px] border border-slate-200 px-3 text-[13px] font-bold normal-case text-slate-950 outline-none focus:border-[#2ECE82]" /></label>
              <label className="grid gap-1.5 text-[10px] font-black uppercase text-slate-500">Email address<div className="flex gap-2"><input value={email} onChange={(event) => { setEmail(event.target.value); setAvailability(null); }} required type="email" placeholder="member@company.com" className="h-11 min-w-0 flex-1 rounded-[8px] border border-slate-200 px-3 text-[13px] font-bold normal-case text-slate-950 outline-none focus:border-[#2ECE82]" /><button type="button" disabled={checking || !email.includes("@")} onClick={() => void checkEmail()} className="h-11 rounded-[8px] bg-[#071010] px-4 text-[11px] font-black text-white disabled:opacity-40">{checking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Check"}</button></div></label>
            </div>
            {availability ? <div className={`mt-3 flex items-start gap-2 rounded-[8px] border px-3 py-2.5 text-[11px] font-bold ${availability.available ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}>{availability.available ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <ShieldCheck className="h-4 w-4 shrink-0" />}<span>{availability.detail}{availability.available && availability.has_account ? " The existing identity will receive a secure setup link." : ""}</span></div> : null}
          </section>

          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[16px] font-black">Permission profile</h3><p className="mt-1 text-[11px] font-semibold text-slate-500">The backend enforces the same profile on every request.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{roleOptions.filter((option) => option.id !== "admin" || canGrantAdmin).map(({ id, label, detail, Icon }) => <button key={id} type="button" onClick={() => setRole(id)} className={`min-h-32 rounded-[8px] border p-4 text-left transition ${role === id ? "border-[#2ECE82] bg-emerald-50 shadow-[0_10px_24px_rgba(46,206,130,0.1)]" : "border-slate-200 bg-white hover:border-slate-300"}`}><div className="flex items-center justify-between"><Icon className={role === id ? "h-5 w-5 text-[#16A86E]" : "h-5 w-5 text-slate-500"} />{role === id ? <Check className="h-4 w-4 text-[#16A86E]" /> : null}</div><p className="mt-4 text-[14px] font-black">{label}</p><p className="mt-1 text-[10px] font-semibold leading-relaxed text-slate-500">{detail}</p></button>)}</div>
            {role === "custom" ? <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-[11px] font-black uppercase text-slate-500">Select modules</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([id, label]) => { const selected = selectedModules.includes(id); return <label key={id} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] border px-3 py-2 ${selected ? "border-emerald-200 bg-emerald-50" : "border-slate-200"}`}><input type="checkbox" checked={selected} onChange={() => setSelectedModules((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} className="h-4 w-4 accent-[#16A86E]" /><span className="text-[11px] font-black text-slate-700">{label}</span></label>; })}</div><p className="mt-3 text-[10px] font-semibold text-slate-500">Selected modules receive view, create, edit, delete, execute, download, and manage actions.</p></div> : null}
          </section>

          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-[#0891B2]" /><h3 className="text-[16px] font-black">Access duration</h3></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{durationOptions.map((option) => <button key={option.label} type="button" onClick={() => setDuration(option.value)} className={`h-11 rounded-[8px] border text-[11px] font-black ${duration === option.value ? "border-[#2ECE82] bg-[#071010] text-[#2ECE82]" : "border-slate-200 bg-white text-slate-600"}`}>{option.label}</button>)}</div></section>
        </div>

        <aside className="rounded-[8px] border border-emerald-100 bg-[#F3FFF8] p-5 shadow-sm xl:sticky xl:top-4">
          <p className="text-[10px] font-black uppercase text-[#0891B2]">Access summary</p><h3 className="mt-1 text-[19px] font-black">Ready for secure setup</h3>
          <div className="mt-4 grid gap-2 text-[11px] font-bold text-slate-600"><div className="flex justify-between gap-3 border-b border-emerald-100 py-2"><span>Workspace</span><strong className="text-right text-slate-950">{activeWorkspace.name}</strong></div><div className="flex justify-between gap-3 border-b border-emerald-100 py-2"><span>Role</span><strong className="text-slate-950">{roleOptions.find((item) => item.id === role)?.label}</strong></div><div className="flex justify-between gap-3 border-b border-emerald-100 py-2"><span>Term</span><strong className="text-slate-950">{duration ? `${duration} days` : "Permanent"}</strong></div><div className="flex justify-between gap-3 py-2"><span>Modules</span><strong className="text-right text-slate-950">{role === "custom" ? `${selectedModules.length} selected` : role === "viewer" ? "Read-only operations" : "All operations"}</strong></div></div>
          <div className="mt-4 rounded-[8px] border border-emerald-100 bg-white/80 p-3 text-[10px] font-semibold leading-relaxed text-slate-600"><Copy className="mb-2 h-4 w-4 text-[#16A86E]" />EVADA never shows the member&apos;s password here. The member creates it privately from the one-time email link.</div>
          <button type="submit" disabled={!formReady || submitting} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#071010] px-4 text-[12px] font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4 text-[#2ECE82]" />}Create secure setup</button>
        </aside>
      </div>
    </form>
  );
}
