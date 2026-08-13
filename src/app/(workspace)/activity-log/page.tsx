import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Activity Log - EVADA",
  description: "EVADA activity log.",
};

export default function ActivityLogPage() {
  return <DashboardSuccess initialSection="activity-log" />;
}
