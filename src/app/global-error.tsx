"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/errors/ErrorScreen";
import { createErrorReference } from "@/lib/error-map";

type GlobalErrorValue = Error & { digest?: string };

export default function GlobalError({ error }: Readonly<{ error: GlobalErrorValue; reset: () => void }>) {
  const reference = createErrorReference(error, "EVG");

  useEffect(() => {
    console.error("EVADA global error", { reference, digest: error.digest, message: error.message });
  }, [error.digest, error.message, reference]);

  return (
    <html lang="en">
      <body>
        <ErrorScreen
          kind="global"
          reference={reference}
          primaryAction={{ label: "Reload EVADA", onClick: () => window.location.reload() }}
          secondaryAction={{ href: "/", label: "Public home" }}
        />
      </body>
    </html>
  );
}
