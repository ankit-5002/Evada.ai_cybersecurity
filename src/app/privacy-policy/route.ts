import { renderLegalPage, type LegalSection } from "../lib/public-legal";

const SECTIONS: readonly LegalSection[] = [
  {
    id: "scope",
    title: "Scope and who is responsible",
    paragraphs: [
      "This policy explains how Netforte Consulting Ltd processes personal information when operating EVADA, including the public website, customer authentication, tenant workspaces and support communications.",
      "For enterprise customers, an order form, data processing agreement or other written contract may further define whether EVADA acts as a controller, processor or service provider for particular customer data.",
    ],
  },
  {
    id: "information-we-process",
    title: "Information we process",
    paragraphs: [
      "EVADA processes only the information needed to provide secure access, operate authorized security workflows and maintain the service.",
    ],
    bullets: [
      "Identity and account information, including name, work email, organization, role, verification state and membership permissions.",
      "Authentication and security metadata, including session events, timestamps, and connection or device diagnostics recorded by configured services.",
      "Authorized Asset scope, ownership-verification records, scanner configuration, scan evidence, normalized Findings, reports and activity records.",
      "Support, contact and demonstration requests submitted directly to EVADA.",
    ],
  },
  {
    id: "purposes-and-bases",
    title: "Why we process information",
    paragraphs: [
      "We process information to deliver the service, protect accounts and tenant workspaces, run customer-authorized assessments, generate evidence and reports, provide support and meet legal or contractual obligations.",
      "Depending on the context, processing is based on performance of a contract, legitimate interests in operating and securing EVADA, compliance with legal obligations, or consent where consent is required.",
    ],
  },
  {
    id: "customer-security-data",
    title: "Customer security data",
    paragraphs: [
      "Security telemetry and scan output remain scoped to the customer organization that authorized the work. EVADA uses tenant-aware routing, separate storage paths and access controls to prevent one organization from accessing another organization's evidence.",
      "Customers control which Assets are authorized, who may access a workspace and which permitted users may start scans, triage Findings or prepare reports.",
    ],
    note: "Do not submit credentials, personal data or targets that are not required for an authorized EVADA workflow.",
  },
  {
    id: "sharing",
    title: "Sharing and subprocessors",
    paragraphs: [
      "EVADA does not sell personal information. Information may be shared with approved infrastructure, communications, monitoring or security providers only where needed to operate the service.",
      "Subprocessors are subject to contractual confidentiality, data-protection and security obligations. Information may also be disclosed where required by law or to protect users, customers and platform integrity.",
    ],
  },
  {
    id: "international-transfers",
    title: "International transfers",
    paragraphs: [
      "Where information is processed outside the United Kingdom or the country in which it was collected, EVADA uses appropriate contractual and organizational safeguards required by applicable data-protection law.",
      "Enterprise deployment regions and additional transfer commitments may be specified in the relevant order form or data processing agreement.",
    ],
  },
  {
    id: "retention-and-security",
    title: "Retention and security",
    paragraphs: [
      "Information is retained for the period needed to provide the service, preserve agreed evidence and audit history, meet customer retention settings, and satisfy legal or contractual requirements. It is then deleted or anonymized where appropriate.",
    ],
    bullets: [
      "Encryption is used for sensitive data channels and configured storage services.",
      "Role and permission checks protect organization and tenant access.",
      "Authentication, scan, Finding, report and administrative actions may be recorded for accountability.",
      "No system is completely risk-free; EVADA maintains proportionate technical and organizational safeguards and reviews them as the service evolves.",
    ],
  },
  {
    id: "rights-and-choices",
    title: "Your rights and choices",
    paragraphs: [
      "Depending on applicable law, you may have rights to access, correct, delete, restrict or object to processing of personal information, or to request a portable copy. You may also complain to the relevant data-protection authority.",
      "Requests can be sent to info@evada.ai. We may need to verify identity and organization authority before acting on a request, particularly where it concerns enterprise workspace data.",
    ],
  },
  {
    id: "cookies",
    title: "Cookie policy and browser storage",
    paragraphs: [
      "EVADA uses browser storage technologies where they are necessary for secure account access, session continuity and workspace preferences. The current application uses local storage for authentication state and the active organization, and session storage for short-lived navigation and status messages.",
      "These technologies are not used to sell personal information. Clearing browser storage may sign you out, remove the selected workspace or interrupt an in-progress account setup flow.",
    ],
    bullets: [
      "Strictly necessary storage supports authentication, security and core service behavior.",
      "Preference storage remembers limited workspace or navigation choices on the device.",
      "If optional analytics or advertising technologies are introduced, EVADA will provide the disclosures and consent controls required by applicable law before using them.",
      "You can manage storage through browser controls, although blocking necessary storage may prevent authenticated features from working.",
    ],
  },
  {
    id: "updates-and-contact",
    title: "Updates and contact",
    paragraphs: [
      "We may update this policy when the service, legal requirements or processing practices change. Material updates will be communicated through an appropriate channel and the effective date will be revised.",
      "For privacy questions or rights requests, contact info@evada.ai. Netforte Consulting Ltd's office is 124 City Road, London, EC1V 2NX, United Kingdom.",
    ],
  },
];

export async function GET() {
  return renderLegalPage({
    active: "privacy",
    eyebrow: "Privacy and data protection",
    title: "Privacy policy",
    description:
      "How EVADA handles account, tenant, security and operational information while delivering authorized security validation.",
    effectiveDate: "April 25, 2026",
    highlights: [
      "EVADA does not sell personal information.",
      "Customer security data stays scoped to its organization.",
      "Browser storage supports secure sessions and workspace continuity.",
    ],
    sections: SECTIONS,
  });
}
