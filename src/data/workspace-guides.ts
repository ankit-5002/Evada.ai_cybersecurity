export type WorkspaceGuideId =
  | "assets"
  | "scanner-engine"
  | "findings"
  | "reports"
  | "team";

export type WorkspaceGuideTopic =
  | WorkspaceGuideId
  | "asset-web-application"
  | "asset-api-endpoint"
  | "asset-hostname"
  | "verification-dns"
  | "verification-http"
  | "scanner-web-app"
  | "scanner-tls"
  | "scanner-api"
  | "scanner-database"
  | "scanner-os-port"
  | "scanner-sharepoint"
  | "scanner-hybrid"
  | "scanner-sast-dast";

export type GuideStep = {
  title: string;
  description: string;
};

export type WorkspaceGuide = {
  id: WorkspaceGuideTopic;
  moduleId: WorkspaceGuideId;
  eyebrow: string;
  title: string;
  summary: string;
  whenToUse: string[];
  steps: GuideStep[];
  rules: string[];
  fullGuideHref: string;
  returnHref: string;
};

export type ScannerOperationalGuide = {
  status: "Ready" | "Locked";
  engine: string;
  supportedScope: string;
  evidenceFormat: string;
  inputs: string[];
  processing: string[];
  storedData: string[];
  findingExamples: string[];
};

const moduleGuides: Record<WorkspaceGuideId, WorkspaceGuide> = {
  assets: {
    id: "assets",
    moduleId: "assets",
    eyebrow: "Authorized scope",
    title: "Asset Management guide",
    summary: "Register security targets, prove that your organization controls them, and make verified scope available to compatible scanners.",
    whenToUse: [
      "Before running a scanner against a new website, API, or public hostname.",
      "When a target changes domain, protocol, ownership, environment, or business owner.",
      "When reviewing verification history, risk, tags, and scanner compatibility.",
    ],
    steps: [
      { title: "Define the Asset", description: "Choose the correct Asset type, enter its canonical target, environment, owner label, and useful tags." },
      { title: "Generate ownership proof", description: "EVADA creates a short-lived DNS TXT or HTTP file challenge for the exact Asset hostname." },
      { title: "Verify control", description: "Publish the exact challenge, wait for it to become publicly visible, then ask EVADA to verify it." },
      { title: "Use verified scope", description: "An Active Asset becomes selectable only by scanners compatible with its Asset type." },
      { title: "Track risk", description: "Completed scans normalize evidence into Findings and update the Asset risk summary." },
    ],
    rules: [
      "Only add targets your organization is authorized to assess.",
      "A changed target requires a new ownership challenge.",
      "Archiving removes an Asset from scanner selection but preserves history.",
      "DNS values must match the currently active challenge exactly.",
    ],
    fullGuideHref: "/assets/guide",
    returnHref: "/assets",
  },
  "scanner-engine": {
    id: "scanner-engine",
    moduleId: "scanner-engine",
    eyebrow: "Isolated assessment",
    title: "Scanner Engine guide",
    summary: "Select a released adapter and a compatible verified Asset, then follow the queued job from isolated execution through stored evidence and normalization.",
    whenToUse: [
      "To run an approved Web App or TLS/SSL assessment.",
      "To inspect scan progress, cancellation, retry, evidence, or normalization status.",
      "To understand which adapters are ready and which remain release-locked.",
    ],
    steps: [
      { title: "Choose an adapter", description: "Ready adapters can run. Locked adapters remain visible for roadmap clarity but cannot be selected." },
      { title: "Select verified scope", description: "EVADA lists only Active Assets whose type is supported by the selected scanner." },
      { title: "Queue the job", description: "The request is tenant-scoped and sent through Redis to a resource-limited scanner worker." },
      { title: "Store raw evidence", description: "Scanner output is uploaded under the tenant storage prefix in MinIO locally or S3 in production." },
      { title: "Normalize results", description: "The parser deduplicates scanner evidence into Findings without altering the original artifact." },
    ],
    rules: [
      "Targets cannot be typed or overridden from the scan screen.",
      "Leaving the page does not stop a queued or running job.",
      "Only released adapters may execute.",
      "Cancellation and retries are recorded in the scan lifecycle.",
    ],
    fullGuideHref: "/scans/guide",
    returnHref: "/scans",
  },
  findings: {
    id: "findings",
    moduleId: "findings",
    eyebrow: "Normalized evidence",
    title: "Findings guide",
    summary: "Review deduplicated security observations, understand severity and evidence, assign a workflow decision, remediate, and validate through retesting.",
    whenToUse: [
      "After a scan completes and normalization finishes.",
      "When prioritizing security work by Asset, severity, scanner, or workflow state.",
      "When reviewing evidence and remediation before marking an issue resolved.",
    ],
    steps: [
      { title: "Filter by Asset", description: "Start from an affected Asset to keep a large tenant inventory understandable." },
      { title: "Review the evidence", description: "Open a Finding to inspect the observation, affected location, scanner rule, and supporting evidence." },
      { title: "Triage the workflow", description: "Move the Finding through review using the permitted status and decision controls." },
      { title: "Apply remediation", description: "Use the recommended remediation as a starting point and record the real fix in the owning system." },
      { title: "Retest", description: "Run the compatible scanner again. A clean result can resolve the Finding while preserving its history." },
    ],
    rules: [
      "Severity describes technical impact, while workflow status describes the team's decision.",
      "A Finding is tenant-scoped and cannot be opened from another organization.",
      "Raw evidence remains linked to the originating scan.",
      "Report snapshots do not change when a live Finding is edited later.",
    ],
    fullGuideHref: "/findings/guide",
    returnHref: "/findings",
  },
  reports: {
    id: "reports",
    moduleId: "reports",
    eyebrow: "Immutable deliverables",
    title: "VAPT Reports guide",
    summary: "Capture a fixed tenant snapshot of Assets and Findings, generate PDF and JSON artifacts, and distribute them through short-lived signed downloads.",
    whenToUse: [
      "For an audit, customer delivery, remediation review, or management summary.",
      "When a fixed record is required even if live Findings change later.",
      "When downloading generated PDF or machine-readable JSON evidence.",
    ],
    steps: [
      { title: "Choose report scope", description: "Select the workspace or specific Assets and choose the report format required by the audience." },
      { title: "Capture the snapshot", description: "EVADA freezes the selected Assets and Findings and records a snapshot integrity hash." },
      { title: "Generate artifacts", description: "A dedicated report worker renders PDF and JSON without rerunning any scanner." },
      { title: "Store and retain", description: "Artifacts are stored in tenant storage for the configured retention period." },
      { title: "Prepare downloads", description: "EVADA creates short-lived signed links and records download activity." },
    ],
    rules: [
      "Issued report content is immutable.",
      "Generating a report does not start a security scan.",
      "Signed download links expire and should not be forwarded publicly.",
      "Deleting a report must follow organization retention and audit policy.",
    ],
    fullGuideHref: "/reports/guide",
    returnHref: "/reports",
  },
  team: {
    id: "team",
    moduleId: "team",
    eyebrow: "Workspace access",
    title: "Team access guide",
    summary: "Add members through secure account setup, assign a fixed role or custom module profile, control access duration, and review membership status.",
    whenToUse: [
      "When granting a colleague access to the current workspace.",
      "When changing a member's status, expiry, or custom module access.",
      "When resending or revoking an unfinished account setup.",
    ],
    steps: [
      { title: "Check the email", description: "EVADA confirms that the identity is eligible for this workspace under the current single-workspace membership policy." },
      { title: "Select role and duration", description: "Choose Viewer, Admin, or Custom and set 30, 60, 90 days, or permanent access." },
      { title: "Send secure setup", description: "The member receives a one-time link and creates a private password. Owners never see that password." },
      { title: "Activate permissions", description: "After setup, the sidebar and backend authorization use the assigned membership profile." },
      { title: "Maintain access", description: "Owners can suspend, renew, or remove eligible members while protected roles remain restricted." },
    ],
    rules: [
      "Only the Owner can create, suspend, or remove an Admin.",
      "Viewer access is read-only for permitted operational modules.",
      "Custom access enables only the modules selected by the Owner.",
      "Frontend visibility never replaces backend permission enforcement.",
    ],
    fullGuideHref: "/team/guide",
    returnHref: "/team",
  },
};

function topic(
  id: WorkspaceGuideTopic,
  moduleId: WorkspaceGuideId,
  title: string,
  summary: string,
  whenToUse: string[],
  steps: GuideStep[],
  rules: string[],
): WorkspaceGuide {
  const moduleGuide = moduleGuides[moduleId];
  return {
    id,
    moduleId,
    eyebrow: `${moduleGuide.title.replace(" guide", "")} help`,
    title,
    summary,
    whenToUse,
    steps,
    rules,
    fullGuideHref: `${moduleGuide.fullGuideHref}?topic=${id}`,
    returnHref: moduleGuide.returnHref,
  };
}

const topicGuides: Partial<Record<WorkspaceGuideTopic, WorkspaceGuide>> = {
  "asset-web-application": topic(
    "asset-web-application", "assets", "Web application Asset", "Use this type for a website, browser application, customer portal, or other HTTP/HTTPS user interface.",
    ["The target is opened and used through a browser.", "You need Web App scanning and usually TLS/SSL checks."],
    [
      { title: "Enter the canonical URL", description: "Use the public http:// or https:// URL without credentials or a URL fragment." },
      { title: "Verify the hostname", description: "Publish the DNS TXT record or HTTP verification file for the hostname in that URL." },
      { title: "Run compatible scanners", description: "After verification, select the Asset in Web App or TLS/SSL Scanner." },
    ],
    ["Do not add a third-party website without written authorization.", "Use API endpoint instead when the target is primarily a machine API."],
  ),
  "asset-api-endpoint": topic(
    "asset-api-endpoint", "assets", "API endpoint Asset", "Use this type for a REST, GraphQL, SOAP, or other HTTP/HTTPS API surface.",
    ["The target is consumed primarily by applications rather than a browser UI.", "You want to attach an OpenAPI contract or API authentication profile later."],
    [
      { title: "Enter the API base URL", description: "Use the stable scheme and host, plus a base path when it defines the API boundary." },
      { title: "Verify the host", description: "Complete DNS TXT or HTTP file verification for the API hostname." },
      { title: "Use released adapters", description: "TLS/SSL is available now. API Scanner remains unavailable until its adapter is released." },
    ],
    ["Never place API keys in the target URL.", "Scanner credentials must be stored as secret references, not Asset metadata."],
  ),
  "asset-hostname": topic(
    "asset-hostname", "assets", "Hostname Asset", "Use this type for a public domain or service host when a full application URL is not the right scope.",
    ["You need transport or host-level assessment of a public service.", "The target is a hostname such as vpn.example.com or mail.example.com."],
    [
      { title: "Enter only the hostname", description: "Do not add a scheme, path, credentials, or port to this Asset type." },
      { title: "Prove DNS control", description: "Publish the challenge under the exact hostname supplied by EVADA." },
      { title: "Select a compatible scanner", description: "TLS/SSL is available; future host and port adapters remain release-locked." },
    ],
    ["Use separate Assets when distinct hosts have different owners or environments.", "Private network targets belong in the Network Agent workflow."],
  ),
  "verification-dns": topic(
    "verification-dns", "assets", "DNS TXT ownership verification", "Prove control by publishing one exact TXT value at the EVADA verification hostname.",
    ["You can edit public DNS for the Asset hostname.", "The site cannot publish a file under /.well-known/."],
    [
      { title: "Copy Name and Value", description: "Use the exact Name and TXT Value shown for the currently active challenge." },
      { title: "Publish the TXT record", description: "In providers that append the domain automatically, enter only the host label shown before the domain." },
      { title: "Wait for public DNS", description: "Check that the configured public resolver returns the new value before verifying." },
      { title: "Verify once", description: "Press Check DNS and verify. Do not regenerate while waiting, because that invalidates the previous value." },
    ],
    ["The value is safe to publish and does not expose credentials.", "A mismatch means DNS still returns an older challenge or the value was copied incorrectly."],
  ),
  "verification-http": topic(
    "verification-http", "assets", "HTTP file ownership verification", "Prove control by serving the exact challenge as plain text from the required /.well-known/ URL.",
    ["You control web hosting but not DNS.", "The target can serve a stable public file with HTTP 200."],
    [
      { title: "Copy the challenge value", description: "Create evada-verification.txt with only the exact value shown by EVADA." },
      { title: "Publish the file", description: "Place it at the displayed /.well-known/ URL on the exact hostname." },
      { title: "Check the public response", description: "Open the URL without signing in and confirm HTTP 200 with plain text content." },
      { title: "Verify ownership", description: "Return to EVADA and run the verification check before the challenge expires." },
    ],
    ["Redirects, access-denied pages, HTML wrappers, and login screens will fail verification.", "The file contains a verification token, never a password or private key."],
  ),
  "scanner-web-app": topic("scanner-web-app", "scanner-engine", "Web App Scanner", "Runs the released passive OWASP ZAP baseline against a verified web application.", ["For browser-facing websites and portals.", "For a safe baseline before deeper authenticated testing."], [{ title: "Select verified web scope", description: "Only compatible Active Web application Assets appear." }, { title: "Queue baseline", description: "A resource-limited scanner container assesses the target and uploads raw evidence." }, { title: "Review Findings", description: "Normalization creates deduplicated Web Findings after the scan succeeds." }], ["This is a passive baseline, not permission for destructive testing.", "Use only against authorized Assets."]),
  "scanner-tls": topic("scanner-tls", "scanner-engine", "TLS/SSL Scanner", "Assesses certificates, protocols, ciphers, trust, and transport-security posture for a verified public target.", ["For websites, APIs, and public hostnames using TLS.", "For certificate expiry and weak transport configuration review."], [{ title: "Select compatible scope", description: "Choose an Active Web application, API endpoint, or Hostname Asset." }, { title: "Run transport checks", description: "The SSLyze-based adapter inspects the endpoint without application credentials." }, { title: "Review transport Findings", description: "Results are normalized and linked back to the Asset and scan evidence." }], ["The target must be publicly reachable from the scanner runtime.", "A clean TLS scan does not prove the web application itself is secure."]),
  "scanner-api": topic("scanner-api", "scanner-engine", "API Scanner", "Planned OpenAPI-aware assessment for REST and API attack surfaces.", ["After the API adapter and secure authentication profiles are released."], [{ title: "Create an API Asset", description: "Register and verify the API base URL." }, { title: "Attach contract and secret profile", description: "Use an OpenAPI source and encrypted credential reference." }, { title: "Run API policy", description: "The released adapter will test only allowed operations and normalize evidence." }], ["This adapter is currently locked and cannot execute.", "Never store API secrets in Asset fields or scan URLs."]),
  "scanner-database": topic("scanner-database", "scanner-engine", "Database Scanner", "Planned adapter for database exposure, authentication, configuration, and service risk.", ["For explicitly authorized database services after the adapter is released."], [{ title: "Define approved scope", description: "Register the database endpoint without embedding credentials." }, { title: "Attach a secret reference", description: "Use a controlled, least-privilege scanner identity." }, { title: "Run released checks", description: "Configuration and exposure checks will produce normalized Findings." }], ["This adapter is currently locked.", "Production credentials must never be exposed to the browser."]),
  "scanner-os-port": topic("scanner-os-port", "scanner-engine", "OS / Port Scanner", "Planned host and service discovery for authorized public or agent-reachable targets.", ["For inventorying exposed services after the adapter is released."], [{ title: "Choose authorized host scope", description: "Use a verified public Hostname or Network Agent target." }, { title: "Select a bounded profile", description: "Ports, timing, and resource limits must be explicit." }, { title: "Normalize services", description: "Discovered services and risks will feed Assets and Findings." }], ["This adapter is currently locked.", "Broad network ranges require explicit authorization and tighter quotas."]),
  "scanner-sharepoint": topic("scanner-sharepoint", "scanner-engine", "SharePoint Scanner", "Planned Microsoft 365 assessment for SharePoint permissions, external sharing, and exposed content controls.", ["For an authorized Microsoft 365 tenant after consent integration is released."], [{ title: "Authorize Microsoft 365", description: "A tenant administrator grants the minimum required application permissions." }, { title: "Select SharePoint scope", description: "Choose approved sites and policy checks." }, { title: "Review access Findings", description: "Permission and sharing observations will be normalized without copying document content unnecessarily." }], ["This adapter is currently locked.", "OAuth consent and tenant boundaries must be enforced before release."]),
  "scanner-hybrid": topic("scanner-hybrid", "scanner-engine", "Hybrid SOS Scanner", "Planned orchestrated profile combining compatible application, transport, and host checks.", ["For a bounded multi-adapter baseline after all required adapters are released."], [{ title: "Select verified scope", description: "EVADA determines which released checks are compatible." }, { title: "Launch child jobs", description: "Each adapter runs in its own resource-limited execution." }, { title: "Merge results", description: "Evidence stays attributable while Findings are deduplicated across adapters." }], ["This adapter is currently locked.", "Hybrid execution must respect per-adapter quotas and cancellation."]),
  "scanner-sast-dast": topic("scanner-sast-dast", "scanner-engine", "SAST/DAST Scanner", "Planned combined source-aware and runtime assessment for an authorized application release.", ["When a repository and deployed Asset can be linked under one approved scope."], [{ title: "Authorize repository and Asset", description: "Connect source scope separately from the verified runtime target." }, { title: "Run isolated analysis", description: "Static and dynamic engines execute with bounded permissions." }, { title: "Correlate evidence", description: "EVADA links code and runtime evidence without losing the source of each Finding." }], ["This adapter is currently locked.", "Repository tokens must remain in the secret manager and use read-only access."]),
};

export const scannerOperationalGuides: Partial<Record<WorkspaceGuideTopic, ScannerOperationalGuide>> = {
  "scanner-web-app": {
    status: "Ready",
    engine: "OWASP ZAP Baseline",
    supportedScope: "Verified Web application Assets",
    evidenceFormat: "ZAP JSON and HTML artifacts",
    inputs: [
      "Immutable Asset ID, canonical URL, hostname and environment snapshot.",
      "Baseline scan profile and tenant-scoped execution identifiers.",
      "No browser-supplied target override and no credentials in the scan request.",
    ],
    processing: [
      "The customer API validates execute permission and verified Asset scope.",
      "Redis queues the job for an isolated, resource-limited Web scanner container.",
      "The result parser reads the raw ZAP output and deduplicates observations.",
    ],
    storedData: [
      "Raw scanner artifacts under the tenant scan prefix in MinIO locally or S3 in production.",
      "Scan status, timestamps, lifecycle events, summary and artifact references in the tenant database.",
      "Normalized Findings linked to the Asset, scan, scanner rule and evidence reference.",
    ],
    findingExamples: ["Missing security headers", "Potential reflected XSS indicators", "Information disclosure", "Insecure caching", "Outdated Web components"],
  },
  "scanner-tls": {
    status: "Ready",
    engine: "SSLyze transport assessment",
    supportedScope: "Verified Web application, API endpoint and Hostname Assets",
    evidenceFormat: "Structured TLS JSON artifact",
    inputs: [
      "Immutable Asset hostname and resolved TLS endpoint from verified scope.",
      "Baseline transport profile, tenant ID and scan lifecycle identifiers.",
      "No application login credentials are required for the released baseline.",
    ],
    processing: [
      "EVADA validates Asset compatibility before placing the job on Redis.",
      "An isolated TLS scanner inspects certificate chains, protocols, ciphers and endpoint posture.",
      "The parser converts transport observations into stable, deduplicated Findings.",
    ],
    storedData: [
      "Raw TLS evidence in tenant MinIO/S3 storage under the scan artifact prefix.",
      "Certificate, protocol and cipher summaries with lifecycle metadata in the tenant database.",
      "Normalized transport Findings with remediation and originating evidence references.",
    ],
    findingExamples: ["Certificate expiry risk", "Untrusted certificate chain", "Weak TLS protocol", "Weak cipher support", "Hostname mismatch"],
  },
  "scanner-api": {
    status: "Locked",
    engine: "Planned OpenAPI-aware API adapter",
    supportedScope: "Verified API endpoint Assets",
    evidenceFormat: "Planned request/response metadata and JSON evidence",
    inputs: ["Verified API base URL and immutable Asset snapshot.", "Validated OpenAPI contract or an approved endpoint inventory.", "Encrypted authentication-profile reference from the secret manager, never a raw browser secret."],
    processing: ["Validate allowed methods, paths and rate policy.", "Run bounded API checks in an isolated container.", "Redact sensitive response content before evidence normalization."],
    storedData: ["Redacted API test evidence in tenant object storage.", "Endpoint coverage and lifecycle metadata in the tenant database.", "Normalized API Findings linked to operation IDs and evidence references."],
    findingExamples: ["Broken authorization signal", "Missing rate controls", "Sensitive response exposure", "Unsafe method access", "Schema validation weakness"],
  },
  "scanner-database": {
    status: "Locked",
    engine: "Planned database exposure adapter",
    supportedScope: "Explicitly authorized database service Assets",
    evidenceFormat: "Planned configuration and exposure JSON evidence",
    inputs: ["Approved database hostname, port and service type.", "Least-privilege scanner identity stored as a secret reference.", "A bounded policy that excludes destructive queries and production-data extraction."],
    processing: ["Confirm scope and secret authorization server-side.", "Inspect network exposure, transport, authentication posture and safe configuration signals.", "Normalize configuration observations without copying business records."],
    storedData: ["Configuration evidence and redacted service metadata in tenant storage.", "Execution history and secret-reference identifier, never the secret value.", "Normalized database Findings linked to the approved service Asset."],
    findingExamples: ["Public database exposure", "TLS not enforced", "Weak authentication posture", "Unsafe default configuration", "Excessive service privileges"],
  },
  "scanner-os-port": {
    status: "Locked",
    engine: "Planned bounded host discovery adapter",
    supportedScope: "Verified public Hostnames or Network Agent scope",
    evidenceFormat: "Planned host, port and service JSON evidence",
    inputs: ["Authorized hostname, IP or agent-approved target boundary.", "Explicit port range, timing profile and concurrency limit.", "Tenant-scoped job ID and cancellation policy."],
    processing: ["Resolve the approved target without expanding scope automatically.", "Run service discovery in a resource-limited scanner job.", "Normalize exposed services and host signals into Asset and Finding records."],
    storedData: ["Raw discovery output in tenant object storage.", "Observed ports, protocols and service fingerprints in tenant data.", "Findings and Asset service metadata with first-seen and last-seen timestamps."],
    findingExamples: ["Unexpected exposed port", "Administrative service exposed", "Obsolete service version", "Insecure plaintext protocol", "Unrecognized reachable service"],
  },
  "scanner-sharepoint": {
    status: "Locked",
    engine: "Planned Microsoft Graph and SharePoint adapter",
    supportedScope: "Authorized Microsoft 365 tenant and selected SharePoint sites",
    evidenceFormat: "Planned permission and sharing metadata evidence",
    inputs: ["Microsoft 365 tenant consent with minimum required permissions.", "Approved SharePoint site identifiers and policy profile.", "OAuth credential reference held in the secret manager."],
    processing: ["Confirm tenant consent and selected site boundaries.", "Inspect sharing, guest access and permission metadata.", "Avoid copying document bodies unless a future policy explicitly requires it."],
    storedData: ["Redacted permission and sharing evidence in tenant storage.", "Consent reference, site coverage and lifecycle metadata.", "Normalized SharePoint Findings linked to the affected site or resource reference."],
    findingExamples: ["Anonymous sharing enabled", "Excessive guest access", "Overly broad site permissions", "Stale external collaborator", "Sensitive site exposed externally"],
  },
  "scanner-hybrid": {
    status: "Locked",
    engine: "Planned multi-adapter orchestrator",
    supportedScope: "Verified Assets compatible with two or more released adapters",
    evidenceFormat: "Separate child artifacts plus correlation metadata",
    inputs: ["One immutable verified Asset snapshot.", "Explicitly selected compatible child scanners and profiles.", "Shared quota, timeout and cancellation policy for the parent run."],
    processing: ["Create isolated child jobs rather than combining engines in one container.", "Track each adapter lifecycle independently.", "Correlate and deduplicate results while preserving scanner attribution."],
    storedData: ["Original child-scanner artifacts under separate tenant prefixes.", "Parent and child lifecycle relationships in tenant data.", "Correlated Findings that retain every supporting evidence reference."],
    findingExamples: ["Web and TLS risk correlation", "Host exposure linked to application risk", "Duplicate observation merged across scanners", "Cross-layer remediation priority"],
  },
  "scanner-sast-dast": {
    status: "Locked",
    engine: "Planned source and runtime orchestration",
    supportedScope: "Authorized source repository plus verified deployed Asset",
    evidenceFormat: "Separate static and dynamic artifacts with correlation metadata",
    inputs: ["Read-only repository connection stored as a secret reference.", "Approved branch or commit and immutable deployed Asset snapshot.", "Explicit static and dynamic policies with bounded execution."],
    processing: ["Run source analysis and runtime testing in separate isolated jobs.", "Redact secrets and avoid retaining unnecessary source content.", "Correlate code locations with runtime evidence without losing origin."],
    storedData: ["Static and dynamic artifacts under separate tenant storage prefixes.", "Repository reference, commit identifier and deployed Asset relationship.", "Correlated Findings with code location and runtime evidence where available."],
    findingExamples: ["Unsafe source pattern confirmed at runtime", "Vulnerable dependency exposure", "Injection path correlation", "Missing source-to-deployment control", "Runtime issue without source match"],
  },
};

export const workspaceGuides: Record<WorkspaceGuideTopic, WorkspaceGuide> = {
  ...moduleGuides,
  ...topicGuides,
} as Record<WorkspaceGuideTopic, WorkspaceGuide>;

export function getWorkspaceGuide(id: WorkspaceGuideTopic) {
  return workspaceGuides[id];
}

export function guideForSection(section: string): WorkspaceGuideId | null {
  if (section === "asset-management") return "assets";
  if (section === "scanner-engine") return "scanner-engine";
  if (section === "findings") return "findings";
  if (section === "reports") return "reports";
  if (section === "team") return "team";
  return null;
}
