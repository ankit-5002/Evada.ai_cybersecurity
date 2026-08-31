import { renderPage } from "../lib/shell";

const OPERATING_MODEL = [
  ["01", "Authorize scope", "A customer verifies the Asset and explicitly defines what EVADA may assess."],
  ["02", "Control execution", "Permissions, queue limits, duplicate locks and timeouts govern every scanner job."],
  ["03", "Normalize evidence", "Scanner output becomes tenant-scoped Findings with severity, evidence and remediation context."],
  ["04", "Issue accountable output", "Teams triage Findings, preserve activity and generate immutable VAPT report snapshots."],
] as const;

const PRINCIPLES = [
  ["Authorization first", "No target enters a scanner queue until ownership and scope have been established.", "Asset verification", "Before execution"],
  ["Tenant isolation", "Each organization receives isolated data routing, storage paths and operational boundaries.", "Workspace context", "Every request"],
  ["Human accountability", "Automation supports decisions. People approve access, scope, remediation and reporting.", "Roles and activity", "At every decision"],
  ["Evidence integrity", "Findings and reports retain the evidence and audit history needed to explain a decision.", "Finding lifecycle", "Through reporting"],
] as const;

const CAPABILITIES = [
  ["Verified Asset inventory", "Ownership-gated targets and scanner compatibility.", "Scope", "Verified"],
  ["Controlled scanning", "Released Web App and TLS/SSL workflows with queued execution.", "Execute", "Governed"],
  ["Normalized Findings", "Deduplicated evidence, severity and remediation workflow.", "Triage", "Prioritized"],
  ["Immutable VAPT reports", "PDF and JSON report snapshots with controlled downloads.", "Evidence", "Retained"],
  ["Enterprise Team access", "Owner, Admin, Viewer and Custom access boundaries.", "Access", "Scoped"],
  ["Workspace activity", "Attributable authentication, scan, Finding and report events.", "Audit", "Traceable"],
] as const;

export async function GET() {
  const body = `
<div class="evd-page co">
  <section class="evd-hero evd-hero--shard-left">
    <div class="evd-hero-inner">
      <h1>EVADA by Netforte Consulting Ltd.</h1>
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
      <div class="co-story-intro">
        <span class="co-label">Why EVADA exists</span>
        <h2>Security signals only matter when a team can make a defensible decision.</h2>
        <p class="co-story-summary">EVADA connects the evidence a scanner produces with the context and controls a security team needs to act.</p>
      </div>
      <div class="co-story-copy">
        <article class="co-story-card co-story-card--dark"><span>01.</span><div><h3>Establish trust first</h3><p>Verify the Asset and authorized scope before any security check can run.</p></div><footer>Verified scope &nbsp;&middot;&nbsp; Authorization</footer></article>
        <article class="co-story-card co-story-card--light"><span>02.</span><div><h3>Turn output into context</h3><p>Normalize scanner evidence into Findings that teams can prioritize and explain.</p></div><footer>Normalized evidence &nbsp;&middot;&nbsp; Triage</footer></article>
        <article class="co-story-card co-story-card--green"><span>03.</span><div><h3>Preserve the decision</h3><p>Keep activity, remediation and immutable report evidence connected through the full lifecycle—from attributable actions to fixed PDF and JSON report snapshots.</p></div><footer>Immutable snapshots &nbsp;&middot;&nbsp; Audit history</footer></article>
      </div>
      <p class="co-story-owner">Owned and developed by <strong>Netforte Consulting Ltd</strong> in England and Wales.</p>
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
          ([title, description, surface, moment], index) => `
        <article class="co-principle">
          <div class="co-principle-top"><span class="co-principle-index">${String(index + 1).padStart(2, "0")}</span><span class="co-principle-state"><i></i>Enforced</span></div>
          <div class="co-principle-rule" aria-hidden="true"><span></span></div>
          <div class="co-principle-content"><h3>${title}</h3><p>${description}</p></div>
          <dl class="co-principle-meta"><div><dt>Visible in</dt><dd>${surface}</dd></div><div><dt>Applied</dt><dd>${moment}</dd></div></dl>
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
        <div class="co-capability-pulse"><i></i><span><strong>One operating context</strong><small>Asset to evidence</small></span></div>
      </div>
      <div class="co-capability-list">
        ${CAPABILITIES.map(
          ([title, description, phase, state], index) => `
        <div class="co-capability">
          <span class="co-capability-index">${String(index + 1).padStart(2, "0")}</span>
          <div class="co-capability-copy"><span class="co-capability-phase">${phase}</span><h3>${title}</h3><p>${description}</p></div>
          <span class="co-capability-state"><i></i>${state}</span>
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

    .co-story { padding:clamp(4.25rem,8vw,7rem) 0; background:#fff; }
    .co-story-grid { display:grid; grid-template-columns:minmax(0,.78fr) minmax(28rem,1.22fr); gap:clamp(2.5rem,6vw,6rem); align-items:center; }
    .co-story-intro { min-width:0; }
    .co-story h2 { max-width:35rem; margin:1rem 0 0; }
    .co-story-summary { max-width:30rem; margin:1.25rem 0 0; color:rgba(16,21,16,.58); font-size:.94rem; line-height:1.6; }
    .co-story-copy { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,.78fr); grid-template-rows:repeat(2,minmax(9.75rem,auto)); gap:.75rem; border:0; }
    .co-story-card { position:relative; isolation:isolate; display:flex; min-width:0; overflow:hidden; flex-direction:column; padding:1.05rem 1.15rem; border:1px solid rgba(16,21,16,.18); border-radius:14px; box-shadow:0 12px 28px rgba(7,24,19,.08); transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .35s ease,border-color .3s ease; }
    .co-story-card::before { content:""; position:absolute; inset:0; z-index:-1; opacity:0; background:linear-gradient(115deg,transparent 25%,rgba(255,255,255,.22) 48%,transparent 68%); transform:translateX(-100%); transition:transform .75s cubic-bezier(.16,1,.3,1),opacity .3s ease; }
    .co-story-card--dark { grid-column:1; grid-row:1; color:#f2f8f5; background:linear-gradient(145deg,#071018,#0b1717); border-color:rgba(255,255,255,.1); }
    .co-story-card--light { grid-column:1; grid-row:2; color:#101510; background:#fff; }
    .co-story-card--green { grid-column:2; grid-row:1 / 3; color:#06130e; background:linear-gradient(145deg,#42dc91,#24c979); border-color:rgba(7,24,19,.12); box-shadow:0 22px 55px rgba(46,205,128,.2); }
    .co-story-card > span { color:inherit; font:700 .68rem/1 'Aeonik Mono',monospace; }
    .co-story-card > div { margin-top:.75rem; }
    .co-story-card--green > div { margin-top:.85rem; }
    .co-story-copy h3 { margin:0; font-size:clamp(1rem,.45vw + .92rem,1.2rem); }
    .co-story-card p { max-width:28rem; margin:.42rem 0 0; color:rgba(16,21,16,.62); font-size:.73rem; line-height:1.48; }
    .co-story-card--dark p { color:rgba(242,248,245,.62); }
    .co-story-card--green p { margin-top:clamp(1rem,3vw,2.8rem); color:rgba(6,19,14,.76); }
    .co-story-card footer { margin-top:auto; padding-top:.7rem; border-top:1px solid rgba(16,21,16,.15); color:rgba(16,21,16,.52); font:600 .55rem/1.35 'Aeonik Mono',monospace; }
    .co-story-card--dark footer { border-color:rgba(255,255,255,.12); color:rgba(242,248,245,.48); }
    .co-story-owner { grid-column:2; margin:.2rem 0 0; color:rgba(16,21,16,.48); font-size:.68rem; line-height:1.45; }
    .co-story-owner strong { color:#173a2d; }
    @media (hover:hover) and (pointer:fine) {
      .co-story-card:hover { transform:translateY(-5px); border-color:rgba(46,205,128,.72); box-shadow:0 22px 45px rgba(7,24,19,.14); }
      .co-story-card--green:hover { box-shadow:0 30px 68px rgba(46,205,128,.3); }
      .co-story-card:hover::before { opacity:1; transform:translateX(100%); }
    }

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

    .co-principles { padding: clamp(4.25rem, 8vw, 7rem) 0; background:linear-gradient(180deg,#fff,#f4faf7); }
    .co-principles-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:1rem; }
    .co-principle { position:relative; isolation:isolate; display:flex; min-height:15.5rem; overflow:hidden; flex-direction:column; padding:clamp(1rem,2.2vw,1.45rem); border:1px solid rgba(22,132,87,.28); border-radius:14px; background:rgba(255,255,255,.82); box-shadow:0 10px 32px rgba(7,24,19,.045); transition:transform .38s cubic-bezier(.16,1,.3,1),box-shadow .35s ease,border-color .3s ease; }
    .co-principle::before { content:""; position:absolute; inset:0; z-index:-1; opacity:0; background:radial-gradient(circle at 88% 10%,rgba(46,205,128,.17),transparent 31%),linear-gradient(145deg,#fff,#f0fff7); transition:opacity .35s ease; }
    .co-principle::after { content:""; position:absolute; top:-35%; right:-12%; width:10rem; height:10rem; border:1px dashed rgba(22,132,87,.18); border-radius:50%; transition:transform .6s cubic-bezier(.16,1,.3,1); }
    .co-principle-top { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .co-principle-index { color:#168457; font-family:'Aeonik Mono',ui-monospace,monospace; font-size:.76rem; letter-spacing:.08em; }
    .co-principle-state { display:inline-flex; align-items:center; gap:.45rem; padding:.38rem .58rem; border:1px solid rgba(46,205,128,.26); border-radius:999px; color:#087547; background:#eafff4; font:700 .6rem/1 'Aeonik Mono',monospace; text-transform:uppercase; }
    .co-principle-state i { width:.42rem; height:.42rem; border-radius:50%; background:#2ecd80; box-shadow:0 0 0 4px rgba(46,205,128,.1); }
    .co-principle-rule { position:relative; height:1px; margin:.9rem 0 1rem; overflow:hidden; background:rgba(16,21,16,.1); }
    .co-principle-rule span { display:block; width:28%; height:100%; background:#2ecd80; transition:width .5s cubic-bezier(.16,1,.3,1); }
    .co-principle-content { max-width:32rem; }
    .co-principle h3 { margin:0 0 .5rem; font-size:1.22rem; }
    .co-principle p { margin:0; color:rgba(16,21,16,.62); font-size:.9rem; line-height:1.55; }
    .co-principle-meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.55rem; margin:auto 0 0; padding-top:1rem; }
    .co-principle-meta > div { padding:.58rem .65rem; border:1px solid rgba(16,21,16,.08); border-radius:8px; background:rgba(244,250,247,.8); }
    .co-principle-meta dt { color:rgba(16,21,16,.42); font:700 .58rem/1 'Aeonik Mono',monospace; text-transform:uppercase; }
    .co-principle-meta dd { margin:.35rem 0 0; color:#173a2d; font-size:.76rem; font-weight:700; }
    @media (hover:hover) and (pointer:fine) {
      .co-principle:hover { transform:translateY(-7px); border-color:rgba(46,205,128,.68); box-shadow:0 24px 52px rgba(7,24,19,.12); }
      .co-principle:hover::before { opacity:1; }.co-principle:hover::after { transform:scale(1.18) rotate(35deg); }
      .co-principle:hover .co-principle-rule span { width:100%; }
    }

    .co-capabilities { position:relative; overflow:hidden; padding:clamp(4.25rem,8vw,7rem) 0; background:radial-gradient(circle at 8% 18%,rgba(46,205,128,.1),transparent 23%),linear-gradient(135deg,#f7fbf9,#fff 58%,#effaf5); }
    .co-capabilities::after { content:""; position:absolute; right:-9rem; top:8%; width:29rem; height:29rem; border:1px dashed rgba(22,132,87,.12); border-radius:50%; pointer-events:none; animation:coCapabilityOrbit 32s linear infinite; }
    .co-capabilities-layout { position:relative; z-index:1; display:grid; grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr); gap:clamp(2.5rem,6vw,5rem); align-items:start; }
    .co-capabilities-intro { position: sticky; top: 7.5rem; }
    .co-capabilities-intro h2 { margin-top: 0.9rem; font-size: clamp(1.9rem, 3.5vw, 3rem); }
    .co-capabilities-intro > p { margin: 1rem 0 1.5rem; max-width: 33rem; color: rgba(16, 21, 16, 0.62); line-height: 1.65; }
    .co-text-link { color: #096c46; font-weight: 600; text-decoration: none; }
    .co-text-link:hover { text-decoration: underline; text-underline-offset: 0.25rem; }
    .co-capability-pulse { display:flex; align-items:center; gap:.75rem; width:max-content; max-width:100%; margin-top:2rem; padding:.7rem .85rem; border:1px solid rgba(46,205,128,.25); border-radius:999px; background:rgba(255,255,255,.78); box-shadow:0 10px 28px rgba(7,24,19,.06); }
    .co-capability-pulse > i { width:.58rem; height:.58rem; border-radius:50%; background:#2ecd80; animation:coCapabilityPulse 1.8s ease-in-out infinite; }
    .co-capability-pulse span,.co-capability-pulse strong,.co-capability-pulse small { display:block; }.co-capability-pulse strong { color:#173a2d; font-size:.72rem; }.co-capability-pulse small { color:rgba(16,21,16,.45); font-size:.58rem; }
    .co-capability-list { position:relative; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.8rem; }
    .co-capability { position:relative; isolation:isolate; display:flex; min-width:0; min-height:10.75rem; overflow:hidden; flex-direction:column; padding:.9rem 1rem; border:1px solid rgba(22,132,87,.2); border-radius:13px; background:rgba(255,255,255,.82); box-shadow:0 8px 28px rgba(7,24,19,.045); backdrop-filter:blur(10px); transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .3s ease,border-color .3s ease; }
    .co-capability::before { content:""; position:absolute; z-index:-1; top:-4.25rem; right:-4.25rem; width:8.5rem; height:8.5rem; border:1px dashed rgba(46,205,128,.22); border-radius:50%; transition:transform .55s cubic-bezier(.16,1,.3,1),background-color .3s ease; }
    .co-capability::after { content:""; position:absolute; top:0; left:0; width:3.5rem; height:2px; background:#2ecd80; transition:width .45s cubic-bezier(.16,1,.3,1); }
    .co-capability-index { display:grid; width:2.35rem; height:2.35rem; place-items:center; border-radius:9px; color:#168457; background:#eafff4; font:700 .66rem/1 'Aeonik Mono',monospace; transition:color .3s ease,background .3s ease; }
    .co-capability-copy { min-width:0; margin-top:.75rem; }.co-capability-phase { position:absolute; top:1rem; right:1rem; display:block; color:#0787a5; font:700 .56rem/1 'Aeonik Mono',monospace; text-transform:uppercase; }
    .co-capability h3 { margin:0; font-size:1.05rem; }.co-capability p { margin:.4rem 0 0; color:rgba(16,21,16,.57); font-size:.78rem; line-height:1.45; }
    .co-capability-state { display:inline-flex; align-items:center; align-self:flex-start; gap:.4rem; margin-top:auto; padding:.36rem .52rem; border:1px solid rgba(46,205,128,.22); border-radius:999px; color:#087547; background:#f1fff8; font:700 .54rem/1 'Aeonik Mono',monospace; text-transform:uppercase; white-space:nowrap; }
    .co-capability-state i { width:.38rem; height:.38rem; border-radius:50%; background:#2ecd80; }
    .co-capability:nth-child(1),.co-capability:nth-child(6) { color:#f2f8f5; border-color:rgba(255,255,255,.12); background:linear-gradient(145deg,#071018,#0b1717); }
    .co-capability:nth-child(1) h3,.co-capability:nth-child(6) h3 { color:#fff; }
    .co-capability:nth-child(1) p,.co-capability:nth-child(6) p { color:rgba(242,248,245,.6); }
    .co-capability:nth-child(1) .co-capability-phase,.co-capability:nth-child(6) .co-capability-phase { color:#75e7ff; }
    .co-capability:nth-child(1) .co-capability-index,.co-capability:nth-child(6) .co-capability-index { color:#bfffe1; background:rgba(46,205,128,.13); }
    .co-capability:nth-child(1) .co-capability-state,.co-capability:nth-child(6) .co-capability-state { color:#bfffe1; border-color:rgba(46,205,128,.25); background:rgba(46,205,128,.09); }
    .co-capability:nth-child(2),.co-capability:nth-child(3) { color:#101510; border-color:rgba(16,21,16,.16); background:#fff; box-shadow:0 10px 28px rgba(7,24,19,.06); }
    .co-capability:nth-child(4),.co-capability:nth-child(5) { color:#06130e; border-color:rgba(7,24,19,.14); background:linear-gradient(145deg,#42dc91,#24c979); box-shadow:0 12px 30px rgba(46,205,128,.14); }
    .co-capability:nth-child(4) p,.co-capability:nth-child(5) p { color:rgba(6,19,14,.7); }
    .co-capability:nth-child(4) .co-capability-phase,.co-capability:nth-child(5) .co-capability-phase { color:#073f2b; }
    .co-capability:nth-child(4) .co-capability-index,.co-capability:nth-child(5) .co-capability-index { color:#fff; background:#071813; }
    .co-capability:nth-child(4) .co-capability-state,.co-capability:nth-child(5) .co-capability-state { color:#071813; border-color:rgba(7,24,19,.16); background:rgba(255,255,255,.3); }
    .co-capability:nth-child(4) .co-capability-state i,.co-capability:nth-child(5) .co-capability-state i { background:#071813; }
    @media (hover:hover) and (pointer:fine) {
      .co-capability:hover { transform:translateY(-6px); border-color:rgba(46,205,128,.65); box-shadow:0 20px 44px rgba(7,24,19,.14); }.co-capability:hover::before { transform:scale(1.25) rotate(38deg); background:rgba(46,205,128,.06); }.co-capability:hover::after { width:100%; }.co-capability:hover .co-capability-index { color:#071813; background:#2ecd80; }
      .co-capability:nth-child(1):hover,.co-capability:nth-child(6):hover { border-color:#2ecd80; box-shadow:0 24px 52px rgba(7,16,24,.3),0 0 24px rgba(46,205,128,.12); }
      .co-capability:nth-child(4):hover,.co-capability:nth-child(5):hover { border-color:rgba(7,24,19,.32); box-shadow:0 25px 52px rgba(46,205,128,.28); }.co-capability:nth-child(4):hover::before,.co-capability:nth-child(5):hover::before { background:rgba(255,255,255,.12); }.co-capability:nth-child(4):hover .co-capability-index,.co-capability:nth-child(5):hover .co-capability-index { color:#2ecd80; background:#071813; }
    }
    @keyframes coCapabilityPulse { 50% { box-shadow:0 0 0 8px rgba(46,205,128,0); transform:scale(1.12); } }
    @keyframes coCapabilityOrbit { to { transform:rotate(360deg); } }

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
      .co-story-intro { grid-template-columns:1fr; gap:1rem; }
      .co-story-intro .co-label { grid-column:auto; margin-bottom:0; }
      .co-story-owner { grid-column:1; }
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
      .co-story-copy { grid-template-columns:1fr; grid-template-rows:auto; padding:0; border:0; }
      .co-story-card--dark,.co-story-card--light,.co-story-card--green { grid-column:1; grid-row:auto; min-height:0; }
      .co-story-card--green p { margin-top:.65rem; }
      .co-capability-list { padding-left:1.35rem; }
      .co-capability-list::before { left:.25rem; }
      .co-capability { grid-template-columns:2.35rem minmax(0,1fr); }
      .co-capability::before { left:-1.35rem; }
      .co-capability-state { grid-column:2; justify-self:start; }
      .co-flow, .co-principles-grid, .co-facts-grid { grid-template-columns: 1fr; }
      .co-flow-step { min-height: 0; padding: 1.4rem 0 1.6rem; border-right: 0; }
      .co-flow-step:first-child { padding-left: 0; }
      .co-flow-step h3, .co-principle h3 { margin-top: 1.25rem; }
      .co-principle { min-height: 0; }
      .co-facts-grid > div { min-height: 0; padding: 1.2rem 0; border-right: 0; }
      .co-facts-grid > div:first-child { padding-left: 0; }
      .co-end-actions, .co-end-actions a { width: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .co-capabilities::after,.co-capability-pulse > i { animation:none !important; }
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
