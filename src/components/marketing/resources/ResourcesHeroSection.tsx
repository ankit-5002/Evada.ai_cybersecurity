"use client";

import Link from "next/link";
import type { CSSProperties, FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  FileText,
  Play,
  Search,
  X,
} from "lucide-react";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import {
  heroCategoryFilters,
  heroPreviewResources,
  heroValuePoints,
} from "@/data/resources";
import type {
  HeroPreviewResource,
  ResourceFilterId,
} from "@/types/resources";
import styles from "./ResourcesHero.module.css";

type ResourcesHeroSectionProps = {
  query: string;
  setQuery: (query: string) => void;
  activeType: ResourceFilterId;
  setActiveType: (type: ResourceFilterId) => void;
  scrollToLibrary: () => void;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0891B2]";

const previewCardPositions: Record<
  HeroPreviewResource["position"],
  string
> = {
  guide: "left-[5%] top-[5%]",
  video: "bottom-[9%] left-[3%]",
  documentation: "right-[4%] top-[18%]",
  webinar: "bottom-[6%] right-[8%]",
};

const previewCardWidths: Record<
  HeroPreviewResource["position"],
  string
> = {
  guide: "w-[262px]",
  video: "w-[246px]",
  documentation: "w-[264px]",
  webinar: "w-[262px]",
};

const previewTone: Record<
  HeroPreviewResource["position"],
  { badge: string; icon: string; accent: string }
> = {
  guide: {
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    icon: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    accent: "from-cyan-400 via-blue-500 to-emerald-500",
  },
  video: {
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: "bg-blue-50 text-blue-700 ring-blue-200",
    accent: "from-blue-500 via-cyan-500 to-cyan-400",
  },
  documentation: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    accent: "from-emerald-500 via-cyan-500 to-cyan-400",
  },
  webinar: {
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    icon: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    accent: "from-cyan-500 via-emerald-500 to-cyan-400",
  },
};

const fallbackActions: Record<
  HeroPreviewResource["position"],
  { href: string; label: string }
> = {
  guide: { href: "/resources?type=guides", label: "Explore guides" },
  video: { href: "/resources?type=videos", label: "View videos" },
  documentation: {
    href: "/resources?type=documentation",
    label: "View docs",
  },
  webinar: { href: "/resources?type=webinars", label: "View webinars" },
};

const particles = [
  {
    left: "7%",
    top: "20%",
    size: 4,
    delay: "-1.2s",
    duration: "9.8s",
    colour: "#22D3EE",
  },
  {
    left: "19%",
    top: "76%",
    size: 3,
    delay: "-4.6s",
    duration: "11.2s",
    colour: "#0891B2",
  },
  {
    left: "38%",
    top: "8%",
    size: 3,
    delay: "-2.8s",
    duration: "8.7s",
    colour: "#2ECE82",
  },
  {
    left: "52%",
    top: "85%",
    size: 4,
    delay: "-6.2s",
    duration: "12.1s",
    colour: "#22D3EE",
  },
  {
    left: "72%",
    top: "7%",
    size: 3,
    delay: "-3.4s",
    duration: "10.6s",
    colour: "#0891B2",
  },
  {
    left: "88%",
    top: "68%",
    size: 4,
    delay: "-7.1s",
    duration: "11.7s",
    colour: "#2ECE82",
  },
  {
    left: "94%",
    top: "28%",
    size: 3,
    delay: "-1.9s",
    duration: "9.4s",
    colour: "#22D3EE",
  },
  {
    left: "62%",
    top: "42%",
    size: 3,
    delay: "-5.2s",
    duration: "10.2s",
    colour: "#0891B2",
  },
] as const;

function HeroSearch({
  query,
  setQuery,
  onSubmit,
}: {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      role="search"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex min-h-[48px] w-full items-center gap-2 rounded-[8px] border border-blue-100/90 bg-white/95 px-3 shadow-[0_12px_30px_rgba(14,165,233,0.10)] transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100/70"
    >
      <label htmlFor="resource-hero-search" className="sr-only">
        Search EVADA resources
      </label>
      <Search
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 text-slate-400"
        strokeWidth={2}
      />
      <input
        id="resource-hero-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search resources..."
        className="min-h-[40px] min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400 sm:text-[14px]"
      />
      {query ? (
        <button
        type="button"
        aria-label="Clear resource search"
        onClick={() => setQuery("")}
        className={`${focusRing} grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900`}
      >
          <X aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
        </button>
      ) : null}
      <button
        type="submit"
        aria-label="Search resources"
        className={`${focusRing} grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[linear-gradient(135deg,#E6FFFA,#ECFEFF)] text-[#0891B2] ring-1 ring-blue-100 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(14,165,233,0.16)] motion-reduce:transform-none`}
      >
        <ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}

function PreviewArtwork({
  position,
}: {
  position: HeroPreviewResource["position"];
}) {
  if (position === "guide") {
    return (
      <div className="relative h-[78px] w-[62px] shrink-0 overflow-hidden rounded-[8px] border border-blue-100 bg-white p-2 shadow-[0_10px_24px_rgba(14,165,233,0.10)]">
        <span className="block h-2 w-6 rounded-full bg-rose-300" />
        <span className="mt-2 block h-1.5 w-full rounded-full bg-slate-200" />
        <span className="mt-1 block h-1.5 w-4/5 rounded-full bg-slate-200" />
        <span className="mt-1 block h-1.5 w-3/5 rounded-full bg-blue-200" />
        <span className="absolute inset-x-2 bottom-2 h-4 rounded-md bg-[linear-gradient(90deg,#E8F8FF,#F1EDFF)]" />
        <span className="absolute bottom-[11px] left-[11px] h-1.5 w-5 rounded-full bg-blue-400/60" />
      </div>
    );
  }

  if (position === "video") {
    return (
      <div className="relative grid h-[68px] w-[78px] shrink-0 place-items-center overflow-hidden rounded-[8px] bg-[#071633] shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(34,211,238,0.40),transparent_38%),radial-gradient(circle_at_82%_82%,rgba(46,206,130,0.44),transparent_44%)]" />
        <span className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:13px_13px]" />
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-[#0891B2] shadow-lg">
          <Play
            aria-hidden="true"
            className="ml-0.5 h-4 w-4 fill-current"
          />
        </span>
      </div>
    );
  }

  if (position === "documentation") {
    return (
      <div className="relative grid h-[66px] w-[66px] shrink-0 place-items-center rounded-[8px] bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
        <span className="absolute -right-1 -top-1 h-8 w-7 rotate-6 rounded-[6px] border border-emerald-100 bg-white shadow-sm" />
        <FileText
          aria-hidden="true"
          className="relative h-8 w-8"
          strokeWidth={1.8}
        />
      </div>
    );
  }

  return (
    <div className="relative grid h-[66px] w-[66px] shrink-0 place-items-center rounded-[8px] bg-blue-50 text-blue-600 ring-1 ring-blue-100">
      <CalendarDays
        aria-hidden="true"
        className="h-8 w-8"
        strokeWidth={1.8}
      />
      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-[8px] bg-emerald-600 text-white ring-2 ring-white">
        <Play
          aria-hidden="true"
          className="ml-0.5 h-2.5 w-2.5 fill-current"
        />
      </span>
    </div>
  );
}

function ResourceHubCore() {
  return (
    <div
      className={`${styles.coreFloat} relative grid h-[212px] w-[212px] place-items-center`}
    >
      <span
        aria-hidden="true"
        className={`${styles.coreGlow} absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24),rgba(14,165,233,0.14)_44%,rgba(46,206,130,0.10)_62%,transparent_76%)] blur-2xl`}
      />
      <span
        aria-hidden="true"
        className={`${styles.orbitSlow} absolute h-[212px] w-[212px] rounded-full border border-dashed border-blue-200/55`}
      />
      <span
        aria-hidden="true"
        className={`${styles.orbitReverse} absolute h-[164px] w-[164px] rounded-full border border-cyan-200/55`}
      />

      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[63%] h-[40px] w-[164px] -translate-x-1/2 rounded-full border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(219,234,254,0.70)_48%,rgba(14,165,233,0.18))] shadow-[0_18px_40px_rgba(14,165,233,0.14),inset_0_-10px_16px_rgba(14,165,233,0.08)] [transform:translateX(-50%)_rotateX(67deg)]"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[58%] h-[30px] w-[122px] -translate-x-1/2 rounded-full border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(236,253,245,0.84)_50%,rgba(46,206,130,0.18))] shadow-[0_14px_30px_rgba(46,206,130,0.10)] [transform:translateX(-50%)_rotateX(67deg)]"
      />

      <span className="relative grid h-[104px] w-[104px] place-items-center rounded-[24px] bg-[linear-gradient(135deg,#0891B2_0%,#06B6D4_52%,#2ECE82_100%)] text-white shadow-[0_24px_58px_rgba(14,165,233,0.25)] ring-4 ring-white/75">
        <span
          aria-hidden="true"
          className="absolute inset-[11px] rounded-[18px] border border-white/25"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_34%_20%,rgba(255,255,255,0.34),transparent_35%)]"
        />
        <span
          aria-hidden="true"
          className="absolute -left-3 top-1/2 h-[68px] w-[54px] -translate-y-1/2 rounded-[14px] border border-white/28 bg-white/10"
        />
        <span
          aria-hidden="true"
          className="absolute -right-3 top-1/2 h-[68px] w-[54px] -translate-y-1/2 rounded-[14px] border border-white/28 bg-white/10"
        />
        <BookOpen
          aria-hidden="true"
          className="relative h-[50px] w-[50px]"
          strokeWidth={1.72}
        />
        <span
          aria-hidden="true"
          className={`${styles.coreSpark} absolute -right-2 -top-2 h-5 w-5 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.95)] ring-4 ring-cyan-100/70`}
        />
      </span>

      <span className="absolute -bottom-8 min-w-[230px] text-center">
        <span className="block text-[15px] font-extrabold tracking-[-0.01em] text-[#081735]">
          Resource Hub
        </span>
        <span className="mt-1 block text-[11px] font-semibold text-slate-500">
          Guides for clear fix decisions
        </span>
      </span>
    </div>
  );
}

function HeroPreviewCard({
  card,
  index,
}: {
  card: HeroPreviewResource;
  index: number;
}) {
  const tone = previewTone[card.position];
  const fallback = fallbackActions[card.position];
  const available = Boolean(
    card.href &&
      (card.assetStatus === "available" || card.assetStatus === "external"),
  );
  const href = available ? card.href! : fallback.href;
  const actionLabel = available ? card.cta : fallback.label;

  return (
    <div className={`absolute z-40 ${previewCardPositions[card.position]}`}>
      <div
        className={styles.cardFloat}
        style={
          {
            "--delay": `${index * -0.56}s`,
            "--duration": `${7.2 + index * 0.46}s`,
          } as CSSProperties
        }
      >
        <article
          className={`evada-light-card group relative ${previewCardWidths[card.position]} overflow-hidden p-4 motion-reduce:transform-none`}
        >
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r ${tone.accent}`}
        />
        <div className="relative z-10 flex items-start gap-3.5">
          <PreviewArtwork position={card.position} />
          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] ring-1 ${tone.badge}`}
            >
              {card.badge}
            </span>
            <h3 className="mt-2.5 text-[14px] font-extrabold leading-[1.24] tracking-[-0.012em] text-[#081735]">
              {card.title}
            </h3>
          </div>
        </div>
        <p className="relative z-10 mt-3 text-[11px] font-medium leading-[1.58] text-slate-600">
          {card.description}
        </p>
        <div className="relative z-10 mt-3.5 flex items-center justify-between gap-3 border-t border-blue-50 pt-3">
          {card.meta ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold text-slate-500">
              <Clock3
                aria-hidden="true"
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
              {card.meta}
            </span>
          ) : (
            <span />
          )}
          <Link
            href={href}
            className={`${focusRing} inline-flex items-center gap-1 whitespace-nowrap rounded-full text-[10px] font-extrabold text-[#0891B2] transition hover:text-[#6D45E8]`}
          >
            {actionLabel}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
        </article>
      </div>
    </div>
  );
}

function MobilePreviewCard({ card }: { card: HeroPreviewResource }) {
  const tone = previewTone[card.position];
  const fallback = fallbackActions[card.position];
  const available = Boolean(
    card.href &&
      (card.assetStatus === "available" || card.assetStatus === "external"),
  );
  const href = available ? card.href! : fallback.href;
  const actionLabel = available ? card.cta : fallback.label;

  return (
    <article className="evada-light-card relative flex h-full flex-col overflow-hidden p-4">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${tone.accent}`}
      />
      <div className="flex items-start gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ring-1 ${tone.icon}`}
        >
          <MarketingIcon
            name={card.icon}
            className="h-5 w-5"
            strokeWidth={2}
          />
        </span>
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.13em] ring-1 ${tone.badge}`}
          >
            {card.badge}
          </span>
          <h3 className="mt-2 text-[13.5px] font-extrabold leading-snug text-[#081735]">
            {card.title}
          </h3>
        </div>
      </div>
      <p className="mt-3 flex-1 text-[12px] font-medium leading-relaxed text-slate-600">
        {card.description}
      </p>
      <Link
        href={href}
        className={`${focusRing} mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0891B2]`}
      >
        {actionLabel}
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

function ResourcesHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[790px] overflow-visible xl:justify-self-end">
      <span className="sr-only">
        Featured EVADA guides, videos, documentation and webinars connected to
        the EVADA Resource Hub.
      </span>
      <div className="relative hidden h-[540px] xl:block 2xl:h-[560px]">
        <div
          aria-hidden="true"
          className="absolute inset-[2%] rounded-[8px] bg-[radial-gradient(circle_at_50%_43%,rgba(14,165,233,0.10),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(46,206,130,0.11),transparent_31%),radial-gradient(circle_at_16%_74%,rgba(34,211,238,0.10),transparent_31%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[11%] top-[10%] h-[72%] w-[78%] rounded-[48%] border border-dashed border-blue-200/35"
        />
        <div
          aria-hidden="true"
          className="absolute left-[24%] top-[24%] h-[46%] w-[54%] rounded-[48%] border border-cyan-200/35"
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          viewBox="0 0 810 620"
          fill="none"
        >
          <defs>
            <linearGradient
              id="resources-hero-connector"
              x1="105"
              y1="80"
              x2="700"
              y2="540"
            >
              <stop stopColor="#22D3EE" />
              <stop offset="0.52" stopColor="#0891B2" />
              <stop offset="1" stopColor="#2ECE82" />
            </linearGradient>
            <filter
              id="resources-hero-node-glow"
              x="-180%"
              y="-180%"
              width="460%"
              height="460%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="405"
            cy="294"
            rx="286"
            ry="236"
            stroke="url(#resources-hero-connector)"
            strokeWidth="1.25"
            strokeDasharray="4 15"
            opacity="0.14"
            className={styles.connectorSoft}
          />
          <ellipse
            cx="405"
            cy="294"
            rx="216"
            ry="174"
            stroke="url(#resources-hero-connector)"
            strokeWidth="1.2"
            strokeDasharray="6 16"
            opacity="0.16"
            className={styles.connector}
          />

          <path
            d="M300 128 C338 154 368 198 393 244"
            stroke="url(#resources-hero-connector)"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
            opacity="0.34"
            className={styles.connector}
          />
          <path
            d="M578 194 C520 204 472 224 438 252"
            stroke="url(#resources-hero-connector)"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
            opacity="0.3"
            className={styles.connectorSoft}
          />
          <path
            d="M245 454 C304 426 354 390 390 348"
            stroke="url(#resources-hero-connector)"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
            opacity="0.3"
            className={styles.connectorSoft}
          />
          <path
            d="M570 470 C515 430 469 390 433 349"
            stroke="url(#resources-hero-connector)"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
            opacity="0.32"
            className={styles.connector}
          />

          {[
            [300, 128, "0s"],
            [393, 244, "-0.8s"],
            [578, 194, "-1.4s"],
            [438, 252, "-2s"],
            [245, 454, "-2.6s"],
            [390, 348, "-3.1s"],
            [570, 470, "-3.7s"],
            [433, 349, "-4.2s"],
          ].map(([cx, cy, delay]) => (
            <g
              key={`${cx}-${cy}`}
              className={styles.node}
              style={{ "--delay": delay as string } as CSSProperties}
            >
              <circle
                cx={Number(cx)}
                cy={Number(cy)}
                r="11"
                fill="#22D3EE"
                opacity="0.12"
              />
              <circle
                cx={Number(cx)}
                cy={Number(cy)}
                r="3.8"
                fill="#FFFFFF"
                stroke="#0891B2"
                strokeWidth="2"
                filter="url(#resources-hero-node-glow)"
              />
            </g>
          ))}
        </svg>

        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            aria-hidden="true"
            className={`${styles.particle} absolute z-10 rounded-full opacity-45`}
            style={
              {
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.colour,
                boxShadow: `0 0 16px ${particle.colour}`,
                "--delay": particle.delay,
                "--duration": particle.duration,
              } as CSSProperties
            }
          />
        ))}

        <div className="absolute left-1/2 top-[46%] z-30 -translate-x-1/2 -translate-y-1/2">
          <ResourceHubCore />
        </div>

        {heroPreviewResources.map((card, index) => (
          <HeroPreviewCard key={card.title} card={card} index={index} />
        ))}
      </div>

      <div className="xl:hidden">
        <div className="evada-light-panel relative overflow-hidden rounded-[8px] p-5 sm:p-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_48%_6%,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(46,206,130,0.10),transparent_34%)]"
          />
          <div className="relative mx-auto grid h-[270px] place-items-center">
            <div className="scale-[0.92] sm:scale-100">
              <ResourceHubCore />
            </div>
          </div>
          <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-2">
            {heroPreviewResources.map((card) => (
              <MobilePreviewCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesHeroSection({
  query,
  setQuery,
  activeType,
  setActiveType,
  scrollToLibrary,
}: ResourcesHeroSectionProps) {
  return (
    <section className="evada-home-hero evada-light-section relative isolate overflow-hidden px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="evada-light-grid evada-source-dot-grid absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 xl:min-h-[560px] xl:grid-cols-[minmax(0,0.43fr)_minmax(650px,0.57fr)] xl:gap-8 2xl:gap-12">
        <div className="min-w-0 xl:pb-2 xl:pr-3">
          <p className="evada-light-eyebrow inline-flex items-center gap-2 text-[10px] font-black uppercase sm:text-[11px]">
            <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
            Resources
          </p>

          <h1 className="evada-light-title mt-4 max-w-[620px] text-[clamp(2.55rem,5vw,4.55rem)] font-black leading-[1.015] tracking-[-0.045em]">
            Resources to help you know what to fix first
          </h1>

          <p className="evada-light-muted mt-5 max-w-[570px] text-[14px] font-medium leading-[1.72] sm:text-[15px] lg:text-[15.5px]">
            Practical guides, videos, documentation, webinars and security
            insights to help growing teams understand findings, prioritise
            action, keep humans in control and make better risk decisions.
          </p>

          <div className="mt-7 grid max-w-[640px] gap-3 lg:grid-cols-[minmax(220px,0.76fr)_minmax(0,1fr)] lg:items-center">
            <HeroSearch
              query={query}
              setQuery={setQuery}
              onSubmit={scrollToLibrary}
            />

            <div className="evada-light-panel min-w-0 overflow-hidden rounded-[8px] p-1.5">
              <div className={styles.filterMarqueeViewport}>
                <div className={styles.filterMarqueeTrack}>
                  {[0, 1].map((loopIndex) => (
                    <div
                      key={loopIndex}
                      className="flex shrink-0 gap-2 pr-2"
                      aria-hidden={loopIndex === 1}
                    >
                      {heroCategoryFilters.map((filter) => (
                        <button
                          key={`${loopIndex}-${filter.id}`}
                          type="button"
                          tabIndex={loopIndex === 1 ? -1 : undefined}
                          aria-pressed={activeType === filter.id}
                          onClick={() => {
                            setActiveType(filter.id);
                            scrollToLibrary();
                          }}
                          className={`${focusRing} inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[8px] px-3 text-[11px] font-bold transition sm:text-[12px] ${
                            activeType === filter.id
                              ? "bg-white text-[#0891B2] shadow-[0_10px_24px_rgba(14,165,233,0.10)] ring-1 ring-blue-200"
                              : "text-slate-700 hover:bg-white/75 hover:text-[#0891B2]"
                          }`}
                        >
                          <MarketingIcon
                            name={filter.icon}
                            className="h-3.5 w-3.5"
                            strokeWidth={2.1}
                          />
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4 xl:mt-9">
            {heroValuePoints.map((point) => (
              <div
                key={point.title}
                className="evada-light-card min-w-0 p-3"
              >
                <span className="evada-light-icon grid h-10 w-10 place-items-center rounded-[8px]">
                  <MarketingIcon
                    name={point.icon}
                    className="h-[19px] w-[19px]"
                    strokeWidth={2.1}
                  />
                </span>
                <p className="mt-2.5 text-[12px] font-extrabold leading-[1.22] tracking-normal text-[#081735] sm:text-[12.5px]">
                  {point.title}
                </p>
                <p className="mt-1 text-[10px] font-medium leading-[1.45] tracking-normal text-slate-600 sm:text-[10.5px]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ResourcesHeroVisual />
      </div>
    </section>
  );
}
