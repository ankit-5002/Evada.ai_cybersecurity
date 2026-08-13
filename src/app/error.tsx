"use client";

import { useEffect } from "react";
import { AccessDenied } from "@/components/errors/AccessDenied";
import { ErrorScreen } from "@/components/errors/ErrorScreen";
import { NetworkError } from "@/components/errors/NetworkError";
import { ResourceNotFound } from "@/components/errors/ResourceNotFound";
import { ServiceUnavailable } from "@/components/errors/ServiceUnavailable";
import { createErrorReference, resolveErrorKind } from "@/lib/error-map";

type RouteError = Error & {
  code?: string;
  digest?: string;
  status?: number;
  statusCode?: number;
};

export default function RootError({ error, reset }: Readonly<{ error: RouteError; reset: () => void }>) {
  const kind = resolveErrorKind(error);
  const reference = createErrorReference(error);

  useEffect(() => {
    console.error("EVADA route error", { reference, digest: error.digest, message: error.message });
  }, [error.digest, error.message, reference]);

  if (kind === "network") return <NetworkError onRetry={reset} />;
  if (kind === "service") return <ServiceUnavailable onRetry={reset} reference={reference} />;
  if (kind === "access") return <AccessDenied />;
  if (kind === "resource") return <ResourceNotFound />;

  return (
    <ErrorScreen
      kind="page"
      reference={reference}
      primaryAction={{ label: "Try again", onClick: reset }}
      secondaryAction={{ href: "/", label: "Go home" }}
    />
  );
}
