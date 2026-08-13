"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Database, FileJson2, Lightbulb, LockKeyhole, ScanSearch, ShieldCheck } from "lucide-react";
import { getWorkspaceGuide, scannerOperationalGuides, type WorkspaceGuideId, type WorkspaceGuideTopic } from "@/data/workspace-guides";

const related: Record<WorkspaceGuideId, Array<{ label: string; href: string; helper: string }>> = {
  assets: [
    { label: "Scanner Engine", href: "/scans/guide", helper: "Run released adapters against verified scope." },
    { label: "Findings", href: "/findings/guide", helper: "Review normalized security observations." },
  ],
  "scanner-engine": [
    { label: "Asset Management", href: "/assets/guide", helper: "Create and verify scanner-ready targets." },
    { label: "Findings", href: "/findings/guide", helper: "Triage normalized scanner evidence." },
  ],
  findings: [
    { label: "Scanner Engine", href: "/scans/guide", helper: "Retest an Asset after remediation." },
    { label: "VAPT Reports", href: "/reports/guide", helper: "Capture Findings in an immutable report." },
  ],
  reports: [
    { label: "Findings", href: "/findings/guide", helper: "Review live records before snapshotting." },
    { label: "Asset Management", href: "/assets/guide", helper: "Understand report scope and Asset risk." },
  ],
  team: [
    { label: "Asset Management", href: "/assets/guide", helper: "Understand permissions members receive." },
    { label: "Scanner Engine", href: "/scans/guide", helper: "Understand execute and view access." },
  ],
};

const scannerDocumentation: Array<{ id: WorkspaceGuideTopic; label: string; status: "Ready" | "Locked" }> = [
  { id: "scanner-web-app", label: "Web App Scanner", status: "Ready" },
  { id: "scanner-tls", label: "TLS/SSL Scanner", status: "Ready" },
  { id: "scanner-api", label: "API Scanner", status: "Locked" },
  { id: "scanner-database", label: "Database Scanner", status: "Locked" },
  { id: "scanner-os-port", label: "OS / Port Scanner", status: "Locked" },
  { id: "scanner-sharepoint", label: "SharePoint Scanner", status: "Locked" },
  { id: "scanner-hybrid", label: "Hybrid SOS Scanner", status: "Locked" },
  { id: "scanner-sast-dast", label: "SAST/DAST Scanner", status: "Locked" },
];

export default function WorkspaceGuidePage({ guideId }: { guideId: WorkspaceGuideTopic }) {
  const guide = getWorkspaceGuide(guideId);
  const scannerDetail = scannerOperationalGuides[guideId];
  const relatedGuides = scannerDetail
    ? [{ label: "All scanner guides", href: "/scans/guide", helper: "Return to the complete eight-adapter documentation index." }, ...related[guide.moduleId]]
    : related[guide.moduleId];
  const workflowColumns = guide.steps.length <= 3 ? "lg:grid-cols-3" : guide.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";

  return (
    <div className="grid gap-5 pb-8">
      <header className="relative overflow-hidden rounded-[8px] border border-[#2ECE82]/20 bg-[#071010] p-5 text-white shadow-[0_18px_48px_rgba(7,16,16,0.18)] sm:p-7">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(125deg,transparent,rgba(4,217,255,0.07),rgba(46,206,130,0.12))]" aria-hidden="true" />
        <div className="relative">
          <Link href={guide.returnHref} className="inline-flex items-center gap-2 text-[10px] font-black text-[#75E7FF]"><ArrowLeft className="h-3.5 w-3.5" />Back to module</Link>
          <div className="mt-5 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/25"><BookOpenText className="h-5 w-5" /></span>
            <div><p className="text-[9px] font-black uppercase text-[#04D9FF]">{guide.eyebrow}</p><h2 className="mt-1 text-[26px] font-black leading-tight sm:text-[32px]">{guide.title}</h2><p className="mt-3 max-w-3xl text-[12px] font-semibold leading-6 text-white/64">{guide.summary}</p></div>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {guide.whenToUse.map((item, index) => (
          <article key={item} className="rounded-[8px] border border-cyan-100 bg-cyan-50 p-4">
            <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-white text-[#0891B2] ring-1 ring-cyan-100"><Lightbulb className="h-4 w-4" /></span>
            <p className="mt-3 text-[9px] font-black uppercase text-[#0891B2]">Use case {index + 1}</p><p className="mt-1 text-[11px] font-semibold leading-5 text-slate-600">{item}</p>
          </article>
        ))}
      </section>

      {guideId === "scanner-engine" ? (
        <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-[9px] font-black uppercase text-[#0891B2]">Scanner documentation</p>
              <h3 className="mt-1 text-[18px] font-black text-slate-950">Choose an adapter guide</h3>
              <p className="mt-1 text-[10px] font-semibold text-slate-500">Ready scanners explain the live workflow; locked scanners document the planned secure release model.</p>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-[9px] font-black uppercase text-cyan-700 ring-1 ring-cyan-100">2 of 8 ready</span>
          </div>
          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
            {scannerDocumentation.map((item) => {
              const active = guideId === item.id;
              return (
                <Link
                  key={item.id}
                  href={`/scans/guide?topic=${item.id}`}
                  className={`min-h-28 bg-white p-4 transition ${active ? "relative z-[1] bg-[#F3FFF8] ring-2 ring-inset ring-[#2ECE82]" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-[8px] ring-1 ${active ? "bg-[#071010] text-[#2ECE82] ring-[#071010]" : "bg-cyan-50 text-[#0891B2] ring-cyan-100"}`}><BookOpenText className="h-4 w-4" /></span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase ring-1 ${item.status === "Ready" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-500 ring-slate-200"}`}>{item.status === "Locked" ? <LockKeyhole className="h-3 w-3" /> : null}{item.status}</span>
                  </div>
                  <p className="mt-3 text-[11px] font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-[9px] font-semibold text-slate-500">Open detailed purpose, workflow, scope and operating rules.</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {scannerDetail ? (
        <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[9px] font-black uppercase text-[#0891B2]">Selected scanner specification</p>
            <h3 className="mt-1 text-[18px] font-black text-slate-950">What this scanner uses and produces</h3>
            <p className="mt-1 text-[10px] font-semibold text-slate-500">This document describes only {guide.title}. Other adapters have separate documentation.</p>
          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Release", value: scannerDetail.status, Icon: ShieldCheck },
              { label: "Engine", value: scannerDetail.engine, Icon: ScanSearch },
              { label: "Supported scope", value: scannerDetail.supportedScope, Icon: Database },
              { label: "Raw evidence", value: scannerDetail.evidenceFormat, Icon: FileJson2 },
            ].map((item) => (
              <div key={item.label} className="min-h-28 bg-white p-4">
                <item.Icon className="h-4 w-4 text-[#16A86E]" />
                <p className="mt-3 text-[9px] font-black uppercase text-slate-400">{item.label}</p>
                <p className="mt-1 text-[11px] font-black leading-5 text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-px border-t border-slate-100 bg-slate-100 lg:grid-cols-3">
            {[
              { eyebrow: "Input boundary", title: "Data EVADA sends", items: scannerDetail.inputs },
              { eyebrow: "Isolated execution", title: "How the job runs", items: scannerDetail.processing },
              { eyebrow: "Tenant evidence", title: "Where results are kept", items: scannerDetail.storedData },
            ].map((section) => (
              <article key={section.title} className="bg-white p-5">
                <p className="text-[9px] font-black uppercase text-[#0891B2]">{section.eyebrow}</p>
                <h4 className="mt-1 text-[14px] font-black text-slate-950">{section.title}</h4>
                <ul className="mt-4 grid gap-3">
                  {section.items.map((item) => <li key={item} className="flex gap-2 text-[10px] font-semibold leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A86E]" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-cyan-50/60 p-5">
            <p className="text-[9px] font-black uppercase text-[#0891B2]">Normalized output</p>
            <h4 className="mt-1 text-[14px] font-black text-slate-950">Example Findings produced by this scanner</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {scannerDetail.findingExamples.map((item) => <span key={item} className="rounded-full bg-white px-3 py-2 text-[9px] font-black text-slate-600 ring-1 ring-cyan-100">{item}</span>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4"><p className="text-[9px] font-black uppercase text-[#0891B2]">End-to-end workflow</p><h3 className="mt-1 text-[18px] font-black text-slate-950">How this module works</h3></div>
        <div className={`grid gap-px bg-slate-100 ${workflowColumns}`}>
          {guide.steps.map((step, index) => (
            <article key={step.title} className="min-h-44 bg-white p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#071010] text-[10px] font-black text-[#2ECE82]">{index + 1}</span>
              <h4 className="mt-4 text-[12px] font-black text-slate-950">{step.title}</h4><p className="mt-2 text-[10px] font-semibold leading-5 text-slate-500">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[8px] border border-emerald-100 bg-[#F3FFF8] p-5">
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-[#16A86E] ring-1 ring-emerald-100"><ShieldCheck className="h-4 w-4" /></span><div><p className="text-[9px] font-black uppercase text-[#16A86E]">Security and workflow</p><h3 className="text-[16px] font-black text-slate-950">Important operating rules</h3></div></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{guide.rules.map((rule) => <div key={rule} className="flex gap-2 rounded-[8px] bg-white p-3 ring-1 ring-emerald-100"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A86E]" /><p className="text-[10px] font-semibold leading-5 text-slate-600">{rule}</p></div>)}</div>
        </article>
        <aside className="rounded-[8px] border border-slate-200 bg-white p-4">
          <p className="text-[9px] font-black uppercase text-slate-400">Continue learning</p><h3 className="mt-1 text-[16px] font-black text-slate-950">Related documentation</h3>
          <div className="mt-4 grid gap-2">{relatedGuides.map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-[8px] border border-slate-200 p-3 transition hover:border-[#2ECE82]/50 hover:bg-[#F3FFF8]"><div className="min-w-0 flex-1"><p className="text-[11px] font-black text-slate-900">{item.label}</p><p className="mt-1 text-[9px] font-semibold leading-4 text-slate-500">{item.helper}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-[#16A86E]" /></Link>)}</div>
        </aside>
      </section>
    </div>
  );
}
