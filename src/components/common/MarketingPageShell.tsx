import { ReactNode } from "react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";

type MarketingPageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function MarketingPageShell({ activePath, children }: Readonly<MarketingPageShellProps>) {
  return (
    <main className="evada-homepage min-h-screen overflow-x-clip bg-[#f7faf9] text-slate-950" data-active-path={activePath}>
      <div className="evada-homepage-content">
        <MarketingNav />
        <section className="relative border-b border-slate-200 bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,118,110,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative mx-auto w-full max-w-[1180px]">{children}</div>
        </section>
        <FooterSection showCta={false} />
      </div>
    </main>
  );
}
