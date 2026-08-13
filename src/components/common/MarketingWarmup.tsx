"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function MarketingWarmup() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return null;
}
