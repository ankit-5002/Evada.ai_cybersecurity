"use client";

import {
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import WorkspaceGuidePage from "@/components/guides/WorkspaceGuidePage";
import {
  ApiError,
  getOrganizationTeam,
  removeOrganizationMember,
  renewOrganizationMembership,
  resendTeamSetup,
  revokeTeamSetup,
  updateOrganizationMember,
  type OrganizationTeam,
} from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-session";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  viewer: "Viewer",
  custom: "Custom",
};

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function accessLabel(expiresAt: string | null, daysRemaining: number | null) {
  if (!expiresAt) return "Permanent";
  if (!daysRemaining) return "Expired";
  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`;
}

function Pager({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (page: number) => void }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <span className="text-[10px] font-bold text-slate-500">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</span>
      <div className="flex gap-1.5">
        <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} title="Previous page" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 disabled:opacity-35"><ChevronLeft className="h-4 w-4" /></button>
        <span className="grid h-8 min-w-12 place-items-center rounded-[8px] bg-[#071010] px-2 text-[10px] font-black text-[#2ECE82]">{page}/{pages}</span>
        <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} title="Next page" className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 disabled:opacity-35"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function TeamWorkspaceSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-label="Loading workspace members">
      <section className="grid gap-3 sm:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-5 w-5 rounded-[6px] bg-slate-100" />
            <div className="mt-5 h-2.5 w-24 rounded bg-slate-100" />
            <div className="mt-3 h-8 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </section>
      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm" aria-hidden="true">
        <div className="flex h-16 items-center justify-between gap-4 border-b border-slate-100 px-4">
          <div className="grid gap-2"><div className="h-4 w-36 animate-pulse rounded bg-slate-100" /><div className="h-2.5 w-64 max-w-[55vw] animate-pulse rounded bg-slate-100" /></div>
          <div className="h-9 w-32 animate-pulse rounded-[8px] bg-slate-100" />
        </div>
        <div className="divide-y divide-slate-100 px-4">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="grid min-h-16 animate-pulse grid-cols-[minmax(140px,1.4fr)_90px_90px_minmax(110px,1fr)] items-center gap-5 py-3">
              <div className="grid gap-2"><div className="h-3 w-32 rounded bg-slate-100" /><div className="h-2.5 w-44 max-w-full rounded bg-slate-100" /></div>
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only">Loading team data</span>
    </div>
  );
}

function TeamWorkspaceContent() {
  const router = useLoadingRouter();
  const { activeWorkspace, activeOrganizationId } = useWorkspace();
  const [team, setTeam] = useState<OrganizationTeam | null>(null);
  const [search, setSearch] = useState("");
  const [memberPage, setMemberPage] = useState(1);
  const [setupPage, setSetupPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadTeam = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken || !activeOrganizationId) {
      setTeam(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setTeam(await getOrganizationTeam(accessToken, activeOrganizationId));
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not load this team.");
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId]);

  useEffect(() => {
    const pendingNotice = window.sessionStorage.getItem("evada.teamNotice");
    if (pendingNotice) {
      setNotice(pendingNotice);
      window.sessionStorage.removeItem("evada.teamNotice");
    }
    setTeam(null);
    setMemberPage(1);
    setSetupPage(1);
    void loadTeam();
  }, [loadTeam]);

  const occupiedSeats = useMemo(() => team?.members.filter((member) => ["active", "pending"].includes(member.status)).length || 0, [team]);
  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return team?.members || [];
    return (team?.members || []).filter((member) => [member.full_name, member.email, member.role, member.status].some((value) => value.toLowerCase().includes(term)));
  }, [search, team]);
  const pageSize = 10;
  const currentMemberPage = Math.min(memberPage, Math.max(1, Math.ceil(filteredMembers.length / pageSize)));
  const currentSetupPage = Math.min(setupPage, Math.max(1, Math.ceil((team?.pending_setups.length || 0) / pageSize)));
  const members = filteredMembers.slice((currentMemberPage - 1) * pageSize, currentMemberPage * pageSize);
  const setups = (team?.pending_setups || []).slice((currentSetupPage - 1) * pageSize, currentSetupPage * pageSize);

  const runMemberAction = async (membershipId: number, action: "suspend" | "activate" | "remove" | "renew") => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setBusyKey(`member-${membershipId}`);
    setError("");
    setNotice("");
    try {
      if (action === "remove") await removeOrganizationMember(access, activeOrganizationId, membershipId);
      else if (action === "renew") await renewOrganizationMembership(access, activeOrganizationId, membershipId, 30);
      else await updateOrganizationMember(access, activeOrganizationId, membershipId, { status: action === "suspend" ? "suspended" : "active" });
      setNotice(action === "remove" ? "Member removed." : action === "renew" ? "Member access extended by 30 days." : `Member ${action}d.`);
      await loadTeam();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not update the member.");
    } finally {
      setBusyKey("");
    }
  };

  const runSetupAction = async (setupId: number, action: "resend" | "revoke") => {
    const access = getAccessToken();
    if (!access || !activeOrganizationId) return;
    setBusyKey(`setup-${setupId}`);
    setError("");
    setNotice("");
    try {
      if (action === "resend") {
        const response = await resendTeamSetup(access, activeOrganizationId, setupId);
        setNotice(response.message);
      } else {
        await revokeTeamSetup(access, activeOrganizationId, setupId);
        setNotice("Account setup revoked. The email is available to another workspace.");
      }
      await loadTeam();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not update the account setup.");
    } finally {
      setBusyKey("");
    }
  };

  if (!activeWorkspace) {
    return <section className="rounded-[8px] border border-slate-200 bg-white p-8 text-center"><Users className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-4 text-[22px] font-black">No active organization</h2><p className="mt-2 text-[13px] font-semibold text-slate-500">An active organization is required before a team can be managed.</p></section>;
  }

  if (loading && !team) return <TeamWorkspaceSkeleton />;

  const canManageMember = (role: string) => team?.can_manage && role !== "owner" && (activeWorkspace.role === "owner" || role !== "admin");

  return (
    <div className="grid gap-4">
      <section className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"><Users className="h-5 w-5 text-[#16A86E]" /><p className="mt-3 text-[11px] font-black uppercase text-slate-500">Occupied seats</p><p className="mt-1 text-[28px] font-black">{occupiedSeats} / {activeWorkspace.user_limit}</p></article>
        <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"><Clock3 className="h-5 w-5 text-[#0891B2]" /><p className="mt-3 text-[11px] font-black uppercase text-slate-500">Pending setup</p><p className="mt-1 text-[28px] font-black">{team?.pending_setups.length || 0}</p></article>
        <article className="rounded-[8px] border border-emerald-100 bg-[#F3FFF8] p-4 shadow-sm"><ShieldCheck className="h-5 w-5 text-[#16A86E]" /><p className="mt-3 text-[11px] font-black uppercase text-slate-500">Your role</p><p className="mt-1 text-[22px] font-black">{roleLabels[activeWorkspace.role]}</p></article>
      </section>

      {error ? <div className="rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-[12px] font-bold text-rose-700">{error}</div> : null}
      {notice ? <div className="rounded-[8px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-[12px] font-bold text-emerald-700">{notice}</div> : null}

      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div><h2 className="text-[17px] font-black">Workspace members</h2><p className="text-[12px] font-semibold text-slate-500">One identity can hold one current EVADA workspace assignment.</p></div>
          <div className="flex items-center gap-2">
            <label className="relative hidden sm:block"><span className="sr-only">Search members</span><input value={search} onChange={(event) => { setSearch(event.target.value); setMemberPage(1); }} placeholder="Search members" className="h-9 w-48 rounded-[8px] border border-slate-200 px-3 text-[11px] font-bold outline-none focus:border-[#2ECE82]" /></label>
            <button type="button" onClick={() => void loadTeam()} title="Refresh team" className="grid h-9 w-9 place-items-center rounded-[8px] border border-slate-200"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
            {team?.can_manage ? <button type="button" onClick={() => router.push("/team/members/add")} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#071010] px-3 text-[11px] font-black text-white"><Plus className="h-4 w-4 text-[#2ECE82]" />Add member</button> : null}
          </div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[880px] text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500"><tr><th className="px-4 py-3">Member</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Access</th><th className="px-4 py-3">Modules</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => {
                const busy = busyKey === `member-${member.id}`;
                const manageable = canManageMember(member.role);
                return <tr key={member.id} className="text-[12px] font-bold text-slate-600">
                  <td className="px-4 py-3"><p className="font-black text-slate-950">{member.full_name}</p><p className="mt-0.5 text-slate-500">{member.email}</p></td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-700">{roleLabels[member.role]}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${member.status === "active" ? "bg-emerald-50 text-emerald-700" : member.status === "expired" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{member.status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{member.status}</span></td>
                  <td className="px-4 py-3"><p className={member.days_remaining !== null && member.days_remaining <= 7 ? "text-rose-600" : "text-slate-700"}>{accessLabel(member.access_expires_at, member.days_remaining)}</p><p className="mt-0.5 text-[9px] text-slate-400">{member.access_expires_at ? formatDate(member.access_expires_at) : "No expiry"}</p></td>
                  <td className="max-w-[230px] px-4 py-3"><p className="truncate text-[10px] text-slate-500" title={member.permissions.modules.join(", ")}>{member.role === "custom" ? member.custom_modules.join(", ") : member.role === "viewer" ? "Read-only operations" : "All operations"}</p></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-2">{manageable && member.access_expires_at ? <button type="button" disabled={busy} onClick={() => void runMemberAction(member.id, "renew")} title="Extend access 30 days" className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-cyan-100 bg-cyan-50 px-2 text-[10px] font-black text-[#0891B2]"><CalendarClock className="h-3.5 w-3.5" />+30d</button> : null}{manageable ? <><button type="button" disabled={busy || member.status === "expired"} onClick={() => void runMemberAction(member.id, member.status === "active" ? "suspend" : "activate")} title={member.status === "active" ? "Suspend member" : "Activate member"} className="grid h-8 w-8 place-items-center rounded-[8px] border border-slate-200 disabled:opacity-35">{member.status === "active" ? <UserX className="h-4 w-4" /> : <UserCog className="h-4 w-4" />}</button><button type="button" disabled={busy} onClick={() => void runMemberAction(member.id, "remove")} title="Remove member" className="grid h-8 w-8 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600"><Trash2 className="h-4 w-4" /></button></> : <span className="text-[10px] font-black uppercase text-slate-400">Protected</span>}</div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-slate-100 md:hidden">
          {members.map((member) => {
            const busy = busyKey === `member-${member.id}`;
            const manageable = canManageMember(member.role);
            return (
              <div key={member.id} className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-950">{member.full_name}</p>
                    <p className="truncate text-[11px] font-semibold text-slate-500">{member.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-700">{roleLabels[member.role]}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${member.status === "active" ? "bg-emerald-50 text-emerald-700" : member.status === "expired" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{member.status}</span>
                  <span>•</span>
                  <span>{accessLabel(member.access_expires_at, member.days_remaining)}</span>
                </div>
                {manageable ? (
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5">
                    {member.access_expires_at ? <button type="button" disabled={busy} onClick={() => void runMemberAction(member.id, "renew")} className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-cyan-100 bg-cyan-50 px-2 text-[10px] font-black text-[#0891B2]"><CalendarClock className="h-3.5 w-3.5" />+30d</button> : null}
                    <button type="button" disabled={busy || member.status === "expired"} onClick={() => void runMemberAction(member.id, member.status === "active" ? "suspend" : "activate")} className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-slate-200 px-2 text-[10px] font-bold text-slate-700">{member.status === "active" ? "Suspend" : "Activate"}</button>
                    <button type="button" disabled={busy} onClick={() => void runMemberAction(member.id, "remove")} className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-rose-100 bg-rose-50 px-2 text-[10px] font-bold text-rose-600"><Trash2 className="h-3.5 w-3.5" />Remove</button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <Pager page={currentMemberPage} total={filteredMembers.length} pageSize={pageSize} onChange={setMemberPage} />
      </section>

      {team?.pending_setups.length ? <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3"><h2 className="text-[17px] font-black">Pending account setup</h2><p className="text-[12px] font-semibold text-slate-500">Members choose their own password through a one-time secure link.</p></div>
        <div className="divide-y divide-slate-100">{setups.map((setup) => <div key={setup.id} className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_100px_100px_150px_90px] lg:items-center"><div><p className="text-[13px] font-black">{setup.full_name}</p><p className="text-[11px] font-semibold text-slate-500">{setup.email}</p></div><span className="text-[11px] font-black text-slate-600">{roleLabels[setup.role]}</span><span className="text-[11px] font-black text-slate-600">{setup.access_duration_days ? `${setup.access_duration_days} days` : "Permanent"}</span><div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${setup.delivery_status === "sent" ? "bg-emerald-50 text-emerald-700" : setup.delivery_status === "failed" ? "bg-rose-50 text-rose-700" : "bg-cyan-50 text-cyan-700"}`}>{setup.delivery_status}</span><p className="mt-1 text-[9px] font-bold text-slate-400">Expires {formatDate(setup.expires_at)}</p></div>{team.can_manage ? <div className="flex justify-end gap-2"><button type="button" onClick={() => void runSetupAction(setup.id, "resend")} disabled={busyKey === `setup-${setup.id}`} title="Send a fresh setup link" className="grid h-8 w-8 place-items-center rounded-[8px] border border-cyan-100 bg-cyan-50 text-[#0891B2]"><RefreshCw className={`h-4 w-4 ${busyKey === `setup-${setup.id}` ? "animate-spin" : ""}`} /></button><button type="button" onClick={() => void runSetupAction(setup.id, "revoke")} disabled={busyKey === `setup-${setup.id}`} title="Revoke setup" className="grid h-8 w-8 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600"><Trash2 className="h-4 w-4" /></button></div> : null}</div>)}</div>
        <Pager page={currentSetupPage} total={team.pending_setups.length} pageSize={pageSize} onChange={setSetupPage} />
      </section> : null}
    </div>
  );
}

export default function TeamWorkspace() {
  const pathname = usePathname();
  if (pathname === "/team/guide") return <WorkspaceGuidePage guideId="team" />;
  return <TeamWorkspaceContent />;
}
