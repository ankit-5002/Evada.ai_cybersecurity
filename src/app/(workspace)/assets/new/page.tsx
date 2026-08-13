import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Add Asset - EVADA",
  description: "Register and verify a security asset in EVADA.",
};

export default function AddAssetPage() {
  return <DashboardSuccess initialSection="asset-management" />;
}
