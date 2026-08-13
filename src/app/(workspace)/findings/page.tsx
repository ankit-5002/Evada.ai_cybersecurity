import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Findings - EVADA", description: "Review EVADA tenant security findings." };

export default function FindingsPage() {
  return <DashboardSuccess initialSection="findings" />;
}
