import type { ReactNode } from "react";
import { PageLoadingProvider } from "@/components/loading/PageLoadingProvider";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { SessionLifecycleProvider } from "@/components/auth/SessionLifecycleProvider";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <PageLoadingProvider>
      <SessionLifecycleProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </SessionLifecycleProvider>
    </PageLoadingProvider>
  );
}
