import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Notifications - EVADA", description: "Review EVADA tenant notifications." };

export default function NotificationsPage() {
  return <DashboardSuccess initialSection="notifications" />;
}
