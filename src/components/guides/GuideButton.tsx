"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, CheckCircle2, Lightbulb, ShieldCheck, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { getWorkspaceGuide, type WorkspaceGuideTopic } from "@/data/workspace-guides";

type GuideButtonProps = {
  guideId: WorkspaceGuideTopic;
  label?: string;
  compact?: boolean;
  className?: string;
};

export default function GuideButton({ guideId, label = "Guide", compact = false, className = "" }: GuideButtonProps) {
  const guide = getWorkspaceGuide(guideId);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={`${compact ? "grid h-8 w-8 place-items-center" : "inline-flex h-10 items-center gap-2 px-3"} shrink-0 rounded-[8px] border border-slate-200 bg-white text-[11px] font-black text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition hover:border-[#2ECE82]/60 hover:text-[#071010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${className}`}
        aria-label={`${label}: ${guide.title}`}
        title={`${label}: ${guide.title}`}
      >
        <BookOpenText className="h-4 w-4 text-[#0891B2]" />
        {!compact ? <span>{label}</span> : null}
      </button>

      {open ? createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#071010]/72 p-2 backdrop-blur-sm sm:p-5" onMouseDown={() => setOpen(false)}>
          <div className="flex h-full items-center justify-center">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative flex h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[8px] border border-white/10 bg-white shadow-[0_32px_100px_rgba(0,0,0,0.42)] sm:h-[min(720px,calc(100dvh-2.5rem))]"
              onMouseDown={(event) => event.stopPropagation()}
            >
            <header className="relative shrink-0 overflow-hidden bg-[#071010] px-5 py-5 text-white sm:px-6">
              <div className="absolute inset-y-0 right-0 w-44 bg-[linear-gradient(120deg,transparent,rgba(46,206,130,0.12))]" aria-hidden="true" />
              <div className="relative flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/25">
                  <BookOpenText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase text-[#04D9FF]">{guide.eyebrow}</p>
                  <h2 id={titleId} className="mt-1 text-[22px] font-black leading-tight">{guide.title}</h2>
                  <p className="mt-2 max-w-2xl text-[11px] font-semibold leading-5 text-white/62">{guide.summary}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white" aria-label="Close guide">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto bg-slate-50 p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)]">
                <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-[#16A86E]" />
                    <h3 className="text-[13px] font-black text-slate-950">How it works</h3>
                  </div>
                  <div className="grid gap-0 p-4">
                    {guide.steps.map((step, index) => (
                      <div key={step.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-4 last:pb-0">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#071010] text-[10px] font-black text-[#2ECE82]">{index + 1}</span>
                        <div><p className="text-[11px] font-black text-slate-900">{step.title}</p><p className="mt-1 text-[10px] font-semibold leading-5 text-slate-500">{step.description}</p></div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid content-start gap-4">
                  <section className="rounded-[8px] border border-cyan-100 bg-cyan-50 p-4">
                    <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-[#0891B2]" /><h3 className="text-[12px] font-black text-slate-950">Use this when</h3></div>
                    <ul className="mt-3 grid gap-2">{guide.whenToUse.map((item) => <li key={item} className="flex gap-2 text-[10px] font-semibold leading-5 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#04A7C7]" />{item}</li>)}</ul>
                  </section>
                  <section className="rounded-[8px] border border-emerald-100 bg-[#F3FFF8] p-4">
                    <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#16A86E]" /><h3 className="text-[12px] font-black text-slate-950">Important rules</h3></div>
                    <ul className="mt-3 grid gap-2">{guide.rules.map((item) => <li key={item} className="flex gap-2 text-[10px] font-semibold leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A86E]" />{item}</li>)}</ul>
                  </section>
                </div>
              </div>
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
              <p className="text-[10px] font-semibold text-slate-500">Guidance follows the current EVADA workflow and permission model.</p>
              <Link href={guide.fullGuideHref} onClick={() => setOpen(false)} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#071010] px-3 text-[10px] font-black text-white">
                Open documentation<ArrowRight className="h-3.5 w-3.5 text-[#2ECE82]" />
              </Link>
            </footer>
            </section>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
