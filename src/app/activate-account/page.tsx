import type { Metadata } from "next";
import { Suspense } from "react";

import EnterpriseClientActivation from "@/components/auth/EnterpriseClientActivation";

export const metadata: Metadata = {
  title: "Activate Enterprise Account - EVADA",
  description: "Verify and activate an administrator-created EVADA Enterprise account.",
};

export default function ActivateAccountPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#071010]" />}><EnterpriseClientActivation /></Suspense>;
}
