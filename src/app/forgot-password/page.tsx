import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password - EVADA",
  description: "Recover EVADA account access.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Recover secure access."
      description="Request a reset link for your verified EVADA account and return with a new strong password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

