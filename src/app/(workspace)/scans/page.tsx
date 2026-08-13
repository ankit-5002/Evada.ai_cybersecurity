import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Scans - EVADA",
  description: "EVADA scan management dashboard.",
};

export default function ScansPage() {
  return <DashboardSuccess initialSection="scanner-engine" />;
}
