"use client";

import { ArrowRight, Building2, Code2, KeyRound, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { type FocusEvent, type FormEvent, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { ApiError, getApiFieldErrors, login, resendVerification, signup } from "@/lib/auth-api";
import { setAuthSession } from "@/lib/auth-session";
import { AuthToast, PasswordChecklist, type AuthToastNotice, PasswordInput, TextInput } from "./AuthControls";
import { generateStrongPassword, isStrongPassword } from "./passwordRules";

type AuthMode = "login" | "signup";
type SignupPasswordMode = "unset" | "own" | "strong";
type PendingAuthAction = "login" | "signup" | "resend-verification" | null;
type LoginField = "email" | "password";
type SignupField = "full_name" | "workplace" | "email" | "password" | "confirm_password";
type LoginErrors = Partial<Record<LoginField, string>>;
type SignupErrors = Partial<Record<SignupField, string>>;
type AuthProvider = "Google" | "GitHub" | "SSO";

const subscribeToHydration = () => () => undefined;

function getLoginGateNotice(error: unknown): AuthToastNotice | null {
  if (!(error instanceof ApiError) || !error.code) return null;

  const messages: Record<string, AuthToastNotice> = {
    admin_approval_pending: {
      kind: "info",
      title: "Approval pending",
      message: "Your email is verified and your Enterprise access request is waiting for EVADA admin approval. No action is required right now.",
    },
    enterprise_plan_required: {
      kind: "info",
      title: "Plan assignment pending",
      message: "Your account is verified, but Enterprise access has not been assigned yet. EVADA admin review is still in progress.",
    },
    tenant_provisioning_pending: {
      kind: "info",
      title: "Workspace provisioning",
      message: "Your request is approved and EVADA is preparing your Enterprise workspace. Please try again shortly.",
    },
    tenant_provisioning_failed: {
      kind: "error",
      title: "Workspace review required",
      message: "Your workspace could not be prepared automatically. EVADA admin has been notified for review.",
    },
    admin_rejected: {
      kind: "error",
      title: "Access request not approved",
      message: "Your EVADA access request was not approved. Contact EVADA support if this needs review.",
    },
    account_inactive: {
      kind: "error",
      title: "Account unavailable",
      message: "This account is currently inactive. Contact EVADA support for assistance.",
    },
  };

  return messages[error.code] ?? null;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.52Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.49l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.78.5 3.82 1.49l2.87-2.87C16.95 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.51l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
  );
}

type ProviderAuthRowProps = {
  intent: AuthMode;
  onSelect: (provider: AuthProvider, intent: AuthMode) => void;
};

function ProviderAuthRow({ intent, onSelect }: Readonly<ProviderAuthRowProps>) {
  const providers = [
    { name: "Google" as const, icon: <GoogleIcon /> },
    { name: "GitHub" as const, icon: <Code2 className="h-4 w-4" /> },
    { name: "SSO" as const, icon: <KeyRound className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-2" aria-label={`${intent === "login" ? "Login" : "Signup"} providers`}>
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          onClick={() => onSelect(provider.name, intent)}
          title={`${provider.name} ${intent} is not configured yet`}
          className="group inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-[8px] border border-white/12 bg-white/[0.07] px-2 text-[11px] font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:border-[#2ECE82]/35 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] sm:gap-2 sm:text-[12px]"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-white/[0.08] text-white/82 transition group-hover:bg-[#2ECE82]/12 group-hover:text-[#B7FFD9]">
            {provider.icon}
          </span>
          <span className="truncate">{provider.name}</span>
          <LockKeyhole className="h-3 w-3 shrink-0 text-white/34" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

type LoginSignupCardProps = {
  initialMode?: AuthMode;
};

export default function LoginSignupCard({ initialMode = "login" }: Readonly<LoginSignupCardProps>) {
  const router = useLoadingRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [notice, setNotice] = useState<AuthToastNotice | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loginGateNotice, setLoginGateNotice] = useState<AuthToastNotice | null>(null);
  const [fullName, setFullName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [signupPasswordMode, setSignupPasswordMode] = useState<SignupPasswordMode>("unset");
  const [passwordAssistOpen, setPasswordAssistOpen] = useState(false);
  const [signupPasswordTouched, setSignupPasswordTouched] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAuthAction>(null);
  const loading = pendingAction !== null;
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  const signupReady = useMemo(
    () =>
      fullName.trim().length > 1 &&
      workplace.trim().length > 1 &&
      signupEmail.includes("@") &&
      isStrongPassword(signupPassword) &&
      signupPassword === confirmPassword,
    [confirmPassword, fullName, signupEmail, signupPassword, workplace]
  );
  const showSignupPasswordChoice = passwordAssistOpen && signupPasswordMode === "unset";
  const showSignupPasswordNeeds =
    passwordAssistOpen && signupPasswordMode === "own" && signupPasswordTouched && (!isStrongPassword(signupPassword) || signupPassword !== confirmPassword);
  const closeNotice = useCallback(() => setNotice(null), []);

  useEffect(() => setMode(initialMode), [initialMode]);

  useEffect(() => {
    const syncModeFromHistory = () => setMode(window.location.pathname === "/signup" ? "signup" : "login");
    window.addEventListener("popstate", syncModeFromHistory);
    return () => window.removeEventListener("popstate", syncModeFromHistory);
  }, []);

  useEffect(() => {
    if (initialMode !== "login") return;

    const pendingNotice = window.sessionStorage.getItem("evada.authNotice");
    const pendingEmail = window.sessionStorage.getItem("evada.loginEmail");

    if (pendingNotice) {
      try {
        setNotice(JSON.parse(pendingNotice) as AuthToastNotice);
      } catch {
        window.sessionStorage.removeItem("evada.authNotice");
      }
      window.sessionStorage.removeItem("evada.authNotice");
    }

    if (pendingEmail) {
      setLoginEmail(pendingEmail);
      window.sessionStorage.removeItem("evada.loginEmail");
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialMode !== "signup") return;
    const invitedEmail = new URLSearchParams(window.location.search).get("email");
    if (invitedEmail) setSignupEmail(invitedEmail);
  }, [initialMode]);

  const switchMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    setNotice(null);
    setUnverifiedEmail(null);
    setLoginGateNotice(null);
    setLoginErrors({});
    setSignupErrors({});
    if (nextMode === "login" && !loginEmail && signupEmail) setLoginEmail(signupEmail);
    if (nextMode === "signup" && !signupEmail && loginEmail) setSignupEmail(loginEmail);
    setMode(nextMode);
    window.history.pushState(null, "", nextMode === "login" ? "/login" : "/signup");
  };

  const openPasswordAssist = () => {
    setPasswordAssistOpen(true);
    setSignupPasswordTouched(true);
  };

  const closePasswordAssistWhenLeaving = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;
    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) return;
    setPasswordAssistOpen(false);
  };

  const chooseOwnPassword = () => {
    setSignupPasswordMode("own");
    setSignupPasswordTouched(true);
    setPasswordAssistOpen(true);
  };

  const useStrongPassword = () => {
    const suggestedPassword = generateStrongPassword();
    setSignupPasswordMode("strong");
    setSignupPasswordTouched(false);
    setSignupPassword(suggestedPassword);
    setConfirmPassword(suggestedPassword);
    setSignupErrors((current) => ({ ...current, password: undefined, confirm_password: undefined }));
    setPasswordAssistOpen(false);
    setNotice({
      kind: "info",
      title: "Strong password filled",
      message: "A strong password was added to both password fields.",
    });
  };

  const showProviderPendingNotice = (provider: AuthProvider, intent: AuthMode) => {
    setNotice({
      kind: "info",
      title: `${provider} ${intent} is not available yet`,
      message: `${provider} authentication is not configured. Use your EVADA email and password for now.`,
    });
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: LoginErrors = {};
    if (!loginEmail.includes("@")) validationErrors.email = "Enter a valid email address.";
    if (loginPassword.length < 1) validationErrors.password = "Enter your password.";
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      setNotice({
        kind: "error",
        title: "Login details needed",
        message: "Review the highlighted fields and try again.",
      });
      return;
    }

    setPendingAction("login");
    setLoginErrors({});
    setNotice(null);
    setUnverifiedEmail(null);
    setLoginGateNotice(null);

    try {
      const response = await login({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      setAuthSession(response.tokens, response.user, response.session);
      window.sessionStorage.setItem("evada.loginSuccess", "1");
      const returnTo = window.sessionStorage.getItem("evada.returnTo");
      window.sessionStorage.removeItem("evada.returnTo");
      router.push(returnTo?.startsWith("/") ? returnTo : "/dashboard");
    } catch (error) {
      const gateNotice = getLoginGateNotice(error);
      if (error instanceof ApiError && error.code === "email_not_verified") {
        setUnverifiedEmail(loginEmail.trim());
        setLoginErrors({ email: "Verify this email before logging in." });
      } else if (gateNotice) {
        setLoginGateNotice(gateNotice);
        setLoginPassword("");
      } else if (error instanceof ApiError && (error.code === "invalid_credentials" || error.message === "Invalid email or password.")) {
        setLoginErrors({ password: "Invalid email or password." });
        setLoginPassword("");
      } else {
        const apiErrors = getApiFieldErrors(error);
        setLoginErrors({ email: apiErrors.email, password: apiErrors.password });
      }
      setNotice(gateNotice ?? {
          kind: "error",
          title: error instanceof ApiError && error.code === "email_not_verified" ? "Email verification required" : "Login failed",
          message: error instanceof Error ? error.message : "Login failed. Please try again.",
        });
    } finally {
      setPendingAction(null);
    }
  };

  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: SignupErrors = {};
    if (fullName.trim().length <= 1) validationErrors.full_name = "Enter the member's full name.";
    if (workplace.trim().length <= 1) validationErrors.workplace = "Enter the company or team name.";
    if (!signupEmail.includes("@")) validationErrors.email = "Enter a valid email address.";
    if (!isStrongPassword(signupPassword)) validationErrors.password = "Use a stronger password, or choose Use strong password.";
    if (signupPassword !== confirmPassword) validationErrors.confirm_password = "Passwords do not match.";

    if (!signupReady || Object.keys(validationErrors).length > 0) {
      setSignupErrors(validationErrors);

      if (!isStrongPassword(signupPassword) || signupPassword !== confirmPassword) {
        setSignupPasswordMode("own");
        setSignupPasswordTouched(true);
        setPasswordAssistOpen(true);
      }

      setNotice({
        kind: "error",
        title: "Signup not ready",
        message: "Review the highlighted fields before creating the account.",
      });
      return;
    }

    setPendingAction("signup");
    setSignupErrors({});
    setNotice(null);

    try {
      const normalizedEmail = signupEmail.trim();
      await signup({
        full_name: fullName.trim(),
        workplace: workplace.trim(),
        email: normalizedEmail,
        password: signupPassword,
        confirm_password: confirmPassword,
      });
      const successNotice: AuthToastNotice = {
        kind: "success",
        title: "Account created",
        message: "Verification email sent. Verify the account before logging in.",
      };

      setLoginEmail(normalizedEmail);
      setLoginPassword("");
      setLoginErrors({});
      setUnverifiedEmail(normalizedEmail);
      setFullName("");
      setWorkplace("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setSignupPasswordMode("unset");
      setPasswordAssistOpen(false);
      setSignupPasswordTouched(false);
      setMode("login");
      window.history.replaceState(null, "", "/login");
      window.sessionStorage.removeItem("evada.authNotice");
      window.sessionStorage.removeItem("evada.loginEmail");
      setNotice(successNotice);
    } catch (error) {
      const apiErrors = getApiFieldErrors(error);
      setSignupErrors({
        full_name: apiErrors.full_name,
        workplace: apiErrors.workplace,
        email: apiErrors.email,
        password: apiErrors.password,
        confirm_password: apiErrors.confirm_password,
      });
      setNotice({
        kind: "error",
        title: "Signup failed",
        message: error instanceof Error ? error.message : "Signup failed. Please try again.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const resendVerificationEmail = async () => {
    if (!unverifiedEmail) return;

    setPendingAction("resend-verification");
    setNotice(null);

    try {
      await resendVerification(unverifiedEmail);
      setNotice({
        kind: "success",
        title: "Verification email sent",
        message: "Open the email verification link, then return here to log in.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        title: "Could not resend",
        message: error instanceof Error ? error.message : "Could not resend verification email.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const updateSignupPassword = (value: string) => {
    if (signupPasswordMode !== "own") setSignupPasswordMode("own");
    setPasswordAssistOpen(true);
    setSignupPasswordTouched(true);
    setSignupPassword(value);
    setSignupErrors((current) => ({ ...current, password: undefined }));
  };

  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        className="evada-dark-panel relative flex min-h-[420px] w-full max-w-[540px] overflow-hidden rounded-[8px] bg-transparent p-0 text-white sm:min-h-[560px] sm:p-5 lg:min-h-[620px] lg:p-7"
      >
        <div className="mx-auto flex w-full max-w-[432px] animate-pulse flex-col items-center pt-3">
          <div className="h-3 w-24 rounded-full bg-[#04D9FF]/18" />
          <div className="mt-3 h-8 w-48 rounded-[8px] bg-white/10" />
          <div className="mt-7 h-12 w-[min(100%,360px)] rounded-full bg-white/[0.07]" />
          <div className="mt-10 grid w-full gap-4">
            <div className="h-11 rounded-[8px] bg-white/[0.07]" />
            <div className="h-11 rounded-[8px] bg-white/[0.07]" />
            <div className="mt-4 h-11 rounded-full bg-[#2ECE82]/14" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthToast notice={notice} onClose={closeNotice} autoDismissMs={notice?.actionHref ? 9000 : 5600} />
      <div className="evada-dark-panel relative flex min-h-0 w-full min-w-0 max-w-[540px] overflow-hidden rounded-[8px] bg-transparent p-0 text-white sm:min-h-[560px] sm:p-5 lg:min-h-[620px] lg:p-7">
        <div className="relative z-10 flex flex-1 flex-col px-0.5 sm:px-1">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#04D9FF]">Secure access</p>
            <h2 className="mt-1 text-2xl font-black tracking-normal text-white sm:text-[1.9rem]">Log in or sign up</h2>
          </div>

          <div className="mx-auto mt-5 grid w-[min(100%,360px)] grid-cols-2 rounded-full border border-white/12 bg-white/[0.06] p-1 shadow-inner">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`relative h-10 overflow-hidden rounded-full text-[13px] font-black transition ${
                mode === "login" ? "bg-white text-[#04100C] shadow-[0_10px_24px_rgba(0,0,0,0.22)]" : "text-white/62 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <span className="relative">Log in</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`relative h-10 overflow-hidden rounded-full text-[13px] font-black transition ${
                mode === "signup" ? "bg-white text-[#04100C] shadow-[0_10px_24px_rgba(0,0,0,0.22)]" : "text-white/62 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <span className="relative">Sign up</span>
            </button>
          </div>

          <div className="mt-7 flex flex-1">
            {mode === "login" ? (
          <form onSubmit={submitLogin} className="mx-auto grid w-full min-w-0 max-w-[432px] content-start gap-4 lg:pt-6">
            {unverifiedEmail ? (
              <div role="status" className="flex items-start gap-3 rounded-[8px] border border-[#2ECE82]/22 bg-[#2ECE82]/10 p-3 text-left">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#2ECE82]/12 text-[#2ECE82] ring-1 ring-[#2ECE82]/22">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">Verification email sent</p>
                  <p className="mt-1 break-all text-[10px] font-semibold leading-relaxed text-white/58">{unverifiedEmail}</p>
                </div>
              </div>
            ) : null}
            {loginGateNotice ? (
              <div role={loginGateNotice.kind === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-[8px] border p-3 text-left ${loginGateNotice.kind === "error" ? "border-red-400/24 bg-red-500/10" : "border-[#04D9FF]/22 bg-[#04D9FF]/10"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] ring-1 ${loginGateNotice.kind === "error" ? "bg-red-500/12 text-red-200 ring-red-400/22" : "bg-[#04D9FF]/12 text-[#75E7FF] ring-[#04D9FF]/22"}`}>
                  <LockKeyhole className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white">{loginGateNotice.title}</p>
                  <p className="mt-1 text-[10px] font-semibold leading-relaxed text-white/62">{loginGateNotice.message}</p>
                </div>
              </div>
            ) : null}
            <TextInput
              label="Email"
              value={loginEmail}
              onChange={(value) => {
                setLoginEmail(value);
                setLoginErrors((current) => ({ ...current, email: undefined }));
              }}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              icon={<Mail className="h-4 w-4" />}
              variant="dark"
              compact
              error={loginErrors.email}
            />
            <PasswordInput
              label="Password"
              value={loginPassword}
              onChange={(value) => {
                setLoginPassword(value);
                setLoginErrors((current) => ({ ...current, password: undefined }));
              }}
              autoComplete="current-password"
              placeholder="Password"
              icon={<LockKeyhole className="h-4 w-4" />}
              variant="dark"
              compact
              error={loginErrors.password}
            />
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px] font-bold">
              <span className="text-white/52">Email verification required</span>
              <Link href="/forgot-password" className="shrink-0 text-[#04D9FF] transition hover:text-[#2ECE82]">
                Forgot password?
              </Link>
            </div>
            {unverifiedEmail ? (
              <button
                type="button"
                onClick={resendVerificationEmail}
                disabled={loading}
                className="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-[#04D9FF]/20 bg-[#04D9FF]/10 px-4 text-[12px] font-black text-[#9CF5FF] transition hover:bg-[#04D9FF]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingAction === "resend-verification" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {pendingAction === "resend-verification" ? "Sending verification email..." : "Resend verification email"}
              </button>
            ) : null}
            <div className="mx-auto mt-2 grid w-[min(100%,360px)] gap-3">
              <button type="submit" disabled={loading} className="evada-bracket-button min-h-11 w-full text-[13px]">
                {pendingAction === "login" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {pendingAction === "login" ? "Checking account..." : "Log in"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <ProviderAuthRow intent="login" onSelect={showProviderPendingNotice} />
            </div>
          </form>
            ) : (
          <form onSubmit={submitSignup} className="mx-auto grid w-full max-w-[432px] content-start gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="Full Name"
                value={fullName}
                onChange={(value) => {
                  setFullName(value);
                  setSignupErrors((current) => ({ ...current, full_name: undefined }));
                }}
                autoComplete="name"
                placeholder="Jane Doe"
                icon={<UserRound className="h-4 w-4" />}
                variant="dark"
                compact
                error={signupErrors.full_name}
              />
              <TextInput
                label="Workplace"
                value={workplace}
                onChange={(value) => {
                  setWorkplace(value);
                  setSignupErrors((current) => ({ ...current, workplace: undefined }));
                }}
                autoComplete="organization"
                placeholder="Company or team"
                icon={<Building2 className="h-4 w-4" />}
                variant="dark"
                compact
                error={signupErrors.workplace}
              />
            </div>
            <TextInput
              label="Email"
              value={signupEmail}
              onChange={(value) => {
                setSignupEmail(value);
                setSignupErrors((current) => ({ ...current, email: undefined }));
              }}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              icon={<Mail className="h-4 w-4" />}
              variant="dark"
              compact
              error={signupErrors.email}
            />
            <div className="relative grid gap-3" onBlur={closePasswordAssistWhenLeaving}>
              <div className="grid gap-3 sm:grid-cols-2">
              <PasswordInput
                label="Password"
                value={signupPassword}
                onChange={updateSignupPassword}
                autoComplete="new-password"
                placeholder="Create password"
                icon={<KeyRound className="h-4 w-4" />}
                variant="dark"
                compact
                onFocus={openPasswordAssist}
                error={signupErrors.password}
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(value) => {
                  setSignupPasswordTouched(true);
                  setConfirmPassword(value);
                  setSignupErrors((current) => ({ ...current, confirm_password: undefined }));
                }}
                autoComplete="new-password"
                placeholder="Confirm password"
                icon={<LockKeyhole className="h-4 w-4" />}
                variant="dark"
                compact
                onFocus={openPasswordAssist}
                error={signupErrors.confirm_password}
              />
              </div>
              {showSignupPasswordChoice || showSignupPasswordNeeds ? (
                <div className="absolute bottom-[calc(100%+0.55rem)] left-0 right-0 z-30">
                  <div className="relative">
                    {showSignupPasswordChoice ? (
                      <div className="rounded-[8px] border border-[#04D9FF]/18 bg-[#0B1018]/95 p-3 shadow-[0_20px_46px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[12px] font-black text-white">Choose password style</p>
                            <p className="mt-1 text-[11px] font-bold leading-relaxed text-white/52">Use your own password or let EVADA fill a strong one.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:w-[244px]">
                            <button
                              type="button"
                              onClick={chooseOwnPassword}
                              className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] px-3 text-[11px] font-black text-white transition hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                            >
                              My own
                            </button>
                            <button
                              type="button"
                              onClick={useStrongPassword}
                              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#2ECE82]/24 bg-[#2ECE82]/18 px-3 text-[11px] font-black text-[#B7FFD9] transition hover:bg-[#2ECE82]/24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
                            >
                              Strong
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <PasswordChecklist password={signupPassword} confirmPassword={confirmPassword} variant="dark" hideWhenComplete showOnlyMissing />
                    )}
                    <span className="absolute -bottom-1.5 left-10 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-[#0B1018]" />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mx-auto mt-1 grid w-[min(100%,360px)] gap-3">
              <button type="submit" disabled={loading} className="evada-bracket-button min-h-11 w-full text-[13px]">
                {pendingAction === "signup" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {pendingAction === "signup" ? "Creating account..." : "Sign up"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <ProviderAuthRow intent="signup" onSelect={showProviderPendingNotice} />
            </div>
          </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
