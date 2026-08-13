"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";
import { forgotPassword } from "@/lib/auth-api";
import { AuthToast, type AuthToastNotice, TextInput } from "./AuthControls";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<AuthToastNotice | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const closeNotice = useCallback(() => setNotice(null), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setEmailError("Enter a valid email address.");
      setNotice({
        kind: "error",
        title: "Email needed",
        message: "Enter the email address connected to your EVADA account.",
      });
      return;
    }

    setLoading(true);
    setEmailError("");
    setNotice(null);

    try {
      const response = await forgotPassword(email.trim());
      setNotice({
        kind: "success",
        title: "Check your email",
        message: response.message,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        title: "Reset email failed",
        message: error instanceof Error ? error.message : "Could not send reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthToast notice={notice} onClose={closeNotice} autoDismissMs={notice?.actionHref ? 9000 : 5600} />
      <div className="evada-dark-panel relative flex min-h-0 w-full max-w-[540px] overflow-hidden rounded-[8px] bg-transparent p-0 text-white sm:min-h-[560px] sm:p-5 lg:min-h-[620px] lg:p-7">
        <div className="relative z-10 flex flex-1 flex-col px-0.5 sm:px-1">
          <Link href="/login" className="inline-flex items-center gap-2 text-[13px] font-black text-[#75E7FF] transition hover:text-[#2ECE82]">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#04D9FF]">Password recovery</p>
            <h1 className="mt-2 text-2xl font-black tracking-normal text-white sm:text-[2.15rem]">Reset your password</h1>
            <p className="mt-3 text-[14px] font-semibold leading-relaxed text-white/68">
              Enter your account email and EVADA will send a secure reset link.
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-3 text-[12px] font-bold text-white/72">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2ECE82]/10 text-[#2ECE82] ring-1 ring-[#2ECE82]/18">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Private response keeps account existence protected
            </div>
            <div className="flex items-center gap-3 text-[12px] font-bold text-white/72">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#04D9FF]/10 text-[#04D9FF] ring-1 ring-[#04D9FF]/18">
                <Clock3 className="h-4 w-4" />
              </span>
              Reset links expire after 30 minutes
            </div>
          </div>
          <form onSubmit={submit} className="mx-auto mt-7 grid w-full max-w-[432px] gap-4">
            <TextInput
              label="Email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setEmailError("");
              }}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              icon={<Mail className="h-4 w-4" />}
              variant="dark"
              compact
              error={emailError}
            />
            <div className="mx-auto mt-2 w-[min(100%,360px)]">
              <button type="submit" disabled={loading} className="evada-bracket-button min-h-11 w-full text-[13px]">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Sending reset link..." : "Send reset link"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
