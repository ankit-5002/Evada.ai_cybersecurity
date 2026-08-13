import { clearAuthSession, getRefreshToken, setAuthTokens } from "./auth-session";

export type AuthUser = {
  id: number;
  email: string;
  full_name: string;
  workplace: string;
  is_email_verified: boolean;
  date_joined: string;
  last_login: string | null;
  admin_approval_status?: string;
  plan_code?: string;
  tenant_database_status?: string;
};

export type AuthenticationActivityDay = {
  date: string;
  label: string;
  weekday: string;
  login_count: number;
  logout_count: number;
  is_today: boolean;
  is_future: boolean;
  active: boolean;
  events: Array<{
    type: "login" | "logout";
    reason: "authenticated" | "manual" | "idle_timeout" | "absolute_timeout" | "revoked";
    occurred_at: string;
  }>;
};

export type AuthenticationActivityResponse = {
  timezone: string;
  range_start: string;
  range_end: string;
  today: string;
  summary: {
    logins: number;
    logouts: number;
    active_days: number;
    last_login_at: string | null;
  };
  days: AuthenticationActivityDay[];
};

export type AuthenticationSession = {
  id: string;
  audience: "customer" | "admin";
  created_at: string;
  last_activity_at: string;
  idle_expires_at: string;
  absolute_expires_at: string;
  warning_seconds: number;
};

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  status: string;
  plan_code: string;
  role: OrganizationRole;
  membership_status: string;
  tenant_status: string;
  enabled_modules: string[];
  permissions: PermissionProfile;
  user_limit: number;
  report_retention_days: number;
  access_expires_at: string | null;
  days_remaining: number | null;
};

export type OrganizationRole = "owner" | "admin" | "viewer" | "custom";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "execute" | "download" | "manage";

export type PermissionProfile = {
  role: OrganizationRole;
  modules: string[];
  actions: Record<string, PermissionAction[]>;
  owner_controls: boolean;
};

export type AssetType = "web_application" | "api_endpoint" | "hostname";
export type AssetEnvironment = "production" | "staging" | "development" | "testing";
export type AssetStatus = "pending_verification" | "active" | "archived";
export type AssetRisk = "unknown" | "informational" | "low" | "medium" | "high" | "critical";
export type AssetVerificationMethod = "dns_txt" | "http_file";
export type AssetVerificationStatus = "pending" | "verified" | "failed" | "expired";

export type Asset = {
  id: string;
  name: string;
  category: string;
  asset_type: AssetType;
  target: string;
  canonical_target: string;
  hostname: string;
  scheme: string;
  port: number | null;
  status: AssetStatus;
  risk: AssetRisk;
  risk_score: number;
  finding_counts: Record<Exclude<AssetRisk, "unknown">, number>;
  risk_calculated_at: string | null;
  environment: AssetEnvironment;
  owner_label: string;
  owner_email: string;
  tags: string[];
  verification_method: AssetVerificationMethod;
  verification_status: AssetVerificationStatus;
  verification_expires_at: string | null;
  verified_at: string | null;
  last_verification_attempt_at: string | null;
  verification_attempt_count: number;
  verification_error_code: string;
  verification_error_detail: string;
  last_scan_at: string | null;
  compatible_scanners: string[];
  created_at: string;
  updated_at: string;
};

export type AssetChallenge = {
  method: AssetVerificationMethod;
  record_type: string | null;
  host: string | null;
  url: string | null;
  value: string;
  expires_at: string;
};

export type AssetVerificationEvent = {
  id: number;
  status: string;
  method: AssetVerificationMethod;
  message: string;
  error_code: string;
  attempted_by_email: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AssetPayload = {
  name: string;
  asset_type: AssetType;
  target: string;
  environment: AssetEnvironment;
  verification_method: AssetVerificationMethod;
  owner_label: string;
  tags: string[];
};

export type AssetListResponse = {
  organization: Workspace;
  results: Asset[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  summary: { total: number; active: number; pending_verification: number; at_risk: number; archived: number };
};

export type ScannerCode = "web-app" | "tls" | "api" | "database" | "os-port" | "sharepoint" | "hybrid-sos" | "sast-dast";
export type ScanStatus = "queued" | "running" | "uploading" | "cancel_requested" | "succeeded" | "failed" | "cancelled" | "timed_out";

export type ScannerDefinition = {
  code: ScannerCode;
  name: string;
  description: string;
  available: boolean;
  asset_types: AssetType[];
  profile?: "baseline";
};

export type Scan = {
  id: string;
  asset_id: string;
  asset_name: string;
  name: string;
  scanner: ScannerCode;
  scanner_name: string;
  profile: "baseline";
  target: string;
  target_snapshot: Record<string, unknown>;
  status: ScanStatus;
  progress: number;
  stage: string;
  summary: Record<string, unknown>;
  findings_count: number;
  normalization_status: "pending" | "queued" | "running" | "retrying" | "complete" | "failed" | "not_applicable";
  normalization_error_code: string;
  normalization_error_detail: string;
  normalized_at: string | null;
  error_code: string;
  error_detail: string;
  timeout_seconds: number;
  created_by_email: string;
  queued_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancel_requested_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ScanEvent = {
  id: number;
  event_type: string;
  status: ScanStatus;
  stage: string;
  progress: number;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ScanArtifact = {
  id: number;
  artifact_type: string;
  storage_key: string;
  content_type: string;
  size_bytes: number;
  checksum_sha256: string;
  created_at: string;
};

export type ScanListResponse = {
  organization: Workspace;
  results: Scan[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  summary: { total: number; active: number; succeeded: number; failed: number };
};

export type FindingSeverity = "informational" | "low" | "medium" | "high" | "critical";
export type FindingStatus = "open" | "in_progress" | "accepted_risk" | "false_positive" | "resolved" | "reopened";

export type Finding = {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_target: string;
  first_scan_id: string | null;
  last_scan_id: string | null;
  scanner: "web-app" | "tls";
  engine_name: string;
  engine_rule_id: string;
  title: string;
  raw_severity: FindingSeverity;
  severity: FindingSeverity;
  confidence: "low" | "medium" | "high" | "confirmed";
  status: FindingStatus;
  cve: string;
  cwe: string;
  description: string;
  remediation: string;
  references: string[];
  affected_component: string;
  occurrence_count: number;
  assigned_to_email: string;
  due_at: string | null;
  severity_override_reason: string;
  metadata: Record<string, unknown>;
  first_seen_at: string;
  last_seen_at: string;
  resolved_at: string | null;
  reopened_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FindingInstance = {
  id: string;
  location: string;
  http_method: string;
  parameter: string;
  attack: string;
  evidence: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type FindingEvent = {
  id: number;
  scan_id: string | null;
  event_type: string;
  from_status: string;
  to_status: string;
  actor_type: string;
  actor_email: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type FindingObservation = {
  scan_id: string;
  raw_severity: FindingSeverity;
  instance_count: number;
  observed_at: string;
  metadata: Record<string, unknown>;
};

export type FindingListResponse = {
  organization: Workspace;
  results: Finding[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  summary: {
    active: number;
    resolved: number;
    accepted_risk: number;
    false_positive: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
};

export type ReportType = "full_vapt" | "executive" | "technical" | "retest";
export type ReportStatus = "queued" | "generating" | "retrying" | "ready" | "failed" | "expired";

export type VaptReport = {
  id: string;
  title: string;
  report_type: ReportType;
  scope_type: "workspace" | "selected_assets";
  scope: {
    asset_ids?: string[];
    include_resolved?: boolean;
    include_false_positives?: boolean;
    date_from?: string | null;
    date_to?: string | null;
  };
  status: ReportStatus;
  progress: number;
  stage: string;
  requested_formats: Array<"pdf" | "json">;
  requested_by_email: string;
  celery_task_id: string;
  attempt_count: number;
  summary: {
    asset_count?: number;
    finding_count?: number;
    severity_counts?: Record<FindingSeverity, number>;
    workflow_counts?: Record<string, number>;
    artifact_count?: number;
  };
  error_code: string;
  error_detail: string;
  snapshot_hash: string;
  generated_at: string | null;
  retention_expires_at: string | null;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportEvent = {
  event_type: string;
  status: ReportStatus;
  stage: string;
  progress: number;
  actor_type: string;
  actor_email: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ReportArtifact = {
  format: "pdf" | "json";
  content_type: string;
  size_bytes: number;
  checksum_sha256: string;
  created_at: string;
};

export type ReportSnapshot = {
  organization: { id: number; name: string; slug: string; plan_code: string };
  scope: Record<string, unknown>;
  assets: Array<{ id: string; name: string; target: string; environment: string; risk: string; risk_score: number }>;
  severity_counts: Record<FindingSeverity, number>;
  workflow_counts: Record<string, number>;
  finding_count: number;
  findings_preview: Array<Pick<Finding, "id" | "asset_id" | "asset_name" | "asset_target" | "title" | "severity" | "status" | "scanner" | "description" | "remediation">>;
  created_at: string;
};

export type ReportListResponse = {
  organization: Workspace;
  results: VaptReport[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  summary: { active: number; ready: number; failed: number; expired: number; this_month: number };
};

export type DashboardOperation = {
  kind: "scan" | "report";
  id: string;
  title: string;
  subject: string;
  status: string;
  progress: number;
  stage: string;
  href: string;
  updated_at: string;
};

export type DashboardNotification = {
  notification_key: string;
  kind: "asset" | "scan" | "finding" | "report" | "system";
  object_id: string;
  object_name: string;
  status: string;
  title: string;
  message: string | null;
  tone: "success" | "error" | "warning" | "info";
  href: string;
  created_at: string;
  read: boolean;
};

export type DashboardActivityEvent = {
  event_key: string;
  kind: "asset" | "scan" | "finding" | "report" | "team" | "organization";
  event_type: string;
  object_id: string;
  object_name: string;
  status: string;
  actor_type: "user" | "system";
  actor_email: string;
  message: string;
  metadata: Record<string, unknown>;
  href: string;
  created_at: string;
};

export type DashboardActivityResponse = {
  results: DashboardActivityEvent[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
  summary: {
    total: number;
    today: number;
    user_actions: number;
    system_events: number;
    needs_attention: number;
  };
  control_plane_available: boolean;
};

export type DashboardSearchResult = {
  kind: "asset" | "scan" | "finding" | "report";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  updated_at: string;
};

export type DashboardOverview = {
  organization: Workspace;
  generated_at: string;
  summary: {
    assets: { total: number; active: number; pending: number; at_risk: number; archived: number; average_risk_score: number };
    scans: { total: number; active: number; succeeded: number; failed: number; today: number };
    findings: {
      active: number;
      resolved: number;
      in_review: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      informational: number;
    };
    reports: { total: number; active: number; ready: number; failed: number; this_month: number };
    team: { active: number; pending: number; limit: number; available: number; unavailable?: boolean };
  };
  recent_scans: Array<{
    id: string;
    scanner: ScannerCode;
    name: string;
    asset_name: string;
    target: string;
    status: ScanStatus;
    progress: number;
    stage: string;
    findings_count: number;
    created_at: string;
    completed_at: string | null;
  }>;
  priority_findings: Array<{
    id: string;
    title: string;
    severity: FindingSeverity;
    status: FindingStatus;
    occurrence_count: number;
    last_seen_at: string;
    asset_name: string;
    asset_id: string;
  }>;
  operations: DashboardOperation[];
  notifications: { unread: number; results: DashboardNotification[] };
};

export type OrganizationMember = {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  role: OrganizationRole;
  custom_modules: string[];
  permissions: PermissionProfile;
  status: "active" | "pending" | "suspended" | "expired" | "removed";
  joined_at: string | null;
  access_expires_at: string | null;
  days_remaining: number | null;
  created_at: string;
};

export type TeamMemberSetup = {
  id: number;
  email: string;
  full_name: string;
  role: Exclude<OrganizationRole, "owner">;
  custom_modules: string[];
  permissions: PermissionProfile;
  status: "pending" | "completed" | "expired" | "revoked";
  access_duration_days: number | null;
  delivery_status: "queued" | "sent" | "failed";
  sent_at: string | null;
  send_attempts: number;
  last_delivery_error: string;
  expires_at: string;
  created_at: string;
  created_by: string | null;
};

export type OrganizationTeam = {
  organization: Workspace;
  can_manage: boolean;
  members: OrganizationMember[];
  pending_setups: TeamMemberSetup[];
};

export type TeamMemberAvailability = {
  available: boolean;
  code: string;
  detail: string;
  has_account: boolean;
};

export type TeamSetupPreview = {
  setup: TeamMemberSetup & {
    organization: { id: number; name: string };
  };
};

export type EnterpriseClientActivationPreview = {
  activation: {
    email: string;
    full_name: string;
    organization_name: string;
    expires_at: string;
    delivery_status: "queued" | "sent" | "failed";
  };
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type SignupPayload = {
  full_name: string;
  workplace: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  uid: string;
  token: string;
  password: string;
  confirm_password: string;
};

type SignupResponse = {
  message: string;
  user: AuthUser;
};

type LoginResponse = {
  message: string;
  user: AuthUser;
  tokens: AuthTokens;
  session: AuthenticationSession;
};

type MessageResponse = {
  message: string;
  status?: "sent" | "pending";
};

type VerifyEmailResponse = {
  message: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export type WorkspaceBootstrapResponse = {
  user: AuthUser;
  organizations: Workspace[];
};

export class ApiError extends Error {
  status: number;
  code?: string;
  data: unknown;

  constructor(message: string, status: number, data: unknown, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = code;
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const API_REQUEST_TIMEOUT_MS = 30_000;
let refreshPromise: Promise<string> | null = null;

async function apiFetch(input: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const upstreamSignal = init.signal;
  let timedOut = false;
  const abortFromUpstream = () => controller.abort();

  if (upstreamSignal?.aborted) controller.abort();
  else upstreamSignal?.addEventListener("abort", abortFromUpstream, { once: true });

  const timeout = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (timedOut) {
      throw new ApiError("This request timed out. Please try again.", 504, null, "request_timeout");
    }
    if (upstreamSignal?.aborted) throw error;
    throw new ApiError("EVADA could not reach the service. Check your connection and try again.", 0, null, "network_error");
  } finally {
    globalThis.clearTimeout(timeout);
    upstreamSignal?.removeEventListener("abort", abortFromUpstream);
  }
}

function getErrorCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const maybeCode = (data as { code?: unknown }).code;
  if (typeof maybeCode === "string") return maybeCode;
  if (Array.isArray(maybeCode)) {
    const firstCode = maybeCode.find((value) => typeof value === "string");
    return typeof firstCode === "string" ? firstCode : undefined;
  }
  return undefined;
}

function valueToMessage(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(valueToMessage).filter(Boolean).join(" ");
  }
  if (value && typeof value === "object") {
    return Object.values(value)
      .map(valueToMessage)
      .filter(Boolean)
      .join(" ");
  }
  return null;
}

export function getApiFieldErrors(error: unknown) {
  if (!(error instanceof ApiError) || !error.data || typeof error.data !== "object" || Array.isArray(error.data)) {
    return {} as Record<string, string>;
  }

  const fieldErrors: Record<string, string> = {};
  Object.entries(error.data as Record<string, unknown>).forEach(([field, value]) => {
    if (["detail", "message", "code", "non_field_errors"].includes(field)) return;
    const message = valueToMessage(value);
    if (message) fieldErrors[field] = message;
  });
  return fieldErrors;
}

function getErrorMessage(data: unknown): string {
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const detail = (data as { detail?: unknown }).detail;
    const detailMessage = valueToMessage(detail);
    if (detailMessage) return detailMessage;

    const nonFieldErrors = (data as { non_field_errors?: unknown }).non_field_errors;
    const nonFieldMessage = valueToMessage(nonFieldErrors);
    if (nonFieldMessage) return nonFieldMessage;

    const message = (data as { message?: unknown }).message;
    const messageText = valueToMessage(message);
    if (messageText) return messageText;

    const fieldMessages = valueToMessage(data);
    if (fieldMessages) return fieldMessages;
  }

  return "Something went wrong. Please try again.";
}

async function readResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  if (contentType.includes("text/html") || /^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text)) {
    return {
      code: "unexpected_server_response",
      detail: response.status === 404
        ? "This feature is not available from the running backend. Restart the EVADA backend and try again."
        : "EVADA received an unexpected server response. Please retry after restarting the service.",
    };
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function preserveReturnPath() {
  if (typeof window === "undefined") return;
  const returnPath = `${window.location.pathname}${window.location.search}`;
  if (!returnPath.startsWith("/login") && !returnPath.startsWith("/signup")) {
    window.sessionStorage.setItem("evada.returnTo", returnPath);
  }
}

async function refreshCustomerSession() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new ApiError("Your session has expired. Please sign in again.", 401, null, "session_expired");

    const response = await apiFetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    const data = await readResponse(response);
    if (!response.ok || !data || typeof data !== "object" || typeof (data as { access?: unknown }).access !== "string") {
      throw new ApiError("Your session has expired. Please sign in again.", 401, data, "session_expired");
    }

    const access = (data as { access: string }).access;
    const rotatedRefresh = typeof (data as { refresh?: unknown }).refresh === "string" ? (data as { refresh: string }).refresh : refresh;
    const session = (data as { session?: AuthenticationSession }).session;
    setAuthTokens({ access, refresh: rotatedRefresh }, session);
    return access;
  })();

  try {
    return await refreshPromise;
  } catch (error) {
    preserveReturnPath();
    clearAuthSession();
    if (typeof window !== "undefined") {
      window.setTimeout(() => window.location.assign("/login"), 0);
    }
    throw error;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(path: string, init: RequestInit = {}, options: { retryAuth?: boolean } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  let response = await apiFetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
  let data = await readResponse(response);

  if (response.status === 401 && headers.has("Authorization") && options.retryAuth !== false) {
    try {
      const access = await refreshCustomerSession();
      headers.set("Authorization", `Bearer ${access}`);
      response = await apiFetch(`${API_BASE_URL}${path}`, { ...init, headers });
      data = await readResponse(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Your session has expired. Please sign in again.", 401, null, "session_expired");
    }
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status, data, getErrorCode(data));
  }

  return data as T;
}

export function signup(payload: SignupPayload) {
  return request<SignupResponse>("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resendVerification(email: string) {
  return request<MessageResponse>("/auth/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function forgotPassword(email: string) {
  return request<MessageResponse>("/auth/forgot-password/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function validateResetToken(uid: string, token: string) {
  const query = new URLSearchParams({ uid, token });
  return request<MessageResponse>(`/auth/reset-password/?${query.toString()}`);
}

export function verifyEmail(uid: string, token: string) {
  const query = new URLSearchParams({ uid, token });
  return request<VerifyEmailResponse>(`/auth/verify-email/?${query.toString()}`);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return request<MessageResponse>("/auth/reset-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(accessToken: string) {
  return request<MeResponse>("/auth/me/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getWorkspaceBootstrap(accessToken: string) {
  return request<WorkspaceBootstrapResponse>("/workspace-bootstrap/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function listMyOrganizations(accessToken: string) {
  return request<{ organizations: Workspace[] }>("/me/organizations/", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getTenantContext(accessToken: string, organizationId: number) {
  return request<{ organization: Workspace; tenant: { status: string } }>("/tenant-context/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Evada-Organization": String(organizationId),
    },
  });
}

export function getDashboardOverview(accessToken: string, organizationId: number) {
  return request<DashboardOverview>("/tenant/dashboard/overview/", {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function searchDashboard(accessToken: string, organizationId: number, query: string) {
  const search = new URLSearchParams({ q: query });
  return request<{ query: string; results: DashboardSearchResult[] }>(`/tenant/dashboard/search/?${search.toString()}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function listDashboardNotifications(accessToken: string, organizationId: number, limit = 20, unreadOnly = false, page = 1) {
  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (unreadOnly) query.set("unread", "true");
  return request<{ results: DashboardNotification[]; unread: number; total: number; page: number; pages: number }>(`/tenant/notifications/?${query.toString()}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function listDashboardActivity(
  accessToken: string,
  organizationId: number,
  filters: { page?: number; page_size?: number; q?: string; kind?: string; actor?: string; status?: string } = {},
) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return request<DashboardActivityResponse>(`/tenant/activity/?${query.toString()}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function markDashboardNotificationsRead(accessToken: string, organizationId: number, keys: string[]) {
  return request<{ read: number }>("/tenant/notifications/read/", {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({ keys }),
  });
}

export function markAllDashboardNotificationsRead(accessToken: string, organizationId: number) {
  return request<{ read: number }>("/tenant/notifications/read-all/", {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({}),
  });
}

function tenantHeaders(accessToken: string, organizationId: number) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "X-Evada-Organization": String(organizationId),
  };
}

export function listAssets(
  accessToken: string,
  organizationId: number,
  filters: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: AssetStatus;
    asset_type?: AssetType;
    environment?: AssetEnvironment;
    risk?: AssetRisk;
  } = {},
) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<AssetListResponse>(`/tenant/assets/${suffix}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function createAsset(accessToken: string, organizationId: number, payload: AssetPayload) {
  return request<{ result: Asset; challenge: AssetChallenge }>("/tenant/assets/", {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify(payload),
  });
}

export function getAsset(accessToken: string, organizationId: number, assetId: string) {
  return request<{
    result: Asset;
    verification_events: AssetVerificationEvent[];
    findings_summary: { active: number; resolved: number; critical_or_high: number } | null;
    recent_findings: Array<Pick<Finding, "id" | "title" | "severity" | "status" | "scanner" | "last_seen_at">>;
  }>(`/tenant/assets/${assetId}/`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function updateAsset(accessToken: string, organizationId: number, assetId: string, payload: Partial<AssetPayload>) {
  return request<{ result: Asset; challenge: AssetChallenge | null }>(`/tenant/assets/${assetId}/`, {
    method: "PATCH",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify(payload),
  });
}

export function archiveAsset(accessToken: string, organizationId: number, assetId: string) {
  return request<void>(`/tenant/assets/${assetId}/`, {
    method: "DELETE",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function regenerateAssetChallenge(
  accessToken: string,
  organizationId: number,
  assetId: string,
  verificationMethod?: AssetVerificationMethod,
) {
  return request<{ result: Asset; challenge: AssetChallenge }>(`/tenant/assets/${assetId}/challenge/`, {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify(verificationMethod ? { verification_method: verificationMethod } : {}),
  });
}

export function verifyAsset(accessToken: string, organizationId: number, assetId: string) {
  return request<{ verified: boolean; code: string; detail: string; result: Asset }>(`/tenant/assets/${assetId}/verify/`, {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({}),
  });
}

export function listScanners(accessToken: string, organizationId: number) {
  return request<{ results: ScannerDefinition[] }>("/tenant/scans/scanners/", {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function listScans(
  accessToken: string,
  organizationId: number,
  filters: { page?: number; page_size?: number; search?: string; status?: ScanStatus; scanner?: ScannerCode; asset_id?: string } = {},
) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<ScanListResponse>(`/tenant/scans/${suffix}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function createScan(accessToken: string, organizationId: number, payload: { asset_id: string; scanner: ScannerCode; profile?: "baseline" }) {
  return request<{ result: Scan }>("/tenant/scans/", {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({ ...payload, profile: payload.profile || "baseline" }),
  });
}

export function getScan(accessToken: string, organizationId: number, scanId: string) {
  return request<{ result: Scan; events: ScanEvent[]; artifacts: ScanArtifact[] }>(`/tenant/scans/${scanId}/`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function cancelScan(accessToken: string, organizationId: number, scanId: string) {
  return request<{ result: Scan }>(`/tenant/scans/${scanId}/cancel/`, {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({}),
  });
}

export function retryScanNormalization(accessToken: string, organizationId: number, scanId: string) {
  return request<{ result: Scan }>(`/tenant/scans/${scanId}/normalize/`, {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({}),
  });
}

export function listFindings(
  accessToken: string,
  organizationId: number,
  filters: {
    page?: number;
    page_size?: number;
    search?: string;
    severity?: FindingSeverity;
    status?: FindingStatus;
    scanner?: "web-app" | "tls";
    asset_id?: string;
    assigned_to?: string;
  } = {},
) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<FindingListResponse>(`/tenant/findings/${suffix}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function getFinding(accessToken: string, organizationId: number, findingId: string) {
  return request<{
    result: Finding;
    instances: FindingInstance[];
    events: FindingEvent[];
    observations: FindingObservation[];
    artifacts: ScanArtifact[];
  }>(`/tenant/findings/${findingId}/`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function updateFinding(
  accessToken: string,
  organizationId: number,
  findingId: string,
  payload: {
    status?: Exclude<FindingStatus, "resolved" | "reopened">;
    assigned_to_email?: string;
    due_at?: string | null;
    severity?: FindingSeverity;
    decision_reason?: string;
  },
) {
  return request<{ result: Finding }>(`/tenant/findings/${findingId}/`, {
    method: "PATCH",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify(payload),
  });
}

export function getFindingEvidence(accessToken: string, organizationId: number, findingId: string) {
  return request<{
    results: Array<ScanArtifact & { download_url: string; expires_in: number }>;
  }>(`/tenant/findings/${findingId}/evidence/`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function listReports(
  accessToken: string,
  organizationId: number,
  filters: { page?: number; page_size?: number; search?: string; status?: ReportStatus; report_type?: ReportType } = {},
) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  return request<ReportListResponse>(`/tenant/reports/${suffix}`, {
    method: "GET",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function createReport(
  accessToken: string,
  organizationId: number,
  payload: {
    title: string;
    report_type: ReportType;
    scope_type: "workspace" | "selected_assets";
    asset_ids: string[];
    formats: Array<"pdf" | "json">;
    include_resolved: boolean;
    include_false_positives: boolean;
    date_from?: string | null;
    date_to?: string | null;
  },
) {
  return request<{ result: VaptReport }>("/tenant/reports/", {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify(payload),
  });
}

export function getReport(accessToken: string, organizationId: number, reportId: string) {
  return request<{ result: VaptReport; events: ReportEvent[]; artifacts: ReportArtifact[]; snapshot: ReportSnapshot | null }>(
    `/tenant/reports/${reportId}/`,
    { method: "GET", headers: tenantHeaders(accessToken, organizationId) },
  );
}

export function retryReport(accessToken: string, organizationId: number, reportId: string) {
  return request<{ result: VaptReport }>(`/tenant/reports/${reportId}/retry/`, {
    method: "POST",
    headers: tenantHeaders(accessToken, organizationId),
    body: JSON.stringify({}),
  });
}

export function getReportArtifacts(accessToken: string, organizationId: number, reportId: string) {
  return request<{ results: Array<ReportArtifact & { download_url: string; expires_in: number }> }>(
    `/tenant/reports/${reportId}/artifacts/`,
    { method: "GET", headers: tenantHeaders(accessToken, organizationId) },
  );
}

export function deleteReport(accessToken: string, organizationId: number, reportId: string) {
  return request<void>(`/tenant/reports/${reportId}/`, {
    method: "DELETE",
    headers: tenantHeaders(accessToken, organizationId),
  });
}

export function getOrganizationTeam(accessToken: string, organizationId: number) {
  return request<OrganizationTeam>(`/organizations/${organizationId}/team/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function checkTeamMemberEmail(accessToken: string, organizationId: number, email: string) {
  return request<TeamMemberAvailability>(`/organizations/${organizationId}/members/check-email/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ email }),
  });
}

export function addTeamMember(
  accessToken: string,
  organizationId: number,
  payload: {
    full_name: string;
    email: string;
    role: "admin" | "viewer" | "custom";
    custom_modules: string[];
    access_duration_days: number | null;
  },
) {
  return request<{ message: string; setup: TeamMemberSetup }>(`/organizations/${organizationId}/members/add/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export function revokeTeamSetup(accessToken: string, organizationId: number, setupId: number) {
  return request<void>(`/organizations/${organizationId}/member-setups/${setupId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function resendTeamSetup(accessToken: string, organizationId: number, setupId: number) {
  return request<{ message: string; setup: TeamMemberSetup }>(`/organizations/${organizationId}/member-setups/${setupId}/resend/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function updateOrganizationMember(accessToken: string, organizationId: number, membershipId: number, changes: { role?: string; status?: string; custom_modules?: string[] }) {
  return request<{ member: OrganizationMember }>(`/organizations/${organizationId}/members/${membershipId}/`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(changes),
  });
}

export function removeOrganizationMember(accessToken: string, organizationId: number, membershipId: number) {
  return request<void>(`/organizations/${organizationId}/members/${membershipId}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function renewOrganizationMembership(accessToken: string, organizationId: number, membershipId: number, accessDurationDays = 30) {
  return request<{ message: string; member: OrganizationMember }>(`/organizations/${organizationId}/members/${membershipId}/renew/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ access_duration_days: accessDurationDays }),
  });
}

export function previewTeamSetup(token: string) {
  const query = new URLSearchParams({ token });
  return request<TeamSetupPreview>(`/team-setups/preview/?${query.toString()}`);
}

export function completeTeamSetup(token: string, password: string, confirmPassword: string) {
  return request<{ message: string; email: string; organization: Workspace }>("/team-setups/complete/", {
    method: "POST",
    body: JSON.stringify({ token, password, confirm_password: confirmPassword }),
  });
}

export function previewEnterpriseClientActivation(token: string) {
  const query = new URLSearchParams({ token });
  return request<EnterpriseClientActivationPreview>(`/client-activations/preview/?${query.toString()}`);
}

export function completeEnterpriseClientActivation(token: string, password: string, confirmPassword: string) {
  return request<{ message: string; email: string; organization: Workspace }>("/client-activations/complete/", {
    method: "POST",
    body: JSON.stringify({ token, password, confirm_password: confirmPassword }),
  });
}

export function logout(refreshToken: string, reason: "manual" | "idle_timeout" | "absolute_timeout" = "manual") {
  return request<MessageResponse>("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken, reason }),
  }, { retryAuth: false });
}

export function getAuthenticationSession(accessToken: string) {
  return request<{ session: AuthenticationSession }>("/auth/session/", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function touchAuthenticationSession(accessToken: string) {
  return request<{ session: AuthenticationSession }>("/auth/session/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getAuthenticationActivity(accessToken: string, timezone: string) {
  const query = new URLSearchParams({ timezone });
  return request<AuthenticationActivityResponse>(`/auth/activity/?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
