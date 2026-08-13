import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type Phase = {
  phase: string;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  checks: string[];
};

const phases: Phase[] = [
  {
    phase: "Focus 1",
    title: "Ongoing Visibility",
    subtitle: "(between tests)",
    Icon: marketingIconMap["continuous-validation"],
    checks: ["Keep risk decisions current", "Spot changes sooner", "Reduce long gaps between reviews"],
  },
  {
    phase: "Focus 2",
    title: "Delivery Workflow Support",
    subtitle: "(fix earlier)",
    Icon: marketingIconMap["security-workflow"],
    checks: ["Bring context into team workflows", "Review risk before release", "Help teams fix earlier"],
  },
  {
    phase: "Focus 3",
    title: "Better Security Signals",
    subtitle: "(less noise)",
    Icon: marketingIconMap["security-signals"],
    checks: ["Share validated context", "Reduce noisy alerts", "Support faster response decisions"],
  },
  {
    phase: "Focus 4",
    title: "Guardrailed Automation",
    subtitle: "(human-approved)",
    Icon: marketingIconMap["policy-restrictions"],
    checks: ["Keep approvals in place", "Build evidence as work moves", "Speed response without losing control"],
  },
];

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const { Icon } = phase;

  return (
    <article
      className="evada-light-card evolution-phase-card group relative flex h-full min-h-[380px] min-w-0 flex-col overflow-hidden p-6 sm:min-h-[400px] xl:min-h-[410px]"
      style={{ animationDelay: `${index * 0.7}s` }}
    >
      <span className="absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-[#04A9C7] text-[12px] font-black text-white xl:hidden">
        {index + 1}
      </span>
      <div
        className="evada-light-icon evolution-icon-orb mx-auto grid h-24 w-24 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{ animationDelay: `${index * 0.7}s` }}
      >
        <Icon aria-hidden="true" className="h-11 w-11 text-[#04A9C7]" strokeWidth={1.8} />
      </div>

      <div className="mt-7 text-center">
        <p className="evada-light-eyebrow text-[12px] font-black uppercase">{phase.phase}</p>
        <h3 className="evada-light-title mt-2 text-[22px] font-black leading-tight tracking-[-0.01em]">{phase.title}</h3>
        <p className="evada-light-muted mt-1 text-[13px] font-bold">{phase.subtitle}</p>
      </div>

      <div className="mt-auto border-t border-cyan-100/80 pt-5">
        <ul className="grid gap-3">
          {phase.checks.map((check) => (
            <li key={check} className="flex items-start gap-3">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
              <span className="evada-light-muted text-[14px] font-semibold leading-relaxed">{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function PlatformEvolutionSection() {
  return (
    <section id="platform-evolution" className="evada-light-section relative scroll-mt-28 overflow-hidden px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />

      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="evada-light-eyebrow text-[12px] font-black uppercase">Where EVADA is heading</p>
            <h2 className="evada-light-title mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
              <span className="block">From periodic reviews to</span>
              <span className="block">ongoing security confidence</span>
            </h2>
            <p className="evada-light-muted mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed sm:text-[16px]">
              EVADA is moving toward helping teams keep risk decisions current between formal tests, with human approval and evidence still in the loop.
            </p>
            <span className="mx-auto mt-5 block h-1.5 w-16 rounded-full bg-[#04A9C7]" />
          </div>
        </Reveal>

        <div className="relative mt-10 xl:pt-8">
          <div className="evolution-timeline-line pointer-events-none absolute left-[12%] right-[12%] top-4 hidden h-0.5 xl:block" aria-hidden="true">
            <span className="evolution-timeline-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
            {phases.map((phase, index) => (
              <Reveal key={phase.title} delayMs={index * 80} className="min-w-0">
                <div className="relative">
                  <span
                    className="evolution-timeline-node absolute left-1/2 -top-[31px] z-10 hidden h-6 w-6 -translate-x-1/2 rounded-full border-[6px] border-white bg-[#04A9C7] shadow-[0_0_0_7px_rgba(4,169,199,0.12)] xl:block"
                    style={{ animationDelay: `${index * 2}s` }}
                    aria-hidden="true"
                  />
                  <PhaseCard phase={phase} index={index} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delayMs={180}>
          <div className="evada-light-panel relative isolate mt-10 flex flex-col gap-4 overflow-hidden rounded-[8px] px-5 py-5 text-center sm:flex-row sm:items-center sm:text-left">
            <span className="evada-light-icon mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-full sm:mx-0">
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" strokeWidth={2.1} />
            </span>
            <p className="evada-light-title text-[14px] font-black leading-relaxed sm:text-[16px]">
              Ongoing visibility.{" "}
              <span className="text-[#16A86E]">Less noise. More confidence.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
