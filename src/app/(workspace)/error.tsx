"use client";

import { useEffect } from "react";
import { AccessDenied } from "@/components/errors/AccessDenied";
import { ErrorScreen } from "@/components/errors/ErrorScreen";
import { NetworkError } from "@/components/errors/NetworkError";
import { ResourceNotFound } from "@/components/errors/ResourceNotFound";
import { ServiceUnavailable } from "@/components/errors/ServiceUnavailable";
import { createErrorReference, resolveErrorKind } from "@/lib/error-map";

type WorkspaceErrorValue = Error & {
  code?: string;
  digest?: string;
  status?: number;
  statusCode?: number;
};

export default function WorkspaceError({
  error,
  reset,
}: Readonly<{ error: WorkspaceErrorValue; reset: () => void }>) {
  const kind = resolveErrorKind(error);
  const reference = createErrorReference(error, "EVW");

  useEffect(() => {
    console.error("EVADA workspace error", { reference, digest: error.digest, message: error.message });
  }, [error.digest, error.message, reference]);

  if (kind === "network") return <NetworkError onRetry={reset} />;
  if (kind === "service") return <ServiceUnavailable onRetry={reset} reference={reference} />;
  if (kind === "access") return <AccessDenied />;
  if (kind === "resource") return <ResourceNotFound />;

  return (
    <ErrorScreen
      kind="page"
      mode="workspace"
      reference={reference}
      title="This workspace view was interrupted."
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ href: "/dashboard", label: "Dashboard" }}
    />
  );
}
