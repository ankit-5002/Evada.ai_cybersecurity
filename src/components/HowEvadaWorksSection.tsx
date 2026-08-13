import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type WorkflowItem = {
  step: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

type SupportItem = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const workflow: WorkflowItem[] = [
  {
    step: "1",
    title: "Bring everything together",
    body: "Collect reports, scan results and team notes in one clear view.",
    Icon: marketingIconMap.ingest,
  },
  {
    step: "2",
    title: "See what matters first",
    body: "Understand which issues need attention and which can wait.",
    Icon: marketingIconMap.analyse,
  },
  {
    step: "3",
    title: "Approve before checks run",
    body: "You stay in control before EVADA validates anything.",
    Icon: marketingIconMap.validate,
  },
  {
    step: "4",
    title: "Fix with confidence",
    body: "Focus on the next fix and track progress as you improve.",
    Icon: marketingIconMap["security-workflow"],
  },
];

const supportItems: SupportItem[] = [
  {
    title: "AI reduces manual effort",
    body: "Repetitive review is faster while your team stays in control.",
    Icon: marketingIconMap["ai-supported"],
  },
  {
    title: "You approve checks",
    body: "Nothing touches your environment without human approval.",
    Icon: marketingIconMap.approval,
  },
  {
    title: "Every decision is recorded",
    body: "You can see who approved what, when and why.",
    Icon: marketingIconMap["audit-logs"],
  },
  {
    title: "Fits your workflow",
    body: "Use EVADA alongside the tools and processes you already have.",
    Icon: marketingIconMap["integration-categories"],
  },
];

function WorkflowCard({ item, index }: { item: WorkflowItem; index: number }) {
  const { Icon } = item;

  return (
    <div className="relative h-full min-w-0">
      <span
        className="workflow-step-badge absolute left-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#16A86E,#04A9C7)] text-[13px] font-black text-white shadow-[0_12px_24px_rgba(14,165,233,0.18)]"
        style={{ animationDelay: `${index * 1.25}s` }}
      >
        {item.step}
      </span>
      <div className="group flex h-full min-h-[245px] flex-col items-center overflow-hidden rounded-[20px] border border-cyan-100/80 bg-white/88 p-5 pt-8 text-center shadow-[0_16px_42px_rgba(14,165,233,0.065)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-200/80 hover:bg-white hover:shadow-[0_22px_54px_rgba(14,165,233,0.1)] sm:min-h-[260px] xl:min-h-[268px]">
        <div className="workflow-icon-orb grid h-16 w-16 place-items-center rounded-[18px] bg-[#ECFEFF] text-[#0891B2] shadow-[0_0_32px_rgba(14,165,233,0.16)] ring-1 ring-cyan-100 transition group-hover:text-[#16A86E] sm:h-[74px] sm:w-[74px]" style={{ animationDelay: `${index * 1.25 + 0.15}s` }}>
          <Icon aria-hidden="true" className="h-8 w-8" strokeWidth={1.9} />
        </div>
        <h3 className="mt-5 min-h-[52px] text-[17px] font-black leading-tight tracking-[-0.01em] text-slate-950 sm:text-[20px]">{item.title}</h3>
        <p className="mt-2 max-w-[210px] text-[12px] font-medium leading-relaxed text-slate-600 sm:text-[13px]">
          {item.body}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-5 text-[#16A86E]">
          <CheckCircle2 className="h-4 w-4" strokeWidth={2.1} />
          <span className="h-1.5 w-1.5 rounded-full bg-[#04A9C7]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A86E]" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
        </div>
      </div>
      {index < workflow.length - 1 && (
        <div className="workflow-flow-connector pointer-events-none absolute left-[calc(100%_+_14px)] top-1/2 hidden h-6 w-12 -translate-y-1/2 xl:block" style={{ animationDelay: `${index * 1.25}s` }} aria-hidden="true">
          <span className="workflow-flow-line" />
          <span className="workflow-flow-dot" />
          <svg className="absolute -right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#16A86E]" viewBox="0 0 16 16" fill="none">
            <path d="M5 3.5L10 8L5 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      )}
    </div>
  );
}

function SupportCard({ item }: { item: SupportItem }) {
  const { Icon } = item;

  return (
    <div className="flex min-w-0 items-center gap-3 px-3 py-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#ECFEFF] text-[#0891B2] ring-1 ring-cyan-100">
        <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-black leading-tight text-slate-950 sm:text-[16px]">{item.title}</span>
        <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-600 sm:text-[13px]">{item.body}</span>
      </span>
    </div>
  );
}

export default function HowEvadaWorksSection() {
  return (
    <section id="how-evada-works" className="relative scroll-mt-24 overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="inline-flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#0891B2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A86E] shadow-[0_0_14px_rgba(46,206,130,0.55)]" />
              How It Works
            </p>
            <h2 className="mx-auto mt-4 max-w-[760px] break-words text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-950 sm:tracking-[-0.025em]">
              <span className="block">How EVADA turns findings</span>
              <span className="block">into clear next steps</span>
            </h2>

            <p className="mx-auto mt-6 max-w-[760px] text-[15px] leading-[1.8] text-slate-600 sm:text-[16px]">
              Whether you have completed a pentest or are just starting your security journey, EVADA helps you bring findings together, check what matters and focus on the next fix.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 items-stretch gap-5 md:gap-6 xl:grid-cols-4 xl:gap-8">
          {workflow.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 90} className="h-full min-w-0">
              <WorkflowCard item={item} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={180}>
          <div className="relative isolate mt-8 grid grid-cols-1 overflow-hidden rounded-[22px] border border-cyan-100/75 bg-white/72 shadow-[0_18px_48px_rgba(14,165,233,0.07)] backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
            {supportItems.map((item, index) => (
              <div key={item.title} className={index > 0 ? "border-t border-cyan-100/80 sm:border-l sm:border-t-0" : ""}>
                <SupportCard item={item} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
