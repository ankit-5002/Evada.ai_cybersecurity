import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Network Agent - EVADA",
  description: "EVADA Network Agent workspace.",
};

export default function NetworkAgentPage() {
  return <DashboardSuccess initialSection="noc-agent" />;
}
