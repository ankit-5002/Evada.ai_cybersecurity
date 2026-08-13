import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = {
  title: "Add Team Member - EVADA",
  description: "Create a secure EVADA team member account setup.",
};

export default function AddTeamMemberPage() {
  return <DashboardSuccess initialSection="team" />;
}
