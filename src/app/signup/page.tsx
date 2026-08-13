import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginSignupCard from "@/components/auth/LoginSignupCard";

export const metadata: Metadata = {
  title: "Sign Up - EVADA",
  description: "Create a verified EVADA account with strong password protection.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Account access"
      title="Secure access for EVADA."
      description="Create a verified account with strong password protection, then use the email verification link to activate access."
    >
      <LoginSignupCard initialMode="signup" />
    </AuthShell>
  );
}
