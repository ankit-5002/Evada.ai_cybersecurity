"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, getTenantContext, getWorkspaceBootstrap, type AuthUser, type Workspace } from "@/lib/auth-api";
import { getAccessToken, getStoredUser, subscribeAuthIdentity } from "@/lib/auth-session";
import { getActiveOrganizationId, setActiveOrganizationId } from "@/lib/workspace-session";
import { usePageLoadingTask } from "@/components/loading/PageLoadingProvider";

type WorkspaceContextValue = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeOrganizationId: number | null;
  user: AuthUser | null;
  loading: boolean;
  switching: boolean;
  error: string;
  selectWorkspace: (organizationId: number) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeOrganizationId, setActiveOrganizationState] = useState<number | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  usePageLoadingTask("workspace-bootstrap", loading || switching);

  const refreshWorkspaces = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setUser(null);
      setWorkspaces([]);
      setActiveOrganizationState(null);
      setActiveOrganizationId(null);
      setLoading(false);
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
    setLoading(true);
    setError("");
    try {
      const workspaceResponse = await getWorkspaceBootstrap(accessToken);
      setUser(workspaceResponse.user);
      setWorkspaces(workspaceResponse.organizations);
      const storedId = getActiveOrganizationId();
      const selected = workspaceResponse.organizations.find((item) => item.id === storedId) || workspaceResponse.organizations[0] || null;
      setActiveOrganizationState(selected?.id || null);
      setActiveOrganizationId(selected?.id || null);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not load workspaces.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWorkspaces();
    return subscribeAuthIdentity(() => void refreshWorkspaces());
  }, [refreshWorkspaces]);

  const selectWorkspace = useCallback(async (organizationId: number) => {
    if (organizationId === activeOrganizationId || !workspaces.some((item) => item.id === organizationId)) return;
    const accessToken = getAccessToken();
    if (!accessToken) return;

    setSwitching(true);
    setError("");
    try {
      await getTenantContext(accessToken, organizationId);
      setActiveOrganizationState(organizationId);
      setActiveOrganizationId(organizationId);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Could not switch workspaces.");
    } finally {
      setSwitching(false);
    }
  }, [activeOrganizationId, workspaces]);

  const activeWorkspace = useMemo(
    () => workspaces.find((item) => item.id === activeOrganizationId) || null,
    [activeOrganizationId, workspaces],
  );

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, activeOrganizationId, user, loading, switching, error, selectWorkspace, refreshWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider.");
  return value;
}
