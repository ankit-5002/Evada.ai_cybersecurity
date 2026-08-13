import { permanentRedirect } from "next/navigation";

export default function WaitlistPage() {
  permanentRedirect("/signup");
}
