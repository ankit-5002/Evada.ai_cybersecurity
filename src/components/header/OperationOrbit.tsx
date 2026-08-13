"use client";

import { Activity, CheckCircle2 } from "lucide-react";
import type { CSSProperties } from "react";

type OperationOrbitProps = {
  active: boolean;
  count?: number;
  progress?: number;
  size?: "button" | "compact" | "large";
};

export default function OperationOrbit({ active, count = 0, progress = 0, size = "button" }: OperationOrbitProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const style = { "--operation-progress": `${clampedProgress * 3.6}deg` } as CSSProperties;
  const Icon = active ? Activity : CheckCircle2;

  return (
    <span
      aria-hidden="true"
      data-active={active ? "true" : "false"}
      data-size={size}
      className="evada-operation-orbit"
      style={style}
    >
      <span className="evada-operation-orbit__halo" />
      <span className="evada-operation-orbit__progress" />
      <span className="evada-operation-orbit__zigzag" />
      <span className="evada-operation-orbit__rail" />
      <span className="evada-operation-orbit__core">
        <Icon />
        {active && size === "large" ? <strong>{count}</strong> : null}
      </span>
    </span>
  );
}
