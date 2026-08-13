import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password - EVADA",
  description: "Create a new EVADA account password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password reset"
      title="Set a stronger password."
      description="Choose a new password that meets EVADA account security requirements."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}

