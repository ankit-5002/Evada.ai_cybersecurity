import type { LucideIcon } from "lucide-react";
import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  MarketingIcon,
  marketingIconMap,
} from "@/components/marketing/MarketingIcon";

type FeedbackTheme = {
  quote: string;
  role: string;
  company: string;
  theme: string;
  Icon: LucideIcon;
};

type ProofNote = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const feedbackThemes: FeedbackTheme[] = [
  {
    quote:
      "We could see which findings needed action first, instead of treating every issue like an emergency.",
    role: "IT Manager",
    company: "Manufacturing SME",
    theme: "Clearer priorities",
    Icon: marketingIconMap["next-steps"],
  },
  {
    quote:
      "The value was confidence. Clear evidence helped us decide where limited security budget should go.",
    role: "Operations Director",
    company: "Professional Services",
    theme: "Budget confidence",
    Icon: marketingIconMap["business-context"],
  },
  {
    quote:
      "Human approval made the checks feel controlled. We could see what was approved, what ran and what came back.",
    role: "Technology Lead",
    company: "Financial Services",
    theme: "Controlled checks",
    Icon: marketingIconMap.approval,
  },
];

const proofNotes: ProofNote[] = [
  {
    title: "Early product feedback",
    body: "Themes gathered from product conversations and early testing.",
    Icon: marketingIconMap["human-expertise"],
  },
  {
    title: "SME-focused",
    body: "The strongest response is from teams with limited time and budget.",
    Icon: marketingIconMap["business-context"],
  },
  {
    title: "Customer names later",
    body: "Named references can be added once approvals are in place.",
    Icon: marketingIconMap["trusted-platform"],
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="customer-testimonials"
      className="evada-light-section relative scroll-mt-28 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[780px] text-center">
            <p className="evada-light-eyebrow inline-flex items-center justify-center gap-2 text-[12px] font-black uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2ECE82] shadow-[0_0_16px_rgba(46,206,130,0.75)]" />
              Early Product Feedback
            </p>

            <h2 className="evada-light-title mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-[1.08] tracking-[-0.03em]">
              Early feedback points to clarity, control and confidence.
            </h2>

            <p className="evada-light-muted mx-auto mt-5 max-w-[720px] text-[15px] leading-8 sm:text-[16px]">
              Product conversations and early testing point to the same practical outcomes: knowing what to fix first, using budget wisely and keeping sensitive checks safely under human approval.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="evada-light-panel mx-auto mt-8 grid max-w-[1080px] grid-cols-1 gap-3 rounded-[8px] p-3 md:grid-cols-3">
            {proofNotes.map(({ title, body, Icon }) => (
              <div key={title} className="evada-light-card flex min-w-0 items-start gap-3 px-4 py-3">
                <span className="evada-light-icon grid h-10 w-10 shrink-0 place-items-center rounded-[8px]">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="evada-light-title block text-[13px] font-black leading-tight">{title}</span>
                  <span className="evada-light-muted mt-1 block text-[12px] font-semibold leading-snug">{body}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {feedbackThemes.map(({ quote, role, company, theme, Icon }, index) => (
            <Reveal key={theme} delayMs={120 + index * 90} className="h-full min-w-0">
              <article className="evada-light-card group flex h-full min-h-[285px] flex-col overflow-hidden p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="evada-light-icon grid h-12 w-12 place-items-center rounded-[8px] transition group-hover:scale-105 group-hover:text-[#16A86E]">
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
                  </span>

                  <span className="rounded-[8px] border border-cyan-100/80 bg-[#ECFEFF] px-3 py-1.5 text-[11px] font-black text-[#0891B2]">
                    {theme}
                  </span>
                </div>

                <Quote
                  aria-hidden="true"
                  className="mt-6 h-7 w-7 text-cyan-300"
                  strokeWidth={2}
                />

                <p className="evada-light-muted mt-3 flex-1 text-[15px] font-semibold leading-8">
                  {quote}
                </p>

                <div className="mt-6 border-t border-cyan-100/80 pt-5">
                  <h3 className="evada-light-title text-[15px] font-black">
                    Anonymised early feedback
                  </h3>

                  <p className="evada-light-muted mt-1 text-[13px] font-semibold">
                    {role}
                  </p>

                  <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[#16A86E]">
                    {company}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={280}>
          <div className="evada-light-panel mx-auto mt-6 flex max-w-[760px] flex-col items-center justify-center gap-3 rounded-[8px] px-5 py-4 text-center sm:flex-row sm:text-left">
            <MarketingIcon
              name="trusted-platform"
              className="h-5 w-5 shrink-0 text-[#16A86E]"
              strokeWidth={2.1}
            />
            <p className="evada-light-muted text-[13px] font-bold leading-relaxed">
              Named customer stories can be added here when approved references are available.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
