import Image from "next/image";

type EvadaPageLoaderProps = {
  complete?: boolean;
  label?: string;
};

const EVADA_LETTERS = ["E", "V", "A", "D", "A"];

export function EvadaPageLoader({ complete = false, label = "Loading EVADA" }: Readonly<EvadaPageLoaderProps>) {
  return (
    <div
      className="evada-page-loader-canvas fixed inset-0 z-[9999] overflow-hidden bg-[#06100f]"
      role="status"
      aria-live="polite"
      aria-busy={!complete}
      data-evada-page-loader
      data-loader-complete={complete ? "true" : "false"}
    >
      <span className="evada-page-loader-corner evada-page-loader-corner-tl" aria-hidden="true" />
      <span className="evada-page-loader-corner evada-page-loader-corner-tr" aria-hidden="true" />
      <span className="evada-page-loader-corner evada-page-loader-corner-bl" aria-hidden="true" />
      <span className="evada-page-loader-corner evada-page-loader-corner-br" aria-hidden="true" />

      <div className="absolute left-1/2 top-1/2 flex w-[min(340px,82vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className={`evada-page-loader-orbit ${complete ? "evada-page-loader-orbit-complete" : ""}`} aria-hidden="true">
          <span className="evada-page-loader-ring evada-page-loader-ring-a" />
          <span className="evada-page-loader-ring evada-page-loader-ring-b" />
          <span className="evada-page-loader-halo" />
          <Image
            src="/logos/title.png"
            alt=""
            width={96}
            height={96}
            priority
            className="evada-page-loader-mark"
          />
        </div>

        <div className={`evada-page-loader-wordmark ${complete ? "evada-page-loader-wordmark-complete" : ""}`} aria-label="EVADA">
          {EVADA_LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="evada-page-loader-letter"
              data-letter={letter}
              aria-hidden="true"
              style={{ animationDelay: `${360 + index * 320}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <span className="mt-0.5 text-[8px] font-bold uppercase text-[#8ba19b]">
          Enterprise security control plane
        </span>

        <div className="mt-7 w-[min(300px,76vw)]">
          <div className="h-[2px] overflow-visible bg-white/15">
          <div
            className={`relative h-full bg-[#2ece82] ${complete ? "w-full transition-[width] duration-200 ease-out" : "evada-page-loader-progress"}`}
          >
            <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#20d6e4] shadow-[0_0_12px_rgba(32,214,228,0.9)]" />
          </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-[9px] font-extrabold uppercase text-[#2ece82]">
            <span>{complete ? "Workspace ready" : "Resolving workspace"}</span>
            {complete ? (
              <span className="text-white">100%</span>
            ) : (
              <span className="relative h-3 min-w-9 text-right text-[#8ba19b]" aria-hidden="true">
                <span className="evada-page-loader-percent evada-page-loader-percent-18">18%</span>
                <span className="evada-page-loader-percent evada-page-loader-percent-43">43%</span>
                <span className="evada-page-loader-percent evada-page-loader-percent-72">72%</span>
                <span className="evada-page-loader-percent evada-page-loader-percent-88">88%</span>
              </span>
            )}
          </div>
          <div className="mt-7 flex justify-center gap-4" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`size-1 rounded-full bg-[#2ece82] ${complete ? "opacity-100" : "evada-page-loader-node"}`}
                style={{ animationDelay: `${index * 160}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">{complete ? "EVADA workspace ready" : label}</span>
    </div>
  );
}
