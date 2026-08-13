import {
  FileQuestion,
  LoaderCircle,
  SearchX,
  ServerCrash,
  ShieldX,
  TriangleAlert,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import type { EvadaErrorKind } from "@/lib/error-map";

const ICONS: Record<EvadaErrorKind, LucideIcon> = {
  "not-found": FileQuestion,
  page: TriangleAlert,
  global: ServerCrash,
  access: ShieldX,
  network: WifiOff,
  service: ServerCrash,
  resource: SearchX,
  slow: LoaderCircle,
};

type ErrorMotionGraphicProps = {
  code: string;
  kind: EvadaErrorKind;
};

export function ErrorMotionGraphic({ code, kind }: Readonly<ErrorMotionGraphicProps>) {
  const Icon = ICONS[kind];
  const characters = code.split("");

  return (
    <div className={`evada-error-motion evada-error-motion-${kind}`} aria-hidden="true">
      <div className="evada-error-grid" />
      <span className="evada-error-corner evada-error-corner-tl" />
      <span className="evada-error-corner evada-error-corner-tr" />
      <span className="evada-error-corner evada-error-corner-bl" />
      <span className="evada-error-corner evada-error-corner-br" />

      <div className="evada-error-trace evada-error-trace-left">
        <span />
      </div>
      <div className="evada-error-trace evada-error-trace-right">
        <span />
      </div>

      <div className="evada-error-orbit">
        <span className="evada-error-orbit-ring" />
        <span className="evada-error-orbit-dot" />
        <div className="evada-error-icon-core">
          <Icon className={kind === "slow" ? "animate-spin" : ""} strokeWidth={1.8} />
        </div>
      </div>

      <div className="evada-error-code" aria-label={code}>
        {characters.map((character, index) => (
          <span key={`${character}-${index}`} style={{ animationDelay: `${120 + index * 95}ms` }}>
            {character}
          </span>
        ))}
      </div>

      <div className="evada-error-signal">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
