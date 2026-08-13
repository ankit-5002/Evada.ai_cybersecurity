import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "VAPT Report - EVADA", description: "Review report generation and immutable evidence." };

export default function ReportDetailPage() {
  return <DashboardSuccess initialSection="reports" />;
}
