"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    image: "/logos/Dashbord5.png",
    alt: "EVADA dashboard preview showing before and after validated risk transformation",
  },
  {
    image: "/logos/Dashbord1.png",
    alt: "EVADA overview dashboard showing validation metrics, risk severity, and recent validations",
  },
  {
    image: "/logos/Dashbord2.png",
    alt: "EVADA validation queue dashboard showing findings, severity, filters, and approval workflow",
  },
  {
    image: "/logos/Dashbord3.png",
    alt: "EVADA evidence dashboard showing exploit proof, confidence score, and audit trail",
  },
  {
    image: "/logos/Dashbord4.png",
    alt: "EVADA governance dashboard showing approval workflows, policy controls, and audit coverage",
  },
];

const SLIDE_INTERVAL_MS = 3600;
const SLIDE_TRANSITION_MS = 620;

export default function HeroDashboardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const clearPreviousTimer = useRef<number | null>(null);

  useEffect(() => {
    const canAdvanceCarousel = () => {
      if (!document.querySelector(".evada-marketing-scroll-optimized.is-marketing-settled")) {
        return false;
      }

      const section = carouselRef.current?.closest<HTMLElement>("[data-marketing-section='true']");

      return !section || section.classList.contains("is-marketing-section-active");
    };

    const showNextSlide = () => {
      if (document.hidden || !canAdvanceCarousel()) {
        return;
      }

      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % slides.length;

        setPreviousIndex(currentIndex);

        if (clearPreviousTimer.current !== null) {
          window.clearTimeout(clearPreviousTimer.current);
        }

        clearPreviousTimer.current = window.setTimeout(() => {
          setPreviousIndex(null);
          clearPreviousTimer.current = null;
        }, SLIDE_TRANSITION_MS);

        return nextIndex;
      });
    };

    const intervalId = window.setInterval(showNextSlide, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);

      if (clearPreviousTimer.current !== null) {
        window.clearTimeout(clearPreviousTimer.current);
      }
    };
  }, []);

  const visibleIndexes =
    previousIndex !== null && previousIndex !== activeIndex ? [previousIndex, activeIndex] : [activeIndex];

  return (
    <div
      ref={carouselRef}
      className="hero-carousel-float relative mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[760px] lg:-mr-1 xl:-mr-3"
      role="img"
      aria-label="EVADA dashboard preview carousel"
    >
      <div aria-hidden="true" className="absolute -inset-8 rounded-[38px] bg-[radial-gradient(circle_at_50%_46%,rgba(34,211,238,0.18),transparent_62%),radial-gradient(circle_at_76%_18%,rgba(124,58,237,0.15),transparent_44%),radial-gradient(circle_at_28%_76%,rgba(37,99,235,0.10),transparent_52%)] blur-2xl" />

      <div className="hero-carousel-shell relative overflow-hidden rounded-[26px] border border-blue-100/80 bg-white/95 shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur">
        <div className="relative aspect-[1640/1124] w-full overflow-hidden">
          {visibleIndexes.map((index) => {
            const slide = slides[index];
            const isActive = index === activeIndex;

            return (
              <div
                key={`${slide.image}-${isActive ? "active" : "previous"}`}
                className={`hero-dashboard-slide absolute inset-0 grid place-items-center ${isActive ? "is-active" : "is-previous"}`}
                aria-hidden="true"
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  {...(index === 0 ? { priority: true } : { loading: "lazy" as const })}
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 57vw, (min-width: 640px) 640px, calc(100vw - 2.5rem)"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
