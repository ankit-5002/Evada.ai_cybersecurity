import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type PlatformCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
  Preview: () => ReactNode;
};

const queueRows = [
  ["CVE-3081", "Critical", "Now"],
  ["Broken Auth", "High", "Review"],
  ["SSRF", "Medium", "Queued"],
  ["XSS Stored", "High", "Validate"],
];

function MiniHeader({ title, Icon }: { title: string; Icon: LucideIcon }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="h-4 w-4 text-slate-700" strokeWidth={2.1} />
        <span className="text-[11px] font-black text-slate-950">{title}</span>
      </div>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">View all</span>
    </div>
  );
}

function ValidationQueuePreview() {
  return (
    <div className="h-full overflow-hidden rounded-[16px] border border-slate-200 bg-white">
      <MiniHeader title="Validation Queue" Icon={marketingIconMap["next-steps"]} />
      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[250px] text-left text-[10px]">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-2 font-black">Finding</th>
              <th className="pb-2 font-black">Risk</th>
              <th className="pb-2 font-black">Next</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {queueRows.map(([finding, risk, next]) => (
              <tr key={finding}>
                <td className="py-2 font-bold">{finding}</td>
                <td className={`py-2 font-black ${risk === "Critical" || risk === "High" ? "text-red-500" : "text-amber-500"}`}>{risk}</td>
                <td className="py-2 font-semibold text-slate-500">{next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EvidencePreview() {
  return (
    <div className="h-full overflow-hidden rounded-[16px] border border-slate-200 bg-white">
      <MiniHeader title="Evidence & Exploit Proof" Icon={marketingIconMap.evidence} />
      <div className="grid h-[calc(100%-41px)] gap-3 overflow-hidden p-3">
        <div className="rounded-[14px] bg-[#F8FAFC] p-3">
          <p className="text-[10px] font-black text-[#04A9C7]">Request</p>
          <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-[10px] leading-relaxed text-[#0891B2]">{`GET /api/user?id=1'
UNION SELECT role
FROM accounts --`}</pre>
        </div>
        <div className="rounded-[14px] bg-red-50 p-3">
          <p className="text-[10px] font-black text-red-500">Proof</p>
          <p className="mt-2 text-[10px] font-semibold leading-relaxed text-slate-700">Admin role returned in sandbox response.</p>
        </div>
      </div>
    </div>
  );
}

function ApprovalPreview() {
  const rows = [
    ["SQL Injection on Plugins", "Critical", "Pending"],
    ["Package Escalation", "High", "Approved"],
    ["Weak Header", "Medium", "Queued"],
  ];

  return (
    <div className="h-full overflow-hidden rounded-[16px] border border-slate-200 bg-white">
      <MiniHeader title="Approval Workflows" Icon={marketingIconMap.approval} />
      <div className="grid gap-3 p-3">
        {rows.map(([name, risk, status]) => (
          <div key={name} className="flex min-w-0 items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-[#F8FAFC] px-3 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100" />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-black text-slate-950">{name}</p>
                <p className={`mt-1 text-[10px] font-black ${risk === "Critical" ? "text-red-500" : risk === "High" ? "text-orange-500" : "text-amber-500"}`}>{risk}</p>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${status === "Approved" ? "bg-emerald-100 text-[#16A86E]" : "bg-slate-100 text-slate-600"}`}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemediationPreview() {
  const rows = [
    { name: "Jira Cloud", status: "Ticket synced", color: "#0891B2", Icon: marketingIconMap["jira-itsm"] },
    { name: "Slack", status: "Alert created", color: "#04A9C7", Icon: marketingIconMap["team-chat"] },
    { name: "Microsoft Sentinel", status: "Event", color: "#2ECE82", Icon: marketingIconMap.siem },
    { name: "ServiceNow", status: "Updated", color: "#F97316", Icon: marketingIconMap["service-management"] },
  ];

  return (
    <div className="h-full overflow-hidden rounded-[16px] border border-slate-200 bg-white">
      <MiniHeader title="Remediation Sync" Icon={marketingIconMap.sync} />
      <div className="grid gap-3 p-3">
        {rows.map(({ name, status, color, Icon }) => (
          <div key={name} className="flex min-w-0 items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-white px-3 py-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-50" style={{ color }}>
                <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
              </span>
              <span className="truncate text-[10px] font-black text-slate-950">{name}</span>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-[#16A86E]">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const cards: PlatformCard[] = [
  {
    title: "Validation Queue",
    body: "See what is pending, approved, validated or in review.",
    Icon: marketingIconMap["next-steps"],
    Preview: ValidationQueuePreview,
  },
  {
    title: "Evidence and exploit proof",
    body: "Review artefacts, request/response logs and proof of exploitability.",
    Icon: marketingIconMap.evidence,
    Preview: EvidencePreview,
  },
  {
    title: "Approval Workflows",
    body: "Human-in-the-loop approvals for high-risk validations.",
    Icon: marketingIconMap.approval,
    Preview: ApprovalPreview,
  },
  {
    title: "Remediation Sync",
    body: "Push validated issues directly into Jira, Slack, ServiceNow or your SIEM.",
    Icon: marketingIconMap.sync,
    Preview: RemediationPreview,
  },
];

export default function PlatformInActionSection() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Operational visibility</p>
            <h2 className="mx-auto mt-4 max-w-[760px] break-words text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-950 sm:tracking-[-0.025em]">
              <span className="block">Operational visibility for every</span>
              <span className="block">security team</span>
            </h2>
            <span className="mx-auto mt-5 block h-1.5 w-16 rounded-full bg-[#04A9C7]" />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {cards.map(({ title, body, Icon, Preview }, index) => (
            <Reveal key={title} delayMs={index * 80} className="min-w-0">
              <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-5">
                <div className="h-[230px] w-full min-w-0 overflow-hidden rounded-[18px] bg-[#F8FAFC] p-2">
                  <Preview />
                </div>
                <div className="mt-5 flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#EEF2FF] text-[#04A9C7]">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-black tracking-[-0.01em] text-slate-950">{title}</h3>
                    <p className="mt-2 break-words text-[14px] font-medium leading-relaxed text-slate-600">{body}</p>
                  </div>
                </div>
                <span className="mt-5 block h-1.5 w-11 rounded-full bg-[#04A9C7]" />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={120}>
          <div className="mt-9 text-center">
            <a href="/platform" className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-700 transition hover:text-[#16A86E]">
              Explore more platform views <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
