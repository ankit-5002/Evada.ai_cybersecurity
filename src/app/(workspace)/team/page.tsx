import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Team - EVADA",
  description: "Manage EVADA organization members, roles, and secure account setup.",
};

export default function TeamPage() {
  return <DashboardSuccess initialSection="team" />;
}
