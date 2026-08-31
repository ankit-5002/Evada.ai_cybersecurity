import { renderPage } from "../lib/shell";

const MODULES = [
  {
    id: "sec-val",
    n: "01",
    title: "Security validation",
    desc: "Infrastructure, web, API and authenticated scanning, consolidated and de-duplicated into one view.",
    pos: "top-left",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    id: "ai-pentest",
    n: "02",
    title: "AI pentesting",
    desc: "Automated pentesting designed for safe, repeatable validation, with scope control and sandboxing.",
    pos: "mid-left",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    id: "app-sec",
    n: "03",
    title: "Application security",
    desc: "SAST, DAST and API testing wired straight into your CI/CD, with developer ready remediation.",
    pos: "bottom-left",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  },
  {
    id: "threat-ops",
    n: "04",
    title: "Threat operations",
    desc: "Turn alerts and threat signals into validated, prioritised action instead of another queue.",
    pos: "bottom-center",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/></svg>`,
  },
  {
    id: "comp-auto",
    n: "05",
    title: "Compliance automation",
    desc: "Continuous evidence for Cyber Essentials, ISO 27001 and audit readiness, collected as you work.",
    pos: "bottom-right",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  },
  {
    id: "sec-ops",
    n: "06",
    title: "Security operations",
    desc: "SIEM integration and notifications so your existing SOC workflow gets validated context.",
    pos: "mid-right",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  },
  {
    id: "msp-plat",
    n: "07",
    title: "MSP platform",
    desc: "Multi tenant delivery, client workspaces and branded reporting from a single console.",
    pos: "top-right",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  },
];

const SHOTS: Record<string, string> = {
  "Unified findings": "/img-unified.webp",
  "Risk prioritisation": "/img-priority.webp",
  "Human approval": "/img-approval.webp",
  "Evidence & reporting": "/img-evidence.webp",
  "Fix tracking": "/img-fixtracking.webp",
  "Continuous validation": "/img-continuous.webp",
};

const WORKFLOW: [string, string][] = [
  ["Unified findings", "Bring every scanner, report and manual finding into one clear, de-duplicated view."],
  ["Risk prioritisation", "AI ranks what matters by real exploitability, so effort lands where it cuts exposure most."],
  ["Human approval", "Nothing runs against your environment until you approve it. Every check is logged."],
  ["Evidence & reporting", "Proof and context attached to every decision, board ready and audit ready."],
  ["Fix tracking", "Push priorities straight into your tickets and watch remediation close."],
  ["Continuous validation", "Coverage that keeps checking as your systems, users and suppliers change."],
];

const STAGES = [
  {
    title: "Data Sources",
    desc: "Ingesting security telemetry, scan output, cloud infrastructure, and existing workflow tickets across your entire environment.",
    icon: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
  },
  {
    title: "AI Reasoning Layer",
    desc: "EVADA’s AI engine filters out background noise, correlates alerts, and scores exploitability to propose safe, high-value validation checks.",
    icon: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`
  },
  {
    title: "Actionable Outputs",
    desc: "Delivering human-approved fix plans, updating team workflows, and creating audit-ready immutable reports for leadership.",
    icon: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
  },
];

const GUARDRAILS = [
  {
    tag: "DATA PRIVACY",
    title: "Zero Model Re-Training",
    desc: "Your source code, vulnerability findings, and network telemetry are never used to train or fine-tune foundation models. All inference runs in private, isolated instances.",
    badge: "Air-Gapped Context",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    points: ["Stateless reasoning pipelines", "Zero telemetry data harvesting", "Customer-controlled KMS encryption keys"],
  },
  {
    tag: "SECURITY GOVERNANCE",
    title: "Cryptographic Evidence Ledger",
    desc: "Every check, verification step, and remediation timestamp is immutably hashed and logged with SHA-256 signatures, ready for external SOC 2, ISO 27001, and Cyber Essentials audits.",
    badge: "SHA-256 Verified",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
    points: ["Immutable audit snapshots", "Signed PDF & JSON report exports", "Auditor-ready compliance artifacts"],
  },
  {
    tag: "TENANT ISOLATION",
    title: "Strict Multi-Tenant Sandboxing",
    desc: "Multi-layered container and network sandboxing with role-based access control (RBAC), SSO/SAML 2.0 integration, and ephemeral memory buffers that vanish upon scan completion.",
    badge: "VPC & Container Isolated",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>`,
    points: ["Single-tenant compute workers", "SAML 2.0 / Okta / Azure AD SSO", "Granular least-privilege RBAC"],
  },
  {
    tag: "SAFETY CONTROLS",
    title: "Human-in-the-Loop Safe Scope",
    desc: "Strict execution boundary controls. AI proposes high-risk penetration test vectors or validation checks, but nothing touches production assets until approved by an authorized engineer.",
    badge: "Mandatory Approvals",
    icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
    points: ["Out-of-band scan blackout schedules", "Rate limiting & safe payload guardrails", "One-click instant emergency stop"],
  },
];

const INTEGRATION_CATEGORIES = [
  {
    id: "cicd",
    name: "CI/CD & DevOps Security",
    desc: "Embed automated AppSec and SAST/DAST testing straight into developer pull requests and merge checks.",
    tools: [
      {
        name: "GitHub Actions",
        desc: "PR security comments & gate blockers",
        tag: "Webhook Trigger · Real-time",
        bg: "#181717",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`
      },
      {
        name: "GitLab CI/CD",
        desc: "Pipeline automated scanner checks",
        tag: "Pipeline Sync · Webhooks",
        bg: "#fc6d26",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="m23.6 9.58-.04-.12L20.8 1.67a.8.8 0 0 0-.3-.4.8.8 0 0 0-.54-.07.8.8 0 0 0-.46.28.8.8 0 0 0-.15.48v.06l-2.09 6.42H6.74L4.65 1.96v-.06a.8.8 0 0 0-.15-.48.8.8 0 0 0-.46-.28.8.8 0 0 0-.54.07.8.8 0 0 0-.3.4L.44 9.46l-.04.12a5.55 5.55 0 0 0 1.94 6.22l.06.05 9.25 6.72a.8.8 0 0 0 .96 0l9.25-6.72.06-.05a5.55 5.55 0 0 0 1.68-6.22z"/></svg>`
      },
      {
        name: "Bitbucket",
        desc: "Repository vulnerability scan sync",
        tag: "SCM API · Automated",
        bg: "#0052cc",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M.75 2.5a.75.75 0 0 0-.742.862l3.483 17.41a1.5 1.5 0 0 0 1.47 1.228h14.078a.75.75 0 0 0 .742-.862L16.298 3.73a.75.75 0 0 0-.735-.605H.75zm13.1 12.38H10.15l-1.07-5.76h5.84l-1.07 5.76z"/></svg>`
      },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure Protection",
    desc: "Continuously discover assets, open ports, and attack surfaces across multi-cloud environments.",
    tools: [
      {
        name: "AWS (Amazon Web Services)",
        desc: "IAM, VPC, S3 & EC2 asset ingestion",
        tag: "EventBridge · Connected",
        bg: "#232f3e",
        color: "#ff9900",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M18.74 15.68c-.28-.36-.78-.44-1.14-.16-1.53 1.18-3.48 1.83-5.6 1.83-3.1 0-5.83-1.42-7.39-3.66-.23-.33-.68-.42-1.01-.19-.33.23-.42.68-.19 1.01 1.81 2.6 4.96 4.24 8.59 4.24 2.45 0 4.7-.75 6.47-2.11.36-.28.44-.78.16-1.14zm4.07-2.11c-.48-.63-1.63-.5-2.45-.19-.18.07-.26.27-.19.45.28.72 1.34 3.03 2.87 2.21.72-.39.42-1.67-.23-2.47zm-14.7-2.22c0-1.78.89-3.08 2.25-3.08.79 0 1.46.43 1.82 1.11V4.89h1.79v7.94c0 .32.08.53.33.53.13 0 .28-.05.4-.16l.89 1.13c-.56.63-1.35.87-2.12.87-1.15 0-1.72-.6-1.72-1.72v-.93c-.45.74-1.2 1.13-2.02 1.13-1.92 0-3.12-1.42-3.12-3.32zm4.3 0c0-1.05-.6-1.72-1.43-1.72-.85 0-1.43.68-1.43 1.72 0 1.03.58 1.71 1.43 1.71.83 0 1.43-.68 1.43-1.71z"/></svg>`
      },
      {
        name: "Microsoft Azure",
        desc: "Resource groups & Entra ID scanning",
        tag: "ARM API · Continuous",
        bg: "#0078d4",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M13.483 0a.82.82 0 0 0-.75.492L6.804 13.784a.82.82 0 0 0 .75 1.146h4.59L8.41 23.364a.82.82 0 0 0 1.385.744l11.458-13.68a.82.82 0 0 0-.627-1.346h-5.464L18.15.535A.82.82 0 0 0 17.382 0h-3.899z"/></svg>`
      },
      {
        name: "Google Cloud (GCP)",
        desc: "GCP projects & perimeter discovery",
        tag: "Asset API · Runtime",
        bg: "#4285f4",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`
      },
      {
        name: "Kubernetes & Containers (K8s)",
        desc: "Container registry & pod surface checks",
        tag: "Audit Stream · Streaming",
        bg: "#326ce5",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="m12 1.7-8.9 5.1v10.4l8.9 5.1 8.9-5.1V6.8zm0 2.2 6.8 3.9-2.5 1.5-4.3-2.5-4.3 2.5-2.5-1.5zm-7 5.5 2.5 1.5v4.9l-2.5 1.5zm14 0v7.9l-2.5-1.5v-4.9zm-8.8 2.6 3.6 2.1v4.1l-3.6-2.1zm5.2 2.1 3.6-2.1v4.1l-3.6 2.1zm-4.3 6.9v-4.1l3.6-2.1 3.6 2.1v4.1z"/></svg>`
      },
    ],
  },
  {
    id: "observability",
    name: "Observability, SIEM & Incident Response",
    desc: "Feed validated exploit context and high-confidence signals into your SOC alerting queues and developer ticketing workflows.",
    tools: [
      {
        name: "Splunk Enterprise",
        desc: "Structured CEF / Syslog telemetry stream",
        tag: "HEC Stream · SIEM",
        bg: "#000000",
        color: "#ea005a",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M16.92 11.23 8.36 2.67a1.09 1.09 0 0 0-1.54 0 1.09 1.09 0 0 0 0 1.54l7.79 7.79-7.79 7.79a1.09 1.09 0 0 0 0 1.54 1.09 1.09 0 0 0 1.54 0l8.56-8.56a1.09 1.09 0 0 0 0-1.54z"/><path d="M19.92 19.5h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z"/></svg>`
      },
      {
        name: "Datadog",
        desc: "Security signal dashboards & metrics",
        tag: "Logs API · Metrics",
        bg: "#632ca6",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
      },
      {
        name: "Slack",
        desc: "Instant critical exploit alerts & notifications",
        tag: "Incoming Webhook · Instant Alert",
        bg: "#4a154b",
        color: "#ffffff",
        icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M5.04 14.77a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52zm1.26 0a2.52 2.52 0 0 1 5.04 0v6.3a2.52 2.52 0 1 1-5.04 0v-6.3zm2.52-8.47a2.52 2.52 0 1 1 2.52-2.52v2.52H8.82zm0 1.26a2.52 2.52 0 0 1 0 5.04H2.52a2.52 2.52 0 1 1 0-5.04h6.3zm8.47 2.52a2.52 2.52 0 1 1 2.52 2.52h-2.52V10.08zm-1.26 0a2.52 2.52 0 0 1-5.04 0V3.78a2.52 2.52 0 1 1 5.04 0v6.3zm-2.52 8.47a2.52 2.52 0 1 1-2.52 2.52v-2.52h2.52zm0-1.26a2.52 2.52 0 0 1 0-5.04h6.3a2.52 2.52 0 1 1 0 5.04h-6.3z"/></svg>`
      },
    ],
  },
];

export async function GET() {
  const body = `
<div class="evd-page pf">
  <section class="evd-hero evd-hero--dual">
    <div class="evd-hero-inner">
      <h1>The AI-Native Cybersecurity Platform</h1>
      <p>A unified AI-powered cybersecurity platform with modular capabilities across pentesting, AppSec, threat monitoring, SIEM, compliance and vendor risk.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">See EVADA in action</span><span class="evd-cta-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Request a demo</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section id="how-it-works" class="pf-flow evd-lightsec" aria-label="How the platform thinks">
    <div class="pf-flow-header">
      <span class="pf-flow-kicker">EXECUTION ARCHITECTURE</span>
      <h2 class="pf-h2">How the platform thinks</h2>
      <p class="pf-lede">AI proposes, you approve. Nothing touches your environment until you say yes. Every check is recorded, every action accountable to you.</p>
    </div>

    <div class="pf-cards-container">
      ${STAGES.map((s, idx) => {
    const variants = ['pf-card--tl', 'pf-card--tr', 'pf-card--br'];
    return `
      <div class="pf-card ${variants[idx]}">
        <div class="pf-card-bg"></div>
        <div class="pf-card-cutout">
          <div class="pf-card-icon-wrapper">
            ${s.icon}
          </div>
        </div>
        <div class="pf-card-content">
          <h3 class="pf-card-title">${s.title}</h3>
          <p class="pf-card-desc">${s.desc}</p>
        </div>
      </div>
      `}).join("")}
    </div>
  </section>

  <section id="security-workflow" class="evd-feat">
    <div class="evd-feat-inner">
      <h2 class="evd-feat-bigtitle">One platform, findings to fixed.</h2>
      <div class="evd-feat-grid">
        <div class="evd-feat-left">
          <h3 class="evd-feat-subtitle">Built for security teams</h3>
          <p class="evd-feat-sub">Everything you need to turn a noisy backlog into a clear, approved plan of action.</p>
          <div class="evd-feat-list">
            ${WORKFLOW.map(
      ([t, d], i) => `<button class="evd-feat-item${i === 0 ? " active" : ""}" data-i="${i}" data-shot="${SHOTS[t] || ""}"><span class="evd-feat-h">${t}</span><span class="evd-feat-d">${d}</span><span class="evd-feat-bar"><span></span></span></button>`,
    ).join("")}
          </div>
        </div>
        <div class="evd-feat-visual"><div class="evd-feat-panels"><img class="evd-feat-shot" src="/img-unified.webp" alt="EVADA platform dashboard" loading="lazy"/></div></div>
      </div>
    </div>
  </section>

  <!-- =========================================================
       SECTION A: ENTERPRISE GOVERNANCE & AI GUARDRAILS
       ========================================================= -->
  <section id="governance-guardrails" class="pf-guardrails-section" aria-label="Enterprise Governance and AI Guardrails">
    <div class="pf-guardrails-inner">
      
      <div class="pf-guardrails-heading">
        <span class="pf-guardrails-kicker">ENTERPRISE GOVERNANCE &amp; PRIVACY</span>
        <h2 class="pf-h2">Zero-compromise AI safety &amp; isolation</h2>
        <p class="pf-lede">Built for defense-in-depth, regulated workloads, and strict compliance mandates with cryptographically verified execution.</p>
      </div>

      <div class="pf-guardrails-grid">
        
        <!-- Row 1: Card 1 (Wide Green) + Card 2 (Narrow White) -->
        <div class="pf-guardrails-row pf-guardrails-row--1">
          
          <!-- Card 1: Wide Green -->
          <div class="pf-guardrail-card pf-guardrail-card--green">
            <div class="pf-guardrail-header">
              <div class="pf-guardrail-tags">
                <span class="pf-guardrail-tag">${GUARDRAILS[0].tag}</span>
                <span class="pf-guardrail-badge">
                  <span class="pf-guardrail-pulse"></span>
                  ${GUARDRAILS[0].badge}
                </span>
              </div>
              <div class="pf-guardrail-icon-wrap">
                ${GUARDRAILS[0].icon}
              </div>
            </div>

            <div class="pf-guardrail-body">
              <h3 class="pf-guardrail-title">${GUARDRAILS[0].title}</h3>
              <p class="pf-guardrail-desc">${GUARDRAILS[0].desc}</p>
            </div>

            <div class="pf-guardrail-footer">
              <ul class="pf-guardrail-points">
                ${GUARDRAILS[0].points.map((p) => `
                <li>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 10 8 14 16 6"/></svg>
                  <span>${p}</span>
                </li>`).join("")}
              </ul>
            </div>
          </div>

          <!-- Card 2: Narrow White -->
          <div class="pf-guardrail-card pf-guardrail-card--white">
            <div class="pf-guardrail-header">
              <div class="pf-guardrail-tags">
                <span class="pf-guardrail-tag">${GUARDRAILS[1].tag}</span>
                <span class="pf-guardrail-badge">
                  <span class="pf-guardrail-pulse"></span>
                  ${GUARDRAILS[1].badge}
                </span>
              </div>
              <div class="pf-guardrail-icon-wrap">
                ${GUARDRAILS[1].icon}
              </div>
            </div>

            <div class="pf-guardrail-body">
              <h3 class="pf-guardrail-title">${GUARDRAILS[1].title}</h3>
              <p class="pf-guardrail-desc">${GUARDRAILS[1].desc}</p>
            </div>

            <div class="pf-guardrail-footer">
              <ul class="pf-guardrail-points">
                ${GUARDRAILS[1].points.map((p) => `
                <li>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 10 8 14 16 6"/></svg>
                  <span>${p}</span>
                </li>`).join("")}
              </ul>
            </div>
          </div>

        </div>

        <!-- Row 2: Card 3 (Narrow White) + Card 4 (Wide Black) -->
        <div class="pf-guardrails-row pf-guardrails-row--2">
          
          <!-- Card 3: Narrow White -->
          <div class="pf-guardrail-card pf-guardrail-card--white">
            <div class="pf-guardrail-header">
              <div class="pf-guardrail-tags">
                <span class="pf-guardrail-tag">${GUARDRAILS[2].tag}</span>
                <span class="pf-guardrail-badge">
                  <span class="pf-guardrail-pulse"></span>
                  ${GUARDRAILS[2].badge}
                </span>
              </div>
              <div class="pf-guardrail-icon-wrap">
                ${GUARDRAILS[2].icon}
              </div>
            </div>

            <div class="pf-guardrail-body">
              <h3 class="pf-guardrail-title">${GUARDRAILS[2].title}</h3>
              <p class="pf-guardrail-desc">${GUARDRAILS[2].desc}</p>
            </div>

            <div class="pf-guardrail-footer">
              <ul class="pf-guardrail-points">
                ${GUARDRAILS[2].points.map((p) => `
                <li>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 10 8 14 16 6"/></svg>
                  <span>${p}</span>
                </li>`).join("")}
              </ul>
            </div>
          </div>

          <!-- Card 4: Wide Black -->
          <div class="pf-guardrail-card pf-guardrail-card--black">
            <div class="pf-guardrail-header">
              <div class="pf-guardrail-tags">
                <span class="pf-guardrail-tag">${GUARDRAILS[3].tag}</span>
                <span class="pf-guardrail-badge">
                  <span class="pf-guardrail-pulse"></span>
                  ${GUARDRAILS[3].badge}
                </span>
              </div>
              <div class="pf-guardrail-icon-wrap">
                ${GUARDRAILS[3].icon}
              </div>
            </div>

            <div class="pf-guardrail-body">
              <h3 class="pf-guardrail-title">${GUARDRAILS[3].title}</h3>
              <p class="pf-guardrail-desc">${GUARDRAILS[3].desc}</p>
            </div>

            <div class="pf-guardrail-footer">
              <ul class="pf-guardrail-points">
                ${GUARDRAILS[3].points.map((p) => `
                <li>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 10 8 14 16 6"/></svg>
                  <span>${p}</span>
                </li>`).join("")}
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- Orbital Hub: Numerous Modules, One Subscription -->
  <section id="modules" class="pf-orbital-section evd-lightsec" aria-label="Numerous Modules Platform Hub">
    <div class="pf-orbital-inner">
      
      <div class="pf-orbital-heading">
        <span class="pf-orbital-kicker">MODULAR ARCHITECTURE</span>
        <h2 class="pf-h2">Numerous modules, one platform</h2>
        <p class="pf-lede">Turn on what you need today. Expand without adding another vendor.</p>
      </div>

      <!-- Orbital Hub Diagram Stage -->
      <div class="pf-orbit-stage" id="orbital-stage">
        
        <!-- Central Animated Disc -->
        <div class="pf-orbit-center-wrapper">
          
          <!-- Concentric SVG Orbital Green Arcs -->
          <svg class="pf-orbit-svg-arcs" viewBox="0 0 360 360" aria-hidden="true">
            <circle cx="180" cy="180" r="168" class="pf-arc-track" />
            <circle cx="180" cy="180" r="150" class="pf-arc-track" />
            <circle cx="180" cy="180" r="132" class="pf-arc-track" />
            
            <circle cx="180" cy="180" r="168" class="pf-arc-green pf-arc-green--1" />
            <circle cx="180" cy="180" r="150" class="pf-arc-green pf-arc-green--2" />
            <circle cx="180" cy="180" r="132" class="pf-arc-green pf-arc-green--3" />
          </svg>

          <!-- Elevated Center White Disc -->
          <div class="pf-orbit-center-disc">
            <div class="pf-orbit-center-content">
              <span class="pf-orbit-core-pill">CORE PLATFORM</span>
              <h3 id="orbit-center-heading">Modules</h3>
              <p id="orbit-center-desc">Numerous core capabilities, one unified platform.</p>
              <div class="pf-orbit-metric-badge" id="orbit-metric-badge">
                <span id="orbit-metric-val">Core Pillars</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 7 Satellite Orbital Nodes Matching the Reference Image -->
        <div class="pf-orbit-nodes-layer">
          
          <!-- 01: Top-Left -->
          <div class="pf-orbit-node pf-node--top-left active" data-mod-idx="0">
            <div class="pf-node-label pf-node-label--left">
              <strong>${MODULES[0].n}. ${MODULES[0].title}</strong>
              <p class="pf-node-desc">${MODULES[0].desc}</p>
            </div>
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[0].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 02: Mid-Left -->
          <div class="pf-orbit-node pf-node--mid-left" data-mod-idx="1">
            <div class="pf-node-label pf-node-label--left">
              <strong>${MODULES[1].n}. ${MODULES[1].title}</strong>
              <p class="pf-node-desc">${MODULES[1].desc}</p>
            </div>
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[1].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 03: Bottom-Left -->
          <div class="pf-orbit-node pf-node--bottom-left" data-mod-idx="2">
            <div class="pf-node-label pf-node-label--left">
              <strong>${MODULES[2].n}. ${MODULES[2].title}</strong>
              <p class="pf-node-desc">${MODULES[2].desc}</p>
            </div>
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[2].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 04: Bottom-Center -->
          <div class="pf-orbit-node pf-node--bottom-center" data-mod-idx="3">
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[3].icon}
                  </div>
                </div>
              </div>
            </div>
            <div class="pf-node-label pf-node-label--bottom">
              <strong>${MODULES[3].n}. ${MODULES[3].title}</strong>
              <p class="pf-node-desc">${MODULES[3].desc}</p>
            </div>
          </div>

          <!-- 05: Bottom-Right -->
          <div class="pf-orbit-node pf-node--bottom-right" data-mod-idx="4">
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[4].icon}
                  </div>
                </div>
              </div>
            </div>
            <div class="pf-node-label pf-node-label--right">
              <strong>${MODULES[4].n}. ${MODULES[4].title}</strong>
              <p class="pf-node-desc">${MODULES[4].desc}</p>
            </div>
          </div>

          <!-- 06: Mid-Right -->
          <div class="pf-orbit-node pf-node--mid-right" data-mod-idx="5">
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[5].icon}
                  </div>
                </div>
              </div>
            </div>
            <div class="pf-node-label pf-node-label--right">
              <strong>${MODULES[5].n}. ${MODULES[5].title}</strong>
              <p class="pf-node-desc">${MODULES[5].desc}</p>
            </div>
          </div>

          <!-- 07: Top-Right -->
          <div class="pf-orbit-node pf-node--top-right" data-mod-idx="6">
            <div class="pf-node-badge">
              <div class="pf-node-ring-outer">
                <div class="pf-node-ring-inner">
                  <div class="pf-node-circle">
                    ${MODULES[6].icon}
                  </div>
                </div>
              </div>
            </div>
            <div class="pf-node-label pf-node-label--right">
              <strong>${MODULES[6].n}. ${MODULES[6].title}</strong>
              <p class="pf-node-desc">${MODULES[6].desc}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <section id="continuous-validation" class="pf-lifecycle evd-lightsec" aria-label="Continuous validation lifecycle">
    <div class="pf-lifecycle-inner">
      <div class="pf-section-heading">
        <span class="pf-section-kicker">CONTINUOUS VALIDATION</span>
        <h2>From an authorised asset to evidence you can trust</h2>
        <p>EVADA keeps the full security workflow connected. Scope is verified before testing, findings retain their evidence, and reports preserve the exact state that was reviewed.</p>
      </div>
      <div class="pf-lifecycle-track">
        <article class="pf-lifecycle-card">
          <span class="pf-lifecycle-number">01</span>
          <span class="pf-lifecycle-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg></span>
          <h3>Verify ownership</h3>
          <p>Register web applications, APIs and infrastructure, then prove authorisation before any scanner can run.</p>
          <span class="pf-lifecycle-status">Authorised scope</span>
        </article>
        <article class="pf-lifecycle-card">
          <span class="pf-lifecycle-number">02</span>
          <span class="pf-lifecycle-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5.5 15a8 8 0 0 0 13-2M18.5 9a8 8 0 0 0-13 2"/></svg></span>
          <h3>Run governed scans</h3>
          <p>Launch approved Web, TLS and AI-assisted validation while live stages and execution history remain visible.</p>
          <span class="pf-lifecycle-status">Controlled execution</span>
        </article>
        <article class="pf-lifecycle-card">
          <span class="pf-lifecycle-number">03</span>
          <span class="pf-lifecycle-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 18h.01"/></svg></span>
          <h3>Triage real findings</h3>
          <p>Normalised findings bring severity, affected assets, technical evidence and remediation into one review queue.</p>
          <span class="pf-lifecycle-status">Prioritised risk</span>
        </article>
        <article class="pf-lifecycle-card">
          <span class="pf-lifecycle-number">04</span>
          <span class="pf-lifecycle-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg></span>
          <h3>Issue immutable reports</h3>
          <p>Create audit-ready VAPT snapshots with lifecycle history and downloadable PDF and JSON artifacts.</p>
          <span class="pf-lifecycle-status">Defensible evidence</span>
        </article>
      </div>
    </div>
  </section>

  <section id="attack-surface-drift" class="pf-drift" aria-label="Attack surface drift monitoring">
    <div class="pf-drift-inner">
      <div class="pf-drift-head">
        <div><span class="pf-drift-kicker">ATTACK SURFACE DRIFT</span><h2>Your environment changes between assessments. Your validation should too.</h2></div>
        <p>New endpoints, certificates, services and configuration changes can alter exposure overnight. EVADA keeps authorised scope connected to continuous checks so security teams can see what changed and validate the impact before it becomes the next blind spot.</p>
      </div>
      <div class="pf-drift-canvas">
        <div class="pf-drift-grid" aria-hidden="true"></div>
        <div class="pf-drift-rail" aria-label="Exposure timeline">
          <span class="pf-drift-time">09:00</span><i class="safe"></i>
          <span class="pf-drift-time">11:24</span><i class="change"></i>
          <span class="pf-drift-time">11:31</span><i class="risk"></i>
          <span class="pf-drift-time">11:38</span><i class="validated"></i>
          <span class="pf-drift-time">Now</span>
        </div>
        <article class="pf-drift-event pf-drift-event--baseline"><span class="pf-drift-event-icon">01</span><div><small>KNOWN BASELINE</small><strong>24 verified assets</strong><p>Web, API and infrastructure scope is authorised and continuously tracked.</p></div><b>Stable</b></article>
        <article class="pf-drift-event pf-drift-event--change"><span class="pf-drift-event-icon">02</span><div><small>CHANGE DETECTED</small><strong>New authentication endpoint</strong><p>A production route appeared outside the last validated application map.</p></div><b>+1 surface</b></article>
        <article class="pf-drift-event pf-drift-event--risk"><span class="pf-drift-event-icon">03</span><div><small>EXPOSURE CORRELATED</small><strong>TLS policy no longer aligned</strong><p>The new endpoint inherits a weaker configuration than the verified baseline.</p></div><b>High</b></article>
        <article class="pf-drift-event pf-drift-event--validated"><span class="pf-drift-event-icon">04</span><div><small>VALIDATION RUNNING</small><strong>Targeted checks automatically scoped</strong><p>EVADA queues the relevant Web and TLS checks without repeating the full assessment.</p></div><b>72%</b><span class="pf-drift-progress"><i></i></span></article>
        <div class="pf-drift-summary"><span><i></i>Continuous awareness</span><strong>Change becomes a validation decision—not a surprise.</strong><a href="/signup">See EVADA in action &rarr;</a></div>
      </div>
    </div>
  </section>

  <!-- =========================================================
       SECTION B: ENTERPRISE INTEGRATION MESH
       ========================================================= -->
  <section id="ecosystem-integrations" class="pf-integrations-section" aria-label="Enterprise Integration Mesh">
    <div class="pf-integrations-inner">
      
      <div class="pf-integrations-heading">
        <span class="pf-integrations-kicker">ECOSYSTEM &amp; TELEMETRY MESH</span>
        <h2 class="pf-h2">Fits right into your existing security stack</h2>
        <p class="pf-lede">Connect EVADA with your source code, CI/CD pipelines, cloud providers, and ticketing systems without creating another operational silo.</p>
      </div>

      <!-- Grouped Category Sections in Marketplace Registry Layout -->
      <div class="pf-marketplace-sections">
        ${INTEGRATION_CATEGORIES.map((c) => `
        <div class="pf-marketplace-group" data-category-group="${c.id}">
          <div class="pf-marketplace-header">
            <h3 class="pf-marketplace-title">${c.name}</h3>
          </div>
          <div class="pf-marketplace-grid">
            ${c.tools.map((t) => `
            <div class="pf-marketplace-card" data-category="${c.id}">
              <div class="pf-marketplace-icon" style="background: ${t.bg}; color: ${t.color};">
                ${t.icon}
              </div>
              <div class="pf-marketplace-content">
                <span class="pf-marketplace-tool-name">${t.name}</span>
                <span class="pf-marketplace-tag">${t.tag}</span>
                <span class="pf-marketplace-desc">${t.desc}</span>
              </div>
            </div>
            `).join("")}
          </div>
        </div>
        `).join("")}
      </div>

      <div class="pf-int-footer-note">
        <div class="pf-int-note-card">
          <div class="pf-int-note-left">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2ece82" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <div>
              <strong>Custom internal tool or private on-prem pipeline?</strong>
              <p>EVADA supports custom REST APIs, signed Webhooks, and air-gapped on-prem forwarders for sovereign enterprise deployments.</p>
            </div>
          </div>
          <a href="/contact" class="pf-int-note-link">Request custom connector &rarr;</a>
        </div>
      </div>

    </div>
  </section>

  <section id="platform-access" class="pf-end">
    <div class="pf-end-inner">
      <h2>See the platform on your own environment.</h2>
      <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">See EVADA in action</span><span class="evd-cta-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
    </div>
  </section>
</div>

<script>
  (function() {
    // 1. Orbital Nodes Logic
    const nodes = document.querySelectorAll('.pf-orbit-node');

    function setActiveNode(index) {
      if (index < 0 || index >= nodes.length) return;
      nodes.forEach((n, i) => {
        if (i === index) {
          n.classList.add('active');
        } else {
          n.classList.remove('active');
        }
      });
    }

    nodes.forEach((node) => {
      const idx = parseInt(node.getAttribute('data-mod-idx') || '0', 10);
      node.addEventListener('mouseenter', () => setActiveNode(idx));
      node.addEventListener('click', () => setActiveNode(idx));
    });

    // Auto-cycle through nodes gently every 5s when idle
    let autoIndex = 0;
    let autoTimer = setInterval(() => {
      autoIndex = (autoIndex + 1) % nodes.length;
      setActiveNode(autoIndex);
    }, 5000);

    const stage = document.getElementById('orbital-stage');
    if (stage) {
      stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
    }

    // 2. Cards Scroll Fade-In Effect
    const cards = document.querySelectorAll('.pf-card');
    if (cards.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        let delayCount = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = delayCount * 250; // Slower stagger
            delayCount++;
            const tid = setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
            entry.target.dataset.tid = tid.toString();
          } else {
            // Remove visibility when scrolling out of view to retain effect on re-entry
            if (entry.target.dataset.tid) {
              clearTimeout(parseInt(entry.target.dataset.tid, 10));
              entry.target.dataset.tid = "";
            }
            entry.target.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

      cards.forEach((card) => {
        observer.observe(card);
      });
    }
  })();
</script>`;

  const css = `
    .evd-hero { --evd-hero-blend: #ffffff; }
    .pf {
      width: 100%;
      max-width: 100%;
      overflow-x: clip;
      background: #ffffff;
    }
    .pf,
    .pf *,
    .pf *::before,
    .pf *::after { box-sizing: border-box; }
    .pf section[id] { scroll-margin-top: 5.5rem; }
    .pf .evd-hero-inner,
    .pf-flow-inner,
    .pf-guardrails-inner,
    .pf-orbital-inner,
    .pf-integrations-inner,
    .pf .evd-feat-inner,
    .pf-lifecycle-inner,
    .pf-command-inner,
    .pf-end-inner {
      width: 100%;
      min-width: 0;
    }
    .pf .evd-hero-inner { max-width: 82rem; }
    .pf .evd-hero-inner > h1 { width: 100%; max-width: 15ch; text-wrap: balance; }
    .pf .evd-hero-inner > p { width: 100%; max-width: 46rem; }
    .pf h1,
    .pf h2,
    .pf h3,
    .pf p,
    .pf li { overflow-wrap: break-word; }

    .pf-h2 { margin: 0 0 0.6rem; font-size: clamp(1.7rem, 2.2vw + 1rem, 2.6rem); line-height: 1.1; letter-spacing: 0; font-weight: 600; text-wrap: balance; }
    .pf-lede { margin: 0 0 2.6rem; font-size: 1.1rem; line-height: 1.6; color: rgba(20,16,10,0.55); max-width: 38rem; }

    /* Connected operational lifecycle */
    .pf-lifecycle { padding: clamp(4.5rem,7vw,7rem) clamp(1.25rem,5vw,4rem); background: #f7faf9; color: #071018; border-top: 1px solid rgba(7,16,24,.08); }
    .pf-lifecycle-inner { max-width: 82rem; margin: 0 auto; }
    .pf-section-heading { max-width: 48rem; margin-bottom: clamp(2.25rem,4vw,3.5rem); }
    .pf-section-kicker, .pf-command-kicker { display: inline-block; margin-bottom: .8rem; font: 700 .72rem/1 'Aeonik Mono',monospace; color: #087547; }
    .pf-section-heading h2, .pf-command-copy h2 { margin: 0; font: 600 clamp(2rem,3.4vw,3rem)/1.08 'Roobert','Geist',sans-serif; text-wrap: balance; }
    .pf-section-heading p, .pf-command-copy > p { margin: 1rem 0 0; font-size: 1.05rem; line-height: 1.65; color: rgba(7,16,24,.62); }
    .pf-lifecycle-track { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); border-top: 1px solid rgba(7,16,24,.14); border-bottom: 1px solid rgba(7,16,24,.14); }
    .pf-lifecycle-card { position: relative; min-width: 0; padding: 1.6rem 1.35rem 1.5rem; border-right: 1px solid rgba(7,16,24,.12); transition: background .25s ease, transform .25s ease; }
    .pf-lifecycle-card:last-child { border-right: 0; }
    .pf-lifecycle-card:hover { background: #fff; transform: translateY(-4px); }
    .pf-lifecycle-number { position: absolute; top: 1rem; right: 1rem; font: 700 .68rem/1 'Aeonik Mono',monospace; color: rgba(7,16,24,.3); }
    .pf-lifecycle-icon { display: grid; width: 3rem; height: 3rem; place-items: center; color: #087547; background: #e8fff3; border: 1px solid rgba(46,206,130,.3); border-radius: 8px; }
    .pf-lifecycle-card h3 { margin: 1.25rem 0 .65rem; font: 600 1.2rem/1.2 'Roobert',sans-serif; }
    .pf-lifecycle-card p { min-height: 7.2rem; margin: 0; font-size: .9rem; line-height: 1.6; color: rgba(7,16,24,.6); }
    .pf-lifecycle-status { display: inline-flex; margin-top: 1.25rem; padding: .35rem .6rem; border-radius: 999px; background: rgba(46,206,130,.1); color: #087547; font: 700 .68rem/1 'Aeonik Mono',monospace; }

    /* Tenant command center */
    .pf-command { padding: clamp(4.5rem,7vw,7rem) clamp(1.25rem,5vw,4rem); color: #edf6f1; background: radial-gradient(circle at 85% 20%,rgba(46,206,130,.16),transparent 28%),#071010; }
    .pf-command-inner { max-width: 82rem; margin: 0 auto; display: grid; grid-template-columns: minmax(0,.8fr) minmax(32rem,1.2fr); gap: clamp(2.5rem,6vw,6rem); align-items: center; }
    .pf-command-copy h2 { color: #fff; }
    .pf-command-copy > p { color: rgba(237,246,241,.62); }
    .pf-command-kicker { color: #2ece82; }
    .pf-command-points { display: grid; gap: 1rem; margin-top: 2rem; }
    .pf-command-points div { padding-left: 1rem; border-left: 2px solid #2ece82; }
    .pf-command-points strong, .pf-command-points span { display: block; }
    .pf-command-points strong { font-size: .95rem; color: #fff; }
    .pf-command-points span { margin-top: .2rem; font-size: .82rem; line-height: 1.5; color: rgba(237,246,241,.52); }
    .pf-command-link { display: inline-flex; gap: .6rem; margin-top: 2rem; color: #bfffe1; font-weight: 600; text-decoration: none; }
    .pf-command-visual { overflow: hidden; min-width: 0; border: 1px solid rgba(255,255,255,.13); border-radius: 12px; background: #fff; color: #071018; box-shadow: 0 35px 90px rgba(0,0,0,.38); transform: rotate(1deg); }
    .pf-command-top { display: flex; justify-content: space-between; align-items: center; padding: .85rem 1rem; color: #fff; background: #0b1b17; font-size: .78rem; font-weight: 700; }
    .pf-command-top i { display: inline-block; width: .5rem; height: .5rem; margin-right: .4rem; border-radius: 50%; background: #2ece82; box-shadow: 0 0 12px #2ece82; }
    .pf-command-top b { padding: .28rem .55rem; border-radius: 999px; color: #071018; background: #2ece82; font-size: .62rem; }
    .pf-command-body { display: grid; grid-template-columns: 7.5rem minmax(0,1fr); min-height: 22rem; }
    .pf-command-sidebar { display: grid; align-content: start; gap: .35rem; padding: 1rem .7rem; color: rgba(255,255,255,.55); background: #071010; font-size: .72rem; font-weight: 600; }
    .pf-command-sidebar span { padding: .65rem .7rem; border-radius: 6px; }
    .pf-command-sidebar .active { color: #071018; background: #fff; }
    .pf-command-main { min-width: 0; padding: 1.2rem; background: #f7faf9; }
    .pf-command-metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .6rem; }
    .pf-command-metrics div { padding: .85rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
    .pf-command-metrics small, .pf-command-metrics strong { display: block; }
    .pf-command-metrics small { color: #64748b; font-size: .62rem; }
    .pf-command-metrics strong { margin-top: .35rem; font-size: 1.4rem; }
    .pf-command-operation, .pf-command-rows { margin-top: .8rem; padding: .9rem; border: 1px solid #dbeafe; border-radius: 8px; background: #fff; font-size: .7rem; }
    .pf-command-operation > span { display: inline-flex; align-items: center; gap: .4rem; }
    .pf-command-operation > span i { width: .5rem; height: .5rem; border-radius: 50%; background: #06b6d4; }
    .pf-command-operation em { float: right; color: #0891b2; font-style: normal; font-weight: 700; }
    .pf-command-operation > div { clear: both; height: .35rem; margin-top: .75rem; overflow: hidden; border-radius: 99px; background: #e2e8f0; }
    .pf-command-operation > div i { display: block; height: 100%; background: #2ece82; }
    .pf-command-rows { display: grid; gap: 0; padding: 0; overflow: hidden; }
    .pf-command-rows span { display: grid; grid-template-columns: .55rem minmax(0,1fr) auto; gap: .55rem; align-items: center; padding: .8rem; border-bottom: 1px solid #edf2f7; }
    .pf-command-rows span:last-child { border-bottom: 0; }
    .pf-command-rows i { width: .5rem; height: .5rem; border-radius: 50%; background: #f43f5e; }
    .pf-command-rows i.medium { background: #f59e0b; }.pf-command-rows i.ready { background: #2ece82; }
    .pf-command-rows b { font-size: .58rem; text-transform: uppercase; color: #64748b; }

    /* Attack-surface drift timeline */
    .pf-drift { padding: clamp(4.5rem,7vw,7rem) clamp(1.25rem,5vw,4rem); overflow:hidden; color:#edf6f1; background:linear-gradient(145deg,#06100d 0%,#081b17 56%,#071018 100%); }
    .pf-drift-inner { width:100%; max-width:82rem; margin:0 auto; }
    .pf-drift-head { display:grid; grid-template-columns:minmax(0,1.05fr) minmax(20rem,.65fr); gap:clamp(2rem,6vw,6rem); align-items:end; }
    .pf-drift-kicker { display:inline-block; margin-bottom:.85rem; color:#2ece82; font:700 .72rem/1 'Aeonik Mono',monospace; }
    .pf-drift-head h2 { max-width:18ch; margin:0; color:#fff; font:600 clamp(2rem,3.4vw,3rem)/1.07 'Roobert','Geist',sans-serif; text-wrap:balance; }
    .pf-drift-head p { margin:0; color:rgba(237,246,241,.58); font-size:.98rem; line-height:1.65; }
    .pf-drift-canvas { position:relative; min-height:35rem; margin-top:3.5rem; overflow:hidden; border:1px solid rgba(255,255,255,.1); border-radius:16px; background:radial-gradient(circle at 50% 55%,rgba(46,206,130,.1),transparent 35%),rgba(3,12,10,.56); box-shadow:0 30px 80px rgba(0,0,0,.3); }
    .pf-drift-grid { position:absolute; inset:0; opacity:.18; background-image:linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px); background-size:40px 40px; mask-image:linear-gradient(to bottom,#000,transparent 95%); }
    .pf-drift-rail { position:absolute; top:50%; left:5%; right:5%; display:grid; grid-template-columns:auto 1fr auto 1fr auto 1fr auto 1fr auto; align-items:center; gap:.55rem; transform:translateY(-50%); }
    .pf-drift-rail::before { content:""; position:absolute; left:1.5rem; right:1.5rem; top:50%; height:1px; background:linear-gradient(90deg,#2ece82,#04d9ff,#f4b41a,#2ece82); opacity:.5; }
    .pf-drift-time { position:relative; z-index:1; padding:.32rem .5rem; border:1px solid rgba(255,255,255,.12); border-radius:99px; background:#0b1b17; color:rgba(255,255,255,.55); font:600 .58rem/1 'Aeonik Mono',monospace; }
    .pf-drift-rail > i { position:relative; z-index:2; width:.8rem; height:.8rem; justify-self:center; border:2px solid #071510; border-radius:50%; background:var(--dot,#2ece82); box-shadow:0 0 0 5px color-mix(in srgb,var(--dot,#2ece82) 14%,transparent),0 0 18px var(--dot,#2ece82); animation:pfDriftPulse 2s ease-in-out infinite; }
    .pf-drift-rail > i.change { --dot:#04d9ff; animation-delay:-.5s; }.pf-drift-rail > i.risk { --dot:#f4b41a; animation-delay:-1s; }.pf-drift-rail > i.validated { --dot:#2ece82; animation-delay:-1.5s; }
    .pf-drift-event { position:absolute; display:grid; grid-template-columns:2.4rem minmax(0,1fr) auto; gap:.8rem; align-items:start; width:min(22rem,42%); padding:1rem; border:1px solid rgba(255,255,255,.12); border-radius:12px; background:rgba(10,29,24,.9); box-shadow:0 16px 45px rgba(0,0,0,.28); backdrop-filter:blur(14px); animation:pfDriftFloat 6s ease-in-out infinite; }
    .pf-drift-event::after { content:""; position:absolute; width:1px; height:3rem; background:linear-gradient(var(--accent,#2ece82),transparent); }
    .pf-drift-event--baseline { top:6%; left:4%; --accent:#2ece82; }.pf-drift-event--baseline::after { left:22%; top:100%; }
    .pf-drift-event--change { top:5%; right:5%; --accent:#04d9ff; animation-delay:-2s; }.pf-drift-event--change::after { right:28%; top:100%; }
    .pf-drift-event--risk { left:8%; bottom:6%; --accent:#f4b41a; animation-delay:-4s; }.pf-drift-event--risk::after { left:28%; bottom:100%; transform:rotate(180deg); }
    .pf-drift-event--validated { right:4%; bottom:5%; --accent:#2ece82; animation-delay:-1s; }.pf-drift-event--validated::after { right:24%; bottom:100%; transform:rotate(180deg); }
    .pf-drift-event-icon { display:grid; width:2.4rem; height:2.4rem; place-items:center; border:1px solid color-mix(in srgb,var(--accent) 40%,transparent); border-radius:9px; color:var(--accent); background:color-mix(in srgb,var(--accent) 8%,transparent); font:700 .65rem/1 'Aeonik Mono',monospace; }
    .pf-drift-event small { color:var(--accent); font:700 .56rem/1 'Aeonik Mono',monospace; }.pf-drift-event strong { display:block; margin-top:.4rem; color:#fff; font-size:.88rem; }.pf-drift-event p { margin:.35rem 0 0; color:rgba(237,246,241,.48); font-size:.68rem; line-height:1.45; }
    .pf-drift-event > b { padding:.3rem .48rem; border-radius:99px; color:var(--accent); background:color-mix(in srgb,var(--accent) 9%,transparent); font-size:.58rem; white-space:nowrap; }
    .pf-drift-progress { position:absolute; left:4.2rem; right:1rem; bottom:.65rem; height:.22rem; overflow:hidden; border-radius:99px; background:rgba(255,255,255,.08); }.pf-drift-progress i { display:block; width:72%; height:100%; background:#2ece82; animation:pfDriftProgress 3s ease-in-out infinite alternate; }
    .pf-drift-summary { position:absolute; top:50%; left:50%; z-index:3; display:grid; width:min(22rem,38%); gap:.65rem; padding:1.15rem; transform:translate(-50%,-50%); border:1px solid rgba(46,206,130,.28); border-radius:12px; background:#071510; box-shadow:0 0 0 .65rem rgba(46,206,130,.025),0 24px 60px rgba(0,0,0,.42); text-align:center; }
    .pf-drift-summary span { color:#2ece82; font:700 .62rem/1 'Aeonik Mono',monospace; }.pf-drift-summary span i { display:inline-block; width:.45rem; height:.45rem; margin-right:.4rem; border-radius:50%; background:#2ece82; box-shadow:0 0 10px #2ece82; }.pf-drift-summary strong { color:#fff; font:600 1.05rem/1.25 'Roobert',sans-serif; }.pf-drift-summary a { color:#bfffe1; font-size:.7rem; font-weight:700; text-decoration:none; }
    @keyframes pfDriftPulse { 50% { transform:scale(1.25); opacity:.7; } } @keyframes pfDriftFloat { 50% { transform:translateY(-7px); } } @keyframes pfDriftProgress { from { width:45%; } to { width:78%; } }

    /* =========================================================
       FULL-WIDTH STICKY STACKING SECTIONS: HOW THE PLATFORM THINKS
       ========================================================= */
    .pf-flow {
      background: #ffffff;
      color: #14100a;
      padding: clamp(4.5rem, 6vw, 6rem) 0 0;
      position: relative;
      width: 100%;
    }
    .pf-flow-header {
      width: 100%;
      padding: 0 clamp(2rem, 6vw, 6.5rem);
      margin-bottom: clamp(2.5rem, 4vw, 3.5rem);
    }
    .pf-flow-kicker {
      display: inline-block;
      color: #087547;
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
      padding: 0.25rem 0.85rem;
      border-radius: 999px;
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.35);
    }
    .pf-flow-header h2 {
      font-family: 'Roobert', 'Geist', sans-serif;
      font-size: clamp(2.1rem, 3.2vw, 2.9rem);
      font-weight: 600;
      letter-spacing: -0.025em;
      color: #071018;
      margin: 0 0 0.8rem;
    }
    .pf-flow-header p {
      color: rgba(20, 16, 10, 0.65);
      font-size: 1.1rem;
      line-height: 1.6;
      max-width: 46rem;
      margin: 0;
    }

    .pf-cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      width: 100%;
      padding: 0 clamp(2rem, 6vw, 6.5rem) clamp(4rem, 8vw, 8rem);
      max-width: 1400px;
      margin: 0 auto;
    }
    .pf-card {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 2.5rem;
      border-radius: 20px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(60px);
      transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
      min-height: 280px;
    }
    .pf-card.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .pf-card.is-visible:hover {
      transform: translateY(-6px);
    }
    .pf-card-bg {
      position: absolute;
      inset: 0;
      background: #ffffff;
      border: 1px solid #087547;
      border-radius: 20px;
      transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
      z-index: 1;
    }
    .pf-card.is-visible:hover .pf-card-bg {
      background: #39E390;
      border-color: #39E390;
      box-shadow: 0 16px 40px rgba(57, 227, 144, 0.35);
    }
    .pf-card-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .pf-card-cutout {
      position: absolute;
      width: 88px;
      height: 88px;
      background: #ffffff; /* Must match section background */
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pf-card-icon-wrapper {
      color: #ffffff;
      background: #000000;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      transition: background 0.4s ease, color 0.4s ease;
    }
    .pf-card.is-visible:hover .pf-card-icon-wrapper {
      background: #ffffff;
      color: #39E390;
    }
    
    /* Cutout Positions */
    .pf-card--tl .pf-card-cutout {
      top: -1px;
      left: -1px;
      border: 1px solid #087547;
      border-top-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
    .pf-card--tl .pf-card-title {
      margin-left: 64px;
    }
    .pf-card--tl .pf-card-desc {
      margin-top: auto;
    }

    .pf-card--tr .pf-card-cutout {
      top: -1px;
      right: -1px;
      border: 1px solid #087547;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    .pf-card--tr .pf-card-title {
      margin-right: 64px;
    }
    .pf-card--tr .pf-card-desc {
      margin-top: auto;
    }

    .pf-card--br .pf-card-cutout {
      bottom: -1px;
      right: -1px;
      border: 1px solid #087547;
      border-bottom-right-radius: 20px;
      border-top-left-radius: 20px;
    }
    .pf-card--br .pf-card-desc {
      margin-top: auto;
      margin-right: 64px;
    }

    .pf-card-title {
      font-family: 'Roobert', 'Geist', sans-serif;
      font-size: 1.6rem;
      font-weight: 500;
      color: #071018;
      margin: 0 0 1rem;
      letter-spacing: -0.01em;
      transition: color 0.4s ease;
    }
    .pf-card-desc {
      font-family: 'Geist', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(7, 16, 24, 0.75);
      margin: 0;
      transition: color 0.4s ease;
    }

    /* =========================================================
       SECTION A: ENTERPRISE GOVERNANCE & AI GUARDRAILS STYLES
       ========================================================= */
    .pf-guardrails-section {
      background: #faf7f2;
      color: #14100a;
      padding: clamp(4.5rem, 6vw, 6rem) clamp(1.5rem, 5vw, 4rem);
      position: relative;
      border-top: 1px solid rgba(20, 16, 10, 0.08);
    }
    .pf-guardrails-inner {
      max-width: 74rem;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    .pf-guardrails-heading {
      text-align: center;
      max-width: 48rem;
      margin: 0 auto clamp(2rem, 3.5vw, 3rem);
    }
    .pf-guardrails-kicker {
      display: inline-block;
      color: #087547;
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 0.65rem;
      padding: 0.22rem 0.8rem;
      border-radius: 999px;
      background: rgba(46, 205, 128, 0.14);
      border: 1px solid rgba(46, 205, 128, 0.35);
    }
    .pf-guardrails-heading h2 {
      color: #071018;
      font-family: 'Roobert', 'Geist', sans-serif;
      font-size: clamp(2rem, 3vw, 2.75rem);
      font-weight: 600;
      letter-spacing: -0.025em;
      margin: 0 0 0.75rem;
    }
    .pf-guardrails-heading p {
      color: rgba(20, 16, 10, 0.65);
      font-size: 1.02rem;
      line-height: 1.55;
      margin: 0 auto;
    }

    .pf-guardrails-grid {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }
    .pf-guardrails-row {
      display: grid;
      gap: 1.15rem;
    }
    .pf-guardrails-row--1 {
      grid-template-columns: 1.65fr 1fr;
    }
    .pf-guardrails-row--2 {
      grid-template-columns: 1fr 1.65fr;
    }

    .pf-guardrail-card {
      border-radius: 22px;
      padding: clamp(1.35rem, 1.9vw, 1.85rem);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 245px;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .pf-guardrail-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
    }

    .pf-guardrail-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.85rem;
      margin-bottom: 1.1rem;
    }
    .pf-guardrail-tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
    }
    .pf-guardrail-tag {
      font-family: 'Aeonik Mono', monospace;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .pf-guardrail-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.16rem 0.55rem;
      border-radius: 999px;
      font-family: 'Aeonik Mono', monospace;
      font-size: 0.68rem;
      font-weight: 600;
    }
    .pf-guardrail-pulse {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      animation: pfPulseDot 2s infinite ease-in-out;
    }
    @keyframes pfPulseDot {
      0%, 100% { opacity: 0.5; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.3); }
    }

    .pf-guardrail-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.25s ease;
    }
    .pf-guardrail-icon-wrap svg {
      width: 19px;
      height: 19px;
    }
    .pf-guardrail-card:hover .pf-guardrail-icon-wrap {
      transform: scale(1.06);
    }

    .pf-guardrail-body {
      margin-bottom: 1.1rem;
    }
    .pf-guardrail-title {
      font-family: 'Roobert', sans-serif;
      font-size: clamp(1.15rem, 1.45vw, 1.34rem);
      font-weight: 600;
      margin: 0 0 0.45rem;
      letter-spacing: -0.015em;
      line-height: 1.3;
    }
    .pf-guardrail-desc {
      font-family: 'Geist', sans-serif;
      font-size: 0.88rem;
      line-height: 1.55;
      margin: 0;
    }

    .pf-guardrail-footer {
      border-top: 1px solid;
      padding-top: 0.9rem;
    }
    .pf-guardrail-points {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.38rem;
    }
    .pf-guardrail-points li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      font-family: 'Geist', sans-serif;
    }
    .pf-guardrail-points svg {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }

    /* 1. Card Green (Top-Left, Wide) */
    .pf-guardrail-card--green {
      background: #2ecd80;
      color: #071018;
      border: 1px solid rgba(7, 16, 24, 0.12);
      box-shadow: 0 10px 30px rgba(46, 205, 128, 0.22);
    }
    .pf-guardrail-card--green .pf-guardrail-tag { color: #08492c; }
    .pf-guardrail-card--green .pf-guardrail-badge {
      background: rgba(7, 16, 24, 0.08);
      border: 1px solid rgba(7, 16, 24, 0.16);
      color: #071018;
    }
    .pf-guardrail-card--green .pf-guardrail-pulse {
      background: #071018;
      box-shadow: 0 0 6px rgba(7, 16, 24, 0.5);
    }
    .pf-guardrail-card--green .pf-guardrail-icon-wrap {
      background: rgba(7, 16, 24, 0.08);
      border: 1px solid rgba(7, 16, 24, 0.15);
      color: #071018;
    }
    .pf-guardrail-card--green .pf-guardrail-title { color: #071018; }
    .pf-guardrail-card--green .pf-guardrail-desc { color: rgba(7, 16, 24, 0.82); }
    .pf-guardrail-card--green .pf-guardrail-footer { border-color: rgba(7, 16, 24, 0.12); }
    .pf-guardrail-card--green .pf-guardrail-points li { color: rgba(7, 16, 24, 0.88); }
    .pf-guardrail-card--green .pf-guardrail-points svg { color: #071018; }

    /* 2 & 3. Card White (Top-Right Narrow & Bottom-Left Narrow) */
    .pf-guardrail-card--white {
      background: #ffffff;
      color: #071018;
      border: 1.5px solid #2ece82;
      box-shadow: 0 4px 20px rgba(46, 205, 128, 0.08);
    }
    .pf-guardrail-card--white .pf-guardrail-tag { color: #087547; }
    .pf-guardrail-card--white .pf-guardrail-badge {
      background: rgba(46, 205, 128, 0.1);
      border: 1px solid rgba(46, 205, 128, 0.35);
      color: #087547;
    }
    .pf-guardrail-card--white .pf-guardrail-pulse {
      background: #2ece82;
      box-shadow: 0 0 6px #2ece82;
    }
    .pf-guardrail-card--white .pf-guardrail-icon-wrap {
      background: #f8faf9;
      border: 1px solid rgba(46, 205, 128, 0.35);
      color: #087547;
    }
    .pf-guardrail-card--white .pf-guardrail-title { color: #071018; }
    .pf-guardrail-card--white .pf-guardrail-desc { color: #64748b; }
    .pf-guardrail-card--white .pf-guardrail-footer { border-color: rgba(46, 205, 128, 0.2); }
    .pf-guardrail-card--white .pf-guardrail-points li { color: #334155; }
    .pf-guardrail-card--white .pf-guardrail-points svg { color: #2ece82; }

    /* 3. Card Black (Bottom-Left, Narrow) */
    .pf-guardrail-card--black {
      background: #090e15;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
    }
    .pf-guardrail-card--black .pf-guardrail-tag { color: #2ece82; }
    .pf-guardrail-card--black .pf-guardrail-badge {
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.3);
      color: #2ece82;
    }
    .pf-guardrail-card--black .pf-guardrail-pulse {
      background: #2ece82;
      box-shadow: 0 0 8px #2ece82;
    }
    .pf-guardrail-card--black .pf-guardrail-icon-wrap {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #2ece82;
    }
    .pf-guardrail-card--black .pf-guardrail-title { color: #ffffff; }
    .pf-guardrail-card--black .pf-guardrail-desc { color: rgba(255, 255, 255, 0.72); }
    .pf-guardrail-card--black .pf-guardrail-footer { border-color: rgba(255, 255, 255, 0.1); }
    .pf-guardrail-card--black .pf-guardrail-points li { color: rgba(255, 255, 255, 0.85); }
    .pf-guardrail-card--black .pf-guardrail-points svg { color: #2ece82; }

    @media (max-width: 900px) {
      .pf-guardrails-row--1,
      .pf-guardrails-row--2 {
        grid-template-columns: 1fr;
      }
    }

    /* =========================================================
       ORBITAL HUB: SEVEN MODULES SECTION
       ========================================================= */
    .pf-orbital-section {
      background: #ffffff;
      color: #14100a;
      padding: clamp(4.5rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem);
      position: relative;
    }
    .pf-orbital-inner {
      max-width: 88rem;
      margin: 0 auto;
    }
    .pf-orbital-heading {
      text-align: center;
      max-width: 62rem;
      width: 100%;
      margin: 0 auto clamp(0.75rem, 1.5vw, 1.25rem);
    }
    .pf-orbital-kicker {
      display: inline-block;
      color: #087547;
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.35);
    }
    .pf-orbital-heading h2 {
      font-family: 'Roobert', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: clamp(2rem, 3.2vw, 2.8rem);
      font-weight: 600;
      color: #071018;
      letter-spacing: -0.025em;
      margin: 0 0 0.5rem;
      white-space: nowrap;
    }
    .pf-orbital-heading p {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: rgba(20, 16, 10, 0.6);
      font-size: 1.05rem;
      line-height: 1.5;
      margin: 0 auto;
    }

    @media screen and (max-width: 640px) {
      .pf-orbital-heading h2 {
        white-space: normal;
      }
    }

    /* Orbital Radial Stage Container - Exact Mathematical Polar Radius */
    .pf-orbit-stage {
      position: relative;
      width: 100%;
      max-width: 1120px;
      height: 590px;
      margin: 0 auto clamp(1rem, 2vw, 2rem);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Center Disc & Concentric Rings */
    .pf-orbit-center-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: none;
    }

    .pf-orbit-svg-arcs {
      position: absolute;
      inset: -45px;
      width: calc(100% + 90px);
      height: calc(100% + 90px);
      pointer-events: none;
    }
    .pf-arc-track {
      fill: none;
      stroke: rgba(20, 16, 10, 0.06);
      stroke-width: 1.2;
    }
    .pf-arc-green {
      fill: none;
      stroke: #2ECE82;
      stroke-linecap: round;
    }
    .pf-arc-green--1 {
      stroke-width: 2.5;
      stroke-dasharray: 120 400;
      animation: pfRotateClockwise 18s linear infinite;
      transform-origin: center;
    }
    .pf-arc-green--2 {
      stroke-width: 2.2;
      stroke-dasharray: 90 350;
      animation: pfRotateCounterClockwise 24s linear infinite;
      transform-origin: center;
    }
    .pf-arc-green--3 {
      stroke-width: 2.8;
      stroke-dasharray: 140 300;
      animation: pfRotateClockwise 30s linear infinite;
      transform-origin: center;
    }

    @keyframes pfRotateClockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pfRotateCounterClockwise {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    .pf-orbit-center-disc {
      position: relative;
      width: 240px;
      height: 240px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(20, 16, 10, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1.35rem;
      z-index: 10;
      pointer-events: auto;
    }
    .pf-orbit-center-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .pf-orbit-core-pill {
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #087547;
      margin-bottom: 0.35rem;
    }
    .pf-orbit-center-content h3 {
      font-family: 'Roobert', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 1.45rem;
      font-weight: 600;
      color: #071018;
      margin: 0 0 0.35rem;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }
    .pf-orbit-center-content p {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.82rem;
      color: rgba(20, 16, 10, 0.58);
      margin: 0 0 0.65rem;
      line-height: 1.45;
      max-width: 12rem;
    }
    .pf-orbit-metric-badge {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.35);
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.68rem;
      font-weight: 700;
      color: #087547;
    }

    /* Nodes Layer */
    .pf-orbit-nodes-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .pf-orbit-node {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 1.15rem;
      cursor: pointer;
      pointer-events: auto;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 5;
    }

    /* Exact Equal Polar Distance (R = 255px) from Central Disc (50%, 50%) */
    .pf-node--top-left {
      top: calc(50% - 146px);
      left: calc(50% - 209px);
      transform: translate(calc(-100% + 36px), -50%);
    }
    .pf-node--mid-left {
      top: 50%;
      left: calc(50% - 255px);
      transform: translate(calc(-100% + 36px), -50%);
    }
    .pf-node--bottom-left {
      top: calc(50% + 146px);
      left: calc(50% - 209px);
      transform: translate(calc(-100% + 36px), -50%);
    }

    .pf-node--bottom-center {
      top: calc(50% + 255px);
      left: 50%;
      transform: translate(-50%, -36px);
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
      text-align: center;
    }

    .pf-node--bottom-right {
      top: calc(50% + 146px);
      left: calc(50% + 209px);
      transform: translate(-36px, -50%);
    }
    .pf-node--mid-right {
      top: 50%;
      left: calc(50% + 255px);
      transform: translate(-36px, -50%);
    }
    .pf-node--top-right {
      top: calc(50% - 146px);
      left: calc(50% + 209px);
      transform: translate(-36px, -50%);
    }

    .pf-node--top-left:hover,
    .pf-node--mid-left:hover,
    .pf-node--bottom-left:hover {
      transform: translate(calc(-100% + 36px), -50%) scale(1.04);
    }
    .pf-node--right-aligned:hover,
    .pf-node--top-right:hover,
    .pf-node--mid-right:hover,
    .pf-node--bottom-right:hover {
      transform: translate(-36px, -50%) scale(1.04);
    }
    .pf-node--bottom-center:hover {
      transform: translate(-50%, -36px) scale(1.04);
    }

    .pf-node-label {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.95rem;
      color: #071018;
      line-height: 1.35;
      max-width: 14.5rem;
      transition: color 0.2s ease;
    }
    .pf-node-label strong {
      font-family: 'Roobert', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 1.0rem;
      letter-spacing: -0.015em;
      color: #071018;
      display: block;
    }
    .pf-node-desc {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-height: 0;
      opacity: 0;
      margin: 0;
      font-size: 0.82rem;
      line-height: 1.45;
      color: rgba(20, 16, 10, 0.62);
      overflow: hidden;
      transform: translateY(-4px);
      transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, transform 0.3s ease, margin 0.3s ease;
      pointer-events: none;
    }
    .pf-orbit-node:hover .pf-node-desc,
    .pf-orbit-node.active .pf-node-desc {
      max-height: 8rem;
      opacity: 1;
      margin-top: 0.35rem;
      transform: translateY(0);
    }
    .pf-node-label--left { text-align: right; }
    .pf-node-label--right { text-align: left; }
    .pf-node-label--bottom { text-align: center; max-width: 18rem; }

    .pf-orbit-node:hover .pf-node-label strong,
    .pf-orbit-node.active .pf-node-label strong {
      color: #087547;
    }

    .pf-node-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 72px;
      height: 72px;
    }
    .pf-node-ring-outer {
      border: 1px dashed rgba(20, 16, 10, 0.2);
      border-radius: 50%;
      padding: 6px;
      transition: all 0.3s ease;
    }
    .pf-node-ring-inner {
      border: 1px solid rgba(20, 16, 10, 0.12);
      border-radius: 50%;
      padding: 4px;
      transition: all 0.3s ease;
    }
    .pf-node-circle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #071018;
      transition: all 0.3s ease;
    }

    .pf-orbit-node:hover .pf-node-ring-outer,
    .pf-orbit-node.active .pf-node-ring-outer {
      border-color: rgba(46, 205, 128, 0.6);
    }
    .pf-orbit-node:hover .pf-node-ring-inner,
    .pf-orbit-node.active .pf-node-ring-inner {
      border-color: #2ECE82;
    }
    .pf-orbit-node:hover .pf-node-circle,
    .pf-orbit-node.active .pf-node-circle {
      background: #ffffff;
      color: #087547;
      box-shadow: 0 0 22px rgba(46, 205, 128, 0.4), 0 4px 14px rgba(0, 0, 0, 0.08);
      transform: scale(1.05);
    }

    /* =========================================================
       SECTION B: ENTERPRISE INTEGRATION MESH STYLES
       ========================================================= */
    .pf-integrations-section {
      background: #f8faf9;
      color: #14100a;
      padding: clamp(4.5rem, 6vw, 6rem) clamp(1.5rem, 5vw, 4rem);
      border-top: 1px solid rgba(20, 16, 10, 0.08);
      position: relative;
    }
    .pf-integrations-inner {
      max-width: 82rem;
      margin: 0 auto;
    }
    .pf-integrations-heading {
      text-align: center;
      max-width: 46rem;
      margin: 0 auto clamp(2rem, 3vw, 2.75rem);
    }
    .pf-integrations-kicker {
      display: inline-block;
      color: #087547;
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
      padding: 0.25rem 0.85rem;
      border-radius: 999px;
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.35);
    }
    .pf-integrations-heading h2 {
      font-family: 'Roobert', sans-serif;
      font-size: clamp(2rem, 3vw, 2.75rem);
      font-weight: 600;
      color: #071018;
      letter-spacing: -0.025em;
      margin: 0 0 0.8rem;
    }
    .pf-integrations-heading p {
      font-family: 'Geist', sans-serif;
      color: rgba(20, 16, 10, 0.6);
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0 auto;
    }

    /* Marketplace / App Registry Section Style */
    .pf-marketplace-sections {
      display: flex;
      flex-direction: column;
      gap: 3.25rem;
      margin-top: 1rem;
    }
    .pf-marketplace-group {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .pf-marketplace-header {
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      border-bottom: 1px solid rgba(20, 16, 10, 0.08);
      padding-bottom: 0.75rem;
    }
    .pf-marketplace-title {
      font-family: 'Roobert', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 1.28rem;
      font-weight: 700;
      color: #071018;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .pf-marketplace-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.15rem;
    }
    .pf-marketplace-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1.1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .pf-marketplace-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
      border-color: #cbd5e1;
    }
    .pf-marketplace-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }
    .pf-marketplace-card:hover .pf-marketplace-icon {
      transform: scale(1.05);
    }
    .pf-marketplace-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.18rem;
      min-width: 0;
      flex: 1;
    }
    .pf-marketplace-tool-name {
      font-family: 'Roobert', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 1.02rem;
      font-weight: 700;
      color: #071018;
      line-height: 1.25;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .pf-marketplace-tag {
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.68rem;
      font-weight: 600;
      color: #087547;
      background: rgba(46, 205, 128, 0.12);
      border: 1px solid rgba(46, 205, 128, 0.28);
      padding: 0.12rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      letter-spacing: 0.01em;
      margin: 0.15rem 0 0.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .pf-marketplace-desc {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    @media screen and (max-width: 1024px) {
      .pf-marketplace-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media screen and (max-width: 640px) {
      .pf-marketplace-grid {
        grid-template-columns: 1fr;
      }
      .pf-marketplace-header {
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    /* Bottom Custom Connector Banner */
    .pf-int-footer-note {
      margin-top: 3rem;
    }
    .pf-int-note-card {
      background: #ffffff;
      border: 1px solid rgba(46, 205, 128, 0.3);
      border-radius: 14px;
      padding: 1.4rem 1.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
      box-shadow: 0 4px 20px rgba(46, 205, 128, 0.06);
    }
    .pf-int-note-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 52rem;
    }
    .pf-int-note-left strong {
      display: block;
      font-family: 'Roobert', sans-serif;
      font-size: 0.98rem;
      color: #071018;
      margin-bottom: 0.2rem;
    }
    .pf-int-note-left p {
      margin: 0;
      font-size: 0.86rem;
      line-height: 1.45;
      color: rgba(20, 16, 10, 0.65);
    }
    .pf-int-note-link {
      color: #087547;
      font-family: 'Roobert', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      transition: color 0.2s ease, transform 0.2s ease;
    }
    .pf-int-note-link:hover {
      color: #2ece82;
      transform: translateX(3px);
    }

    /* end CTA */
    .pf-end { background: #071018; color: #e9f2ed; padding: 4.5rem clamp(1.5rem,5vw,4rem); }
    .pf-end-inner { max-width: 82rem; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
    .pf-end h2 { margin: 0; font-size: clamp(1.6rem, 2vw + 1rem, 2.4rem); letter-spacing: 0; font-weight: 600; text-wrap: balance; }

    .pf a:focus-visible,
    .pf button:focus-visible { outline: 3px solid #2ECE82; outline-offset: 4px; }

    @media screen and (max-width: 1100px) {
      .pf-int-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media screen and (max-width: 992px) {
      .pf-drift-head { grid-template-columns:1fr; align-items:start; }.pf-drift-head p { max-width:42rem; }
      .pf-lifecycle-track { grid-template-columns: repeat(2,minmax(0,1fr)); }
      .pf-lifecycle-card:nth-child(2) { border-right: 0; }
      .pf-lifecycle-card:nth-child(-n+2) { border-bottom: 1px solid rgba(7,16,24,.12); }
      .pf-command-inner { grid-template-columns: 1fr; }
      .pf-command-visual { transform: none; }
      .pf-guardrails-grid { grid-template-columns: 1fr; }
      .pf-orbit-stage { height: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
      .pf-orbit-center-wrapper { position:relative; inset:auto; grid-column:1 / -1; margin:0 auto; transform:none; }
      .pf-orbit-nodes-layer { position: static; display: contents; }
      .pf-orbit-node { position: static !important; transform: none !important; justify-content: flex-start; }
      .pf-node--top-left, .pf-node--mid-left, .pf-node--bottom-left { flex-direction: row-reverse; }
      .pf-node-label--left { text-align: left; }
      .pf-node--bottom-center { grid-column: 1 / -1; flex-direction: row; justify-content: center; }
      .pf-node-desc { max-height: none !important; opacity: 1 !important; transform: none !important; }
    }

    @media screen and (max-width: 640px) {
      .pf-drift-canvas { display:grid; min-height:0; gap:.7rem; padding:1rem; }.pf-drift-grid,.pf-drift-rail { display:none; }.pf-drift-event,.pf-drift-summary { position:relative; inset:auto; width:100%; transform:none; animation:none; }.pf-drift-event::after { display:none; }.pf-drift-summary { order:-1; }.pf-drift-progress { position:relative; left:auto; right:auto; bottom:auto; grid-column:2 / -1; width:100%; margin-top:.2rem; }
      .pf-lifecycle-track { grid-template-columns: 1fr; }
      .pf-lifecycle-card, .pf-lifecycle-card:nth-child(2) { border-right: 0; border-bottom: 1px solid rgba(7,16,24,.12); }
      .pf-lifecycle-card:last-child { border-bottom: 0; }
      .pf-lifecycle-card p { min-height: 0; }
      .pf-command-body { grid-template-columns: 1fr; }
      .pf-command-sidebar { grid-template-columns: repeat(5,max-content); overflow-x: auto; }
      .pf-command-metrics { grid-template-columns: 1fr; }
      .pf-int-grid { grid-template-columns: 1fr; }
      .pf-int-tabs { justify-content: flex-start; }
      .pf-orbit-stage { grid-template-columns: 1fr; }
      .pf-orbital-section { padding-inline:1rem; }
      .pf-orbital-heading { margin-bottom:1.25rem; text-align:left; }
      .pf-orbit-center-wrapper { display:none; }
      .pf-orbit-stage { display:grid; gap:0; width:100%; margin:0; }
      .pf-orbit-node,
      .pf-node--bottom-center { display:grid; grid-template-columns:2.75rem minmax(0,1fr); gap:.85rem; align-items:start; justify-content:stretch; width:100%; padding:1rem 0; border-top:1px solid rgba(20,16,10,.12); text-align:left; }
      .pf-orbit-node:last-child { border-bottom:1px solid rgba(20,16,10,.12); }
      .pf-node-badge { grid-column:1; grid-row:1; width:2.75rem; height:2.75rem; }
      .pf-node-ring-outer { padding:3px; }
      .pf-node-ring-inner { padding:2px; }
      .pf-node-circle { width:2.25rem; height:2.25rem; box-shadow:none; }
      .pf-node-circle svg { width:1rem; height:1rem; }
      .pf-node-label,
      .pf-node-label--left,
      .pf-node-label--right,
      .pf-node-label--bottom { grid-column:2; grid-row:1; width:auto; max-width:none; text-align:left; }
      .pf-node-label strong { font-size:.9rem; }
      .pf-node-desc { margin-top:.3rem !important; font-size:.75rem; line-height:1.45; }
      .pf-node--top-left, .pf-node--mid-left, .pf-node--bottom-left { flex-direction: row; }
      .pf-node-label--left { text-align: left; }
      .pf-node--bottom-center { justify-content: flex-start; }
    }

    @media screen and (max-width: 860px) {
      .pf,
      .pf section,
      .pf .evd-hero-inner,
      .pf .evd-hero-inner > h1,
      .pf .evd-hero-inner > p,
      .pf .evd-hero-actions,
      .pf-flow-inner,
      .pf-guardrails-inner,
      .pf-integrations-inner,
      .pf .evd-feat-inner,
      .pf-end-inner,
      .pf .evd-feat-grid,
      .pf .evd-feat-left,
      .pf .evd-feat-list,
      .pf .evd-feat-item {
        width: 100%;
        min-width: 0;
        max-width: 100%;
      }
      .pf-flow { padding: 3.25rem 0 2rem; }
      .pf-flow-header { padding: 0 1.25rem; margin-bottom: 2rem; }
      .pf-lede { margin-bottom: 1.75rem; font-size: 1rem; }
      .pf-stack-row-inner { grid-template-columns: 1fr; gap: 1.25rem; }
      .pf-stack-left { min-height: auto; flex-direction: row; justify-content: space-between; align-items: baseline; }
      .pf-stack-num { padding-top: 0; }
      .pf-stack-row { top: 3.75rem; padding: 1.75rem 1.25rem; margin-bottom: 30vh; }
      .pf-stack-row:last-child { margin-bottom: 0; }
      .pf-stack-container { padding-bottom: 0; }

      .pf .evd-feat { padding: 3.25rem 1.25rem; }
      .pf .evd-feat-grid { gap: 1.5rem; }
      .pf .evd-feat-visual { display: none; }
      .pf .evd-feat-list { counter-reset: pf-workflow; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0.75rem; margin-top: 1.25rem; }
      .pf .evd-feat-item {
        counter-increment: pf-workflow;
        min-width: 0;
        min-height: 9rem;
        padding: 1rem;
        border: 1px solid rgba(20,16,10,0.12);
        border-radius: 8px;
        background: #fff;
      }
      .pf .evd-feat-item::before { content: counter(pf-workflow, decimal-leading-zero); display: block; margin-bottom: 0.8rem; font-family: 'Aeonik Mono', ui-monospace, monospace; color: #0787a5; }
      .pf .evd-feat-h { color: #14100a; }
      .pf .evd-feat-d,
      .pf .evd-feat-item.active .evd-feat-d { max-height: none; opacity: 1; margin: 0.45rem 0 0; font-size: 0.92rem; }
      .pf .evd-feat-bar { display: none; }
      .pf-end { padding: 3rem 1.25rem; }
      .pf-end-inner { align-items: flex-start; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pf-drift-event,.pf-drift-rail > i,.pf-drift-progress i { animation:none !important; }
      .pf *,
      .pf *::before,
      .pf *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
      .pf-stage:hover { transform: none; }
      .pf-arc-green--1, .pf-arc-green--2, .pf-arc-green--3 { animation: none !important; }
    }`;

  return renderPage({
    title: "The AI-Native Cybersecurity Platform | EVADA",
    description:
      "Know what to fix first with EVADA's AI-supported, tenant-isolated cybersecurity platform for governed validation, findings and immutable evidence.",
    css,
    body,
  });
}
