import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Scanner Engine Guide - EVADA", description: "Learn the EVADA scanner lifecycle." };

export default function ScannerGuidePage() {
  return <DashboardSuccess initialSection="scanner-engine" />;
}
