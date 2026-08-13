import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Asset Details - EVADA",
  description: "Review security scope, verification and scan readiness.",
};

export default function AssetDetailPage() {
  return <DashboardSuccess initialSection="asset-management" />;
}
