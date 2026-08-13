import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type StatusTone = "before" | "after";

type StatusPanelProps = {
  title: string;
  badge: string;
  tone: StatusTone;
  items: string[];
  noteTitle: string;
  noteBody: string;
};

type DecisionStep = {
  step: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

type AudienceNote = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const beforeItems = [
  "Reports lose context as things change",
  "Leaders ask what really needs fixing",
  "Small teams translate technical detail",
  "Budget spreads across too many possible fixes",
];

const decisionSteps: DecisionStep[] = [
  {
    step: "01",
    title: "Bring the picture together",
    body: "Combine reports, scan results and business context.",
    Icon: marketingIconMap.ingest,
  },
  {
    step: "02",
    title: "Decide what matters",
    body: "Sort issues by exposure, impact and urgency.",
    Icon: marketingIconMap.analyse,
  },
  {
    step: "03",
    title: "Check with approval",
    body: "Nothing runs until your team gives permission.",
    Icon: marketingIconMap.approval,
  },
  {
    step: "04",
    title: "Create a fix plan",
    body: "Turn proof into actions your team can explain.",
    Icon: marketingIconMap.evidence,
  },
];

const afterItems = [
  "You know where the business may be exposed now",
  "Leaders understand why a fix matters",
  "Budget supports the strongest next actions",
  "Progress can be checked as the business changes",
];

const audienceNotes: AudienceNote[] = [
  {
    title: "Owners and leaders",
    body: "A clearer answer to whether the business is exposed.",
    Icon: marketingIconMap["scanner-noise"],
  },
  {
    title: "Lean teams",
    body: "Less time spent translating technical detail.",
    Icon: marketingIconMap.evidence,
  },
  {
    title: "Budget holders",
    body: "A practical reason for what should be funded first.",
    Icon: marketingIconMap.sync,
  },
];

function StatusPanel({ title, badge, tone, items, noteTitle, noteBody }: StatusPanelProps) {
  const isAfter = tone === "after";

  return (
    <article className="rounded-[22px] border border-cyan-100/75 bg-white/82 p-5 shadow-[0_16px_42px_rgba(14,165,233,0.06)] backdrop-blur sm:p-6 lg:self-start">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[16px] font-black text-slate-950">{title}</h3>
        <span
          className={
            isAfter
              ? "rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#16A86E] ring-1 ring-emerald-100"
              : "rounded-full bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-rose-600 ring-1 ring-rose-100"
          }
        >
          {badge}
        </span>
      </div>

      <ul className="mt-5 grid gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            {isAfter ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#16A86E]" strokeWidth={2.1} />
            ) : (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-500 shadow-[0_0_0_5px_rgba(244,63,94,0.08)]" aria-hidden="true" />
            )}
            <span className="text-[14px] font-semibold leading-relaxed text-slate-700">{item}</span>
          </li>
        ))}
      </ul>

      <div
        className={
          isAfter
            ? "mt-5 rounded-[16px] border border-emerald-100 bg-emerald-50/70 p-4"
            : "mt-5 rounded-[16px] border border-rose-100 bg-rose-50/60 p-4"
        }
      >
        <p className={isAfter ? "text-[12px] font-black uppercase tracking-[0.1em] text-[#16A86E]" : "text-[12px] font-black uppercase tracking-[0.1em] text-rose-600"}>
          {noteTitle}
        </p>
        <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-700">{noteBody}</p>
      </div>
    </article>
  );
}

function DecisionStepCard({ item }: { item: DecisionStep }) {
  const { Icon } = item;

  return (
    <article className="relative grid min-h-[76px] grid-cols-[auto_1fr] gap-3 overflow-hidden rounded-[16px] border border-cyan-100/80 bg-white/90 p-3.5 shadow-[0_12px_30px_rgba(14,165,233,0.055)]">
      <div aria-hidden="true" className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,#16A86E,#04A9C7)] opacity-60" />
      <span className="relative z-10 grid h-10 w-10 place-items-center rounded-[14px] bg-[#ECFEFF] text-[#0891B2] ring-1 ring-cyan-100">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="flex items-start justify-between gap-3">
          <span className="text-[14px] font-black leading-tight text-slate-950">{item.title}</span>
          <span className="shrink-0 text-[11px] font-black text-slate-300">{item.step}</span>
        </span>
        <span className="mt-1 block text-[13px] font-medium leading-relaxed text-slate-600">{item.body}</span>
      </span>
    </article>
  );
}

export default function WhyEvadaSection() {
  return (
    <section id="why-evada" className="relative scroll-mt-24 overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[780px] text-center">
            <p className="inline-flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#0891B2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A86E] shadow-[0_0_14px_rgba(46,206,130,0.55)]" />
              From Unclear Risk To A Clear Fix Plan
            </p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
              From unclear risk to a fix plan you can explain.
            </h2>
            <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
              EVADA turns reports, scan results and team knowledge into plain priorities. You can see what needs attention now, what can wait and why the next fix matters.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="relative mt-10 overflow-hidden rounded-[28px] border border-cyan-100/75 bg-white/58 p-4 shadow-[0_24px_70px_rgba(14,165,233,0.08)] backdrop-blur sm:p-5 lg:p-6">
            <div aria-hidden="true" className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
            <div aria-hidden="true" className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-emerald-200/25 blur-3xl" />

            <div className="relative grid grid-cols-1 items-start gap-4 lg:grid-cols-[0.9fr_1.25fr_0.9fr]">
              <StatusPanel
                title="Before EVADA"
                badge="Unclear"
                tone="before"
                items={beforeItems}
                noteTitle="What this creates"
                noteBody="Hard choices, delayed decisions and fixes that may not reduce real exposure."
              />

              <article className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-cyan-100/80 bg-white/88 p-5 shadow-[0_16px_42px_rgba(14,165,233,0.06)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0891B2]">EVADA fix path</p>
                    <h3 className="mt-2 text-[20px] font-black leading-tight text-slate-950 sm:text-[24px]">
                      From findings to a practical fix plan.
                    </h3>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#16A86E]">
                    Human approved
                  </span>
                </div>

                <div className="relative mt-5 grid flex-1 gap-2.5">
                  <span aria-hidden="true" className="absolute bottom-9 left-[34px] top-9 hidden w-px bg-gradient-to-b from-cyan-200 via-emerald-100 to-emerald-200 sm:block" />
                  {decisionSteps.map((item) => (
                    <DecisionStepCard key={item.title} item={item} />
                  ))}
                </div>

                <div className="mt-4 rounded-[16px] border border-cyan-100/80 bg-white/76 px-4 py-3 text-[13px] font-bold leading-relaxed text-slate-700 shadow-[0_12px_30px_rgba(14,165,233,0.045)]">
                  Protection becomes repeatable: review what changed, approve checks, fix what matters and recheck progress.
                </div>
              </article>

              <StatusPanel
                title="After EVADA"
                badge="Clear"
                tone="after"
                items={afterItems}
                noteTitle="What you get"
                noteBody="A fix plan your team can explain, approve and recheck with confidence."
              />
            </div>

            <div className="relative mt-5 grid gap-3 border-t border-cyan-100/80 pt-5 md:grid-cols-3">
              {audienceNotes.map(({ title, body, Icon }) => (
                <div key={title} className="flex min-w-0 items-start gap-3 rounded-[16px] border border-cyan-100/70 bg-white/76 px-4 py-3 shadow-[0_12px_30px_rgba(14,165,233,0.045)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#ECFEFF] text-[#0891B2] shadow-[0_10px_24px_rgba(14,165,233,0.06)] ring-1 ring-cyan-100">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-black leading-tight text-slate-950">{title}</span>
                    <span className="mt-1 block text-[12px] font-semibold leading-snug text-slate-600">{body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
