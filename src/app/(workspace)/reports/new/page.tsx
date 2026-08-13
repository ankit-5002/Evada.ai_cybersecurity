import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Generate VAPT Report - EVADA", description: "Create an immutable VAPT Report from tenant Findings." };

export default function NewReportPage() {
  return <DashboardSuccess initialSection="reports" />;
}
