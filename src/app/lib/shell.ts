import { readFile } from "fs/promises";
import path from "path";
import { applyPublicFooter } from "./public-footer";

/**
 * Interior pages reuse the homepage shell verbatim (head, fonts, styles,
 * nav, footer, cursor) and swap only the <main> content. That keeps every page
 * on the same design system automatically — a homepage style change propagates.
 */

let cached: {
  head: string;
  footerToEnd: string;
} | null = null;

async function loadShell() {
  if (cached && process.env.NODE_ENV === "production") return cached;

  const source = await readFile(
    path.join(process.cwd(), "src/app/home.html"),
    "utf8",
  );
  const html = applyPublicFooter(source);

  const MAIN = '<main class="page-main">';
  const FOOTER = '<footer id="site-footer" class="evd-footer evd-footer--classic">';

  const mainStart = html.indexOf(MAIN);
  const footerStart = html.indexOf(FOOTER);
  if (mainStart === -1 || footerStart === -1) {
    throw new Error("shell: could not locate main/footer boundaries");
  }

  cached = {
    // everything up to and including <main class="page-main">
    head: html.slice(0, mainStart + MAIN.length),
    // footer + </main> + all trailing scripts + </body></html>
    footerToEnd: html.slice(footerStart),
  };
  return cached;
}

export type PageOptions = {
  title: string;
  description: string;
  /** page-specific CSS injected after the shared styles */
  css?: string;
  /** the page body, placed inside <main class="page-main"> */
  body: string;
  /** set when the area behind the nav is light, so the logo flips dark */
  lightNav?: boolean;
};

export async function renderPage({
  title,
  description,
  css = "",
  body,
  lightNav = false,
}: PageOptions): Promise<Response> {
  const { head, footerToEnd } = await loadShell();

  let page = head;

  // swap the homepage metadata for this page's
  page = page.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  );
  page = page.replace(
    /(<meta content=")[^"]*(" name="description"\/>)/,
    `$1${escapeAttr(description)}$2`,
  );
  page = page.replace(
    /(<meta content=")[^"]*(" property="og:description"\/>)/,
    `$1${escapeAttr(description)}$2`,
  );

  // interior pages have no hero load-timeline, so force the nav visible
  // (the shared FOUC guard hides it until the homepage animation reveals it)
  const interiorCss = `
  <style>
    .navigation, [load-item] { visibility: visible !important; opacity: 1 !important; animation: none !important; }
    .evd-nav, .evd-pill { opacity: 1 !important; }
    .evd-page { box-sizing: border-box; width: 100%; max-width: 100%; min-width: 0; padding-top: 0; overflow-x: clip; }
    .evd-page *, .evd-page *::before, .evd-page *::after { box-sizing: border-box; }
    .evd-page section[id], .evd-page article[id] { scroll-margin-top: 7rem; }
    /* shared page hero: obsidian style, UNIFORM sizing across every page, fades into the page below.
       FIXED height + top-aligned content, so every hero is exactly the same size regardless of copy
       length, and there is always consistent room below the content for a long, smooth fade. */
    .evd-hero { position: relative; overflow: hidden; isolation: isolate; min-height: 38rem; display: flex; flex-direction: column; justify-content: flex-start; background: radial-gradient(95% 120% at 75% -10%, #114832 0%, #0b2018 45%, #071018 100%); color: #e9f2ed; padding: 9rem clamp(1.5rem,5vw,4rem) 6rem; }
    /* decorative shapes cropped by the hero edges — the image comes from the per-page variant class */
    .evd-hero::before, .evd-hero::after { content: ""; position: absolute; z-index: -2; pointer-events: none; background-repeat: no-repeat; background-size: contain; }
    /* per-page variants: identical sizing, distinct imagery */
    .evd-hero--dual::before { left: -7%; top: -14%; width: 34rem; height: 34rem; background-image: url('/hero-monolith.webp'); background-position: left top; opacity: 0.85; transform: rotate(-8deg); }
    .evd-hero--dual::after { right: -8%; bottom: -22%; width: 40rem; height: 40rem; background-image: url('/hero-cube.webp'); background-position: right bottom; opacity: 0.7; }
    .evd-hero--monolith::after { right: -6%; top: -12%; width: 36rem; height: 36rem; background-image: url('/hero-monolith.webp'); background-position: right top; opacity: 0.8; transform: rotate(7deg); }
    .evd-hero--cube::after { right: -7%; bottom: -20%; width: 40rem; height: 40rem; background-image: url('/hero-cube.webp'); background-position: right bottom; opacity: 0.68; }
    .evd-hero--shard::after { right: -5%; top: -10%; width: 36rem; height: 36rem; background-image: url('/hero-shard.webp'); background-position: right top; opacity: 0.72; transform: rotate(6deg); }
    .evd-hero--shard-left::before { left: -6%; top: -10%; width: 32rem; height: 32rem; background-image: url('/hero-shard.webp'); background-position: left top; opacity: 0.8; transform: rotate(-6deg); }
    .evd-hero--orb::after { right: -4%; bottom: -16%; width: 34rem; height: 34rem; background-image: url('/hero-orb.svg'); background-position: right bottom; opacity: 0.85; }
    /* smooth fade: the lower third of every hero melts into the next section. content is top-aligned so
       it always sits ABOVE the light zone. the gradient holds dark behind any copy, then eases dark->blend
       on a symmetric (ease-in-out) luminance curve — dense opaque stops, no compressed band, no seam. */
    .evd-hero-fade { position: absolute; left: 0; right: 0; bottom: -1px; height: 20rem; pointer-events: none; z-index: -1; background: linear-gradient(180deg, rgba(7,16,24,0) 0%, rgba(7,16,24,0.22) 12%, rgba(7,16,24,0.55) 23%, rgba(7,16,24,0.82) 33%, rgba(7,16,24,0.96) 40%, rgb(7,16,24) 45%, rgb(21,29,37) 52%, rgb(52,59,65) 60%, rgb(95,101,106) 68%, rgb(143,147,151) 76%, rgb(190,193,195) 83%, rgb(226,227,228) 90%, rgb(246,247,247) 96%, var(--evd-hero-blend, #ffffff) 100%); }
    .evd-hero-inner { position: relative; z-index: 1; width: 100%; max-width: 62rem; min-width: 0; margin: 0 auto; }
    @media screen and (max-width: 900px) {
      .evd-hero { min-height: 30rem; padding: 8rem clamp(1.5rem,5vw,4rem) 5rem; }
      .evd-hero-fade { height: 14rem; }
      .evd-hero::before { width: 20rem; height: 20rem; opacity: 0.5; }
      .evd-hero::after { width: 22rem; height: 22rem; opacity: 0.45; }
    }
    .evd-hero h1 { margin: 0 0 1.1rem; font-size: 3.9rem; line-height: 1.04; letter-spacing: 0; font-weight: 400; max-width: 20ch; }
    .evd-hero p { margin: 0; max-width: 40rem; font-size: 1.12rem; line-height: 1.6; color: rgba(233,242,237,0.6); }
    .evd-hero .evd-hero-cta, .evd-hero .evd-hero-secondary { margin-top: 2rem; }
    .evd-hero-actions { display: flex; align-items: center; gap: 1.6rem; flex-wrap: wrap; margin-top: 2rem; }
    .evd-hero-actions .evd-hero-cta, .evd-hero-actions .evd-hero-secondary { margin-top: 0; }
    @media screen and (max-width: 1200px) {
      .evd-hero h1 { font-size: 3.35rem; }
    }
    @media screen and (max-width: 900px) {
      .evd-hero h1 { font-size: 3rem; }
    }
    @media screen and (max-width: 560px) {
      .evd-hero { min-height: 27rem; padding: 7.25rem 1.25rem 4rem; }
      .evd-hero h1 { font-size: 2.4rem; }
      .evd-hero p { font-size: 1rem; }
      .evd-hero-actions { align-items: stretch; gap: 0.9rem; }
    }
    /* when the two CTAs stack on narrow screens, indent the secondary link's text
       so it lines up with the primary button's LABEL (the pill's padding insets its
       label ~1.5rem); margin-left keeps the underline under the text only. */
    @media screen and (max-width: 560px) {
      .evd-hero-actions { flex-direction: column; align-items: flex-start; gap: 1.35rem; }
      .evd-hero-actions .evd-hero-secondary { margin-left: 1.5rem; }
    }
    .evd-hero--center .evd-hero-inner { text-align: center; }
    .evd-hero--center h1, .evd-hero--center p { margin-left: auto; margin-right: auto; }
    .evd-hero--center .evd-hero-actions { justify-content: center; }
    ${lightNav ? ".evd-logo { background-color: #06110e; box-shadow: 0 10px 28px rgba(4, 15, 13, 0.18); }" : ""}
    ${css}
  </style>`;

  // Robust logo adaptation: sample the ACTUAL background behind the logo on scroll
  // and flip the nav dark/light by its luminance. This does not rely on per-section
  // .evd-lightsec tags (which are easy to miss), so any light section — current or
  // future — flips the logo correctly.
  const interiorJs = `
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      var logo = document.querySelector(".evd-logo");
      if (!logo) return;
      function lum(c) {
        var m = (c || "").match(/[0-9.]+/g);
        if (!m || m.length < 3) return null;
        return (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
      }
      function elLum(el) {
        var s = getComputedStyle(el);
        var c = s.backgroundColor;
        var m = (c || "").match(/[0-9.]+/g);
        if (m && (m.length < 4 || +m[3] > 0.5)) return lum(c); // opaque solid colour
        var bi = s.backgroundImage; // gradients live here, not in backgroundColor
        if (bi && bi !== "none" && bi.indexOf("gradient") !== -1) {
          var cols = bi.match(/rgba?\\([^)]+\\)/g);
          if (cols && cols.length) {
            var sum = 0, n = 0;
            for (var k = 0; k < cols.length; k++) { var lk = lum(cols[k]); if (lk !== null) { sum += lk; n++; } }
            if (n) return sum / n;
          }
        }
        return null; // transparent, no gradient -> look further back
      }
      function bgLumBehindLogo() {
        var r = logo.getBoundingClientRect();
        var x = Math.max(20, r.left + 12), y = r.top + r.height / 2;
        var els = document.elementsFromPoint(x, y);
        for (var i = 0; i < els.length; i++) {
          if (els[i].closest(".navigation")) continue; // skip the nav itself
          var l = elLum(els[i]);
          if (l !== null) return l;
        }
        return lum(getComputedStyle(document.body).backgroundColor);
      }
      var ticking = false;
      function update() {
        ticking = false;
        var l = bgLumBehindLogo();
        if (l !== null) document.body.classList.toggle("evd-on-light", l > 0.6);
      }
      function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
    });
  </script>`;

  page = page.replace("</head>", `${interiorCss}${interiorJs}</head>`);

  return new Response(page + body + footerToEnd, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
