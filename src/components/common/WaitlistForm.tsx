"use client";

import { FormEvent, useState } from "react";

type WaitlistData = {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  companySize: string;
  testingApproach: string;
  timeline: string;
  message: string;
};

const emptyWaitlist: WaitlistData = {
  fullName: "",
  workEmail: "",
  company: "",
  role: "",
  companySize: "",
  testingApproach: "",
  timeline: "",
  message: "",
};

const companySizeOptions = [
  "1-10 employees",
  "11-50 employees",
  "51-250 employees",
  "251-500 employees",
  "500+ employees",
];

const testingApproachOptions = [
  "We complete annual pentests",
  "We test occasionally",
  "We do not currently pentest",
  "Not sure yet",
];

const timelineOptions = [
  "As soon as early access opens",
  "Within 1-3 months",
  "Within 3-6 months",
  "Just researching",
];

type SubmitState = "idle" | "sending" | "sent";
type WaitlistField = "fullName" | "workEmail" | "company";

const fieldErrorClass = "border-red-500 focus:border-red-500 focus:ring-red-200";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildWaitlistMessage(waitlist: WaitlistData) {
  return [
    "Join Waitlist request",
    "",
    `Role: ${waitlist.role.trim() || "Not provided"}`,
    `Company size: ${waitlist.companySize || "Not provided"}`,
    `Current security testing approach: ${waitlist.testingApproach || "Not provided"}`,
    `Preferred timeline: ${waitlist.timeline || "Not provided"}`,
    "",
    "Additional context:",
    waitlist.message.trim() || "Not provided",
  ].join("\n");
}

export function WaitlistForm() {
  const [waitlist, setWaitlist] = useState<WaitlistData>(emptyWaitlist);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Partial<Record<WaitlistField, string>>>({});
  const [website, setWebsite] = useState<string>("");

  const validateField = (field: WaitlistField, value: string): string => {
    const trimmedValue = value.trim();

    if (field === "fullName" && !trimmedValue) {
      return "Full name is required.";
    }

    if (field === "company" && !trimmedValue) {
      return "Company name is required.";
    }

    if (field === "workEmail") {
      if (!trimmedValue) {
        return "Work email is required.";
      }

      if (!isValidEmail(trimmedValue)) {
        return "Please enter a valid work email address.";
      }
    }

    return "";
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<WaitlistField, string>> = {
      fullName: validateField("fullName", waitlist.fullName),
      workEmail: validateField("workEmail", waitlist.workEmail),
      company: validateField("company", waitlist.company),
    };

    setValidationErrors(nextErrors);
    return !nextErrors.fullName && !nextErrors.workEmail && !nextErrors.company;
  };

  const updateField = (field: keyof WaitlistData, value: string) => {
    setWaitlist((current) => ({ ...current, [field]: value }));

    if (field === "fullName" || field === "workEmail" || field === "company") {
      if (validationErrors[field]) {
        const nextError = validateField(field, value);
        setValidationErrors((current) => ({ ...current, [field]: nextError }));
      }
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setError("Please review the highlighted fields and try again.");
      return;
    }

    setError("");
    setSubmitState("sending");

    try {
      const response = await fetch("/contact-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: waitlist.fullName,
          workEmail: waitlist.workEmail,
          company: waitlist.company,
          phone: "",
          topic: "Join waitlist",
          message: buildWaitlistMessage(waitlist),
          website,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to join the waitlist at this time.");
      }

      setSubmitState("sent");
      setWaitlist(emptyWaitlist);
      setWebsite("");
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to join the waitlist at this time.";
      setError(message);
      setSubmitState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-full-name">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="waitlist-full-name"
            type="text"
            value={waitlist.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            aria-invalid={Boolean(validationErrors.fullName)}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition ${
              validationErrors.fullName ? fieldErrorClass : "border-slate-300 focus:border-indigo-400 focus:ring"
            }`}
            placeholder="Your full name"
          />
          {validationErrors.fullName ? (
            <p className="text-xs font-medium text-red-600">{validationErrors.fullName}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-work-email">
            Work email <span className="text-red-500">*</span>
          </label>
          <input
            id="waitlist-work-email"
            type="email"
            value={waitlist.workEmail}
            onChange={(event) => updateField("workEmail", event.target.value)}
            aria-invalid={Boolean(validationErrors.workEmail)}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition ${
              validationErrors.workEmail ? fieldErrorClass : "border-slate-300 focus:border-indigo-400 focus:ring"
            }`}
            placeholder="name@company.com"
          />
          {validationErrors.workEmail ? (
            <p className="text-xs font-medium text-red-600">{validationErrors.workEmail}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-company">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="waitlist-company"
            type="text"
            value={waitlist.company}
            onChange={(event) => updateField("company", event.target.value)}
            aria-invalid={Boolean(validationErrors.company)}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition ${
              validationErrors.company ? fieldErrorClass : "border-slate-300 focus:border-indigo-400 focus:ring"
            }`}
            placeholder="Organisation name"
          />
          {validationErrors.company ? (
            <p className="text-xs font-medium text-red-600">{validationErrors.company}</p>
          ) : null}
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-role">Role</label>
          <input
            id="waitlist-role"
            type="text"
            value={waitlist.role}
            onChange={(event) => updateField("role", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
            placeholder="Founder, IT Manager, CISO..."
          />
        </div>
      </div>

      <label htmlFor="waitlist-website" className="sr-only">
        Website
      </label>
      <input
        id="waitlist-website"
        type="text"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-company-size">Company size</label>
          <select
            id="waitlist-company-size"
            value={waitlist.companySize}
            onChange={(event) => updateField("companySize", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
          >
            <option value="">Select size</option>
            {companySizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-testing-approach">Current testing</label>
          <select
            id="waitlist-testing-approach"
            value={waitlist.testingApproach}
            onChange={(event) => updateField("testingApproach", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
          >
            <option value="">Select approach</option>
            {testingApproachOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="waitlist-timeline">Timeline</label>
          <select
            id="waitlist-timeline"
            value={waitlist.timeline}
            onChange={(event) => updateField("timeline", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 text-sm font-medium text-slate-700">
        <label htmlFor="waitlist-message">Anything specific you want EVADA to help with?</label>
        <textarea
          id="waitlist-message"
          value={waitlist.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
          placeholder="Tell us about your security testing priorities, budget cycle, or current challenges."
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {submitState === "sent" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          You are on the EVADA waitlist. Our team will be in touch with early access updates.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="evada-primary-btn" disabled={submitState === "sending"}>
          {submitState === "sending" ? "Joining waitlist..." : "Join Waitlist"}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        We will use your details to contact you about EVADA early access and launch updates.
      </p>
    </form>
  );
}
