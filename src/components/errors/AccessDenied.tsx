import { ErrorScreen } from "./ErrorScreen";

type AccessDeniedProps = {
  role?: string;
};

export function AccessDenied({ role }: Readonly<AccessDeniedProps>) {
  return (
    <ErrorScreen
      kind="access"
      mode="workspace"
      detail={role ? `Current access profile: ${role}` : undefined}
      primaryAction={{ href: "/dashboard", label: "Open dashboard" }}
      secondaryAction={{ href: "/", label: "Public home" }}
    />
  );
}
