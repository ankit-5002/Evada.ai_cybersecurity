import type { Metadata } from "next";

import DashboardSuccess from "@/components/auth/DashboardSuccess";


export const metadata: Metadata = { title: "Finding - EVADA", description: "Review an EVADA tenant security Finding." };

export default function FindingDetailPage() {
  return <DashboardSuccess initialSection="findings" />;
}
