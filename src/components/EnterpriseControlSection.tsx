import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  MarketingIcon,
  marketingIconMap,
} from "@/components/marketing/MarketingIcon";

type ApprovalStep = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

type ControlCard = {
  title: string;
  body: string;
  tag: string;
  Icon: LucideIcon;
};

const approvalSteps: ApprovalStep[] = [
  {
    title: "See what will be checked",
    body: "Review the target, timing and scope before anything starts.",
    Icon: marketingIconMap["show-workflow"],
  },
  {
    title: "Approve the check",
    body: "Only an approved person can allow EVADA to move forward.",
    Icon: marketingIconMap.approval,
  },
  {
    title: "Keep the record",
    body: "Every approval, check and result is captured for review.",
    Icon: marketingIconMap["audit-logs"],
  },
];

const approvalRecords = [
  "Who said yes",
  "What was checked",
  "When the record was created",
];

const cards: ControlCard[] = [
  {
    title: "Human sign-off",
    body: "No sensitive check runs until an approved person gives clear permission.",
    tag: "Permission required",
    Icon: marketingIconMap.approval,
  },
  {
    title: "Clear permissions",
    body: "Give people access only to the areas they need, without opening everything to everyone.",
    tag: "Right access",
    Icon: marketingIconMap["identity-access"],
  },
  {
    title: "Simple safety rules",
    body: "Set practical boundaries for scope, timing and activity before checks run.",
    tag: "Boundaries set",
    Icon: marketingIconMap["policy-restrictions"],
  },
  {
    title: "Full activity record",
    body: "See who approved what, when it ran and what evidence was created.",
    tag: "Clear record",
    Icon: marketingIconMap["audit-logs"],
  },
];

function ApprovalStepCard({ step, index }: { step: ApprovalStep; index: number }) {
  const { Icon } = step;

  return (
    <article className="evada-light-card relative flex h-full min-h-[142px] flex-col overflow-hidden rounded-[8px] p-4">
      <span className="flex items-start justify-between gap-3">
        <span className="evada-light-icon grid h-11 w-11 place-items-center rounded-[8px]">
          <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="shrink-0 text-[11px] font-black text-cyan-700/35">0{index + 1}</span>
      </span>
      <span className="mt-4 min-w-0">
        <span className="evada-light-title text-[14px] font-black leading-tight">{step.title}</span>
        <span className="evada-light-muted mt-1.5 block text-[13px] font-medium leading-relaxed">{step.body}</span>
      </span>
    </article>
  );
}

function ApprovalRecordStrip() {
  return (
    <div className="evada-light-card mt-4 flex flex-col gap-4 rounded-[8px] p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="evada-light-icon grid h-10 w-10 shrink-0 place-items-center rounded-[8px] text-[#16A86E]">
          <MarketingIcon
            name="secure-platform"
            className="h-5 w-5"
            strokeWidth={2}
          />
        </span>
        <span className="min-w-0">
          <span className="evada-light-title block text-[14px] font-black leading-tight">Approval keeps you in control.</span>
          <span className="evada-light-muted mt-1 block text-[13px] font-semibold leading-relaxed">
            AI can assist the workflow, but your team decides when sensitive checks happen.
          </span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {approvalRecords.map((record) => (
          <span key={record} className="rounded-[8px] border border-cyan-100/80 bg-white/78 px-3 py-1.5 text-[11px] font-black text-[#0891B2] shadow-sm">
            {record}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function EnterpriseControlSection() {
  return (
    <section
      id="human-approved-validation"
      className="evada-light-section relative min-h-[calc(100vh-70px)] scroll-mt-24 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />

      <div className="relative mx-auto flex min-h-[calc(100vh-70px-12rem)] max-w-[1360px] flex-col justify-center">
        <Reveal>
          <div className="mx-auto max-w-[780px] text-center">
            <p className="evada-light-eyebrow inline-flex items-center justify-center gap-2 text-[12px] font-black uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2ECE82] shadow-[0_0_16px_rgba(46,206,130,0.75)]" />
              Human-Approved Validation
            </p>

            <h2 className="evada-light-title mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-[1.08] tracking-[-0.03em]">
              Nothing touches your environment until you say yes.
            </h2>

            <p className="evada-light-muted mx-auto mt-5 max-w-[720px] text-[15px] leading-8 sm:text-[16px]">
              EVADA helps you use AI-supported checks safely. Your team approves sensitive activity, sees what happened and keeps a plain record of every decision.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={90}>
          <div className="evada-light-panel relative isolate mx-auto mt-9 max-w-[1120px] overflow-hidden rounded-[8px] p-5 lg:p-6">
            <div aria-hidden="true" className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-emerald-200/25 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="evada-light-eyebrow text-[11px] font-black uppercase">Simple approval flow</p>
                  <h3 className="evada-light-title mt-2 text-[22px] font-black leading-tight sm:text-[26px]">
                    Safe checks in three simple steps.
                  </h3>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#16A86E]">
                  You stay in control
                </span>
              </div>

              <div className="relative mt-5 grid gap-3 md:grid-cols-3">
                {approvalSteps.map((step, index) => (
                  <ApprovalStepCard key={step.title} step={step} index={index} />
                ))}
              </div>

              <ApprovalRecordStrip />
            </div>
          </div>
        </Reveal>

        <div className="mt-7 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ title, body, tag, Icon }, index) => (
            <Reveal
              key={title}
              delayMs={150 + index * 70}
              className="h-full min-w-0"
            >
              <article className="evada-light-card group flex h-full min-h-[245px] flex-col overflow-hidden p-5">
                <span className="evada-light-icon grid h-12 w-12 place-items-center rounded-[8px] transition group-hover:scale-105 group-hover:text-[#16A86E]">
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6"
                    strokeWidth={2}
                  />
                </span>

                <h3 className="evada-light-title mt-5 text-[18px] font-black leading-tight">
                  {title}
                </h3>

                <p className="evada-light-muted mt-3 flex-1 text-[13px] font-medium leading-7">
                  {body}
                </p>

                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-slate-700">
                  <MarketingIcon
                    name="secure-platform"
                    className="h-4 w-4 text-[#16A86E]"
                    strokeWidth={2.1}
                  />

                  <span>{tag}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
