"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "@/lib/auth-api";
import { AuthToast, type AuthToastNotice, FormNotice } from "./AuthControls";

export default function VerifyEmailStatus() {
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Checking your verification link.");
  const [notice, setNotice] = useState<AuthToastNotice | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    let active = true;

    const runVerification = async () => {
      const params = new URLSearchParams(window.location.search);
      const uid = params.get("uid");
      const token = params.get("token");

      if (!uid || !token) {
        if (!active) return;
        const nextMessage = "Verification link is missing or invalid. Please request a new verification email.";
        setStatus("error");
        setMessage(nextMessage);
        setNotice({
          kind: "error",
          title: "Verification link invalid",
          message: nextMessage,
          actionHref: "/login",
          actionLabel: "Back to login",
        });
        return;
      }

      try {
        const response = await verifyEmail(uid, token);
        if (!active) return;
        setStatus("success");
        setMessage(response.message);
        setNotice({
          kind: "success",
          title: "Email verified",
          message: response.message,
          actionHref: "/login",
          actionLabel: "Return to login",
        });
      } catch {
        if (!active) return;
        const nextMessage = "This verification link is expired, already used, or invalid. Return to login and request a new verification email.";
        setStatus("error");
        setMessage(nextMessage);
        setNotice({
          kind: "error",
          title: "Verification link expired",
          message: nextMessage,
          actionHref: "/login",
          actionLabel: "Back to login",
        });
      }
    };

    void runVerification();

    return () => {
      active = false;
    };
  }, []);

  const verified = status === "success";
  const failed = status === "error";

  return (
    <>
      <AuthToast notice={notice} onClose={closeNotice} autoDismissMs={notice?.actionHref ? 9000 : 5600} />
      <div className="evada-dark-panel relative flex min-h-0 w-full max-w-[540px] overflow-hidden rounded-[8px] bg-transparent p-0 text-center text-white sm:min-h-[560px] sm:p-5 lg:min-h-[620px] lg:p-7">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-0.5 sm:px-1">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full border shadow-[0_18px_44px_rgba(46,206,130,0.16)] ${
              failed
                ? "border-red-400/24 bg-red-500/12 text-red-200"
                : verified
                  ? "border-[#2ECE82]/24 bg-[#2ECE82]/12 text-[#2ECE82]"
                  : "border-[#04D9FF]/24 bg-[#04D9FF]/12 text-[#75E7FF]"
            }`}
          >
            {verified ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : failed ? (
              <XCircle className="h-8 w-8" />
            ) : (
              <LoaderCircle className="h-8 w-8 animate-spin" />
            )}
          </span>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#04D9FF]">Email verification</p>
          <h1 className="mt-2 text-2xl font-black tracking-normal text-white sm:text-[2.15rem]">
            {verified ? "Approval pending" : failed ? "Verification failed" : "Verifying account"}
          </h1>
          <p className="mx-auto mt-3 max-w-[390px] text-[14px] font-semibold leading-relaxed text-white/68">
            {verified ? "Your email is confirmed. EVADA admin review is the next step." : "Your EVADA email verification status will be confirmed here."}
          </p>
          <div className="mt-5">
            <FormNotice kind={verified ? "success" : failed ? "error" : "info"} message={message} variant="dark" />
          </div>
          <div className="mx-auto mt-5 w-[min(100%,360px)]">
            <Link href="/login" className="evada-bracket-button min-h-11 w-full text-[13px]">
              Return to login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
