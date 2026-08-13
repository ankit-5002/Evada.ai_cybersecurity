import type { Metadata } from "next";
import DashboardSuccess from "@/components/auth/DashboardSuccess";

export const metadata: Metadata = { title: "Team Access Guide - EVADA", description: "Learn EVADA workspace roles and account setup." };

export default function TeamGuidePage() {
  return <DashboardSuccess initialSection="team" />;
}
