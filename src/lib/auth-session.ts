import type { AuthenticationSession, AuthTokens, AuthUser } from "./auth-api";

const ACCESS_TOKEN_KEY = "evada.accessToken";
const REFRESH_TOKEN_KEY = "evada.refreshToken";
const USER_KEY = "evada.user";
const SESSION_KEY = "evada.authenticationSession";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitAuthSessionChange() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event("evada.auth-session-change"));
}

function emitAuthIdentityChange() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event("evada.auth-identity-change"));
}

function readJwtExp(token: string) {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4), "=");
    const parsed = JSON.parse(window.atob(paddedPayload)) as { exp?: number };

    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
}

function isAccessTokenActive(token: string) {
  if (!canUseStorage()) return false;

  const exp = readJwtExp(token);
  if (!exp) return false;

  return exp * 1000 > Date.now() + 30_000;
}

export function setAuthSession(tokens: AuthTokens, user: AuthUser, session: AuthenticationSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitAuthSessionChange();
  emitAuthIdentityChange();
}

export function setAuthTokens(tokens: AuthTokens, session?: AuthenticationSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitAuthSessionChange();
}

export function setStoredAuthenticationSession(session: AuthenticationSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitAuthSessionChange();
}

export function clearAuthSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthSessionChange();
  emitAuthIdentityChange();
}

export function getAccessToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!canUseStorage()) return null;
  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getStoredAuthenticationSession(): AuthenticationSession | null {
  if (!canUseStorage()) return null;
  const rawSession = window.localStorage.getItem(SESSION_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthenticationSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function hasActiveAuthSession() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken && !refreshToken) return false;

  return Boolean((accessToken && isAccessTokenActive(accessToken)) || (refreshToken && isAccessTokenActive(refreshToken)));
}

export function subscribeAuthSession(callback: () => void) {
  if (!canUseStorage()) return () => undefined;

  window.addEventListener("storage", callback);
  window.addEventListener("evada.auth-session-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("evada.auth-session-change", callback);
  };
}

export function subscribeAuthIdentity(callback: () => void) {
  if (!canUseStorage()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === USER_KEY || event.key === null) callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("evada.auth-identity-change", callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("evada.auth-identity-change", callback);
  };
}
