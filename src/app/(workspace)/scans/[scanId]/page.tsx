import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Scan Details - EVADA",
  description: "EVADA scanner execution lifecycle and stored evidence.",
};

export default function ScanDetailPage() {
  return <DashboardSuccess initialSection="scanner-engine" />;
}
