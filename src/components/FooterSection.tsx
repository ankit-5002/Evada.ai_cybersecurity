import Image from "next/image";
import Link from "next/link";
import { Code2, Heart, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import HomeLogoLink from "@/components/HomeLogoLink";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "/platform#how-it-works" },
      { label: "Security workflow", href: "/platform#security-workflow" },
      { label: "Platform modules", href: "/platform#modules" },
      { label: "Request access", href: "/platform#platform-access" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "AI Penetration Testing", href: "/solutions/ai-penetration-testing" },
      { label: "Application Security", href: "/solutions/application-security" },
      { label: "Threat Monitoring", href: "/solutions/threat-monitoring" },
      { label: "SIEM & Security Operations", href: "/solutions/siem-security-operations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Practical guides", href: "/resources#practical-guides" },
      { label: "Compliance explainers", href: "/resources#compliance-explainers" },
      { label: "Security validation", href: "/resources#security-validation" },
      { label: "Case studies", href: "/resources#case-studies" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/company#our-story" },
      { label: "Mission and vision", href: "/company#mission-vision" },
      { label: "Principles", href: "/company#principles" },
      { label: "Company facts", href: "/company#company-facts" },
    ],
  },
];

const footerContactItems = [
  { label: "info@evada.ai", href: "mailto:info@evada.ai", icon: Mail },
  { label: "020 3916 6414 / 07723 115384", href: "tel:02039166414", icon: Phone },
  {
    label: "124 City Road, London, EC1V 2NX",
    href: "https://www.google.com/maps/search/?api=1&query=124%20City%20Road%2C%20London%2C%20EC1V%202NX",
    icon: MapPin,
  },
];

type FooterSectionProps = {
  showCta?: boolean;
  ctaVariant?: "standard" | "platformAligned";
  trustBadgeVariant?: "standard" | "aligned";
  descriptionVariant?: "continuous" | "aiPowered";
};

function FooterCTA() {
  return (
    <section className="border-t border-white/10 bg-[#071018] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-6 rounded-[8px] border border-white/12 bg-white/[0.04] p-6 md:flex-row md:items-center md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] border border-[#2ECE82]/25 bg-[#2ECE82]/10 text-[#2ECE82]">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[clamp(1.35rem,2vw,1.9rem)] font-bold leading-tight">Ready to validate authorized scope?</h2>
            <p className="mt-2 max-w-[680px] text-sm leading-6 text-slate-400 sm:text-[15px]">Create a verified workspace and move from controlled scanning to reviewable evidence.</p>
          </div>
        </div>
        <Link href="/signup" className="rounded-[8px] bg-[#2ECE82] px-6 py-3 text-sm font-bold text-[#071018] transition hover:bg-[#45dc94]">
          See EVADA in action
        </Link>
      </div>
    </section>
  );
}

export default function FooterSection({ showCta = true }: FooterSectionProps) {
  return (
    <>
      {showCta ? <FooterCTA /> : null}
      <footer className="relative overflow-hidden border-t border-[#2ECE82]/20 bg-[#061411] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[-3.2rem] right-3 text-[clamp(7rem,18vw,17rem)] font-semibold leading-none text-white/[0.035]">EVADA<span className="text-[#2ECE82]/10">.ai</span></div>
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-6 pt-10 sm:px-8 sm:pb-7 lg:px-14 lg:pt-12 xl:px-16">
          <div className="grid gap-10 xl:grid-cols-[1.2fr_4fr] xl:gap-14">
            <div className="max-w-[310px]">
              <HomeLogoLink ariaLabel="EVADA home" className="inline-flex rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]">
                <Image src="/logos/logo.png" alt="EVADA" width={2890} height={631} className="h-auto w-[145px]" />
              </HomeLogoLink>
              <p className="mt-5 text-sm leading-6 text-slate-400">Tenant-isolated security validation for authorized Assets, controlled Web and TLS scans, normalized Findings and immutable reports.</p>
              <p className="mt-4 text-xs text-slate-500">Built by <a href="https://netforte.co.uk/" target="_blank" rel="noreferrer" className="font-semibold text-[#2ECE82] no-underline transition hover:opacity-85">Netforte Consulting</a>.</p>
              <div className="mt-6 flex gap-2">
                <a href="https://github.com/evadaai" target="_blank" rel="noreferrer" aria-label="EVADA on GitHub" title="GitHub" className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 text-slate-400 transition hover:border-[#2ECE82]/40 hover:text-[#2ECE82]">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="mailto:info@evada.ai" aria-label="Email EVADA" title="Email EVADA" className="grid h-9 w-9 place-items-center rounded-[8px] border border-white/10 text-slate-400 transition hover:border-[#2ECE82]/40 hover:text-[#2ECE82]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-7 gap-y-9 sm:grid-cols-3 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(220px,1.35fr)]">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-bold text-white">{group.title}</h3>
                  <ul className="mt-4 grid gap-3">
                    {group.links.map((link) => (
                      <li key={link.label}><Link href={link.href} className="text-[13px] font-medium text-slate-400 transition hover:text-[#2ECE82]">{link.label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-sm font-bold text-white">Contact</h3>
                <ul className="mt-4 grid gap-3">
                  {footerContactItems.map((item) => {
                    const Icon = item.icon;
                    const external = item.href.startsWith("http");
                    return (
                      <li key={item.label}>
                        <a href={item.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="flex items-start gap-2.5 text-[13px] font-medium leading-5 text-slate-400 transition hover:text-[#2ECE82]">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#04D9FF]" aria-hidden="true" /><span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-1 text-xs text-slate-500">
            <div className="grid justify-items-start gap-2">
              <p>&copy; 2026 EVADA by Netforte Consulting. All rights reserved.</p>
              <nav aria-label="Legal links" className="flex flex-nowrap items-center justify-start gap-x-3 whitespace-nowrap pt-0.5 text-[11px] font-semibold sm:gap-x-5 sm:text-xs">
                <Link href="/privacy-policy" className="transition hover:text-[#2ECE82]">Privacy policy</Link>
                <Link href="/terms-of-service" className="transition hover:text-[#2ECE82]">Terms of service</Link>
                <Link href="/privacy-policy#cookies" className="transition hover:text-[#2ECE82]">Cookie policy</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
