import { readFile } from "fs/promises";
import path from "path";
import { applyPublicFooter } from "./lib/public-footer";

// Serves the hand-authored homepage after applying the shared public footer.
export async function GET() {
  const source = await readFile(
    path.join(process.cwd(), "src/app/home.html"),
    "utf8",
  );
  const html = applyPublicFooter(source);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
