import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import VerifyEmailStatus from "@/components/auth/VerifyEmailStatus";

export const metadata: Metadata = {
  title: "Verify Email - EVADA",
  description: "Verify your EVADA account email.",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="Email verification"
      title="Activate your account."
      description="Verify your email address before signing in to EVADA."
    >
      <VerifyEmailStatus />
    </AuthShell>
  );
}

