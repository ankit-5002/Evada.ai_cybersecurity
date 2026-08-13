"use client";

import Link from "next/link";
import type { MouseEvent, MouseEventHandler, ReactNode } from "react";

type HomeLogoLinkProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function HomeLogoLink({
  children,
  className,
  ariaLabel = "Go to EVADA home",
  onClick,
}: HomeLogoLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    if (currentPath === "/") {
      event.preventDefault();
      window.location.assign("/");
    }
  };

  return (
    <Link href="/" prefetch aria-label={ariaLabel} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
