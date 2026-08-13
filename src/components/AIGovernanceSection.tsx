import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { MarketingIcon, marketingIconMap } from "@/components/marketing/MarketingIcon";

type DiagramItem = {
  label: string;
  Icon: LucideIcon;
  tone?: "cyan" | "blue" | "purple";
};

const governanceChecks = [
  "Input restrictions and policy-led validation",
  "Approval workflows and human accountability",
  "Secure sandbox testing and data isolation",
  "Full audit trail for every action",
  "No unsupervised exploitation",
];

const inputSources: DiagramItem[] = [
  { label: "Vulnerability Scanners", Icon: marketingIconMap["classic-scans"] },
  { label: "Cloud Findings", Icon: marketingIconMap["infrastructure-security"] },
  { label: "AppSec Tools", Icon: marketingIconMap["api-reference"] },
  { label: "Security Signals", Icon: marketingIconMap["security-signals"] },
  { label: "Manual Uploads", Icon: marketingIconMap["manual-uploads"] },
];

const engineSteps: DiagramItem[] = [
  { label: "Sanitisation Layer", Icon: marketingIconMap.sanitisation },
  { label: "AI Analysis and Prioritisation", Icon: marketingIconMap["ai-supported"] },
  { label: "Controlled Validation (Safe Sandbox)", Icon: marketingIconMap["safe-sandbox"] },
  { label: "Human Approval", Icon: marketingIconMap.approval },
  { label: "Evidence and Audit Logging", Icon: marketingIconMap["audit-logs"] },
];

const outputs: DiagramItem[] = [
  { label: "Jira / ITSM", Icon: marketingIconMap["jira-itsm"], tone: "blue" },
  { label: "SIEM", Icon: marketingIconMap.siem, tone: "blue" },
  { label: "Slack / Teams", Icon: marketingIconMap["team-chat"], tone: "purple" },
  { label: "Reports", Icon: marketingIconMap.documentation, tone: "purple" },
  { label: "Dashboards", Icon: marketingIconMap.dashboards, tone: "cyan" },
];

const connectorRows = [61, 131, 201, 271, 341];

function toneClass(tone: DiagramItem["tone"]) {
  if (tone === "blue") return "bg-blue-50 text-[#0891B2] ring-blue-100";
  if (tone === "purple") return "bg-emerald-50 text-[#2ECE82] ring-emerald-100";
  return "bg-[#EEF2FF] text-[#04A9C7] ring-emerald-100";
}

function DiagramChip({ item, compact = false, delay = 0 }: { item: DiagramItem; compact?: boolean; delay?: number }) {
  const { Icon } = item;

  return (
    <div
      className={`governance-chip flex min-h-[58px] min-w-0 items-center gap-3 rounded-[14px] border bg-white px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.055)] ${
        compact ? "governance-engine-chip border-emerald-200 xl:min-h-[54px]" : "border-slate-200"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className={`governance-chip-icon grid h-9 w-9 shrink-0 place-items-center rounded-[11px] ring-1 ${toneClass(item.tone)}`}>
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 text-[12px] font-black leading-tight text-slate-950 sm:text-[13px]">{item.label}</span>
    </div>
  );
}

function DiagramColumn({ title, items }: { title: string; items: DiagramItem[] }) {
  return (
    <div className="relative z-10 min-w-0">
      <h3 className="text-center text-[13px] font-black text-slate-950 sm:text-[14px]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <DiagramChip key={item.label} item={item} delay={index * 0.32} />
        ))}
      </div>
    </div>
  );
}

function EngineColumn() {
  return (
    <div className="relative z-10 min-w-0 overflow-hidden rounded-[18px] border border-emerald-200 bg-[#EEF2FF]/65 p-3 shadow-[inset_0_0_0_1px_rgba(4,169,199,0.08)] xl:p-4">
      <h3 className="text-center text-[13px] font-black text-slate-950 sm:text-[14px]">EVADA Validation Engine</h3>
      <div className="relative mt-4 grid gap-2.5">
        <div className="pointer-events-none absolute inset-x-1 top-9 bottom-9 z-0 hidden xl:block" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 280 270" fill="none" preserveAspectRatio="none">
            <path className="governance-engine-path" d="M46 10 C18 44 18 92 52 128 C18 164 18 220 46 260" stroke="#04A9C7" strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2" />
            <path className="governance-engine-path governance-engine-path-alt" d="M234 10 C262 44 262 92 228 128 C262 164 262 220 234 260" stroke="#04A9C7" strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
        <div className="governance-engine-spine pointer-events-none absolute left-1/2 top-8 z-0 hidden h-[calc(100%-64px)] -translate-x-1/2 xl:block" aria-hidden="true" />
        {engineSteps.map((item, index) => (
          <div key={item.label} className="relative z-10">
            <DiagramChip item={item} compact delay={index * 0.58} />
            {index < engineSteps.length - 1 && (
              <div className="mx-auto h-4 w-px border-l-2 border-dotted border-[#04A9C7] xl:hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectorLane({ delayOffset = 0, markerId }: { delayOffset?: number; markerId: string }) {
  return (
    <div className="relative hidden min-h-[370px] xl:block" aria-hidden="true">
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200/80" />
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 60 370" fill="none" preserveAspectRatio="none">
        <defs>
          <marker id={markerId} markerHeight="6" markerWidth="6" orient="auto" refX="5.5" refY="3">
            <path d="M0 0L6 3L0 6" fill="none" stroke="#04A9C7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </marker>
        </defs>
        {connectorRows.map((row, index) => {
          const pathId = `${markerId}-path-${index}`;

          return (
            <g key={pathId}>
              <path
                id={pathId}
                className={index % 2 === 0 ? "governance-flow-path" : "governance-flow-path governance-flow-path-alt"}
                d={`M5 ${row} H55`}
                markerEnd={`url(#${markerId})`}
                stroke="#04A9C7"
                strokeDasharray="3 7"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <circle className="governance-flow-packet-glow" r="8">
                <animate attributeName="opacity" values="0;0.4;0.4;0" dur="4.6s" begin={`${delayOffset + index * 0.32}s`} repeatCount="indefinite" />
                <animateMotion dur="4.6s" begin={`${delayOffset + index * 0.32}s`} repeatCount="indefinite">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
              <circle className="governance-flow-packet" r="4.2">
                <animate attributeName="opacity" values="0;1;1;0" dur="4.6s" begin={`${delayOffset + index * 0.32}s`} repeatCount="indefinite" />
                <animateMotion dur="4.6s" begin={`${delayOffset + index * 0.32}s`} repeatCount="indefinite">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AIGovernanceSection() {
  return (
    <section id="ai-governance" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="absolute inset-x-5 inset-y-0 rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(238,242,255,0.56)_0%,rgba(255,255,255,0.28)_52%,rgba(224,247,250,0.46)_100%)] shadow-[0_26px_80px_rgba(14,165,233,0.08)] backdrop-blur-[1px] sm:inset-x-8 lg:inset-x-10" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-160px] left-0 hidden h-[560px] w-[560px] rounded-full border border-emerald-200/70 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-95px] left-16 hidden h-[420px] w-[420px] rounded-full border border-emerald-200/55 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-10 top-8 h-32 w-32 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1360px] min-w-0 grid-cols-1 items-center gap-12 px-0 py-2 xl:grid-cols-[0.38fr_0.62fr] xl:gap-16">
        <Reveal className="min-w-0">
          <div className="max-w-[480px]">
            <p className="text-[12px] font-black uppercase leading-tight tracking-[0.18em] text-[#16A86E]">AI Governance</p>
            <h2 className="mt-6 text-[clamp(2rem,6.4vw,3.1rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-950">
              AI governance
              <br />
              built for
              <br />
              safety,
              <br />
              control and trust
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
              Unsafe or unsupervised AI is not enough for enterprise security. EVADA keeps validation governed, auditable and ready for accountable operations.
            </p>

            <div className="mt-7 grid gap-4">
              {governanceChecks.map((item) => (
                <div key={item} className="flex min-w-0 items-start gap-3">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
                  <p className="min-w-0 text-[14px] font-semibold leading-relaxed text-slate-700 sm:text-[15px]">{item}</p>
                </div>
              ))}
            </div>

            <Link href="/resources#security-validation" className="mt-7 inline-flex items-center gap-2 text-[15px] font-black text-slate-950 transition hover:text-[#16A86E]">
              Read the <span className="text-[#16A86E]">validation guide</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
            </Link>
          </div>
        </Reveal>

        <Reveal className="min-w-0 xl:justify-self-end" delayMs={120}>
          <div className="relative w-full max-w-[800px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-5 lg:p-6">
            <div className="relative z-10 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[1fr_44px_1.28fr_44px_1fr] xl:gap-0">
              <div className="min-w-0">
                <DiagramColumn title="Input Sources" items={inputSources} />
              </div>

              <ConnectorLane markerId="governance-arrow-in" />

              <div className="flex items-center justify-center xl:hidden" aria-hidden="true">
                <ArrowDown className="h-6 w-6 text-[#04A9C7]" strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <EngineColumn />
              </div>

              <ConnectorLane delayOffset={0.45} markerId="governance-arrow-out" />

              <div className="flex items-center justify-center xl:hidden" aria-hidden="true">
                <ArrowDown className="h-6 w-6 text-[#04A9C7]" strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <DiagramColumn title="Outputs" items={outputs} />
              </div>
            </div>

            <div className="governance-audit-band relative z-10 mt-5 flex flex-col items-center gap-3 rounded-[16px] bg-[#EEF2FF] px-4 py-4 text-center sm:flex-row sm:px-5 sm:text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-white text-[#04A9C7] shadow-[0_12px_24px_rgba(4,169,199,0.14)]">
                <MarketingIcon name="audit-logs" className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-[13px] font-bold leading-relaxed text-slate-700 sm:text-[14px]">
                Every action is logged. <span className="font-black text-[#16A86E] underline decoration-[#04A9C7]/50 decoration-4 underline-offset-4">Every validation is auditable.</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
