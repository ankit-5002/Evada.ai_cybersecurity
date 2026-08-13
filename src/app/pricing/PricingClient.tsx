"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Globe2,
  HelpCircle,
  Layers3,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

const publicPlans = [
  {
    name: "Free",
    badge: "Start here",
    description: "For first validation, small tests, and product evaluation.",
    monthly: 0,
    yearly: 0,
    webOptions: ["2 Web/API assets"],
    nocOptions: ["2 Network devices"],
    features: ["Basic Web/API scan", "Basic Network Agent device check", "1 VAPT report preview", "7-day history", "Community support"],
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Starter",
    badge: "Small team",
    description: "For teams monitoring a few apps and a small device footprint.",
    monthly: 29,
    yearly: 24,
    webOptions: ["5 Web/API assets", "10 Web/API assets"],
    nocOptions: ["10 Network devices", "25 Network devices"],
    features: ["Scheduled scans", "Web, API, TLS, port checks", "Network inventory view", "PDF VAPT reports", "30-day history"],
    cta: "Choose Starter",
    href: "/book-demo",
  },
  {
    name: "Pro",
    badge: "Most popular",
    description: "For active security teams that need repeat scans and reporting.",
    monthly: 79,
    yearly: 65,
    webOptions: ["25 Web/API assets", "50 Web/API assets"],
    nocOptions: ["50 Network devices", "100 Network devices"],
    features: ["Authenticated Web/API scans", "AI Pentester preview", "PDF + HTML VAPT reports", "90-day activity log", "5 workspace users"],
    cta: "Choose Pro",
    href: "/book-demo",
    featured: true,
  },
  {
    name: "Business",
    badge: "Scale ready",
    description: "For client-ready operations across assets, reports, and Network devices.",
    monthly: 199,
    yearly: 165,
    webOptions: ["100 Web/API assets", "250 Web/API assets"],
    nocOptions: ["250 Network devices", "500 Network devices"],
    features: ["Full AI Pentester workspace", "Network fleet monitoring", "Custom report branding", "1-year retention", "Priority support"],
    cta: "Choose Business",
    href: "/book-demo",
  },
];

const comparisonRows = [
  { feature: "Web/API asset quota", free: "2", starter: "5+", pro: "25+", business: "100+" },
  { feature: "Network device quota", free: "2", starter: "10+", pro: "50+", business: "250+" },
  { feature: "Scanner Engine", free: "Basic", starter: "Scheduled", pro: "Advanced", business: "Advanced" },
  { feature: "VAPT reports", free: "Preview", starter: "PDF", pro: "PDF + HTML", business: "Branded" },
  { feature: "AI Pentester", free: "-", starter: "-", pro: "Preview", business: "Full" },
  { feature: "Activity log", free: "7 days", starter: "30 days", pro: "90 days", business: "1 year" },
];

const addOns = [
  { label: "Extra Web/API asset", price: "$8 / asset", Icon: Globe2 },
  { label: "Extra Network device", price: "$3 / device", Icon: Bot },
  { label: "Extra VAPT report", price: "$19 / report", Icon: FileText },
  { label: "Extra AI Pentester credits", price: "$0.10 / credit", Icon: BrainCircuit },
];

const faqs = [
  { question: "What is a Web/API asset?", answer: "A website, domain, API base URL, public IP target, TLS endpoint, or application target scanned by EVADA." },
  { question: "What is a Network device?", answer: "A router, switch, firewall, server, VM, or cloud device monitored through the EVADA Network Agent workflow." },
  { question: "Can I mix asset and device limits?", answer: "Yes. Paid plans keep Web/API assets and Network devices separate because every client has a different mix." },
  { question: "Is billing connected now?", answer: "This is frontend pricing for approval. Payment, subscriptions, invoices, and enforcement can be connected later." },
];

function priceFor(plan: (typeof publicPlans)[number], cycle: "monthly" | "yearly") {
  const price = cycle === "monthly" ? plan.monthly : plan.yearly;
  return price === 0 ? "Free" : `$${price}`;
}

export default function PricingClient() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [reviewMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("review") === "business";
  });

  return (
    <>
      <section className="evada-light-section relative overflow-hidden px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-14 lg:pt-10">
        <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-[1220px] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.7fr)] lg:items-center">
          <div>
            <p className="evada-light-eyebrow inline-flex items-center gap-2 text-[11px] font-semibold uppercase">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Public pricing
            </p>
            <h1 className="evada-light-title mt-5 max-w-[720px] pb-2 text-[36px] font-black leading-[1.08] sm:text-[50px] lg:text-[64px]">
              Scale EVADA by assets, devices, and reporting.
            </h1>
            <p className="evada-light-muted mt-5 max-w-[640px] text-[16px] font-semibold leading-[1.75]">
              Pick the plan that fits your security mission. Web/API assets and Network devices are priced separately so your client workspace stays flexible.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" className="evada-bracket-button min-h-12 min-w-[170px] px-7 text-[13px]">
                Start Free
              </Link>
              <Link href="/book-demo" className="evada-bracket-button min-h-12 min-w-[178px] px-7 text-[13px]">
                Talk to Sales
              </Link>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-5 text-white shadow-[0_28px_70px_rgba(7,16,16,0.24)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#04D9FF]">Plan model</p>
                <h2 className="mt-2 text-[28px] font-black">Two clear quotas</h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/24">
                <ShieldCheck className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                { label: "Scanner Engine", value: "Web/API assets", Icon: ScanLine },
                { label: "Network Agent", value: "Network devices", Icon: Bot },
                { label: "VAPT Reports", value: "Client-ready evidence", Icon: FileText },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[8px] bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-white/[0.08] text-[#75E7FF]">
                    <item.Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-black">{item.label}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-white/56">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Available plans</p>
              <h2 className="mt-2 text-[32px] font-black text-slate-950">Choose what best fits your security mission</h2>
            </div>
            <div className="inline-grid h-12 w-full grid-cols-2 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:w-[300px]">
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`rounded-full px-5 text-[12px] font-black capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                    billingCycle === cycle ? "bg-[#071010] text-white shadow-[0_10px_24px_rgba(7,16,16,0.18)]" : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          {reviewMode ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#2ECE82]/24 bg-[#F3FFF8] p-4 shadow-[0_14px_34px_rgba(46,206,130,0.08)]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0891B2]">Plan review</p>
                <p className="mt-1 text-[14px] font-black text-slate-950">Current plan: Pro. Recommended update: Business.</p>
              </div>
              <Link href="/billing" className="inline-flex h-10 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-4 text-[12px] font-black text-slate-800 transition hover:border-[#2ECE82]/40">
                Back to billing
              </Link>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            {publicPlans.map((plan) => {
              const price = priceFor(plan, billingCycle);
              const isCurrentPlan = reviewMode && plan.name === "Pro";
              const isRecommendedUpgrade = reviewMode && plan.name === "Business";
              const badgeLabel = isCurrentPlan ? "Current plan" : isRecommendedUpgrade ? "Recommended update" : plan.badge;
              const ctaLabel = isCurrentPlan ? "Back to billing" : isRecommendedUpgrade ? "Upgrade to Business" : plan.cta;
              const ctaHref = isCurrentPlan ? "/billing" : plan.href;

              return (
                <article
                  key={plan.name}
                  id={`${plan.name.toLowerCase()}-plan`}
                  className={`relative flex min-h-full flex-col rounded-[8px] border bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] ${
                    isRecommendedUpgrade
                      ? "border-[#2ECE82] ring-2 ring-[#2ECE82]/18"
                      : isCurrentPlan
                        ? "border-slate-300 ring-2 ring-slate-100"
                        : plan.featured
                          ? "border-[#2ECE82] ring-2 ring-[#2ECE82]/16"
                          : "border-slate-200"
                  }`}
                >
                  <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ring-1 ${
                    isRecommendedUpgrade
                      ? "bg-[#071010] text-[#2ECE82] ring-[#071010]"
                      : isCurrentPlan
                        ? "bg-slate-950 text-white ring-slate-950"
                        : plan.featured
                          ? "bg-[#071010] text-[#2ECE82] ring-[#071010]"
                          : "bg-slate-50 text-slate-500 ring-slate-100"
                  }`}>
                    {badgeLabel}
                  </span>
                  <h3 className="mt-4 text-[22px] font-black text-slate-950">{plan.name}</h3>
                  <p className="mt-2 min-h-[58px] text-[13px] font-semibold leading-relaxed text-slate-600">{plan.description}</p>

                  <div className="mt-5">
                    <span className="text-[36px] font-black leading-none text-slate-950">{price}</span>
                    {price !== "Free" ? <span className="ml-1 text-[13px] font-bold text-slate-500">/month</span> : null}
                    <p className="mt-1 text-[11px] font-bold text-slate-500">
                      {billingCycle === "yearly" && price !== "Free" ? "Billed yearly. Pay for 10 months." : "Monthly billing. Change anytime."}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">Web/API assets</span>
                      <select className="h-11 rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-[13px] font-black text-slate-900 outline-none focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18">
                        {plan.webOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">Network devices</span>
                      <select className="h-11 rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-[13px] font-black text-slate-900 outline-none focus:border-[#2ECE82] focus:ring-2 focus:ring-[#2ECE82]/18">
                        {plan.nocOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A86E]" />
                        <span className="text-[12px] font-bold leading-relaxed text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={ctaHref}
                    className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                      isCurrentPlan
                        ? "border border-slate-200 bg-white text-slate-800 hover:border-[#2ECE82]/40"
                        : plan.featured || isRecommendedUpgrade
                        ? "bg-[#2ECE82] text-[#071010] shadow-[0_18px_38px_rgba(46,206,130,0.24)] hover:-translate-y-0.5 hover:bg-[#3FDC8F]"
                        : "bg-[#071010] text-white shadow-[0_16px_34px_rgba(7,16,16,0.16)] hover:-translate-y-0.5 hover:bg-[#0E241E]"
                    }`}
                  >
                    {ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1220px] gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Feature comparison</p>
                <h2 className="mt-2 text-[28px] font-black text-slate-950">Plan limits at a glance</h2>
              </div>
              <Layers3 className="h-6 w-6 text-[#16A86E]" />
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 text-[12px] font-black text-slate-700">
                    <th className="rounded-l-[8px] px-3 py-4">Feature</th>
                    <th className="px-3 py-4">Free</th>
                    <th className="px-3 py-4">Starter</th>
                    <th className="px-3 py-4">Pro</th>
                    <th className="rounded-r-[8px] px-3 py-4">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="text-[13px] font-bold text-slate-700">
                      <td className="px-3 py-4 font-black text-slate-950">{row.feature}</td>
                      <td className="px-3 py-4">{row.free}</td>
                      <td className="px-3 py-4">{row.starter}</td>
                      <td className="px-3 py-4">{row.pro}</td>
                      <td className="px-3 py-4">{row.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[8px] border border-[#2ECE82]/24 bg-[#071010] p-5 text-white shadow-[0_18px_44px_rgba(7,16,16,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#04D9FF]">Enterprise</p>
            <h2 className="mt-3 text-[26px] font-black leading-tight">Need custom limits?</h2>
            <p className="mt-3 text-[13px] font-semibold leading-relaxed text-white/70">
              Use Enterprise for MSP, private cloud, larger Network Device pools, SSO, SLA, custom retention, or tenant separation.
            </p>
            <div className="mt-5 grid gap-2">
              {["Custom asset and device quota", "Dedicated onboarding", "Private deployment option"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-[8px] bg-white/[0.06] px-3 py-2 text-[12px] font-black text-white/86">
                  <ShieldCheck className="h-4 w-4 text-[#2ECE82]" />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/book-demo" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-white text-[13px] font-black text-[#071010] transition hover:-translate-y-0.5 hover:bg-[#E8FFF3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]">
              Contact sales
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#0891B2]">Add-ons and FAQ</p>
              <h2 className="mt-2 text-[28px] font-black text-slate-950">Scale without changing everything</h2>
              <p className="mt-3 text-[14px] font-semibold leading-relaxed text-slate-600">
                Add capacity when a client grows beyond included plan limits.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                {addOns.map((addOn) => (
                  <div key={addOn.label} className="flex items-center justify-between gap-4 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-[#0891B2] ring-1 ring-slate-200">
                        <addOn.Icon className="h-4.5 w-4.5" />
                      </span>
                      <p className="text-[13px] font-black text-slate-950">{addOn.label}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 ring-1 ring-slate-200">{addOn.price}</span>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0891B2]" />
                      <div>
                        <p className="text-[13px] font-black text-slate-950">{faq.question}</p>
                        <p className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
