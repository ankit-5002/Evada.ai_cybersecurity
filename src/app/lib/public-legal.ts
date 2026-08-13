import { renderPage } from "./shell";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  note?: string;
};

type LegalPageOptions = {
  active: "privacy" | "terms";
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  highlights: readonly string[];
  sections: readonly LegalSection[];
};

const ARROW = `
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderSection(section: LegalSection, index: number) {
  return `
    <section class="legal-section" id="${escapeHtml(section.id)}">
      <span class="legal-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <div class="legal-section-copy">
        <h2>${escapeHtml(section.title)}</h2>
        ${(section.paragraphs ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${
          section.bullets?.length
            ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
            : ""
        }
        ${section.note ? `<div class="legal-note"><span>Important</span><p>${escapeHtml(section.note)}</p></div>` : ""}
      </div>
    </section>`;
}

export async function renderLegalPage(options: LegalPageOptions) {
  const { active, eyebrow, title, description, effectiveDate, highlights, sections } = options;
  const privacyActive = active === "privacy" ? ' class="is-active" aria-current="page"' : "";
  const termsActive = active === "terms" ? ' class="is-active" aria-current="page"' : "";

  const body = `
<div class="evd-page legal-page">
  <section class="evd-hero evd-hero--shard-left legal-hero">
    <div class="evd-hero-inner">
      <span class="legal-eyebrow">${escapeHtml(eyebrow)}</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="legal-lede">${escapeHtml(description)}</p>
      <dl class="legal-meta">
        <div><dt>Effective date</dt><dd>${escapeHtml(effectiveDate)}</dd></div>
        <div><dt>Product</dt><dd>EVADA</dd></div>
        <div><dt>Operator</dt><dd>Netforte Consulting Ltd</dd></div>
      </dl>
      <nav class="legal-switch" aria-label="Legal documents">
        <a href="/privacy-policy"${privacyActive}>Privacy policy</a>
        <a href="/terms-of-service"${termsActive}>Terms of service</a>
        <a href="/privacy-policy#cookies">Cookie policy</a>
      </nav>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="legal-content evd-lightsec">
    <div class="legal-wrap">
      <aside class="legal-sidebar" aria-label="On this page">
        <div class="legal-sidebar-inner">
          <span class="legal-sidebar-label">On this page</span>
          <ol>
            ${sections
              .map(
                (section, index) => `
              <li><a href="#${escapeHtml(section.id)}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(section.title)}</a></li>`,
              )
              .join("")}
          </ol>
        </div>
      </aside>

      <article class="legal-document">
        <header class="legal-summary">
          <span class="legal-summary-label">At a glance</span>
          <div class="legal-highlights">
            ${highlights
              .map(
                (item) => `
              <div><span aria-hidden="true"></span><p>${escapeHtml(item)}</p></div>`,
              )
              .join("")}
          </div>
        </header>
        ${sections.map(renderSection).join("")}
      </article>
    </div>
  </section>

  <section class="legal-contact evd-lightsec">
    <div class="legal-contact-inner">
      <div>
        <span class="legal-contact-label">Questions about this document?</span>
        <h2>Talk to the EVADA team.</h2>
        <p>For privacy, contractual or legal enquiries, contact Netforte Consulting Ltd.</p>
      </div>
      <a href="mailto:info@evada.ai" class="legal-contact-link">info@evada.ai ${ARROW}</a>
    </div>
  </section>
</div>`;

  const css = `
    .evd-hero { --evd-hero-blend: #f6f8f7; }
    .legal-page { background: #f6f8f7; color: #101510; }
    .legal-page h1, .legal-page h2, .legal-page p, .legal-page li, .legal-page dd { overflow-wrap: break-word; }
    .legal-hero { min-height: 39rem; }
    .legal-hero .evd-hero-inner { max-width: 74rem; }
    .legal-eyebrow, .legal-sidebar-label, .legal-summary-label, .legal-contact-label {
      display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.73rem;
      line-height: 1.4; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .legal-eyebrow { color: #35d18b; margin-bottom: 1rem; }
    .legal-hero h1 { max-width: 15ch; }
    .legal-lede { max-width: 48rem !important; }
    .legal-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 48rem; margin: 2rem 0 0; border-top: 1px solid rgba(237, 246, 241, 0.2); }
    .legal-meta > div { min-width: 0; padding: 1rem 1.2rem 0 0; }
    .legal-meta dt { color: rgba(237, 246, 241, 0.48); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.67rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .legal-meta dd { margin: 0.35rem 0 0; color: #edf6f1; font-size: 0.92rem; line-height: 1.4; }
    .legal-switch { display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 2rem; padding: 0.3rem; border: 1px solid rgba(237, 246, 241, 0.2); border-radius: 8px; background: rgba(4, 16, 12, 0.48); }
    .legal-switch a { min-height: 2.55rem; display: inline-flex; align-items: center; justify-content: center; padding: 0 0.9rem; border-radius: 6px; color: rgba(237, 246, 241, 0.68); font-size: 0.85rem; font-weight: 600; text-decoration: none; transition: color 160ms ease, background-color 160ms ease; }
    .legal-switch a:hover, .legal-switch a:focus-visible { color: #ffffff; background: rgba(255, 255, 255, 0.08); }
    .legal-switch a.is-active { color: #07130e; background: #35d18b; }

    .legal-content { padding: clamp(3rem, 7vw, 6.5rem) 0 clamp(4rem, 8vw, 7rem); }
    .legal-wrap { width: min(100% - clamp(2rem, 8vw, 8rem), 82rem); margin-inline: auto; display: grid; grid-template-columns: minmax(13rem, 0.34fr) minmax(0, 1fr); gap: clamp(2.5rem, 7vw, 7rem); align-items: start; }
    .legal-sidebar { min-width: 0; }
    .legal-sidebar-inner { position: sticky; top: 7rem; }
    .legal-sidebar-label { color: #168457; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(16, 21, 16, 0.16); }
    .legal-sidebar ol { list-style: none; padding: 0; margin: 0; }
    .legal-sidebar li { border-bottom: 1px solid rgba(16, 21, 16, 0.1); }
    .legal-sidebar a { display: grid; grid-template-columns: 2rem minmax(0, 1fr); gap: 0.65rem; padding: 0.85rem 0; color: rgba(16, 21, 16, 0.6); font-size: 0.83rem; line-height: 1.35; text-decoration: none; transition: color 150ms ease, padding-left 150ms ease; }
    .legal-sidebar a span { color: #168457; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.67rem; padding-top: 0.1rem; }
    .legal-sidebar a:hover, .legal-sidebar a:focus-visible { color: #101510; padding-left: 0.25rem; }

    .legal-document { min-width: 0; }
    .legal-summary { padding: 0 0 clamp(2.5rem, 5vw, 4rem); }
    .legal-summary-label { color: #168457; margin-bottom: 1.2rem; }
    .legal-highlights { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid rgba(16, 21, 16, 0.18); border-bottom: 1px solid rgba(16, 21, 16, 0.18); }
    .legal-highlights > div { min-width: 0; padding: 1.2rem 1.25rem 1.2rem 0; display: grid; grid-template-columns: 0.65rem minmax(0, 1fr); gap: 0.7rem; }
    .legal-highlights > div + div { border-left: 1px solid rgba(16, 21, 16, 0.14); padding-left: 1.25rem; }
    .legal-highlights span { width: 0.45rem; height: 0.45rem; margin-top: 0.42rem; border-radius: 50%; background: #2ece82; }
    .legal-highlights p { margin: 0; color: rgba(16, 21, 16, 0.7); font-size: 0.9rem; line-height: 1.55; }

    .legal-section { scroll-margin-top: 7rem; display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); gap: clamp(1rem, 3vw, 2.2rem); padding: clamp(2rem, 5vw, 3.5rem) 0; border-top: 1px solid rgba(16, 21, 16, 0.18); }
    .legal-index { padding-top: 0.35rem; color: #168457; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.73rem; letter-spacing: 0.08em; }
    .legal-section h2 { margin: 0 0 1.15rem; color: #101510; font-size: clamp(1.55rem, 3vw, 2.35rem); line-height: 1.12; letter-spacing: 0; font-weight: 600; }
    .legal-section p { margin: 0 0 1rem; color: rgba(16, 21, 16, 0.68); font-size: 1rem; line-height: 1.75; }
    .legal-section ul { margin: 1.2rem 0 0; padding: 0; list-style: none; border-top: 1px solid rgba(16, 21, 16, 0.12); }
    .legal-section li { position: relative; padding: 0.9rem 0 0.9rem 1.25rem; border-bottom: 1px solid rgba(16, 21, 16, 0.1); color: rgba(16, 21, 16, 0.68); font-size: 0.95rem; line-height: 1.6; }
    .legal-section li::before { content: ""; position: absolute; left: 0; top: 1.42rem; width: 0.42rem; height: 0.42rem; border-radius: 50%; background: #2ece82; }
    .legal-note { margin-top: 1.4rem; padding: 1.1rem 1.2rem; border-left: 3px solid #2ece82; background: #edf8f2; }
    .legal-note > span { color: #096c46; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .legal-note p { margin: 0.45rem 0 0; color: rgba(16, 21, 16, 0.72); font-size: 0.92rem; line-height: 1.6; }

    .legal-contact { padding: 0 0 clamp(4rem, 8vw, 7rem); }
    .legal-contact-inner { width: min(100% - clamp(2rem, 8vw, 8rem), 82rem); margin-inline: auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; padding-top: clamp(2rem, 5vw, 3.5rem); border-top: 1px solid rgba(16, 21, 16, 0.2); }
    .legal-contact-label { color: #168457; }
    .legal-contact h2 { margin: 0.75rem 0 0; font-size: clamp(1.8rem, 3.5vw, 3rem); line-height: 1.08; letter-spacing: 0; font-weight: 600; }
    .legal-contact p { margin: 0.8rem 0 0; color: rgba(16, 21, 16, 0.62); line-height: 1.6; }
    .legal-contact-link { flex: 0 0 auto; min-height: 3.25rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.7rem; padding: 0 1.2rem; border-radius: 8px; background: #061510; color: #edf6f1; font-weight: 600; text-decoration: none; }
    .legal-contact-link:hover { background: #173a2d; }

    .legal-page a:focus-visible { outline: 3px solid rgba(46, 206, 130, 0.42); outline-offset: 3px; }
    @media screen and (max-width: 900px) {
      .legal-hero { min-height: 34rem; }
      .legal-wrap { grid-template-columns: 1fr; gap: 2.5rem; }
      .legal-sidebar-inner { position: static; }
      .legal-sidebar ol { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid rgba(16, 21, 16, 0.12); }
      .legal-sidebar li { min-width: 0; }
      .legal-sidebar li:nth-child(odd) { padding-right: 1rem; }
      .legal-sidebar li:nth-child(even) { padding-left: 1rem; border-left: 1px solid rgba(16, 21, 16, 0.12); }
      .legal-sidebar-label { border-bottom: 0; }
    }
    @media screen and (max-width: 640px) {
      .legal-hero { min-height: 37rem; }
      .legal-meta { grid-template-columns: 1fr; }
      .legal-meta > div { padding-top: 0.65rem; }
      .legal-switch { width: 100%; overflow-x: auto; justify-content: flex-start; scrollbar-width: none; }
      .legal-switch::-webkit-scrollbar { display: none; }
      .legal-switch a { flex: 0 0 auto; }
      .legal-sidebar ol { grid-template-columns: 1fr; }
      .legal-sidebar li:nth-child(odd), .legal-sidebar li:nth-child(even) { padding-left: 0; padding-right: 0; border-left: 0; }
      .legal-highlights { grid-template-columns: 1fr; }
      .legal-highlights > div, .legal-highlights > div + div { padding: 0.95rem 0; border-left: 0; border-bottom: 1px solid rgba(16, 21, 16, 0.1); }
      .legal-highlights > div:last-child { border-bottom: 0; }
      .legal-section { grid-template-columns: 2rem minmax(0, 1fr); gap: 0.65rem; }
      .legal-contact-inner { align-items: stretch; flex-direction: column; }
      .legal-contact-link { width: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .legal-page *, .legal-page *::before, .legal-page *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
    }
  `;

  return renderPage({
    title: `${title} | EVADA`,
    description,
    body,
    css,
  });
}
