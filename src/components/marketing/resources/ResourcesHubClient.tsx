"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Download, FileText, Play, Search, Sparkles, X } from "lucide-react";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import ResourcesHeroSection from "@/components/marketing/resources/ResourcesHeroSection";
import {
  documentationItems,
  featuredResources,
  learningPaths,
  libraryResources,
  mediaResources,
  popularTopics,
  resourceFilters,
  resourceTypeLabels,
} from "@/data/resources";
import type { AssetStatus, MediaResource, ResourceFilterId, ResourceItem, Tone } from "@/types/resources";

type ResourcesHubClientProps = {
  initialQuery: string;
  initialType: ResourceFilterId;
};

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0891B2]";

const toneClasses: Record<Tone, { badge: string; icon: string; panel: string; thumb: string }> = {
  cyan: { badge: "bg-cyan-50 text-cyan-700 ring-cyan-200", icon: "bg-cyan-50 text-cyan-700 ring-cyan-200", panel: "border-cyan-100 bg-cyan-50/55", thumb: "from-cyan-400/24 via-blue-500/16 to-white/5" },
  blue: { badge: "bg-blue-50 text-blue-700 ring-blue-200", icon: "bg-blue-50 text-blue-700 ring-blue-200", panel: "border-blue-100 bg-blue-50/55", thumb: "from-blue-500/24 via-cyan-400/14 to-white/5" },
  violet: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: "bg-emerald-50 text-emerald-700 ring-emerald-200", panel: "border-emerald-100 bg-emerald-50/55", thumb: "from-emerald-500/26 via-blue-500/16 to-white/5" },
  amber: { badge: "bg-amber-50 text-amber-700 ring-amber-200", icon: "bg-amber-50 text-amber-700 ring-amber-200", panel: "border-amber-100 bg-amber-50/50", thumb: "from-amber-400/24 via-blue-500/12 to-white/5" },
  green: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: "bg-emerald-50 text-emerald-700 ring-emerald-200", panel: "border-emerald-100 bg-emerald-50/50", thumb: "from-emerald-400/22 via-cyan-500/14 to-white/5" },
  rose: { badge: "bg-rose-50 text-rose-700 ring-rose-200", icon: "bg-rose-50 text-rose-700 ring-rose-200", panel: "border-rose-100 bg-rose-50/50", thumb: "from-rose-400/20 via-emerald-500/14 to-white/5" },
};

function isResourceFilterId(value: string): value is ResourceFilterId {
  return resourceFilters.some((filter) => filter.id === value);
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-[760px] text-center">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0891B2]">{eyebrow}</p>
      <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.7rem,3.4vw,2.65rem)] font-black leading-[1.08] tracking-normal text-[#081735]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-medium leading-relaxed text-slate-600 sm:text-[16px]">{text}</p>
    </div>
  );
}

function ResourceAction({
  href,
  external,
  status = "available",
  cta,
  icon,
}: {
  href?: string;
  external?: boolean;
  status?: AssetStatus;
  cta: string;
  icon?: "arrow" | "download";
}) {
  const available = (status === "available" || status === "external") && href;
  const className = `${focusRing} inline-flex min-h-10 items-center justify-center gap-2 rounded-full text-[13px] font-black transition ${
    available ? "text-[#0891B2] hover:translate-x-0.5 hover:text-[#16A86E]" : "cursor-not-allowed text-slate-400"
  }`;
  const label = available ? cta : status === "draft" ? "Draft" : "Coming soon";

  if (!available) {
    return (
      <button type="button" disabled className={className} aria-disabled="true">
        {label}
      </button>
    );
  }

  return (
    <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
      {label}
      {icon === "download" ? <Download aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} /> : <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />}
    </Link>
  );
}

function ResourceCard({ item, featured = false }: { item: ResourceItem; featured?: boolean }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden p-5 motion-reduce:transform-none ${
        featured
          ? "evada-light-card min-h-[250px]"
          : "evada-light-card min-h-[236px]"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="evada-light-icon grid h-12 w-12 shrink-0 place-items-center rounded-[8px] transition group-hover:scale-105 motion-reduce:transform-none">
          <MarketingIcon name={item.icon} className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <span className="inline-flex rounded-[8px] bg-white/78 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0891B2] ring-1 ring-blue-100">
            {resourceTypeLabels[item.type]}
          </span>
          <h3 className="evada-light-title mt-3 text-[17px] font-black leading-snug tracking-normal">{item.title}</h3>
        </div>
      </div>
      <p className="evada-light-muted mt-4 flex-1 text-[14px] font-medium leading-relaxed">{item.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-blue-100/70 pt-4">
        <span className="inline-flex items-center gap-2 text-[12px] font-bold text-slate-500">
          {item.type === "whitepapers" ? <FileText aria-hidden="true" className="h-4 w-4" /> : item.type === "videos" || item.type === "webinars" ? <Play aria-hidden="true" className="h-4 w-4" /> : <Clock3 aria-hidden="true" className="h-4 w-4" />}
          {item.meta}
        </span>
        <ResourceAction href={item.href ?? item.downloadUrl} external={item.external} status={item.assetStatus} cta={item.cta} icon={item.type === "whitepapers" ? "download" : "arrow"} />
      </div>
    </article>
  );
}

function FeaturedResourcesSection() {
  return (
    <section id="featured-resources" className="evada-light-section relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="FEATURED RESOURCES" title="Featured Resources" text="Start with the guidance your team needs first." />
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} item={resource} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourceLibrarySection({
  query,
  activeType,
  setActiveType,
  filteredResources,
  clearFilters,
}: {
  query: string;
  activeType: ResourceFilterId;
  setActiveType: (type: ResourceFilterId) => void;
  filteredResources: ResourceItem[];
  clearFilters: () => void;
}) {
  const resultLabel = `${filteredResources.length} ${filteredResources.length === 1 ? "resource" : "resources"} found`;

  return (
    <section id="resource-library" className="evada-light-section relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="RESOURCE LIBRARY" title="Resource Library" text="Browse all resources across guides, documentation, videos, webinars and more." />
        <div className="evada-light-panel mx-auto mt-8 max-w-[1120px] rounded-[8px] p-2">
          <div className="flex gap-1.5 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-wrap lg:justify-center [&::-webkit-scrollbar]:hidden">
            {resourceFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={activeType === filter.id}
                onClick={() => setActiveType(filter.id)}
                className={`${focusRing} inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[8px] px-3.5 text-[12px] font-black transition ${
                  activeType === filter.id ? "bg-white text-[#0891B2] shadow-[0_10px_24px_rgba(14,165,233,0.10)] ring-1 ring-blue-200" : "text-slate-600 hover:bg-white/70 hover:text-[#0891B2]"
                }`}
              >
                <MarketingIcon name={filter.icon} className="h-4 w-4" strokeWidth={2.1} />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-[1120px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="evada-light-muted text-[13px] font-bold" aria-live="polite">
            {resultLabel}
          </p>
          {(query || activeType !== "all") && (
            <button type="button" onClick={clearFilters} className={`${focusRing} evada-light-card inline-flex w-fit items-center gap-2 rounded-[8px] px-4 py-2 text-[13px] font-black text-[#0891B2]`}>
              Clear filters
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>

        {filteredResources.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} item={resource} />
            ))}
          </div>
        ) : (
          <div className="evada-light-panel mt-8 rounded-[8px] p-8 text-center">
            <Search aria-hidden="true" className="mx-auto h-10 w-10 text-[#0891B2]" />
            <h3 className="evada-light-title mt-4 text-[22px] font-black">No resources found</h3>
            <p className="evada-light-muted mx-auto mt-2 max-w-[520px] text-[14px] font-medium leading-relaxed">Try a different keyword or clear the filter to browse the full EVADA resource library.</p>
            <button type="button" onClick={clearFilters} className={`${focusRing} evada-bracket-button mt-5 inline-flex min-h-11 items-center justify-center px-6 text-[13px]`}>
              Show all resources
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function DocumentationSection() {
  return (
    <section id="documentation" className="evada-resources-dark-band evada-protection-practice-section relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="EVADA DOCUMENTATION" title="EVADA Documentation" text="Step-by-step documentation to help you set up, use and get value from EVADA." />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {documentationItems.map((item) => (
            <article key={item.title} className="evada-light-card group flex min-h-[190px] flex-col p-5 text-center motion-reduce:transform-none">
              <span className="evada-light-icon mx-auto grid h-12 w-12 place-items-center rounded-[8px]">
                <MarketingIcon name={item.icon} className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h3 className="evada-light-title mt-4 text-[14px] font-black leading-snug">{item.title}</h3>
              <p className="evada-light-muted mt-2 flex-1 text-[12px] font-medium leading-relaxed">{item.description}</p>
              <ResourceAction href={item.href} status={item.assetStatus} cta="View docs" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FallbackThumbnail({ media }: { media: MediaResource }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[8px] bg-[#071633] bg-[radial-gradient(circle_at_28%_22%,rgba(44,207,239,0.22),transparent_32%),radial-gradient(circle_at_76%_26%,rgba(46,206,130,0.20),transparent_34%)]">
      <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${toneClasses[media.tone].thumb}`} />
      <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div aria-hidden="true" className="absolute left-4 top-4 grid w-[44%] gap-2">
        <span className="h-2 rounded-full bg-white/28" />
        <span className="h-2 w-2/3 rounded-full bg-cyan-200/36" />
      </div>
      <div aria-hidden="true" className="absolute right-4 top-4 grid w-[28%] gap-2">
        <span className="h-8 rounded-[8px] bg-white/10 ring-1 ring-white/10" />
        <span className="h-8 rounded-[8px] bg-white/10 ring-1 ring-white/10" />
      </div>
      <div aria-hidden="true" className="absolute bottom-4 left-4 grid w-[45%] grid-cols-3 gap-2">
        <span className="h-8 rounded-[8px] bg-white/12" />
        <span className="h-8 rounded-[8px] bg-white/12" />
        <span className="h-8 rounded-[8px] bg-white/12" />
      </div>
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-[#0891B2] shadow-[0_18px_44px_rgba(0,0,0,0.22)]">
        <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" strokeWidth={1.8} />
      </span>
      <span className="absolute right-3 bottom-3 rounded-[8px] bg-slate-950/82 px-2.5 py-1 text-[11px] font-black text-white">{media.duration}</span>
    </div>
  );
}

function MediaSection() {
  return (
    <section id="videos-webinars" className="evada-light-section relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="WATCH AND LEARN" title="Videos & Webinars" text="Watch practical sessions that help your team understand EVADA and make better security decisions." />
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mediaResources.map((media) => (
            <article key={media.title} className="evada-light-card group overflow-hidden p-4 motion-reduce:transform-none">
              <FallbackThumbnail media={media} />
              <div className="pt-4">
                <span className={`inline-flex rounded-[8px] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ring-1 ${toneClasses[media.tone].badge}`}>{media.type}</span>
                <h3 className="evada-light-title mt-3 text-[17px] font-black leading-snug">{media.title}</h3>
                <p className="evada-light-muted mt-2 text-[13px] font-medium leading-relaxed">{media.description}</p>
                <div className="mt-4">
                  <ResourceAction href={media.href ?? media.videoUrl} status={media.assetStatus} cta={media.cta} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPathsSection() {
  return (
    <section className="evada-light-section relative overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="CHOOSE YOUR STARTING POINT" title="Choose Your Starting Point" text="Follow a curated path based on your goals and current security process." />
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {learningPaths.map((path) => (
            <article key={path.title} className="evada-light-card flex min-h-[330px] flex-col p-5">
              <span className={`grid h-12 w-12 place-items-center rounded-[8px] ring-1 ${toneClasses[path.tone].icon}`}>
                <MarketingIcon name={path.icon} className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h3 className="evada-light-title mt-4 text-[18px] font-black">{path.title}</h3>
              <p className="evada-light-muted mt-2 text-[13px] font-medium leading-relaxed">{path.description}</p>
              <ul className="mt-5 grid gap-2.5">
                {path.resources.map((resource) => (
                  <li key={resource} className="evada-light-muted flex items-start gap-2 text-[12.5px] font-bold leading-relaxed">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#0891B2]" strokeWidth={2.2} />
                    {resource}
                  </li>
                ))}
              </ul>
              <Link href={path.href ?? "/resources"} className={`${focusRing} evada-bracket-button mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-[13px]`}>
                Start path
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularTopicsSection() {
  return (
    <section id="popular-topics" className="evada-light-section relative scroll-mt-24 overflow-hidden px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          <div className="max-w-[720px]">
            <p className="evada-light-eyebrow text-[11px] font-black uppercase tracking-[0.2em]">POPULAR TOPICS</p>
            <h2 className="evada-light-title mt-3 text-[clamp(1.7rem,3.4vw,2.55rem)] font-black leading-[1.08]">Quick answers to practical security questions</h2>
            <p className="evada-light-muted mt-4 text-[15px] font-medium leading-relaxed">Explore the subjects growing teams ask about most.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {popularTopics.map((topic) => (
              <Link key={topic.title} href={topic.href} className={`${focusRing} evada-light-card group flex min-h-[106px] items-start gap-3 p-4 motion-reduce:transform-none`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ring-1 ${toneClasses[topic.tone].icon}`}>
                  <MarketingIcon name={topic.icon} className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <span className="min-w-0">
                  <span className="evada-light-title block text-[13px] font-black leading-snug">{topic.title}</span>
                  <span className="evada-light-muted mt-1 block text-[12px] font-medium leading-relaxed">{topic.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="ml-auto mt-1 h-4 w-4 shrink-0 text-[#0891B2] transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <aside className="evada-light-panel rounded-[8px] p-6 lg:mt-[172px] xl:mt-[184px]">
          <span className="evada-light-icon grid h-14 w-14 place-items-center rounded-[8px]">
            <Sparkles aria-hidden="true" className="h-7 w-7" strokeWidth={2} />
          </span>
          <h3 className="evada-light-title mt-5 text-[24px] font-black leading-tight">Need help finding the right resource?</h3>
          <p className="evada-light-muted mt-3 text-[14px] font-medium leading-relaxed">Our team can point you to the most useful guidance for your goals.</p>
          <div className="mt-6 grid gap-3">
            <Link href="/signup" className={`${focusRing} evada-bracket-button inline-flex min-h-12 items-center justify-center px-5 text-[13px]`}>Create account</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="evada-light-section relative overflow-hidden px-5 pb-12 pt-4 sm:px-8 lg:px-10">
      <div aria-hidden="true" className="evada-light-grid absolute inset-0" />
      <div className="evada-dark-panel relative isolate mx-auto max-w-[1360px] overflow-hidden rounded-[8px] border border-white/10 bg-[#071010] p-6 text-white shadow-[0_24px_70px_rgba(7,16,16,0.24)] ring-1 ring-[#2ECE82]/10 sm:p-8 lg:p-10">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(46,206,130,0.16),transparent_28%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative z-10 flex min-w-0 gap-5">
            <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-[18px] border border-white/12 bg-white/[0.06] text-[#2ECE82] shadow-[0_18px_38px_rgba(46,206,130,0.08)] sm:grid">
              <Search aria-hidden="true" className="h-8 w-8" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="!text-[clamp(1.65rem,3vw,2.35rem)] !font-extrabold !leading-tight !tracking-[-0.025em] text-white">Ready to turn security guidance into action?</h2>
              <p className="mt-3 max-w-[720px] text-[15px] font-medium leading-relaxed text-slate-300 sm:text-[16px]">See how EVADA helps your team understand what to fix first, keep humans in control and move from findings to evidence-backed decisions.</p>
            </div>
          </div>
          <div className="relative z-10 grid gap-5 sm:flex sm:items-center">
            <Link href="/login" className={`${focusRing} evada-bracket-button inline-flex min-h-12 items-center justify-center px-7 text-[13px] sm:min-w-[220px]`}>See EVADA in Action</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResourcesHubClient({ initialQuery, initialType }: ResourcesHubClientProps) {
  const pathname = usePathname();
  const libraryRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<ResourceFilterId>(isResourceFilterId(initialType) ? initialType : "all");

  useEffect(() => {
    libraryRef.current = document.getElementById("resource-library");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        params.set("q", trimmedQuery);
      } else {
        params.delete("q");
      }
      if (activeType !== "all") {
        params.set("type", activeType);
      } else {
        params.delete("type");
      }
      const nextPath = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      window.history.replaceState(null, "", nextPath);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [activeType, pathname, query]);

  const scrollToLibrary = () => {
    window.setTimeout(() => {
      libraryRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }, 40);
  };

  const filteredResources = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();
    return libraryResources.filter((resource) => {
      const matchesType = activeType === "all" || resource.type === activeType;
      const searchable = [resource.title, resource.description, resourceTypeLabels[resource.type], resource.meta, ...resource.keywords].join(" ").toLowerCase();
      return matchesType && (!normalisedQuery || searchable.includes(normalisedQuery));
    });
  }, [activeType, query]);

  const clearFilters = () => {
    setQuery("");
    setActiveType("all");
  };

  return (
    <>
      <ResourcesHeroSection
        query={query}
        setQuery={setQuery}
        activeType={activeType}
        setActiveType={setActiveType}
        scrollToLibrary={scrollToLibrary}
      />
      <FeaturedResourcesSection />
      <ResourceLibrarySection query={query} activeType={activeType} setActiveType={setActiveType} filteredResources={filteredResources} clearFilters={clearFilters} />
      <DocumentationSection />
      <MediaSection />
      <LearningPathsSection />
      <PopularTopicsSection />
      <FinalCtaSection />
    </>
  );
}
