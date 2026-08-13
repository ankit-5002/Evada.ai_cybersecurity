import { renderPage } from "../lib/shell";

const OPERATING_MODEL = [
  ["01", "Authorize scope", "A customer verifies the Asset and explicitly defines what EVADA may assess."],
  ["02", "Control execution", "Permissions, queue limits, duplicate locks and timeouts govern every scanner job."],
  ["03", "Normalize evidence", "Scanner output becomes tenant-scoped Findings with severity, evidence and remediation context."],
  ["04", "Issue accountable output", "Teams triage Findings, preserve activity and generate immutable VAPT report snapshots."],
] as const;

const PRINCIPLES = [
  ["Authorization first", "No target enters a scanner queue until ownership and scope have been established."],
  ["Tenant isolation", "Each organization receives isolated data routing, storage paths and operational boundaries."],
  ["Human accountability", "Automation supports decisions. People approve access, scope, remediation and reporting."],
  ["Evidence integrity", "Findings and reports retain the evidence and audit history needed to explain a decision."],
] as const;

const CAPABILITIES = [
  ["Verified Asset inventory", "Ownership-gated targets and scanner compatibility."],
  ["Controlled scanning", "Released Web App and TLS/SSL workflows with queued execution."],
  ["Normalized Findings", "Deduplicated evidence, severity and remediation workflow."],
  ["Immutable VAPT reports", "PDF and JSON report snapshots with controlled downloads."],
  ["Enterprise Team access", "Owner, Admin, Viewer and Custom access boundaries."],
  ["Workspace activity", "Attributable authentication, scan, Finding and report events."],
] as const;

export async function GET() {
  const body = `
<div class="evd-page co">
  <section class="evd-hero evd-hero--shard-left">
    <div class="evd-hero-inner">
      <span class="co-hero-label">EVADA by Netforte Consulting</span>
      <h1>EVADA by Netforte Consulting</h1>
      <p class="co-hero-copy">Tenant-isolated security validation for teams that need authorized scope, controlled assessment and an accountable path from evidence to action.</p>
      <div class="evd-hero-actions">
        <a href="/book-demo" class="evd-hero-cta"><span class="evd-cta-label">See EVADA in action</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/contact" class="evd-hero-secondary">Contact the team</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section id="our-story" class="co-story evd-lightsec">
    <div class="co-wrap co-story-grid">
      <div>
        <span class="co-label">Why EVADA exists</span>
        <h2>Security signals only matter when a team can make a defensible decision.</h2>
      </div>
      <div class="co-story-copy">
        <p>Security teams rarely lack scanner output. They lack a reliable way to connect authorized scope, controlled execution, normalized evidence and accountable remediation.</p>
        <p>EVADA brings that workflow into one enterprise control plane. It keeps each organization isolated while giving its team a clear route from a verified Asset to a Finding, and from a Finding to an immutable report.</p>
        <p>The product is owned and developed by Netforte Consulting Ltd in England and Wales.</p>
      </div>
    </div>
  </section>

  <section id="operating-model" class="co-model">
    <div class="co-wrap">
      <div class="co-section-heading co-section-heading--dark">
        <span class="co-label">Operating model</span>
        <h2>From authorized scope to accountable output.</h2>
        <p>The same controls follow each customer workflow, regardless of the scanner adapter used.</p>
      </div>
      <ol class="co-flow">
        ${OPERATING_MODEL.map(
          ([number, title, description]) => `
        <li class="co-flow-step">
          <span class="co-flow-number">${number}</span>
          <h3>${title}</h3>
          <p>${description}</p>
        </li>`,
        ).join("")}
      </ol>
    </div>
  </section>

  <section id="principles" class="co-principles evd-lightsec">
    <div class="co-wrap">
      <div class="co-section-heading">
        <span class="co-label">Product principles</span>
        <h2>Controls that remain visible in the product.</h2>
      </div>
      <div class="co-principles-grid">
        ${PRINCIPLES.map(
          ([title, description], index) => `
        <article class="co-principle">
          <span class="co-principle-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>${description}</p>
        </article>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section id="capabilities" class="co-capabilities evd-lightsec">
    <div class="co-wrap co-capabilities-layout">
      <div class="co-capabilities-intro">
        <span class="co-label">Available today</span>
        <h2>A connected validation workflow, not a collection of disconnected screens.</h2>
        <p>These capabilities are implemented across EVADA's customer workspace and internal control plane.</p>
        <a href="/platform" class="co-text-link">Explore the platform <span aria-hidden="true">&#8594;</span></a>
      </div>
      <div class="co-capability-list">
        ${CAPABILITIES.map(
          ([title, description], index) => `
        <div class="co-capability">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><h3>${title}</h3><p>${description}</p></div>
        </div>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section id="company-facts" class="co-facts">
    <div class="co-wrap">
      <div class="co-section-heading co-section-heading--dark">
        <span class="co-label">Company facts</span>
        <h2>The organization behind EVADA.</h2>
      </div>
      <dl class="co-facts-grid">
        <div><dt>Product</dt><dd>EVADA</dd></div>
        <div><dt>Owner and developer</dt><dd>Netforte Consulting Ltd</dd></div>
        <div><dt>Registered</dt><dd>England and Wales</dd></div>
        <div><dt>Office</dt><dd>124 City Road, London, EC1V 2NX</dd></div>
        <div><dt>Contact</dt><dd><a href="mailto:info@evada.ai">info@evada.ai</a></dd></div>
      </dl>
    </div>
  </section>

  <!-- Continuous Logo Marquee Queue in #F3F6F4 Gap Band -->
  <div class="co-logo-marquee-band" aria-label="EVADA Brand Logos">
    <div class="co-logo-marquee-track">
      <div class="co-logo-marquee-group">
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
      </div>
      <div class="co-logo-marquee-group" aria-hidden="true">
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
        <div class="co-logo-item"><img src="/logos/logo1.png" alt="EVADA Logo" loading="lazy" /></div>
      </div>
    </div>
  </div>

  <!-- =========================================================
       CERTIFICATIONS & STANDARDS SECTION
       ========================================================= -->
  <section class="evd-rankings-section" aria-label="Certifications & Standards">
    <div class="evd-rankings-card">
      
      <!-- Left Badge Showcase Box with Glowing Red/Green Gradient -->
      <div class="evd-rankings-showcase">
        
        <!-- Cert 1 (Left): PEERS 2022 -->
        <div class="evd-rank-badge" title="PEERS 2022 Certified">
          <img src="/certificates/peers (2022).jpg" alt="PEERS 2022 Certified" loading="lazy" />
        </div>

        <!-- Cert 2 (Center - Enlarged): Cyber Essentials -->
        <div class="evd-rank-badge evd-rank-badge--center" title="Cyber Essentials Certified">
          <img src="/certificates/cyber-essentials.png" alt="Cyber Essentials Certified" loading="lazy" />
        </div>

        <!-- Cert 3 (Right): PEERS Quality -->
        <div class="evd-rank-badge" title="PEERS Quality Standard">
          <img src="/certificates/peers_Quality.jpg" alt="PEERS Quality Standard" loading="lazy" />
        </div>

      </div>

      <!-- Right Content Area -->
      <div class="evd-rankings-content">
        <div class="evd-rankings-text-block">
          <h2 class="evd-rankings-headline">Built for security. Proven by standards.</h2>
          <p class="evd-rankings-sub">Our certifications and industry recognitions demonstrate our commitment to security, compliance, and continuous improvement.</p>
        </div>
      </div>

    </div>
  </section>

  <section class="co-end evd-lightsec">
    <div class="co-wrap co-end-inner">
      <div><span class="co-label">Start a conversation</span><h2>Talk to the people building EVADA.</h2></div>
      <div class="co-end-actions">
        <a href="/contact" class="evd-hero-cta"><span class="evd-cta-label">Contact us</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="co-outline-link">Request a demo</a>
      </div>
    </div>
  </section>
</div>`;

  const css = `
    .evd-hero { --evd-hero-blend: #ffffff; }
    .co { width: 100%; max-width: 100%; min-width: 0; overflow-x: clip; background: #ffffff; color: #101510; }
    .co-wrap { width: min(100% - clamp(2rem, 8vw, 8rem), 82rem); margin-inline: auto; }
    .co section, .co-wrap, .co-story-grid > *, .co-capabilities-layout > *, .co-end-inner > * { min-width: 0; max-width: 100%; }
    .co h1, .co h2, .co h3, .co p, .co dt, .co dd { max-width: 100%; overflow-wrap: break-word; }
    .co-label, .co-hero-label { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; line-height: 1.4; letter-spacing: 0.1em; text-transform: uppercase; }
    .co-label { color: #168457; }
    .co-hero-label { color: #35d18b; margin-bottom: 1rem; }
    .co-hero-copy { max-width: 43rem; margin: 1.25rem 0 0; color: rgba(237, 246, 242, 0.72); font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.65; }
    .co h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.04; letter-spacing: 0; font-weight: 600; }
    .co h3 { letter-spacing: 0; }

    .co-story { padding: clamp(4.25rem, 8vw, 7rem) 0; }
    .co-story-grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(3rem, 8vw, 8rem); align-items: start; }
    .co-story h2 { max-width: 35rem; margin-top: 1rem; }
    .co-story-copy { border-left: 1px solid rgba(16, 21, 16, 0.16); padding-left: clamp(1.5rem, 4vw, 3rem); }
    .co-story-copy p { margin: 0 0 1.2rem; color: rgba(16, 21, 16, 0.66); font-size: 1.08rem; line-height: 1.75; }
    .co-story-copy p:first-child { color: #101510; font-size: 1.24rem; line-height: 1.6; }
    .co-story-copy p:last-child { margin-bottom: 0; }

    .co-model { background: #061510; color: #edf6f1; padding: clamp(4rem, 7vw, 6.5rem) 0; }
    .co-section-heading { max-width: 48rem; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
    .co-section-heading h2 { margin-top: 0.85rem; }
    .co-section-heading > p { margin: 1rem 0 0; max-width: 40rem; color: rgba(16, 21, 16, 0.62); font-size: 1.05rem; line-height: 1.65; }
    .co-section-heading--dark .co-label { color: #35d18b; }
    .co-section-heading--dark > p { color: rgba(237, 246, 241, 0.62); }
    .co-flow { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid rgba(237, 246, 241, 0.2); }
    .co-flow-step { position: relative; min-height: 15rem; padding: 1.4rem clamp(1rem, 2.2vw, 2rem) 0; border-right: 1px solid rgba(237, 246, 241, 0.14); }
    .co-flow-step:first-child { padding-left: 0; }
    .co-flow-step:last-child { border-right: 0; }
    .co-flow-number { color: #35d18b; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; letter-spacing: 0.08em; }
    .co-flow-step h3 { margin: 3rem 0 0.65rem; font-size: 1.2rem; }
    .co-flow-step p { margin: 0; color: rgba(237, 246, 241, 0.62); font-size: 0.96rem; line-height: 1.65; }

    .co-principles { padding: clamp(4.25rem, 8vw, 7rem) 0; }
    .co-principles-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid rgba(16, 21, 16, 0.18); border-left: 1px solid rgba(16, 21, 16, 0.18); }
    .co-principle { min-height: 13rem; padding: clamp(1.5rem, 4vw, 2.5rem); border-right: 1px solid rgba(16, 21, 16, 0.18); border-bottom: 1px solid rgba(16, 21, 16, 0.18); transition: background-color 180ms ease; }
    .co-principle:hover { background: #f0f8f4; }
    .co-principle-index { color: #168457; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; letter-spacing: 0.08em; }
    .co-principle h3 { margin: 2rem 0 0.65rem; font-size: 1.35rem; }
    .co-principle p { margin: 0; max-width: 31rem; color: rgba(16, 21, 16, 0.62); line-height: 1.65; }

    .co-capabilities { padding: 0 0 clamp(4.25rem, 8vw, 7rem); }
    .co-capabilities-layout { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: clamp(3rem, 8vw, 8rem); align-items: start; }
    .co-capabilities-intro { position: sticky; top: 7.5rem; }
    .co-capabilities-intro h2 { margin-top: 0.9rem; font-size: clamp(1.9rem, 3.5vw, 3rem); }
    .co-capabilities-intro > p { margin: 1rem 0 1.5rem; max-width: 33rem; color: rgba(16, 21, 16, 0.62); line-height: 1.65; }
    .co-text-link { color: #096c46; font-weight: 600; text-decoration: none; }
    .co-text-link:hover { text-decoration: underline; text-underline-offset: 0.25rem; }
    .co-capability-list { border-top: 1px solid rgba(16, 21, 16, 0.18); }
    .co-capability { display: grid; grid-template-columns: 3rem minmax(0, 1fr); gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid rgba(16, 21, 16, 0.18); }
    .co-capability > span { color: #168457; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.74rem; padding-top: 0.2rem; }
    .co-capability h3 { margin: 0 0 0.35rem; font-size: 1.12rem; }
    .co-capability p { margin: 0; color: rgba(16, 21, 16, 0.6); line-height: 1.55; }

    .co-facts { background: #173a2d; color: #eef7f2; padding: clamp(4rem, 7vw, 6rem) 0; }
    .co-facts-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin: 0; border-top: 1px solid rgba(238, 247, 242, 0.18); }
    .co-facts-grid > div { padding: 1.4rem clamp(0.75rem, 2vw, 1.5rem) 0; border-right: 1px solid rgba(238, 247, 242, 0.14); }
    .co-facts-grid > div:first-child { padding-left: 0; }
    .co-facts-grid > div:last-child { border-right: 0; }
    .co-facts dt { color: rgba(238, 247, 242, 0.48); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .co-facts dd { margin: 0.65rem 0 0; font-size: 1rem; line-height: 1.5; }
    .co-facts a { color: #eef7f2; text-underline-offset: 0.25rem; }

    .co-end { padding: clamp(4rem, 8vw, 6.5rem) 0; }
    .co-end-inner { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; }
    .co-end h2 { max-width: 43rem; margin-top: 0.8rem; }
    .co-end-actions { display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
    .co-outline-link { display: inline-flex; align-items: center; justify-content: center; min-height: 3.25rem; padding: 0 1.25rem; border: 1px solid rgba(16, 21, 16, 0.25); border-radius: 8px; color: #101510; font-weight: 600; text-decoration: none; }
    .co-outline-link:hover { background: #f1f6f3; }

    /* =========================================================
       LOGO MARQUEE QUEUE (Infinite Right-to-Left Loop)
       ========================================================= */
    .co-logo-marquee-band {
      width: 100%;
      background: #F3F6F4;
      padding: clamp(1.25rem, 2.2vw, 1.85rem) 0;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }

    .co-logo-marquee-track {
      display: flex;
      width: max-content;
      animation: coLogoScroll 28s linear infinite;
      will-change: transform;
    }

    .co-logo-marquee-band:hover .co-logo-marquee-track {
      animation-play-state: paused;
    }

    .co-logo-marquee-group {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: clamp(3rem, 6vw, 6rem);
      padding-right: clamp(3rem, 6vw, 6rem);
      flex-shrink: 0;
    }

    .co-logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      opacity: 0.82;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .co-logo-item:hover {
      opacity: 1;
      transform: scale(1.06);
    }

    .co-logo-item img {
      height: clamp(30px, 3vw, 42px);
      width: auto;
      max-width: 160px;
      object-fit: contain;
      display: block;
    }

    @keyframes coLogoScroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media screen and (max-width: 980px) {
      .co-story-grid, .co-capabilities-layout { grid-template-columns: 1fr; gap: 2.5rem; }
      .co-capabilities-intro { position: static; }
      .co-flow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .co-flow-step { min-height: 13rem; border-bottom: 1px solid rgba(237, 246, 241, 0.14); }
      .co-flow-step:first-child { padding-left: clamp(1rem, 2.2vw, 2rem); }
      .co-facts-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .co-facts-grid > div { min-height: 7rem; border-bottom: 1px solid rgba(238, 247, 242, 0.14); }
      .co-facts-grid > div:first-child { padding-left: clamp(0.75rem, 2vw, 1.5rem); }
      .co-end-inner { align-items: flex-start; flex-direction: column; }
    }
    @media screen and (max-width: 620px) {
      .co-wrap { width: calc(100% - 2rem); max-width: calc(100vw - 2rem); }
      .co .evd-hero-inner { box-sizing: border-box; width: 100%; min-width: 0; max-width: 100%; }
      .co h1, .co h2, .co h3, .co p, .co dt, .co dd { white-space: normal !important; }
      .co-story-copy { border-left: 0; border-top: 1px solid rgba(16, 21, 16, 0.16); padding: 1.5rem 0 0; }
      .co-flow, .co-principles-grid, .co-facts-grid { grid-template-columns: 1fr; }
      .co-flow-step { min-height: 0; padding: 1.4rem 0 1.6rem; border-right: 0; }
      .co-flow-step:first-child { padding-left: 0; }
      .co-flow-step h3, .co-principle h3 { margin-top: 1.25rem; }
      .co-principle { min-height: 0; }
      .co-facts-grid > div { min-height: 0; padding: 1.2rem 0; border-right: 0; }
      .co-facts-grid > div:first-child { padding-left: 0; }
      .co-end-actions, .co-end-actions a { width: 100%; }
    }
    /* =========================================================
       CERTIFICATIONS & STANDARDS SECTION (Full-Width Banner)
       ========================================================= */
    .evd-rankings-section {
      position: relative;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: clamp(2.4rem, 3.6vw, 3.3rem) 0;
      background: #000000;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-sizing: border-box;
      overflow: hidden;
    }

    .evd-rankings-section::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 8%;
      transform: translateY(-50%);
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(220, 20, 40, 0.12) 0%, transparent 65%);
      pointer-events: none;
    }

    .evd-rankings-section::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 6%;
      transform: translateY(-50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(46, 205, 128, 0.1) 0%, transparent 65%);
      pointer-events: none;
    }

    .evd-rankings-card {
      width: max-content;
      max-width: min(84rem, 94vw);
      margin: 0 auto;
      padding: 0 clamp(1rem, 2vw, 2rem);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(3rem, 5vw, 5.5rem);
      position: relative;
      z-index: 2;
      background: transparent;
      border: none;
      box-shadow: none;
      border-radius: 0;
      box-sizing: border-box;
    }

    .evd-rankings-showcase {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.9rem, 1.6vw, 1.8rem);
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }

    .evd-rank-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
      cursor: pointer;
      flex-shrink: 0;
    }

    .evd-rank-badge:hover {
      transform: translateY(-4px) scale(1.06);
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.65));
    }

    .evd-rank-badge img {
      width: clamp(85px, 8vw, 115px);
      height: auto;
      max-height: 120px;
      object-fit: contain;
      display: block;
    }

    .evd-rank-badge--center {
      transform: scale(1.04);
      z-index: 3;
    }

    .evd-rank-badge--center:hover {
      transform: translateY(-4px) scale(1.1);
    }

    .evd-rank-badge--center img {
      width: clamp(105px, 10vw, 135px);
      max-height: 140px;
    }

    .evd-rankings-content {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2;
      min-width: 0;
      flex: 0 1 auto;
    }

    .evd-rankings-text-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.45rem;
      min-width: 0;
      flex: 1 1 auto;
    }

    .evd-rankings-headline {
      font-family: 'Roobert', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: clamp(1.85rem, 2.8vw + 0.3rem, 3.2rem);
      font-weight: 600;
      line-height: 1.06;
      letter-spacing: 0;
      color: #ffffff;
      margin: 0;
      text-wrap: balance;
    }

    .evd-rankings-sub {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: clamp(0.94rem, 0.3vw + 0.92rem, 1.08rem);
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.78);
      margin: 0.35rem 0 0 0;
      text-wrap: balance;
      max-width: 44rem;
    }

    @media screen and (max-width: 1100px) {
      .evd-rankings-card {
        flex-direction: column;
        width: 100%;
        gap: 1.8rem;
        text-align: center;
      }

      .evd-rankings-showcase {
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
      }

      .evd-rankings-content {
        justify-content: center;
        width: 100%;
      }

      .evd-rankings-text-block {
        align-items: center;
        max-width: 100%;
      }

      .evd-rankings-headline {
        max-width: 100%;
      }
    }

    @media screen and (max-width: 640px) {
      .evd-rankings-section {
        padding: 2.2rem 0;
      }

      .evd-rankings-showcase {
        gap: 0.75rem;
      }

      .evd-rank-badge img {
        width: 75px;
      }

      .evd-rank-badge--center img {
        width: 100px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .co-principle { transition: none; }
    }`;

  return renderPage({
    title: "Company | EVADA",
    description:
      "EVADA is owned and developed by Netforte Consulting Ltd. Learn how authorization, tenant isolation and evidence integrity shape the platform.",
    css,
    body,
  });
}
