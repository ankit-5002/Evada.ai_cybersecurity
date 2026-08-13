import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

const problemItems = [
  "Separate urgent issues from background noise",
  "Put budget behind fixes that reduce real exposure",
  "Give leaders a clear reason for the next action",
];

const decisionCards = [
  {
    title: "Unclear",
    text: "Too many findings.",
  },
  {
    title: "Focused",
    text: "The real priority is clear.",
  },
  {
    title: "Decision",
    text: "Next fix is easier to justify.",
  },
];

const decisionPath = [
  { title: "Find", label: "What might be wrong", active: true },
  { title: "Sort", label: "What can wait" },
  { title: "Check", label: "What matters now" },
  { title: "Approve", label: "What gets funded" },
  { title: "Fix", label: "What reduces risk" },
];

export default function ProblemSection() {
  return (
    <section className="evada-light-section relative min-h-[calc(100vh-70px)] overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto grid min-h-[calc(100vh-70px-12rem)] max-w-[1360px] min-w-0 grid-cols-1 items-center gap-12 xl:grid-cols-[0.42fr_0.58fr] xl:gap-14">
        <Reveal className="min-w-0">
          <p className="evada-light-eyebrow inline-flex items-center gap-2 text-[12px] font-black uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2ECE82] shadow-[0_0_16px_rgba(46,206,130,0.75)]" />
            Security Budget, Real Risk
          </p>
          <h2 className="evada-light-title mt-5 max-w-[570px] text-[clamp(1.75rem,6vw,2.75rem)] font-black leading-[1.06] tracking-[-0.025em]">
            When budget is limited, knowing what to fix first matters.
            <br />
          </h2>
          <p className="evada-light-muted mt-5 max-w-[560px] text-[15px] leading-[1.75] sm:text-[17px]">
            Most growing businesses cannot fix every security finding at once. EVADA helps you understand which issues need action first, so your time and budget go toward the fixes that reduce real risk.
          </p>

          <div className="mt-7 space-y-4">
            {problemItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#16A86E]" strokeWidth={2.1} />
                <p className="evada-light-muted min-w-0 break-words text-[14px] font-semibold leading-relaxed sm:text-[15px]">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="min-w-0" delayMs={120}>
          <div className="evada-light-panel relative isolate w-full overflow-hidden rounded-[8px] p-5 sm:p-8">
            <h3 className="evada-light-title relative max-w-[620px] text-[20px] font-black leading-tight tracking-[-0.01em] sm:text-[24px]">
              The problem is not just finding issues. It is knowing which ones deserve time, money and attention.
            </h3>

            <div className="relative mt-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {decisionCards.map((card) => (
                  <div key={card.title} className="evada-light-card px-4 py-3">
                    <p className="evada-light-eyebrow text-[12px] font-black uppercase">{card.title}</p>
                    <p className="evada-light-muted mt-1.5 text-[13px] font-bold leading-snug">{card.text}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-7">
                <div className="risk-timeline-track absolute left-[10%] right-[10%] top-[18px] hidden h-[2px] sm:block" aria-hidden="true">
                  <span className="risk-timeline-base" />
                  <span className="risk-timeline-progress" />
                  <span className="risk-timeline-pulse">
                    <span />
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-2">
                  {decisionPath.map((step, index) => (
                    <div key={step.title} className="relative min-w-0 rounded-[8px] border border-cyan-100/80 bg-white/60 p-3 text-center shadow-[0_12px_28px_rgba(14,165,233,0.08)] sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                      <span
                        data-step={index}
                        className={`risk-timeline-node relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full border-[5px] bg-white ${step.active ? "border-[#16A86E]" : "border-cyan-100"}`}
                        style={{ animationDelay: `${index * 1.78}s` }}
                        aria-hidden="true"
                      >
                        <span className={`risk-timeline-node-inner h-2.5 w-2.5 rounded-full ${step.active ? "bg-[#0891B2]" : "bg-cyan-200"}`} />
                      </span>
                      <p className="evada-light-title mt-4 text-[12px] font-black leading-tight sm:text-[14px]">{step.title}</p>
                      <p className="evada-light-muted mt-1 break-words text-[10px] font-semibold leading-tight sm:text-[12px]">{step.label}</p>
                      <span className="risk-risk-dot mx-auto mt-4 hidden h-2 w-2 rounded-full bg-[#16A86E] sm:block" style={{ animationDelay: `${index * 1.78 + 0.32}s` }} aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-center gap-2 rounded-[8px] border border-cyan-100/80 bg-white/70 px-3 py-4 text-center text-[12px] font-black text-[#071633] shadow-[0_14px_32px_rgba(14,165,233,0.1)] sm:text-[15px]">
                <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0 text-[#0891B2]" strokeWidth={2.2} />
                <span>Without clear priority, budget can go to low-impact work while real exposure stays open.</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
