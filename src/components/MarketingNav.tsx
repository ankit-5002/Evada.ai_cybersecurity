"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import HomeLogoLink from "@/components/HomeLogoLink";
import { hasActiveAuthSession, subscribeAuthSession } from "@/lib/auth-session";

const navItems = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
  { label: "Contact us", href: "/contact" },
];

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useSyncExternalStore(subscribeAuthSession, hasActiveAuthSession, () => false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const actionHref = isAuthenticated ? "/dashboard" : "/signup";
  const actionLabel = isAuthenticated ? "Dashboard" : "See EVADA in action";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071018] text-[#071018]">
      <div className="mx-auto flex min-h-[78px] w-full max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <HomeLogoLink
          ariaLabel="EVADA home"
          className="inline-flex shrink-0 rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
        >
          <Image src="/logos/logo.png" alt="EVADA" width={2890} height={631} priority className="h-auto w-[138px] lg:w-[154px]" />
        </HomeLogoLink>

        <div className="hidden items-center gap-1 rounded-[15px] border border-white/70 bg-white/95 p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] lg:flex">
          <nav aria-label="Primary navigation" className="flex items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`px-3.5 py-2.5 text-[14px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
                  isActive(item.href) ? "text-[#087749]" : "text-[#111820] hover:text-[#087749]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span aria-hidden="true" className="h-8 w-px bg-slate-200" />
          <Link
            href={actionHref}
            prefetch={false}
            className="rounded-[11px] bg-[#071826] px-5 py-3 text-[14px] font-bold text-white transition hover:bg-[#0d2a2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
          >
            {actionLabel}
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/20 bg-white/10 text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div id="mobile-navigation" className={`overflow-hidden bg-[#071018] transition-[max-height,opacity] duration-300 lg:hidden ${mobileOpen ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0"}`}>
        <nav aria-label="Mobile navigation" className="mx-5 mb-5 grid gap-1 rounded-[8px] border border-white/15 bg-white p-2 sm:mx-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-[6px] px-4 py-3 text-sm font-semibold transition ${isActive(item.href) ? "bg-[#e9fff5] text-[#087749]" : "text-[#111820] hover:bg-slate-100"}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={actionHref}
            prefetch={false}
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-[6px] bg-[#071826] px-4 py-3 text-center text-sm font-bold text-white"
          >
            {actionLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
