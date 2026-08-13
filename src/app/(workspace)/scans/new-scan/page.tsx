import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "New Scan - EVADA",
  description: "Create a new EVADA scan.",
};

export default function NewScanPage() {
  return <DashboardSuccess initialSection="scanner-engine" />;
}
