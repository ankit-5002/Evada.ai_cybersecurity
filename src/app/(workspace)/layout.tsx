import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div data-evada-workspace-route>{children}</div>;
}
