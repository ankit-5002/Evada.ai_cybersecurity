import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  MarketingIcon,
  marketingIconMap,
} from "@/components/marketing/MarketingIcon";

type OutcomeCard = {
  title: string;
  body: string;
  tag: string;
  Icon: LucideIcon;
};

type ProofPoint = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

const proofPoints: ProofPoint[] = [
  {
    label: "Next fix",
    value: "Clear",
    Icon: marketingIconMap["next-steps"],
  },
  {
    label: "Budget",
    value: "Focused",
    Icon: marketingIconMap["pricing-launch"],
  },
  {
    label: "Decisions",
    value: "Evidence-led",
    Icon: marketingIconMap.validate,
  },
  {
    label: "Progress",
    value: "Visible",
    Icon: marketingIconMap["audit-logs"],
  },
];

const outcomes: OutcomeCard[] = [
  {
    title: "Grow with confidence",
    body: "Move projects, suppliers and systems forward with a clearer view of what needs attention before it slows the business.",
    tag: "Move forward",
    Icon: marketingIconMap["business-context"],
  },
  {
    title: "Decide without delay",
    body: "Give owners and lean teams plain evidence, so security decisions do not stall in technical detail.",
    tag: "Clear decisions",
    Icon: marketingIconMap["actionable-insights"],
  },
  {
    title: "Protect limited budget",
    body: "Spend on fixes that reduce real exposure, not every issue that appears in a long report.",
    tag: "Budget focus",
    Icon: marketingIconMap.sync,
  },
  {
    title: "Show progress clearly",
    body: "Track approvals, checks and fixes in a simple record leaders can review.",
    tag: "Leader ready",
    Icon: marketingIconMap["audit-logs"],
  },
];

export default function CustomerOutcomesSection() {
  return (
    <section
      id="customer-outcomes"
      className="evada-business-outcomes-section relative scroll-mt-24 overflow-hidden px-5 pb-16 pt-24 text-white sm:px-8 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2ECE82]/25 to-transparent"
      />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[780px] text-center">
            <p className="inline-flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#04D9FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2ECE82] shadow-[0_0_16px_rgba(46,206,130,0.75)]" />
              Business Outcomes
            </p>

            <h2 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white">
              Protected businesses can move faster.
            </h2>

            <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-8 text-slate-300 sm:text-[16px]">
              When you know what matters, you can make decisions faster, protect limited budget and keep projects moving without guessing where the real risk sits.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-2 gap-3 rounded-[24px] border border-white/10 bg-[#071010]/72 p-3 shadow-[0_20px_55px_rgba(7,16,16,0.22)] ring-1 ring-[#2ECE82]/10 backdrop-blur md:grid-cols-4">
            {proofPoints.map(({ label, value, Icon }) => (
              <div key={label} className="flex min-w-0 items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.045] px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#2ECE82]/10 text-[#04D9FF] shadow-[0_10px_24px_rgba(46,206,130,0.08)] ring-1 ring-[#2ECE82]/18">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">{label}</span>
                  <span className="mt-0.5 block text-[14px] font-black leading-tight text-white">{value}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {outcomes.map(({ title, body, tag, Icon }, index) => (
            <Reveal
              key={title}
              delayMs={140 + index * 70}
              className="h-full min-w-0"
            >
              <article className="group flex h-full min-h-[245px] flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#071010]/86 p-5 shadow-[0_16px_42px_rgba(7,16,16,0.28)] ring-1 ring-[#2ECE82]/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#2ECE82]/30 hover:bg-[#071010] hover:shadow-[0_22px_54px_rgba(46,206,130,0.08)]">
                <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#2ECE82]/10 text-[#04D9FF] shadow-[0_0_24px_rgba(4,217,255,0.10)] ring-1 ring-[#2ECE82]/18 transition group-hover:scale-105 group-hover:text-[#2ECE82]">
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6"
                    strokeWidth={2}
                  />
                </span>

                <h3 className="mt-5 text-[18px] font-black leading-tight text-white">
                  {title}
                </h3>

                <p className="mt-3 flex-1 text-[13px] font-medium leading-7 text-slate-300">
                  {body}
                </p>

                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#2ECE82]/18 bg-[#2ECE82]/[0.075] px-3 py-1.5 text-[11px] font-bold text-slate-200">
                  <MarketingIcon
                    name="trusted-platform"
                    className="h-4 w-4 text-[#2ECE82]"
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
