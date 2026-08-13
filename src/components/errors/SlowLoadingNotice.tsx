"use client";

import { ErrorScreen } from "./ErrorScreen";

type SlowLoadingNoticeProps = {
  onContinue: () => void;
  onCancel: () => void;
};

export function SlowLoadingNotice({ onContinue, onCancel }: Readonly<SlowLoadingNoticeProps>) {
  return (
    <ErrorScreen
      kind="slow"
      mode="workspace"
      primaryAction={{ label: "Continue waiting", onClick: onContinue }}
      secondaryAction={{ label: "Cancel", onClick: onCancel }}
    />
  );
}
