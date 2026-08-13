"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Eye, EyeOff, Info, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { passwordRules } from "./passwordRules";

export type AuthNoticeKind = "success" | "error" | "info";

export type AuthToastNotice = {
  kind: AuthNoticeKind;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
  variant?: "light" | "dark";
  compact?: boolean;
  disabled?: boolean;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  icon,
  required = true,
  variant = "light",
  compact = false,
  disabled = false,
  error,
  onFocus,
  onBlur,
}: Readonly<TextInputProps>) {
  const id = useId();
  const errorId = `${id}-error`;
  const dark = variant === "dark";

  return (
    <label htmlFor={id} className={`grid ${compact ? "gap-1.5" : "gap-2"} text-[12px] font-black ${dark ? "text-white/82" : "text-slate-700"}`}>
      {label}
      <span className="relative block">
        {icon ? <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-[#75E7FF]/70" : "text-slate-400"}`}>{icon}</span> : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${compact ? "h-11" : "h-12"} w-full rounded-[8px] border px-3 text-base font-semibold outline-none transition sm:text-[14px] ${
            error
              ? dark
                ? "border-red-400/65 bg-red-500/[0.08] text-white placeholder:text-white/34 focus:border-red-300 focus:ring-4 focus:ring-red-400/12"
                : "border-red-300 bg-red-50/55 text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-200/45"
              : dark
              ? "border-white/10 bg-white/[0.07] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] placeholder:text-white/34 focus:border-[#2ECE82] focus:ring-4 focus:ring-[#2ECE82]/12"
              : "border-cyan-100 bg-white/88 text-slate-900 shadow-[0_10px_24px_rgba(14,165,233,0.07)] placeholder:text-slate-400 focus:border-[#16A86E] focus:ring-4 focus:ring-[#2ECE82]/15"
          } ${
            icon ? "pl-10" : ""
          } disabled:cursor-not-allowed disabled:opacity-55`}
        />
      </span>
      {error ? <span id={errorId} role="alert" className={`text-[11px] font-bold ${dark ? "text-red-200" : "text-red-600"}`}>{error}</span> : null}
    </label>
  );
}

type PasswordInputProps = Omit<TextInputProps, "type"> & {
  showMeter?: boolean;
};

export function PasswordInput(props: Readonly<PasswordInputProps>) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;
  const dark = props.variant === "dark";

  return (
    <label htmlFor={id} className={`grid ${props.compact ? "gap-1.5" : "gap-2"} text-[12px] font-black ${dark ? "text-white/82" : "text-slate-700"}`}>
      {props.label}
      <span className="relative block">
        {props.icon ? <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-[#75E7FF]/70" : "text-slate-400"}`}>{props.icon}</span> : null}
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          required={props.required ?? true}
          disabled={props.disabled}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? errorId : undefined}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          className={`${props.compact ? "h-11" : "h-12"} w-full rounded-[8px] border px-3 pr-10 text-base font-semibold outline-none transition sm:text-[14px] ${
            props.error
              ? dark
                ? "border-red-400/65 bg-red-500/[0.08] text-white placeholder:text-white/34 focus:border-red-300 focus:ring-4 focus:ring-red-400/12"
                : "border-red-300 bg-red-50/55 text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-200/45"
              : dark
              ? "border-white/10 bg-white/[0.07] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] placeholder:text-white/34 focus:border-[#2ECE82] focus:ring-4 focus:ring-[#2ECE82]/12"
              : "border-cyan-100 bg-white/88 text-slate-900 shadow-[0_10px_24px_rgba(14,165,233,0.07)] placeholder:text-slate-400 focus:border-[#16A86E] focus:ring-4 focus:ring-[#2ECE82]/15"
          } ${
            props.icon ? "pl-10" : ""
          } disabled:cursor-not-allowed disabled:opacity-55`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className={`absolute right-2 top-1/2 grid ${props.compact ? "h-7 w-7" : "h-8 w-8"} -translate-y-1/2 place-items-center rounded-[8px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82] ${
            dark ? "text-white/56 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-cyan-50 hover:text-slate-900"
          }`}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
      {props.error ? <span id={errorId} role="alert" className={`text-[11px] font-bold ${dark ? "text-red-200" : "text-red-600"}`}>{props.error}</span> : null}
      {props.showMeter ? <PasswordChecklist password={props.value} /> : null}
    </label>
  );
}

type PasswordChecklistProps = {
  password: string;
  confirmPassword?: string;
  variant?: "light" | "dark";
  hideWhenComplete?: boolean;
  showOnlyMissing?: boolean;
};

export function PasswordChecklist({ password, confirmPassword, variant = "light", hideWhenComplete = false, showOnlyMissing = false }: Readonly<PasswordChecklistProps>) {
  const showMatch = typeof confirmPassword === "string";
  const matches = showMatch && password.length > 0 && password === confirmPassword;
  const dark = variant === "dark";
  const missingRules = passwordRules.filter((rule) => !rule.test(password));

  if (showMatch && !matches) {
    missingRules.push({ id: "match", label: password.length > 0 ? "Passwords match" : "Confirm password", test: () => false });
  }

  if (showOnlyMissing) {
    if (hideWhenComplete && missingRules.length === 0) return null;

    return (
      <div className={`mt-0 rounded-[8px] border p-3 ${dark ? "border-white/10 bg-[#0B1018] shadow-[0_20px_46px_rgba(0,0,0,0.38)]" : "border-cyan-100 bg-cyan-50/95 shadow-[0_18px_38px_rgba(14,165,233,0.14)]"}`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className={`text-[12px] font-black ${dark ? "text-white" : "text-slate-800"}`}>Password needs</p>
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
              missingRules.length === 0 ? "bg-[#2ECE82]/14 text-[#B7FFD9]" : "bg-red-400/16 text-red-100"
            }`}
          >
            {missingRules.length === 0 ? "Ready" : "Weak"}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {missingRules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-2 text-[11px] font-bold">
              <span className={`h-2 w-2 rounded-full ${dark ? "bg-slate-500" : "bg-slate-400"}`} />
              <span className={dark ? "text-slate-300" : "text-slate-600"}>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-0 grid gap-1 rounded-[8px] border p-2 sm:grid-cols-3 ${dark ? "border-white/10 bg-white/[0.05]" : "border-cyan-100 bg-cyan-50/45"}`}>
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return <ChecklistItem key={rule.id} passed={passed} label={rule.label} variant={variant} />;
      })}
      {showMatch ? <ChecklistItem passed={matches} label="Passwords match" variant={variant} /> : null}
    </div>
  );
}

function ChecklistItem({ passed, label, variant = "light" }: Readonly<{ passed: boolean; label: string; variant?: "light" | "dark" }>) {
  const dark = variant === "dark";

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold">
      {passed ? <CheckCircle2 className="h-3.5 w-3.5 text-[#2ECE82]" /> : <XCircle className={`h-3.5 w-3.5 ${dark ? "text-white/22" : "text-slate-300"}`} />}
      <span className={passed ? (dark ? "text-white" : "text-slate-800") : dark ? "text-white/48" : "text-slate-500"}>{label}</span>
    </div>
  );
}

export function AuthToast({
  notice,
  onClose,
  autoDismissMs = 5600,
}: Readonly<{ notice: AuthToastNotice | null; onClose: () => void; autoDismissMs?: number }>) {
  useEffect(() => {
    if (!notice || autoDismissMs <= 0) return;

    const timer = window.setTimeout(onClose, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, notice, onClose]);

  if (!notice) return null;

  const styles = {
    success: {
      border: "border-[#2ECE82]/28",
      icon: "bg-[#2ECE82]/12 text-[#2ECE82] ring-[#2ECE82]/24",
      label: "text-[#04D9FF]",
    },
    error: {
      border: "border-red-400/26",
      icon: "bg-red-500/12 text-red-200 ring-red-400/24",
      label: "text-red-100",
    },
    info: {
      border: "border-[#04D9FF]/28",
      icon: "bg-[#04D9FF]/12 text-[#75E7FF] ring-[#04D9FF]/24",
      label: "text-[#04D9FF]",
    },
  }[notice.kind];

  const Icon = notice.kind === "success" ? CheckCircle2 : notice.kind === "error" ? AlertTriangle : Info;

  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      className={`fixed inset-x-3 top-3 z-[90] overflow-hidden rounded-[8px] border ${styles.border} bg-[#071010] p-4 text-left text-white shadow-[0_24px_70px_rgba(7,16,16,0.36)] sm:left-auto sm:right-4 sm:top-4 sm:w-[min(calc(100vw-2rem),420px)]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(4,217,255,0.18),transparent_38%),radial-gradient(circle_at_86%_22%,rgba(46,206,130,0.16),transparent_34%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(46,206,130,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(4,217,255,0.24)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ${styles.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-[12px] font-black uppercase tracking-[0.16em] ${styles.label}`}>{notice.title}</p>
          <p className="mt-1 text-[14px] font-bold leading-relaxed text-white/84">{notice.message}</p>
          {notice.actionHref ? (
            <a
              href={notice.actionHref}
              className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.08] px-3 text-[12px] font-black text-white transition hover:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
            >
              {notice.actionLabel || "Open link"}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-white/58 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ECE82]"
          aria-label="Dismiss message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function FormNotice({
  kind,
  message,
  variant = "light",
}: Readonly<{ kind: AuthNoticeKind; message: string; variant?: "light" | "dark" }>) {
  const lightStyles = {
    success: "border-emerald-100 bg-emerald-50 text-emerald-800",
    error: "border-red-100 bg-red-50 text-red-800",
    info: "border-cyan-100 bg-cyan-50 text-cyan-800",
  };
  const darkStyles = {
    success: "border-[#2ECE82]/24 bg-[#2ECE82]/10 text-[#B7FFD9]",
    error: "border-red-400/24 bg-red-500/10 text-red-100",
    info: "border-[#04D9FF]/24 bg-[#04D9FF]/10 text-[#9CF5FF]",
  };
  const styles = variant === "dark" ? darkStyles : lightStyles;

  return <p className={`rounded-[8px] border px-3 py-2 text-[13px] font-bold leading-relaxed break-words ${styles[kind]}`}>{message}</p>;
}
