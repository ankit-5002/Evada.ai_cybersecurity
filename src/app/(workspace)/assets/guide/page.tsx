import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Asset Management Guide - EVADA", description: "Learn the authorized Asset workflow in EVADA." };

export default function AssetGuidePage() {
  return <DashboardSuccess initialSection="asset-management" />;
}
