import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Dashboard - EVADA",
  description: "EVADA login success dashboard.",
};

export default function DashboardPage() {
  return <DashboardSuccess />;
}
