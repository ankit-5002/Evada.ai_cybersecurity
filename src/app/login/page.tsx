import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginSignupCard from "@/components/auth/LoginSignupCard";

export const metadata: Metadata = {
  title: "Login - EVADA",
  description: "Log in or sign up for EVADA secure access.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Account access"
      title="Secure access for EVADA."
      description="Sign in with a verified email, or create a new account with strong password protection and email verification."
    >
      <LoginSignupCard initialMode="login" />
    </AuthShell>
  );
}
