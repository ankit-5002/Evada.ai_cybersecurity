import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "VAPT Reports Guide - EVADA", description: "Learn the immutable EVADA VAPT reporting workflow." };

export default function ReportsGuidePage() {
  return <DashboardSuccess initialSection="reports" />;
}
