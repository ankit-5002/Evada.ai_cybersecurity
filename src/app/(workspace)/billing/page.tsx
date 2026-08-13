import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Billing & Cost - EVADA",
  description: "EVADA billing and cost management dashboard.",
};

export default function BillingPage() {
  return <DashboardSuccess initialSection="billing-cost" />;
}
