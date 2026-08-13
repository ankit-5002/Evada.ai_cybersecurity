import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "VAPT Reports - EVADA",
  description: "EVADA VAPT reports dashboard.",
};

export default function ReportsPage() {
  return <DashboardSuccess initialSection="reports" />;
}
