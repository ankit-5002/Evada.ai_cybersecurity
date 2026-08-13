import { renderPublicEnquiry } from "../lib/public-enquiry";

export async function GET() {
  return renderPublicEnquiry("contact");
}
