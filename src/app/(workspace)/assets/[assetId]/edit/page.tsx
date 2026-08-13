import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Edit Asset - EVADA",
  description: "Update an EVADA asset and its verified security scope.",
};

export default function EditAssetPage() {
  return <DashboardSuccess initialSection="asset-management" />;
}
