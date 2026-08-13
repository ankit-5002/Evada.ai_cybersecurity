import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, LockKeyhole, Radar, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const assuranceItems = [
  "Verified account activation",
  "Strong password policy",
  "Secure reset links",
];

export default function AuthShell({ eyebrow, title, description, children }: Readonly<AuthShellProps>) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#F8FEFF] text-slate-950">
      <header className="absolute left-0 top-0 z-20 flex items-center px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="EVADA home"
        >
          <Image
            src="/logos/logo.png"
            alt="EVADA"
            width={2890}
            height={631}
            priority
            className="h-auto w-[118px] object-contain [filter:drop-shadow(0_1px_1px_rgba(7,22,51,0.8))_drop-shadow(0_8px_18px_rgba(7,22,51,0.1))] sm:w-[132px]"
          />
        </Link>
      </header>

      <section className="grid min-h-dvh w-full min-w-0 overflow-x-hidden lg:grid-cols-2">
        <div className="relative hidden overflow-hidden px-5 pb-8 pt-24 sm:px-8 lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:self-start lg:items-center lg:px-12 lg:pb-8 lg:pt-24 xl:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_28%,rgba(14,165,233,0.14),transparent_30%),radial-gradient(ellipse_at_90%_64%,rgba(46,206,130,0.28),transparent_33%),radial-gradient(circle_at_15%_10%,rgba(6,182,212,0.14),transparent_30%),linear-gradient(112deg,#F8FEFF_0%,#EFFDFF_30%,#ECFBFF_52%,#E8FFF3_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.72] [background-image:radial-gradient(rgba(14,165,233,0.24)_1px,transparent_1px),radial-gradient(rgba(46,206,130,0.22)_1px,transparent_1px)] [background-position:0_0,10px_10px] [background-size:22px_22px]"
          />
          <div aria-hidden="true" className="absolute left-[-18%] top-[14%] h-[58vh] w-[52vw] rotate-[-14deg] border border-cyan-200/26 opacity-50" />
          <div aria-hidden="true" className="absolute right-[-18%] top-[10%] h-[68vh] w-[50vw] border border-emerald-200/30 opacity-48" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(180deg,rgba(245,248,246,0)_0%,rgba(245,248,246,0.92)_100%)]" />

          <aside className="relative z-10 mx-auto w-full max-w-[620px] py-4 lg:ml-0 lg:mr-auto lg:py-0">
            <div className="max-w-[560px]">
              <p className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#0891B2]">
                <ShieldCheck className="h-4 w-4" />
                {eyebrow}
              </p>
              <h1 className="mt-5 text-[2.5rem] font-black leading-none tracking-normal text-[#071633] xl:text-[3.5rem] 2xl:text-[4.25rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-[540px] text-[15px] font-semibold leading-[1.75] text-slate-700 sm:text-[17px]">
                {description}
              </p>
            </div>

            <div className="relative mt-7 max-w-[560px] overflow-hidden rounded-[8px] border border-cyan-100 bg-white/84 p-4 shadow-[0_18px_48px_rgba(14,165,233,0.1)] backdrop-blur-xl sm:p-5 lg:mt-6">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(46,206,130,0.16),transparent_34%)]" />
              <div className="relative grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-cyan-100 bg-white text-[#0891B2] shadow-[0_18px_44px_rgba(14,165,233,0.16)]">
                  <Radar className="h-8 w-8" />
                </span>
                <div>
                  <p className="text-[18px] font-black leading-tight text-[#071633]">Identity gate ready</p>
                  <p className="mt-2 text-[13px] font-semibold leading-relaxed text-slate-600">
                    A clean sign-in layer for verified EVADA accounts and secure workspace activation.
                  </p>
                </div>
              </div>

              <div className="relative mt-4 grid gap-2">
                {assuranceItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[8px] border border-cyan-100 bg-white/78 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A86E]" />
                    <span className="text-[12px] font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/74 px-3 py-2">
                <LockKeyhole className="h-3.5 w-3.5 text-[#0891B2]" />
                Email verified
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/74 px-3 py-2">
                <Sparkles className="h-3.5 w-3.5 text-[#16A86E]" />
                Password hardened
              </span>
            </div>
          </aside>
        </div>

        <div className="relative min-h-dvh w-full min-w-0 overflow-x-hidden bg-[#071010] px-5 pb-8 pt-24 sm:px-8 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:justify-center lg:px-8 lg:py-10 xl:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(46,206,130,0.16),transparent_28%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.10),transparent_28%)]"
          />
          <div className="relative z-10 flex w-full min-w-0 max-w-[540px] justify-center">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
