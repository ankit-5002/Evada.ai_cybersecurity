import { type PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  delayMs?: number;
  variant?: "up" | "scale" | "fade";
  once?: boolean;
}>;

export default function Reveal({ className, children }: RevealProps) {
  return <div className={className}>{children}</div>;
}
