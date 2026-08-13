import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type InquiryRequest = {
  fullName: string;
  workEmail: string;
  company?: string;
  phone?: string;
  topic: string;
  message: string;
  website?: string;
};

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function sanitizeValue(value: string | undefined) {
  return (value ?? "").trim();
}

function classifyContactError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const rawCode =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  const code = typeof rawCode === "string" ? rawCode : "";

  if (message.includes("missing required environment variable")) {
    return "CONTACT_CONFIG_ERROR";
  }

  if (code === "EAUTH") {
    return "SMTP_AUTH_FAILED";
  }

  if (code === "ESOCKET" || code === "ECONNECTION" || code === "ETIMEDOUT") {
    return "SMTP_CONNECTION_FAILED";
  }

  return "CONTACT_DELIVERY_FAILED";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const payload = (await request.json()) as InquiryRequest;

    if (sanitizeValue(payload.website)) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const fullName = sanitizeValue(payload.fullName);
    const workEmail = sanitizeValue(payload.workEmail);
    const company = sanitizeValue(payload.company) || "Not provided";
    const phone = sanitizeValue(payload.phone) || "Not provided";
    const topic = sanitizeValue(payload.topic);
    const message = sanitizeValue(payload.message);

    if (!fullName || !workEmail || !topic || !message) {
      return NextResponse.json(
        { error: "Please provide name, work email, topic, and inquiry details." },
        { status: 400 }
      );
    }

    const smtpHost = getRequiredEnvironmentVariable("CONTACT_SMTP_HOST");
    const smtpPort = Number(process.env.CONTACT_SMTP_PORT ?? "587");
    const smtpUser = getRequiredEnvironmentVariable("CONTACT_SMTP_USER");
    const smtpPassword = getRequiredEnvironmentVariable("CONTACT_SMTP_PASS");
    const fromEmail = sanitizeValue(process.env.CONTACT_FROM_EMAIL) || smtpUser;
    const toEmail =
      sanitizeValue(process.env.CONTACT_TO_EMAIL) ||
      sanitizeValue(process.env.CONTACT_FROM_EMAIL) ||
      smtpUser;
    const secure = process.env.CONTACT_SMTP_SECURE === "true";

    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transport.verify();

    await transport.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: workEmail,
      subject: `EVADA Inquiry - ${topic}`,
      text: [
        "New inquiry received from EVADA website",
        "",
        `Name: ${fullName}`,
        `Work Email: ${workEmail}`,
        `Company: ${company}`,
        `Phone: ${phone}`,
        `Topic: ${topic}`,
        "",
        "Inquiry Details:",
        message,
      ].join("\n"),
      html: `
        <h2>New inquiry received from EVADA website</h2>
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Work Email:</strong> ${escapeHtml(workEmail)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
        <p><strong>Inquiry Details:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const code = classifyContactError(error);
    const message = error instanceof Error ? error.message : "Unable to process inquiry.";
    console.error("[contact-mail] request failed", {
      requestId,
      code,
      message,
    });

    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" ? message : "Unable to submit inquiry.",
        code,
        requestId,
      },
      { status: 500 }
    );
  }
}
