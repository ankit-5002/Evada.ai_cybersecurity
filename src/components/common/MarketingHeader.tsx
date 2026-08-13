"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HomeLogoLink from "@/components/HomeLogoLink";

type HeaderLink = {
  label: string;
  href: string;
};

const headerLinks: HeaderLink[] = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
  { label: "Pricing", href: "/pricing" },
];

type MarketingHeaderProps = {
  activePath?: string;
};

function isActiveLink(activePath: string | undefined, href: string) {
  if (!activePath) {
    return false;
  }

  return activePath === href || activePath.startsWith(`${href}/`);
}

export function MarketingHeader({ activePath }: Readonly<MarketingHeaderProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const syncViewportMode = () => {
      const desktop = globalThis.matchMedia("(min-width: 1024px)").matches;
      setIsDesktop(desktop);
      if (desktop) {
        setMenuOpen(false);
      }
    };

    syncViewportMode();
    globalThis.addEventListener("resize", syncViewportMode);

    return () => {
      globalThis.removeEventListener("resize", syncViewportMode);
    };
  }, []);

  return (
    <header className="evada-soft-card fixed left-1/2 top-3 z-50 w-[calc(100%-2rem)] max-w-[1600px] -translate-x-1/2 rounded-2xl px-4 py-3 shadow-[0_12px_35px_-20px_rgba(15,23,42,0.45)] sm:w-[calc(100%-3rem)] sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <HomeLogoLink
            className="inline-grid h-10 w-10 place-items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
            ariaLabel="Go to EVADA home"
          >
            <Image
              src="/logos/title.png"
              alt="EVADA logo"
              width={40}
              height={40}
              className="h-8 w-8 object-contain"
              priority
            />
          </HomeLogoLink>
          <span className="hidden rounded-full border border-[var(--evada-soft)] bg-indigo-50 px-3 py-1 text-xs font-semibold text-[var(--evada-primary)] sm:inline-flex">
            Enterprise Security
          </span>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {headerLinks.map((item) => {
            const active = isActiveLink(activePath, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={active ? "text-[var(--evada-primary)]" : "hover:text-[var(--evada-primary)]"}
              >
                {item.label}
              </Link>
            );
          })}

        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isDesktop === false && (
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-700 transition hover:bg-white"
            >
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          )}

          <Link href="/login" prefetch className="evada-primary-btn px-4 py-2 hover:scale-[1.02]">
            See EVADA in Action
          </Link>
        </div>
      </div>

      {menuOpen && isDesktop === false && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur-sm lg:hidden">
          <div className="grid gap-1">
            {headerLinks.map((item) => {
              const active = isActiveLink(activePath, item.href);
              return (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  prefetch
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-indigo-50 text-[var(--evada-primary)]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
