"use client";

import { FormEvent, useState } from "react";

type InquiryData = {
  fullName: string;
  workEmail: string;
  company: string;
  phone: string;
  topic: string;
  message: string;
};

const emptyInquiry: InquiryData = {
  fullName: "",
  workEmail: "",
  company: "",
  phone: "",
  topic: "Request a demo",
  message: "",
};

const topicOptions = [
  "Request a demo",
  "Join waitlist",
  "Request pricing",
  "Platform overview",
  "AI-supported pentest",
  "Agents and administration",
  "Security and compliance",
  "Partnership enquiry",
  "Other",
];

type SubmitState = "idle" | "sending" | "sent";
type InquiryField = "fullName" | "workEmail" | "message";

const fieldErrorClass = "border-red-500 focus:border-red-500 focus:ring-red-200";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function EnquiryForm() {
  const [inquiry, setInquiry] = useState<InquiryData>(emptyInquiry);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Partial<Record<InquiryField, string>>>({});
  const [website, setWebsite] = useState<string>("");

  const validateField = (field: InquiryField, value: string): string => {
    const trimmedValue = value.trim();

    if (field === "fullName" && !trimmedValue) {
      return "Full name is required.";
    }

    if (field === "workEmail") {
      if (!trimmedValue) {
        return "Work email is required.";
      }

      if (!isValidEmail(trimmedValue)) {
        return "Please enter a valid work email address.";
      }
    }

    if (field === "message" && !trimmedValue) {
      return "Enquiry details are required.";
    }

    return "";
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<InquiryField, string>> = {
      fullName: validateField("fullName", inquiry.fullName),
      workEmail: validateField("workEmail", inquiry.workEmail),
      message: validateField("message", inquiry.message),
    };

    setValidationErrors(nextErrors);
    return !nextErrors.fullName && !nextErrors.workEmail && !nextErrors.message;
  };

  const updateField = (field: keyof InquiryData, value: string) => {
    setInquiry((current) => ({ ...current, [field]: value }));

    if (field === "fullName" || field === "workEmail" || field === "message") {
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
        body: JSON.stringify({ ...inquiry, website }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to send your enquiry at this time.");
      }

      setSubmitState("sent");
      setInquiry(emptyInquiry);
      setWebsite("");
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to send your enquiry at this time.";
      setError(message);
      setSubmitState("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 text-sm font-medium text-slate-700">
        <label htmlFor="enquiry-full-name">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="enquiry-full-name"
            type="text"
            value={inquiry.fullName}
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
          <label htmlFor="enquiry-work-email">
            Work email <span className="text-red-500">*</span>
          </label>
          <input
            id="enquiry-work-email"
            type="email"
            value={inquiry.workEmail}
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
          <label htmlFor="enquiry-company">Company</label>
          <input
            id="enquiry-company"
            type="text"
            value={inquiry.company}
            onChange={(event) => updateField("company", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
            placeholder="Organisation name"
          />
        </div>

        <div className="space-y-1.5 text-sm font-medium text-slate-700">
          <label htmlFor="enquiry-phone">Phone number</label>
          <input
            id="enquiry-phone"
            type="tel"
            value={inquiry.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
            placeholder="+44 20 0000 0000"
          />
        </div>
      </div>

      <div className="space-y-1.5 text-sm font-medium text-slate-700">
        <label htmlFor="enquiry-website" className="sr-only">
          Website
        </label>
        <input
          id="enquiry-website"
          type="text"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <label htmlFor="enquiry-topic">What can we help with?</label>
        <select
          id="enquiry-topic"
          value={inquiry.topic}
          onChange={(event) => updateField("topic", event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition focus:border-indigo-400 focus:ring"
        >
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 text-sm font-medium text-slate-700">
        <label htmlFor="enquiry-message">
          Enquiry details <span className="text-red-500">*</span>
        </label>
        <textarea
          id="enquiry-message"
          value={inquiry.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(validationErrors.message)}
          className={`min-h-36 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none ring-indigo-300 transition ${
            validationErrors.message ? fieldErrorClass : "border-slate-300 focus:border-indigo-400 focus:ring"
          }`}
          placeholder="Share your objective, timeline and any specific security priorities."
        />
        {validationErrors.message ? (
          <p className="text-xs font-medium text-red-600">{validationErrors.message}</p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {submitState === "sent" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          Enquiry submitted successfully. Our team will respond shortly.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="evada-primary-btn" disabled={submitState === "sending"}>
          {submitState === "sending" ? "Sending enquiry..." : "Send enquiry"}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        This action sends your enquiry through EVADA secure backend delivery.
      </p>
    </form>
  );
}
