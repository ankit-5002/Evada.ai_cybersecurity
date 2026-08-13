import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Asset Management - EVADA",
  description: "EVADA asset management workspace.",
};

export default function AssetsPage() {
  return <DashboardSuccess initialSection="asset-management" />;
}
