import type { Metadata } from "next";
import { Suspense } from "react";
import TeamAccessSetupClient from "@/components/team/TeamAccessSetupClient";

export const metadata: Metadata = {
  title: "Team Access Setup - EVADA",
  description: "Securely activate an EVADA team member account.",
};

export default function TeamAccessSetupPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#071010]" />}><TeamAccessSetupClient /></Suspense>;
}
