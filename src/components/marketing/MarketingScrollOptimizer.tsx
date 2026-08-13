"use client";

import { useEffect } from "react";

type LenisInstance = {
  raf: (time: number) => void;
  destroy: () => void;
};

const ROOT_SELECTOR = ".evada-marketing-scroll-optimized";
const SECTION_SELECTOR = ".evada-homepage-content section, .evada-homepage-content footer";
const SETTLE_DELAY_MS = 2300;
const SCROLL_DURATION = 0.42;
const WHEEL_MULTIPLIER = 1.45;

type MarketingScrollOptimizerProps = {
  scrollDuration?: number;
  scrollLerp?: number;
  settleDelayMs?: number;
  strictActiveSectionAnimations?: boolean;
  wheelMultiplier?: number;
};

function supportsFineSmoothScroll() {
  return (
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(hover: none)").matches
  );
}

export default function MarketingScrollOptimizer({
  scrollDuration = SCROLL_DURATION,
  scrollLerp,
  settleDelayMs = SETTLE_DELAY_MS,
  strictActiveSectionAnimations = false,
  wheelMultiplier = WHEEL_MULTIPLIER,
}: MarketingScrollOptimizerProps = {}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);

    if (!root) {
      return;
    }

    let readyFrame = 0;
    let scrollTimer = 0;
    let settleTimer = 0;
    let activeFrame = 0;
    let lenisFrame = 0;
    let lenis: LenisInstance | null = null;
    let cancelled = false;

    root.classList.toggle("is-marketing-strict-active", strictActiveSectionAnimations);

    const sections = Array.from(root.querySelectorAll<HTMLElement>(SECTION_SELECTOR));

    sections.forEach((section) => {
      section.dataset.marketingSection = "true";
    });

    const setActiveSection = () => {
      if (!sections.length) {
        return;
      }

      const viewportCenter = window.innerHeight * 0.5;
      let activeSection = sections[0];
      let activeDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.5;
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        const distance = isVisible ? Math.abs(sectionCenter - viewportCenter) : Number.POSITIVE_INFINITY;

        if (distance < activeDistance) {
          activeSection = section;
          activeDistance = distance;
        }
      });

      sections.forEach((section) => {
        section.classList.toggle("is-marketing-section-active", section === activeSection);
      });
    };

    const requestActiveSection = () => {
      if (activeFrame) {
        return;
      }

      activeFrame = window.requestAnimationFrame(() => {
        activeFrame = 0;
        setActiveSection();
      });
    };

    const armSettledState = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        setActiveSection();
        root.classList.add("is-marketing-settled");
      }, settleDelayMs);
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-marketing-section-near", entry.isIntersecting);
        });
      },
      {
        rootMargin: "900px 0px",
        threshold: 0.01,
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
    setActiveSection();
    armSettledState();

    const markScrolling = () => {
      root.classList.add("has-marketing-scrolled");
      root.classList.add("is-marketing-scrolling");
      root.classList.remove("is-marketing-settled");
      requestActiveSection();

      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        root.classList.remove("is-marketing-scrolling");
      }, 260);

      armSettledState();
    };

    window.addEventListener("scroll", markScrolling, { passive: true });
    window.addEventListener("wheel", markScrolling, { passive: true });
    window.addEventListener("resize", requestActiveSection);

    readyFrame = window.requestAnimationFrame(() => {
      readyFrame = window.requestAnimationFrame(() => {
        root.dataset.marketingReady = "true";
      });
    });

    const setupLenis = async () => {
      if (!supportsFineSmoothScroll()) {
        return;
      }

      const { default: Lenis } = await import("lenis");

      if (cancelled) {
        return;
      }

      lenis = new Lenis({
        ...(scrollLerp === undefined
          ? {
              duration: scrollDuration,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            }
          : { lerp: scrollLerp }),
        anchors: {
          offset: -82,
        },
        gestureOrientation: "vertical",
        overscroll: false,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier,
      }) as LenisInstance;

      const raf = (time: number) => {
        lenis?.raf(time);
        lenisFrame = window.requestAnimationFrame(raf);
      };

      lenisFrame = window.requestAnimationFrame(raf);
    };

    void setupLenis();

    return () => {
      cancelled = true;
      sectionObserver.disconnect();
      window.removeEventListener("scroll", markScrolling);
      window.removeEventListener("wheel", markScrolling);
      window.removeEventListener("resize", requestActiveSection);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(settleTimer);
      window.cancelAnimationFrame(readyFrame);
      window.cancelAnimationFrame(activeFrame);
      window.cancelAnimationFrame(lenisFrame);
      lenis?.destroy();
      root.classList.remove("is-marketing-scrolling");
      root.classList.remove("is-marketing-settled");
      root.classList.remove("is-marketing-strict-active");
      root.classList.remove("has-marketing-scrolled");
      root.dataset.marketingReady = "false";

      sections.forEach((section) => {
        section.classList.remove("is-marketing-section-near");
        section.classList.remove("is-marketing-section-active");
        delete section.dataset.marketingSection;
      });
    };
  }, [scrollDuration, scrollLerp, settleDelayMs, strictActiveSectionAnimations, wheelMultiplier]);

  return null;
}
