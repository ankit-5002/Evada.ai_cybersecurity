import Link from "next/link";
import Image from "next/image";
import HomeLogoLink from "@/components/HomeLogoLink";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="evada-soft-card mt-12 rounded-3xl px-5 py-8 md:px-8 md:py-10">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <HomeLogoLink className="mb-3 inline-grid h-10 w-10 place-items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500" ariaLabel="Go to EVADA home">
            <Image
              src="/logos/title.png"
              alt="EVADA logo"
              width={40}
              height={40}
              className="h-8 w-8 object-contain"
            />
          </HomeLogoLink>
          <p className="text-sm leading-relaxed text-slate-600">
            EVADA delivers AI-supported penetration testing and governed security validation for
            enterprise teams that need measurable, board-ready risk outcomes.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/platform" className="hover:text-[var(--evada-primary)]">
                Attack Surface Discovery
              </Link>
            </li>
            <li>
              <Link href="/platform" prefetch={false} className="hover:text-[var(--evada-primary)]">
                AI-Supported Pentest Pipelines
              </Link>
            </li>
            <li>
              <Link href="/platform" prefetch={false} className="hover:text-[var(--evada-primary)]">
                Exploit Validation Sandbox
              </Link>
            </li>
            <li>
              <Link href="/platform" prefetch={false} className="hover:text-[var(--evada-primary)]">
                Executive Risk Reporting
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/company" prefetch={false} className="hover:text-[var(--evada-primary)]">
                About EVADA
              </Link>
            </li>
            <li>
              <Link href="/solutions" prefetch={false} className="hover:text-[var(--evada-primary)]">
                Security Solutions
              </Link>
            </li>
            <li>
              <Link href="/resources" prefetch={false} className="hover:text-[var(--evada-primary)]">
                Reports and Playbooks
              </Link>
            </li>
            <li>
              <Link href="/contact" prefetch={false} className="hover:text-[var(--evada-primary)]">
                Contact Team
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a href="mailto:info@evada.ai" className="hover:text-[var(--evada-primary)]">
                info@evada.ai
              </a>
            </li>
            <li>
              <a href="tel:02039166414" className="hover:text-[var(--evada-primary)]">
                02039166414 / 07723115384
              </a>
            </li>
            <li>124 City Road, London, EC1V 2NX</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/70 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>Copyright {year} EVADA Security. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" prefetch={false} className="hover:text-[var(--evada-primary)]">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" prefetch={false} className="hover:text-[var(--evada-primary)]">
            Terms of Service
          </Link>
          <Link href="/privacy-policy#cookies" prefetch={false} className="hover:text-[var(--evada-primary)]">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
