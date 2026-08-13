export type EvadaErrorKind =
  | "not-found"
  | "page"
  | "global"
  | "access"
  | "network"
  | "service"
  | "resource"
  | "slow";

export type EvadaErrorDefinition = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  signal: string;
};

export const EVADA_ERROR_DEFINITIONS: Record<EvadaErrorKind, EvadaErrorDefinition> = {
  "not-found": {
    code: "404",
    eyebrow: "Route unavailable",
    title: "This page left no trace.",
    description: "The address may have changed, or the page may no longer be available.",
    signal: "ROUTE_NOT_FOUND",
  },
  page: {
    code: "ERR",
    eyebrow: "Page interrupted",
    title: "Something interrupted this page.",
    description: "Your session and previous work are safe. Retry the page or return to a stable location.",
    signal: "RENDER_INTERRUPTED",
  },
  global: {
    code: "SYS",
    eyebrow: "Application recovery",
    title: "EVADA could not continue.",
    description: "Reload the application to start a clean, secure session.",
    signal: "ROOT_RECOVERY_REQUIRED",
  },
  access: {
    code: "403",
    eyebrow: "Permission boundary",
    title: "This module is outside your access profile.",
    description: "Your workspace is active, but your current role does not allow this operation.",
    signal: "MODULE_ACCESS_DENIED",
  },
  network: {
    code: "NET",
    eyebrow: "Connection interrupted",
    title: "EVADA cannot reach the network.",
    description: "Check your connection. This screen will detect when the secure channel returns.",
    signal: "NETWORK_UNAVAILABLE",
  },
  service: {
    code: "503",
    eyebrow: "Service unavailable",
    title: "EVADA services are temporarily unavailable.",
    description: "The service may be restarting or under maintenance. Your stored workspace data is unaffected.",
    signal: "SERVICE_UNAVAILABLE",
  },
  resource: {
    code: "404",
    eyebrow: "Resource unavailable",
    title: "This resource could not be found.",
    description: "It may have been removed, or it may not belong to the active workspace.",
    signal: "RESOURCE_NOT_FOUND",
  },
  slow: {
    code: "WAIT",
    eyebrow: "Secure session pending",
    title: "Workspace initialization is taking longer than expected.",
    description: "EVADA is still resolving identity, permissions and tenant readiness.",
    signal: "WORKSPACE_STILL_LOADING",
  },
};

type ErrorLike = Error & {
  code?: string;
  digest?: string;
  status?: number;
  statusCode?: number;
};

export function resolveErrorKind(error: ErrorLike): EvadaErrorKind {
  const status = error.status ?? error.statusCode;
  const code = error.code?.toLowerCase();
  const message = error.message.toLowerCase();

  if (status === 401 || status === 403 || code === "module_access_denied") return "access";
  if (status === 404 || code === "resource_not_found") return "resource";
  if (status === 500 || status === 502 || status === 503 || status === 504) return "service";
  if (
    code === "network_error" ||
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("offline")
  ) {
    return "network";
  }

  return "page";
}

function hashErrorSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
}

export function createErrorReference(error?: Partial<ErrorLike>, prefix = "EV") {
  const seed = error?.digest || `${error?.name || "Error"}:${error?.message || "unknown"}`;
  return `${prefix}-${hashErrorSeed(seed)}`;
}
