import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Findings Guide - EVADA", description: "Learn the EVADA Finding review and remediation workflow." };

export default function FindingsGuidePage() {
  return <DashboardSuccess initialSection="findings" />;
}
