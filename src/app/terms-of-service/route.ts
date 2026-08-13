import { renderLegalPage, type LegalSection } from "../lib/public-legal";

const SECTIONS: readonly LegalSection[] = [
  {
    id: "agreement-and-scope",
    title: "Agreement and service scope",
    paragraphs: [
      "These terms govern access to EVADA's public website and enterprise security-validation service. By using EVADA, you agree to these terms and any applicable order form, subscription agreement or data processing agreement.",
      "EVADA provides workflows for authorized Asset management, controlled scanning, normalized Findings, VAPT report generation, team access and audit activity. Available modules and limits depend on the applicable plan and deployment.",
    ],
    note: "If a signed enterprise agreement conflicts with these online terms, the signed agreement controls for that customer.",
  },
  {
    id: "authority-and-responsibility",
    title: "Customer authority and responsibility",
    paragraphs: [
      "Customers are responsible for ensuring they have lawful authority to add every Asset and to perform every assessment requested through EVADA. Ownership verification is a technical safeguard and does not replace legal authorization.",
    ],
    bullets: [
      "Keep organization, Asset and contact information accurate.",
      "Assign roles and module permissions only to authorized people.",
      "Protect account credentials and notify EVADA promptly of suspected compromise.",
      "Review scanner scope, timing and impact before starting an assessment.",
    ],
  },
  {
    id: "accounts-and-access",
    title: "Accounts and workspace access",
    paragraphs: [
      "One EVADA identity may be associated with the organization and role approved for that account. Access remains subject to email verification, administrative approval, organization status, tenant readiness, membership state and configured permissions.",
      "Customers are responsible for promptly suspending or removing people who should no longer access a workspace. EVADA may require re-authentication or end sessions to protect account security.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: [
      "EVADA must not be used to scan, disrupt, access or test systems without authorization, to evade technical controls, to distribute malware, or to violate law or third-party rights.",
      "Users must not attempt to exceed queue, concurrency, rate, storage or tenant boundaries, interfere with other customers, or use the service to build or operate a competing unauthorized scanning service.",
    ],
  },
  {
    id: "scan-execution",
    title: "Scan execution and results",
    paragraphs: [
      "Security assessments can produce load, false positives, incomplete results or findings that require professional review. Customers choose authorized scope and remain responsible for operational readiness, backups and remediation decisions.",
      "EVADA may queue, limit, cancel or time out work to protect customer systems and shared infrastructure. Findings and reports reflect the evidence available at the time and do not guarantee that an environment is secure or free from vulnerabilities.",
    ],
  },
  {
    id: "customer-data",
    title: "Customer data and confidentiality",
    paragraphs: [
      "Customers retain their rights in data submitted to EVADA and in their generated security outputs. Customers grant EVADA the limited rights needed to host, process, secure and transmit that data for service delivery.",
      "Each party must protect the other's confidential information and use it only for the agreed purpose, subject to legally required disclosures and the terms of any enterprise agreement.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      "EVADA, its software, interfaces, documentation, workflows and related intellectual property remain owned by Netforte Consulting Ltd or its licensors. No ownership rights are transferred except where expressly stated in a signed agreement.",
      "Feedback may be used to improve EVADA without identifying the person or customer that provided it, unless otherwise agreed in writing.",
    ],
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    paragraphs: [
      "EVADA may rely on cloud infrastructure, email delivery, storage, monitoring and scanner technologies supplied by third parties. Their availability and behavior may affect the service.",
      "External links and customer-integrated services are governed by their own terms. EVADA is not responsible for third-party services outside its control, except as required by law or an applicable enterprise agreement.",
    ],
  },
  {
    id: "commercial-terms",
    title: "Fees, support and service commitments",
    paragraphs: [
      "Fees, usage allowances, renewal terms, support channels, service levels and report-retention commitments are defined in the applicable order form or subscription agreement.",
      "Taxes and payment obligations apply as stated in that agreement. Unless expressly agreed, preview, evaluation or local-development functionality is provided without a production service-level commitment.",
    ],
  },
  {
    id: "suspension-and-termination",
    title: "Suspension and termination",
    paragraphs: [
      "EVADA may suspend access where reasonably necessary to address security risk, unauthorized activity, non-payment, legal requirements or material breach. Where practical, notice and an opportunity to remedy will be provided.",
      "On termination, access ends and customer data is handled according to the applicable agreement, configured retention requirements and legal obligations.",
    ],
  },
  {
    id: "warranties-and-liability",
    title: "Warranties and liability",
    paragraphs: [
      "EVADA is designed to support security decisions, not replace professional judgment. To the extent permitted by law, warranties, remedies and liability limits are those set out in the applicable enterprise agreement.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded. Customers should review the relevant order form for negotiated commitments, exclusions and caps.",
    ],
  },
  {
    id: "changes-and-contact",
    title: "Changes, governing agreement and contact",
    paragraphs: [
      "These terms may be updated as EVADA and applicable law evolve. Material changes will be communicated through an appropriate channel and the effective date will be revised.",
      "The governing law, jurisdiction and formal notice procedure for an enterprise customer are defined in its signed agreement. For legal or contractual questions, contact info@evada.ai.",
    ],
  },
];

export async function GET() {
  return renderLegalPage({
    active: "terms",
    eyebrow: "Responsible platform use",
    title: "Terms of service",
    description:
      "The legal and operational standards for authorized use of EVADA's tenant-isolated security-validation service.",
    effectiveDate: "April 25, 2026",
    highlights: [
      "Only authorized Assets and security activity are permitted.",
      "Customers control scope, people and remediation decisions.",
      "Signed enterprise agreements supplement these online terms.",
    ],
    sections: SECTIONS,
  });
}
