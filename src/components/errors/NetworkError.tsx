"use client";

import { useEffect, useRef } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { ErrorScreen } from "./ErrorScreen";

type NetworkErrorProps = {
  onRetry?: () => void;
};

export function NetworkError({ onRetry }: Readonly<NetworkErrorProps>) {
  const online = useNetworkStatus();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current && onRetry) {
      wasOffline.current = false;
      onRetry();
    }
  }, [online, onRetry]);

  return (
    <ErrorScreen
      kind="network"
      mode="workspace"
      detail={online ? "A connection is available. Retry the secure request." : "Your browser currently reports that it is offline."}
      primaryAction={onRetry ? { label: "Retry connection", onClick: onRetry } : { href: "/dashboard", label: "Open dashboard" }}
      secondaryAction={{ href: "/", label: "Public home" }}
    />
  );
}
