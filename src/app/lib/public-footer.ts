const PUBLIC_FOOTER_MARKER = "evd-footer--classic";

const icon = (paths: string, label = "") => `
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"${label ? ` data-icon="${label}"` : ""}>
    ${paths}
  </svg>`;

const brandIcon = (path: string, label: string) => `
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" data-icon="${label}">
    <path d="${path}"></path>
  </svg>`;

const icons = {
  github: brandIcon("M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.47.11-3.05 0 0 .96-.31 3.16 1.18A10.96 10.96 0 0 1 12 6.12c.98 0 1.95.13 2.87.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7z", "github"),
  mail: icon('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>', "mail"),
  phone: icon('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"></path>', "phone"),
  pin: icon('<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>', "location"),
  heart: icon('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>', "heart"),
};

const linkGroup = (
  title: string,
  links: Array<[string, string]>,
) => `
  <section class="evd-classic-footer-group" aria-labelledby="footer-${title.toLowerCase()}">
    <h2 id="footer-${title.toLowerCase()}">${title}</h2>
    <ul>
      ${links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}
    </ul>
  </section>`;

const PUBLIC_FOOTER_HTML = `
<footer id="site-footer" class="evd-footer evd-footer--classic">
  <div class="evd-footer-glow-aura" aria-hidden="true"></div>
  <div class="evd-classic-footer-inner">
    <div class="evd-classic-footer-grid">
      <section class="evd-classic-footer-brand" aria-labelledby="footer-brand">
        <a class="evd-classic-footer-logo" href="/" aria-label="EVADA home">
          <img src="/logos/logo.png" alt="EVADA" width="2890" height="631" />
        </a>
        <p id="footer-brand">Tenant-isolated security validation for authorized Assets, controlled scans, normalized Findings and immutable reports.</p>
        <p class="evd-classic-footer-byline">Built by <a class="evd-classic-footer-byline-link" href="https://netforte.co.uk/" target="_blank" rel="noreferrer"><strong>Netforte Consulting Ltd.</strong></a>.</p>
        <nav class="evd-classic-footer-social" aria-label="EVADA social links">
          <a href="https://github.com/evadaai" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">${icons.github}</a>
          <a href="mailto:info@evada.ai" aria-label="Email EVADA" title="Email EVADA">${icons.mail}</a>
        </nav>
      </section>

      <div class="evd-classic-footer-links">
        ${linkGroup("Platform", [
  ["How it works", "/platform#how-it-works"],
  ["Security workflow", "/platform#security-workflow"],
  ["Platform modules", "/platform#modules"],
  ["Request access", "/platform#platform-access"],
])}
        ${linkGroup("Solutions", [
  ["AI Penetration Testing", "/solutions/ai-penetration-testing"],
  ["Application Security", "/solutions/application-security"],
  ["Threat Monitoring", "/solutions/threat-monitoring"],
  ["SIEM & Security Operations", "/solutions/siem-security-operations"],
])}
        ${linkGroup("Resources", [
  ["Practical guides", "/resources#practical-guides"],
  ["Compliance explainers", "/resources#compliance-explainers"],
  ["Security validation", "/resources#security-validation"],
  ["Case studies", "/resources#case-studies"],
])}
        ${linkGroup("Company", [
  ["Our story", "/company#our-story"],
  ["Mission and vision", "/company#mission-vision"],
  ["Principles", "/company#principles"],
  ["Company facts", "/company#company-facts"],
])}
        <section class="evd-classic-footer-group evd-classic-footer-contact" aria-labelledby="footer-contact">
          <h2 id="footer-contact">Contact</h2>
          <ul>
            <li><a href="mailto:info@evada.ai">${icons.mail}<span>info@evada.ai</span></a></li>
             <li><a href="tel:02039166414">${icons.phone}<span>020 3916 6414 / 07723 115384</span></a></li>
            <li><a href="https://www.google.com/maps/search/?api=1&amp;query=124%20City%20Road%2C%20London%2C%20EC1V%202NX" target="_blank" rel="noreferrer">${icons.pin}<span>124 City Road, London, EC1V 2NX</span></a></li>
          </ul>
        </section>
      </div>
    </div>

    <div class="evd-classic-footer-meta">
      <div>
        <p>&copy; 2026 EVADA by Netforte Consulting. All rights reserved.</p>
        <nav class="evd-classic-footer-legal" aria-label="Legal links">
          <a href="/privacy-policy">Privacy policy</a>
          <a href="/terms-of-service">Terms of service</a>
          <a href="/privacy-policy#cookies">Cookie policy</a>
        </nav>
      </div>
    </div>
  </div>
  
  <!-- Right-Aligned Subdued Wordmark inside Existing Footer Bounds -->
  <div class="evd-footer-giant-wordmark" aria-hidden="true">
    <span>evada.ai</span>
  </div>
</footer>`;

const PUBLIC_FOOTER_STYLES = `
<style data-evada-public-footer>
  .evd-footer--classic {
    display: block;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    grid-column: 1 / -1;
    width: 100%;
    min-width: 0;
    padding: 0;
    border-top: 1px solid rgba(46, 205, 128, 0.2);
    background: #060907;
    color: #f1f8f5;
  }

  /* Vibrant Green Glowing Aura (Replacing Orange in Reference) */
  .evd-footer-glow-aura {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: radial-gradient(circle at 50% 90%, rgba(46, 206, 130, 0.44) 0%, rgba(16, 185, 129, 0.24) 30%, rgba(5, 150, 105, 0.08) 55%, transparent 75%),
                radial-gradient(circle at 82% 80%, rgba(46, 206, 130, 0.28) 0%, transparent 48%),
                radial-gradient(circle at 18% 75%, rgba(16, 185, 129, 0.18) 0%, transparent 45%);
    filter: blur(18px);
  }

  .evd-classic-footer-inner {
    position: relative;
    z-index: 3;
    width: min(calc(100% - 4.5rem), 92.5rem);
    margin: 0 auto;
    padding: 2.75rem 0 1.5rem;
  }
  .evd-classic-footer-grid {
    display: grid;
    grid-template-columns: minmax(14rem, 0.75fr) minmax(0, 3.5fr);
    gap: clamp(2.5rem, 4vw, 4rem);
    align-items: start;
  }
  .evd-classic-footer-brand { max-width: 18.75rem; }
  .evd-classic-footer-logo {
    display: inline-flex;
    width: 8.65rem;
    border-radius: 0.5rem;
  }
  .evd-classic-footer-logo:focus-visible,
  .evd-classic-footer-group a:focus-visible,
  .evd-classic-footer-social a:focus-visible {
    outline: 2px solid #2ece82;
    outline-offset: 3px;
  }
  .evd-classic-footer-logo img { display: block; width: 100%; height: auto; }
  .evd-classic-footer-brand > p {
    max-width: 18.5rem;
    margin: 1rem 0 0;
    color: #98a4a7;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  .evd-classic-footer-brand .evd-classic-footer-byline {
    margin-top: 0.65rem;
    color: #667579;
    font-size: 0.78rem;
  }
  .evd-classic-footer-byline a,
  .evd-classic-footer-byline-link,
  #site-footer .evd-classic-footer-byline a {
    color: #2ece82 !important;
    text-decoration: none !important;
    transition: opacity 0.2s ease;
  }
  .evd-classic-footer-byline a:hover,
  .evd-classic-footer-byline-link:hover,
  #site-footer .evd-classic-footer-byline a:hover {
    text-decoration: none !important;
    opacity: 0.85;
  }
  .evd-classic-footer-byline strong {
    color: #2ece82 !important;
    text-decoration: none !important;
  }
  .evd-classic-footer-social { display: flex; gap: 0.5rem; margin-top: 1.1rem; }
  .evd-classic-footer-social a {
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    color: #98a4a7;
    transition: transform 160ms ease, border-color 160ms ease, color 160ms ease, background 160ms ease;
  }
  .evd-classic-footer-social a:hover {
    transform: translateY(-2px);
    border-color: rgba(46, 206, 130, 0.46);
    background: rgba(46, 206, 130, 0.09);
    color: #2ece82;
  }
  .evd-classic-footer-social svg { width: 1rem; height: 1rem; }
  .evd-classic-footer-links {
    display: grid;
    grid-template-columns: repeat(4, minmax(6.5rem, 1fr)) minmax(11.5rem, 1.25fr);
    gap: clamp(0.9rem, 1.6vw, 1.5rem);
  }
  .evd-classic-footer-group h2 {
    margin: 0;
    color: #f1f8f5;
    font: 700 0.875rem/1.2 'Aeonik', Arial, sans-serif;
    letter-spacing: 0;
  }
  .evd-classic-footer-group ul { display: grid; gap: 0.7rem; margin: 0.9rem 0 0; padding: 0; list-style: none; }
  .evd-classic-footer-group a {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.62rem;
    color: #98a4a7;
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1.55;
    text-decoration: none;
    transition: color 160ms ease, transform 160ms ease;
  }
  .evd-classic-footer-group a:hover { color: #2ece82; transform: translateX(2px); }
  .evd-classic-footer-contact a { font-weight: 600; }
  .evd-classic-footer-contact svg { width: 1rem; height: 1rem; flex: 0 0 1rem; margin-top: 0.14rem; color: #04d9ff; }
  
  .evd-classic-footer-meta {
    position: relative;
    z-index: 3;
    display: block;
    margin-top: 1.5rem;
    padding-top: 0.35rem;
    color: #667579;
    font-size: 0.76rem;
    line-height: 1.5;
  }
  .evd-classic-footer-meta > div { display: grid; justify-items: start; gap: 0.45rem; }
  .evd-classic-footer-meta p { margin: 0; }
  .evd-classic-footer-meta p:last-child { display: inline-flex; align-items: center; gap: 0.35rem; }
  .evd-classic-footer-legal { display: flex; flex-wrap: nowrap; justify-content: flex-start; gap: 0.45rem clamp(0.65rem, 2.5vw, 1.15rem); margin-top: 0.15rem; white-space: nowrap; }
  .evd-classic-footer-legal a { color: #7f8c8f; font-weight: 600; text-decoration: none; transition: color 160ms ease; }
  .evd-classic-footer-legal a:hover { color: #2ece82; }
  .evd-classic-footer-legal a:focus-visible { outline: 2px solid #2ece82; outline-offset: 3px; }
  .evd-classic-footer-heart { display: inline-flex; color: #2ece82; }
  .evd-classic-footer-heart svg { width: 0.88rem; height: 0.88rem; fill: currentColor; }

  /* Right-Aligned Subdued Wordmark inside Existing Footer Bounds */
  .evd-footer-giant-wordmark {
    position: absolute;
    right: max(1.5rem, calc((100% - 92.5rem) / 2));
    bottom: -0.05em;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    text-align: right;
    pointer-events: none;
    user-select: none;
    line-height: 0.76;
    overflow: hidden;
    opacity: 0.35;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.6) 82%, rgba(0, 0, 0, 0.28) 100%);
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.6) 82%, rgba(0, 0, 0, 0.28) 100%);
  }

  .evd-footer-giant-wordmark span {
    display: block;
    font-family: 'Roobert', 'Aeonik', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: clamp(4.5rem, 12vw, 10.5rem);
    font-weight: 900;
    letter-spacing: -0.045em;
    color: rgba(255, 255, 255, 0.9);
    text-transform: lowercase;
    white-space: nowrap;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 1320px) {
    .evd-classic-footer-grid { grid-template-columns: 1fr; gap: 3rem; }
    .evd-classic-footer-brand { max-width: 25rem; }
    .evd-classic-footer-links { grid-template-columns: repeat(3, minmax(8.5rem, 1fr)); gap: 2rem 1.5rem; }
  }
  @media (max-width: 720px) {
    .evd-classic-footer-inner { width: min(calc(100% - 2rem), 92.5rem); padding: 2.25rem 0 1.25rem; }
    .evd-classic-footer-links { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.25rem 1.5rem; }
    .evd-classic-footer-contact { grid-column: 1 / -1; }
    .evd-footer-giant-wordmark { right: 1rem; bottom: -0.02em; }
    .evd-footer-giant-wordmark span { font-size: clamp(3.2rem, 16vw, 6.2rem); }
  }
  @media (max-width: 430px) {
    .evd-classic-footer-links { grid-template-columns: 1fr; }
    .evd-classic-footer-contact { grid-column: auto; }
    .evd-classic-footer-legal { font-size: clamp(0.65rem, 2.75vw, 0.76rem); }
  }
</style>`;

export function applyPublicFooter(html: string): string {
  if (html.includes(PUBLIC_FOOTER_MARKER)) return html;

  const footerPattern = /<footer class="evd-footer">[\s\S]*?<\/footer>/;
  if (!footerPattern.test(html)) {
    throw new Error("public footer: could not locate the shared footer");
  }

  return html
    .replace("</head>", `${PUBLIC_FOOTER_STYLES}</head>`)
    .replace(footerPattern, PUBLIC_FOOTER_HTML);
}
