import { ErrorScreen } from "@/components/errors/ErrorScreen";

export default function NotFound() {
  return (
    <ErrorScreen
      kind="not-found"
      primaryAction={{ href: "/", label: "Go home" }}
      secondaryAction={{ href: "/platform", label: "Explore platform" }}
    />
  );
}
