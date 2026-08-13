"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, KeyRound, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLoadingRouter } from "@/components/loading/PageLoadingProvider";
import { ApiError, getApiFieldErrors, resetPassword, validateResetToken } from "@/lib/auth-api";
import { AuthToast, type AuthToastNotice, PasswordChecklist, PasswordInput } from "./AuthControls";
import { isStrongPassword } from "./passwordRules";

type LinkStatus = "checking" | "valid" | "invalid" | "complete";

const expiredMessage = "This reset link is expired, already used, or invalid. Request a new password reset email.";

export default function ResetPasswordForm() {
  const router = useLoadingRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<AuthToastNotice | null>(null);
  const [loading, setLoading] = useState(false);
  const [linkStatus, setLinkStatus] = useState<LinkStatus>("checking");
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const ready = useMemo(() => isStrongPassword(password) && password === confirmPassword, [confirmPassword, password]);
  const closeNotice = useCallback(() => setNotice(null), []);
  const formDisabled = loading || linkStatus !== "valid" || redirecting;

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const nextUid = params.get("uid") || "";
    const nextToken = params.get("token") || "";

    setUid(nextUid);
    setToken(nextToken);

    if (!nextUid || !nextToken) {
      setLinkStatus("invalid");
      setNotice({
        kind: "error",
        title: "Reset link missing",
        message: "Open the reset link from your email, or request a new password reset email.",
      });
      return () => {
        active = false;
      };
    }

    validateResetToken(nextUid, nextToken)
      .then(() => {
        if (!active) return;
        setLinkStatus("valid");
      })
      .catch(() => {
        if (!active) return;
        setLinkStatus("invalid");
        setNotice({
          kind: "error",
          title: "Reset link expired",
          message: expiredMessage,
          actionHref: "/forgot-password",
          actionLabel: "Request new link",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!redirecting) return;

    const timer = window.setTimeout(() => router.replace("/login"), 2600);
    return () => window.clearTimeout(timer);
  }, [redirecting, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (linkStatus === "checking") {
      setNotice({
        kind: "info",
        title: "Checking reset link",
        message: "Hold on while EVADA verifies this reset link.",
      });
      return;
    }

    if (linkStatus === "invalid") {
      setNotice({
        kind: "error",
        title: "Reset link expired",
        message: expiredMessage,
        actionHref: "/forgot-password",
        actionLabel: "Request new link",
      });
      return;
    }

    if (!ready) {
      setPasswordError(!isStrongPassword(password) ? "Use a stronger password." : "");
      setConfirmPasswordError(password !== confirmPassword ? "Passwords do not match." : "");
      setNotice({
        kind: "error",
        title: "Password not ready",
        message: "Use 8+ characters with uppercase, lowercase, number, special character, and matching confirmation.",
      });
      return;
    }

    setLoading(true);
    setPasswordError("");
    setConfirmPasswordError("");
    setNotice(null);

    try {
      await resetPassword({
        uid,
        token,
        password,
        confirm_password: confirmPassword,
      });
      setPassword("");
      setConfirmPassword("");
      setLinkStatus("complete");
      setNotice({
        kind: "success",
        title: "Password updated",
        message: "Your new password is saved. Redirecting you to login in a moment.",
      });
      setRedirecting(true);
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      if (fieldErrors.password || fieldErrors.confirm_password) {
        setPasswordError(fieldErrors.password || "");
        setConfirmPasswordError(fieldErrors.confirm_password || "");
        setNotice({
          kind: "error",
          title: "Password not accepted",
          message: "Review the highlighted password fields and try again.",
        });
      } else if (error instanceof ApiError && ["network_error", "request_timeout"].includes(error.code || "")) {
        setNotice({
          kind: "error",
          title: "Could not save password",
          message: error.message,
        });
      } else {
        setLinkStatus("invalid");
        setNotice({
          kind: "error",
          title: "Reset link expired",
          message: expiredMessage,
          actionHref: "/forgot-password",
          actionLabel: "Request new link",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = (value: string) => {
    setPasswordTouched(true);
    setPassword(value);
    setPasswordError("");
  };

  return (
    <>
      <AuthToast notice={notice} onClose={closeNotice} autoDismissMs={notice?.actionHref ? 10000 : redirecting ? 2400 : 5600} />
      <div className="evada-dark-panel relative flex min-h-0 w-full max-w-[540px] overflow-hidden rounded-[8px] bg-transparent p-0 text-white sm:min-h-[560px] sm:p-5 lg:min-h-[620px] lg:p-7">
        <div className="relative z-10 flex flex-1 flex-col px-0.5 sm:px-1">
          <Link href="/login" className="inline-flex items-center gap-2 text-[13px] font-black text-[#75E7FF] transition hover:text-[#2ECE82]">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#04D9FF]">Secure reset</p>
            <h1 className="mt-2 text-2xl font-black tracking-normal text-white sm:text-[2.15rem]">Create a new password</h1>
            <p className="mt-3 text-[14px] font-semibold leading-relaxed text-white/68">
              Choose a new password that meets EVADA account security requirements.
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-start gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ${
                  linkStatus === "invalid"
                    ? "bg-red-500/12 text-red-200 ring-red-400/24"
                    : linkStatus === "complete"
                      ? "bg-[#2ECE82]/12 text-[#2ECE82] ring-[#2ECE82]/24"
                      : "bg-[#04D9FF]/12 text-[#75E7FF] ring-[#04D9FF]/24"
                }`}
              >
                {linkStatus === "invalid" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : linkStatus === "complete" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : linkStatus === "checking" ? (
                  <RotateCcw className="h-5 w-5 animate-spin" />
                ) : (
                  <KeyRound className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="text-[13px] font-black text-white">
                  {linkStatus === "invalid"
                    ? "Reset link cannot be used"
                    : linkStatus === "complete"
                      ? "Password saved"
                      : linkStatus === "checking"
                        ? "Checking reset link"
                        : "Reset link ready"}
                </p>
                <p className="mt-1 text-[12px] font-bold leading-relaxed text-white/58">
                  {linkStatus === "invalid"
                    ? expiredMessage
                    : linkStatus === "complete"
                      ? "Return to login with your new password."
                      : linkStatus === "checking"
                        ? "EVADA is confirming this email reset link."
                        : "Use a fresh password you have not used before."}
                </p>
              </div>
            </div>
          </div>

          {linkStatus === "invalid" ? (
            <div className="mx-auto mt-5 w-[min(100%,360px)]">
              <Link href="/forgot-password" className="evada-bracket-button min-h-11 w-full text-[13px]">
                Request new reset link
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-7 grid w-full max-w-[432px] gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={updatePassword}
                  autoComplete="new-password"
                  placeholder="New password"
                  icon={<KeyRound className="h-4 w-4" />}
                  variant="dark"
                  compact
                  required={linkStatus === "valid"}
                  disabled={formDisabled}
                  onFocus={() => setPasswordTouched(true)}
                  error={passwordError}
                />
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(value) => {
                    setPasswordTouched(true);
                    setConfirmPassword(value);
                    setConfirmPasswordError("");
                  }}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  icon={<LockKeyhole className="h-4 w-4" />}
                  variant="dark"
                  compact
                  required={linkStatus === "valid"}
                  disabled={formDisabled}
                  onFocus={() => setPasswordTouched(true)}
                  error={confirmPasswordError}
                />
              </div>
              {passwordTouched ? <PasswordChecklist password={password} confirmPassword={confirmPassword} variant="dark" hideWhenComplete showOnlyMissing /> : null}
              <div className="mx-auto mt-2 w-[min(100%,360px)]">
                <button type="submit" disabled={formDisabled} className="evada-bracket-button min-h-11 w-full text-[13px]">
                  {loading || redirecting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {redirecting ? "Redirecting to login..." : loading ? "Saving password..." : "Save new password"}
                  {!loading && !redirecting ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
