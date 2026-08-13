import { ErrorScreen } from "./ErrorScreen";

type ResourceNotFoundProps = {
  resource?: string;
  returnHref?: string;
  returnLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ResourceNotFound({
  resource = "resource",
  returnHref = "/dashboard",
  returnLabel = "Open dashboard",
  secondaryHref = "/",
  secondaryLabel = "Public home",
}: Readonly<ResourceNotFoundProps>) {
  return (
    <ErrorScreen
      kind="resource"
      mode="workspace"
      title={`This ${resource} is unavailable.`}
      primaryAction={{ href: returnHref, label: returnLabel }}
      secondaryAction={{ href: secondaryHref, label: secondaryLabel }}
    />
  );
}
