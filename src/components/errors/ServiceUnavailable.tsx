"use client";

import { ErrorScreen } from "./ErrorScreen";

type ServiceUnavailableProps = {
  onRetry?: () => void;
  onCancel?: () => void;
  reference?: string;
};

export function ServiceUnavailable({ onRetry, onCancel, reference }: Readonly<ServiceUnavailableProps>) {
  return (
    <ErrorScreen
      kind="service"
      mode="workspace"
      reference={reference}
      primaryAction={onRetry ? { label: "Try again", onClick: onRetry } : { href: "/dashboard", label: "Open dashboard" }}
      secondaryAction={onCancel ? { label: "Cancel", onClick: onCancel } : { href: "/", label: "Public home" }}
    />
  );
}
