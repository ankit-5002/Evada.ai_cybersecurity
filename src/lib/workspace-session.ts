const ACTIVE_ORGANIZATION_KEY = "evada.activeOrganization";

export function getActiveOrganizationId(): number | null {
  if (typeof window === "undefined") return null;
  const value = Number(window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY));
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function setActiveOrganizationId(organizationId: number | null) {
  if (typeof window === "undefined") return;
  if (organizationId) window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, String(organizationId));
  else window.localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
  window.dispatchEvent(new Event("evada.workspace-change"));
}
