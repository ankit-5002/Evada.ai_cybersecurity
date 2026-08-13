import { renderPage } from "../lib/shell";

type Plan = {
  name: string;
  themeColor: string;
  iconShape: 'circle' | 'triangle' | 'hexagon';
  status: string;
  statusClass: string;
  summary: string;
  price: string;
  note: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    themeColor: "#2a85ff",
    iconShape: "circle",
    status: "Not available",
    statusClass: "is-paused",
    summary: "A future self-service entry point for small, limited security workflows.",
    price: "Planned",
    note: "No signup or checkout is available for this plan today.",
    features: ["Visible product direction", "No active tenant provisioning", "No scanner capacity assigned"],
  },
  {
    name: "Enterprise",
    themeColor: "#2ecd80",
    iconShape: "triangle",
    status: "Available now",
    statusClass: "is-live",
    summary: "A tenant-isolated security workspace configured around your authorized scope and operating needs.",
    price: "Custom",
    note: "Quoted after scope, capacity and deployment review.",
    features: [
      "Verified Asset inventory",
      "Released Web App and TLS/SSL scanners",
      "Normalized Findings and retesting",
      "Immutable PDF and JSON VAPT Reports",
      "Team roles, permissions and audit history",
      "Isolated database, evidence storage and queues",
    ],
    featured: true,
  },
  {
    name: "Pro",
    themeColor: "#00b8ff",
    iconShape: "hexagon",
    status: "Not available",
    statusClass: "is-paused",
    summary: "A future packaged workspace between self-service access and Enterprise governance.",
    price: "Planned",
    note: "Features, limits and pricing are not published yet.",
    features: ["Visible product direction", "No active tenant provisioning", "No scanner capacity assigned"],
  },
];

const QUOTE_FACTORS = [
  ["01", "Authorized scope", "The number and type of verified Assets that enter your security workflow."],
  ["02", "Team access", "Seats, membership roles and custom module permissions for your organization."],
  ["03", "Scan capacity", "Per-member and tenant queue limits, scanner runtime and required concurrency."],
  ["04", "Evidence retention", "How long Findings, raw scanner evidence and issued Reports must remain available."],
  ["05", "Deployment needs", "Tenant isolation, integration, data-location and operational support requirements."],
  ["06", "Service level", "Onboarding, response expectations and the support model agreed for your team."],
];

const CURRENT_CAPABILITIES = [
  "Asset ownership verification",
  "Web App baseline assessments",
  "TLS/SSL configuration assessments",
  "Tenant-scoped scanner queues",
  "Normalized Finding workflow",
  "Immutable PDF and JSON Reports",
  "Owner, Admin, Viewer and Custom access",
  "Activity and audit history",
];

const PLANNED_CAPABILITIES = [
  "API Scanner",
  "Database Scanner",
  "OS / Port Scanner",
  "SharePoint Scanner",
  "Hybrid SOS Scanner",
  "SAST/DAST Scanner",
  "AI Pentester",
  "Network Agent",
];

const FAQS = [
  [
    "Why is there no public monthly price?",
    "Enterprise scope varies by verified Assets, seats, scanner capacity, evidence retention and deployment requirements. EVADA reviews those inputs before issuing a quote instead of presenting a price that may not match the operating model.",
  ],
  [
    "Can I start on Free or Pro?",
    "Not currently. Both plans remain visible as product direction, but they cannot provision a workspace or run scanners. Enterprise is the only active plan today.",
  ],
  [
    "Which scanners are available now?",
    "Web App Scanner and TLS/SSL Scanner are released. The other scanner adapters remain visibly locked until their controlled implementation, security review and release.",
  ],
  [
    "Does generating a report run another scan?",
    "No. A VAPT Report freezes the selected Asset and Finding state, then renders immutable PDF and JSON artifacts from that snapshot.",
  ],
  [
    "Is self-service billing connected?",
    "No. Enterprise access is currently handled through an agreed commercial process and internal provisioning. The public site does not collect payment details.",
  ],
];

export async function GET() {
  const body = `
<div class="evd-page pr">
  <section class="evd-hero evd-hero--cube">
    <div class="evd-hero-inner">
      <p class="pr-kicker">Enterprise access</p>
      <h1>Pricing built around your security scope</h1>
      <p>EVADA is available today as an Enterprise workspace. Your quote reflects verified Assets, team access, scan capacity, evidence retention and deployment needs, without promising unavailable modules or artificial package limits.</p>
      <div class="evd-hero-actions">
        <a href="/book-demo" class="evd-hero-cta"><span class="evd-cta-label">Request Enterprise access</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="#plans" class="evd-hero-secondary">Review availability</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="pr-truth" aria-label="Current pricing status">
    <div class="pr-truth-inner">
      <span>Current offer</span>
      <p>Enterprise is active. Free and Pro are visible but unavailable.</p>
      <a href="#included">See what is included</a>
    </div>
  </section>

  <section id="plans" class="pr-plans evd-lightsec" style="background: #070B14; color: #fff; padding-block: 6rem;">
    <div class="pr-wrap">
      <div class="pr-heading" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin: 0 auto 5rem; max-width: 40rem;">
        <p style="color: #31d189; text-transform: uppercase; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; margin: 0;">Plan availability</p>
        <h2 style="color: #fff; font-size: 2.5rem; margin: 0.5rem 0 1rem; text-align: center;">One active path, clearly defined.</h2>
        <span style="color: rgba(255,255,255,0.5); text-align: center; display: block; margin: 0 auto;">EVADA does not display fabricated monthly prices or enable checkout for plans that are not operational.</span>
      </div>
      <div class="pr-plan-grid">
        ${PLANS.map(
          (plan) => `
        <article class="pr-plan${plan.featured ? " is-featured" : ""}">
          <div class="pr-plan-content">
            <div class="pr-plan-pill">${plan.name}</div>
            
            <div class="pr-plan-price">
              <strong>${plan.price}</strong>
            </div>
            
            <p class="pr-plan-summary">${plan.summary}</p>
            
            <div class="pr-plan-divider"></div>
            
            <ul class="pr-plan-features">
              ${plan.features.map((feature) => `
                <li>
                  <svg class="pr-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${feature}</span>
                </li>
              `).join("")}
            </ul>
            
            <div class="pr-plan-action-wrap">
              ${
                plan.featured
                  ? `<a href="/book-demo" class="pr-plan-btn"><span>Get Started</span></a>
                     <div class="pr-plan-offer">- Enterprise access -</div>`
                  : `<span class="pr-plan-btn is-disabled"><span>Unavailable</span></span>`
              }
            </div>
          </div>
        </article>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section class="pr-factors">
    <div class="pr-wrap pr-factor-layout">
      <div class="pr-factor-intro">
        <p>Quote inputs</p>
        <h2>What shapes an Enterprise agreement.</h2>
        <span>Each input maps to a real control in the tenant or control plane. Commercial scope should match operational scope.</span>
      </div>
      <ol class="pr-factor-list">
        ${QUOTE_FACTORS.map(
          ([number, title, description]) => `
        <li>
          <span>${number}</span>
          <div><h3>${title}</h3><p>${description}</p></div>
        </li>`,
        ).join("")}
      </ol>
    </div>
  </section>

  <section id="included" class="pr-release evd-lightsec">
    <div class="pr-wrap">
      <div class="pr-heading pr-heading-dark">
        <p>Release transparency</p>
        <h2>Buy what exists today, not a roadmap promise.</h2>
        <span>Locked modules remain visible in the application so customers understand the direction, but they are not represented as released Enterprise capabilities.</span>
      </div>
      <div class="pr-release-grid">
        <article class="pr-capabilities is-current">
          <div class="pr-cap-head"><span>Included today</span><strong>${CURRENT_CAPABILITIES.length}</strong></div>
          <ul>${CURRENT_CAPABILITIES.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="pr-capabilities is-planned">
          <div class="pr-cap-head"><span>Planned or locked</span><strong>${PLANNED_CAPABILITIES.length}</strong></div>
          <ul>${PLANNED_CAPABILITIES.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </div>
      <p class="pr-release-note">Availability can change only after implementation, testing and an explicit release. Locked capabilities are not included in the current agreement unless separately documented.</p>
    </div>
  </section>

  <section class="pr-compare">
    <div class="pr-wrap">
      <div class="pr-heading">
        <p>Plan comparison</p>
        <h2>Availability without fine print.</h2>
      </div>
      <div class="pr-table-wrap" tabindex="0" aria-label="Scrollable plan comparison">
        <table>
          <thead><tr><th scope="col">Capability</th><th scope="col">Free</th><th scope="col">Pro</th><th scope="col">Enterprise</th></tr></thead>
          <tbody>
            <tr><th scope="row">Workspace provisioning</th><td>Unavailable</td><td>Unavailable</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Tenant-isolated database and storage</th><td>&mdash;</td><td>&mdash;</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Verified Asset workflow</th><td>&mdash;</td><td>&mdash;</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Web App and TLS/SSL scanners</th><td>&mdash;</td><td>&mdash;</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Findings and immutable Reports</th><td>&mdash;</td><td>&mdash;</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Team roles and activity history</th><td>&mdash;</td><td>&mdash;</td><td class="pr-yes"><svg class="pr-table-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Included</td></tr>
            <tr><th scope="row">Capacity and retention</th><td>Not assigned</td><td>Not assigned</td><td>Configured</td></tr>
            <tr><th scope="row">Commercial model</th><td>Not published</td><td>Not published</td><td>Custom agreement</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="pr-process evd-lightsec">
    <div class="pr-wrap">
      <div class="pr-heading">
        <p>Enterprise onboarding</p>
        <h2>From scope review to an isolated workspace.</h2>
      </div>
      <ol class="pr-process-grid">
        <li><span>01</span><h3>Define scope</h3><p>Review Assets, team size, current security workflow and evidence needs.</p></li>
        <li><span>02</span><h3>Configure controls</h3><p>Agree scanner capacity, permissions, retention and support requirements.</p></li>
        <li><span>03</span><h3>Provision tenant</h3><p>Create the isolated database, storage prefix, queues and organization owner.</p></li>
        <li><span>04</span><h3>Start validation</h3><p>Verify authorized Assets, run released scanners and work Findings through Reports.</p></li>
      </ol>
    </div>
  </section>

  <section class="pr-faq">
    <div class="pr-wrap pr-faq-layout">
      <div class="pr-faq-title"><p>Questions</p><h2>Before you request access.</h2></div>
      <div class="pr-faq-list">
        ${FAQS.map(
          ([question, answer], index) => `
        <details${index === 0 ? " open" : ""}>
          <summary>${question}<span aria-hidden="true">+</span></summary>
          <p>${answer}</p>
        </details>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section class="pr-end evd-lightsec">
    <div class="pr-end-inner">
      <div><p>Enterprise access</p><h2>Define the right operating scope.</h2></div>
      <div class="pr-end-actions">
        <a href="/book-demo" class="evd-hero-cta"><span class="evd-cta-label">Request a demo</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/contact" class="pr-text-link">Contact the team</a>
      </div>
    </div>
  </section>
</div>`;

  const css = `
    .evd-hero { --evd-hero-blend: #f4f7f6; }
    .pr { width: 100%; max-width: 100%; overflow: clip; background: #fff; color: #14100a; }
    .pr *, .pr *::before, .pr *::after { box-sizing: border-box; }
    .pr-wrap { width: min(82rem, 100%); margin: 0 auto; padding-inline: clamp(1.25rem,5vw,4rem); }
    .pr-kicker { margin-bottom: 0.9rem !important; color: #31d189 !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .pr .evd-hero-inner > p:not(.pr-kicker) { max-width: 49rem; }
    .pr section[id] { scroll-margin-top: 7rem; }

    .pr-truth { border-block: 1px solid rgba(20,16,10,0.1); background: #f4f7f6; }
    .pr-truth-inner { width: min(82rem,100%); margin: 0 auto; padding: 1.05rem clamp(1.25rem,5vw,4rem); display: grid; grid-template-columns: auto minmax(0,1fr) auto; gap: 1rem 1.4rem; align-items: center; }
    .pr-truth span, .pr-heading > p, .pr-factor-intro > p, .pr-faq-title > p, .pr-end-inner > div > p { margin: 0; color: #0088aa; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.71rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; }
    .pr-truth span { padding: 0.42rem 0.62rem; border: 1px solid rgba(46,205,128,0.35); border-radius: 999px; background: #eafff4; color: #087547; white-space: nowrap; }
    .pr-truth p { margin: 0; color: #4f5a55; font-size: 0.94rem; line-height: 1.45; }
    .pr-truth a { color: #087547; font-size: 0.9rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
    .pr-truth a:hover { text-decoration: underline; text-underline-offset: 0.2em; }

    .pr-plans, .pr-release, .pr-process { padding-block: clamp(4.2rem,8vw,7.5rem); background: #f4f7f6; }
    .pr-heading { max-width: 51rem; margin-bottom: clamp(2rem,4vw,3.3rem); }
    .pr-heading h2, .pr-factor-intro h2, .pr-faq-title h2, .pr-end h2 { margin: 0.55rem 0 0; font-size: clamp(2rem,3.5vw + 0.6rem,4rem); line-height: 1.02; letter-spacing: 0; font-weight: 600; text-wrap: balance; }
    .pr-heading > span, .pr-factor-intro > span { display: block; max-width: 46rem; margin-top: 1rem; color: #626d68; font-size: clamp(0.98rem,0.3vw + 0.92rem,1.12rem); line-height: 1.62; }

    .pr-plan-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; align-items: stretch; max-width: 68rem; margin: 0 auto; }
    
    .pr-plan { --theme: #556270; position: relative; border-radius: 20px; background: #0B101E; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; text-align: center; margin-top: 3rem; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s, opacity 0.4s, background 0.4s, border-color 0.4s; }
    
    /* ELEVATED STATE (Default featured or actively hovered) */
    .pr-plan-grid:not(:has(.pr-plan:hover)) .pr-plan.is-featured,
    .pr-plan:hover { --theme: #2ecd80; background: #131A2D; border-color: var(--theme); z-index: 2; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    
    /* Hovered card specifically elevates more */
    .pr-plan:hover { transform: translateY(-20px); box-shadow: 0 30px 60px rgba(0,0,0,0.6); z-index: 5; }
    
    /* When ANY card is hovered, push the OTHER cards down and make them grey */
    .pr-plan-grid:has(.pr-plan:hover) .pr-plan:not(:hover) { --theme: #556270; transform: translateY(15px) scale(0.96); opacity: 0.6; z-index: 1; background: #0B101E; border-color: rgba(255, 255, 255, 0.08); box-shadow: none; }
    
    .pr-plan-content { padding: 3rem 2rem 2.5rem; display: flex; flex-direction: column; align-items: center; flex: 1; }
    
    .pr-plan-pill { display: inline-flex; padding: 0.3rem 1rem; border-radius: 999px; border: 1px solid var(--theme); color: var(--theme); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1.5rem; transition: border-color 0.4s, color 0.4s; }
    
    .pr-plan-price { margin-bottom: 0.5rem; }
    .pr-plan-price strong { font-size: 2.5rem; font-weight: 700; color: #fff; line-height: 1; transition: font-size 0.3s, color 0.3s; }
    
    .pr-plan-grid:not(:has(.pr-plan:hover)) .pr-plan.is-featured .pr-plan-price strong,
    .pr-plan:hover .pr-plan-price strong { font-size: 3.2rem; color: var(--theme); }
    
    .pr-plan-summary { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 2rem; min-height: 2.7rem; }
    
    .pr-plan-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 2rem; transition: background 0.3s; }
    
    .pr-plan-grid:not(:has(.pr-plan:hover)) .pr-plan.is-featured .pr-plan-divider,
    .pr-plan:hover .pr-plan-divider { background: rgba(255,255,255,0.1); }
    
    .pr-plan-features { list-style: none; padding: 0; margin: 0 0 2.5rem; width: 100%; text-align: left; display: flex; flex-direction: column; gap: 1.2rem; }
    .pr-plan-features li { display: flex; align-items: flex-start; gap: 0.8rem; color: rgba(255,255,255,0.7); font-size: 0.85rem; line-height: 1.4; }
    
    .pr-check-icon { width: 1.1rem; height: 1.1rem; flex-shrink: 0; color: #fff; background: var(--theme); border-radius: 50%; padding: 0.2rem; margin-top: 0.1rem; transition: background 0.4s; }
    
    .pr-plan-action-wrap { margin-top: auto; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    
    .pr-plan-btn { display: flex; align-items: center; justify-content: center; gap: 0.8rem; width: 100%; padding: 0.9rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s, filter 0.2s; }
    .pr-plan-btn:hover:not(.is-disabled) { background: rgba(255,255,255,0.1); }
    
    .pr-plan-grid:not(:has(.pr-plan:hover)) .pr-plan.is-featured .pr-plan-btn,
    .pr-plan:hover .pr-plan-btn { background: var(--theme); color: #000; border-color: var(--theme); }
    
    .pr-plan-grid:not(:has(.pr-plan:hover)) .pr-plan.is-featured .pr-plan-btn:hover,
    .pr-plan:hover .pr-plan-btn:hover { filter: brightness(1.1); }
    
    .pr-plan-btn.is-disabled { opacity: 0.5; cursor: not-allowed; }
    
    .pr-plan-offer { color: var(--theme); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.4s; }


    .pr-factors { padding-block: clamp(4rem,8vw,7.5rem); background: #fff; }
    .pr-factor-layout { display: grid; grid-template-columns: minmax(15rem,0.78fr) minmax(0,1.35fr); gap: clamp(2.5rem,7vw,7rem); align-items: start; }
    .pr-factor-intro { position: sticky; top: 7.5rem; }
    .pr-factor-intro h2 { max-width: 24rem; }
    .pr-factor-list { margin: 0; padding: 0; border-top: 1px solid #dce2df; list-style: none; }
    .pr-factor-list li { padding: 1.55rem 0; border-bottom: 1px solid #dce2df; display: grid; grid-template-columns: 2.6rem minmax(0,1fr); gap: 1rem; }
    .pr-factor-list > li > span { font-family: 'Aeonik Mono', ui-monospace, monospace; color: #0088aa; font-size: 0.7rem; font-weight: 700; }
    .pr-factor-list h3 { margin: 0; font-size: clamp(1.08rem,0.55vw + 0.96rem,1.35rem); letter-spacing: 0; }
    .pr-factor-list p { margin: 0.45rem 0 0; color: #67716d; font-size: 0.94rem; line-height: 1.55; }

    .pr-release { background: #071813; color: #edf8f2; }
    .pr-heading-dark > p { color: #32d18a; }
    .pr-heading-dark > span { color: #a9bbb3; }
    .pr-release-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border: 1px solid rgba(237,248,242,0.14); border-radius: 8px; overflow: hidden; }
    .pr-capabilities { padding: clamp(1.35rem,3vw,2.4rem); }
    .pr-capabilities + .pr-capabilities { border-left: 1px solid rgba(237,248,242,0.14); }
    .pr-capabilities.is-current { background: rgba(46,205,128,0.08); }
    .pr-capabilities.is-planned { background: rgba(255,255,255,0.025); }
    .pr-cap-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(237,248,242,0.12); }
    .pr-cap-head span { font-size: 1.2rem; font-weight: 700; }
    .pr-cap-head strong { display: grid; width: 2.4rem; height: 2.4rem; place-items: center; border: 1px solid currentColor; border-radius: 50%; color: #32d18a; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.72rem; }
    .pr-capabilities ul { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0; margin: 0; padding: 0; list-style: none; }
    .pr-capabilities li { padding: 1rem 1rem 1rem 1.25rem; border-bottom: 1px solid rgba(237,248,242,0.08); position: relative; color: #c9d7d0; font-size: 0.89rem; line-height: 1.4; }
    .pr-capabilities li:nth-last-child(-n+2) { border-bottom: none; }
    .pr-capabilities li::before { content: ''; position: absolute; left: 0; top: 1.38rem; width: 0.42rem; height: 0.42rem; border-radius: 50%; background: #32d18a; }
    .pr-capabilities.is-planned li::before { background: #71807a; }
    .pr-release-note { max-width: 65rem; margin: 1.4rem 0 0; color: #91a49b; font-size: 0.85rem; line-height: 1.55; }

    .pr-compare { padding-block: clamp(4rem,8vw,7rem); background: #fff; }
    .pr-table-wrap { width: 100%; overflow-x: auto; scrollbar-width: thin; }
    .pr-table-wrap:focus-visible { outline: 3px solid #22d68c; outline-offset: 4px; }
    
    .pr table { width: 100%; min-width: 48rem; border-collapse: collapse; text-align: left; }
    .pr th, .pr td { padding: 1.25rem 1.5rem; font-size: 0.95rem; line-height: 1.4; border-bottom: 1px solid #f0f4f2; }
    
    /* Highlight the Enterprise Column (4th column) */
    .pr th:nth-child(4), .pr td:nth-child(4) { background: rgba(46, 205, 128, 0.05); }
    .pr thead th:nth-child(4) { border-top: 3px solid #2ecd80; border-bottom: 1px solid #e2e7e5; }
    
    .pr thead th { font-size: 1.2rem; font-weight: 700; color: #14100a; border-bottom: 1px solid #e2e7e5; vertical-align: bottom; }
    .pr thead th:first-child { color: #2ecd80; font-family: inherit; font-size: 1.1rem; }
    
    .pr tbody th { width: 32%; font-weight: 500; color: #6a7470; }
    .pr tbody td { color: #35403b; font-weight: 500; }
    
    .pr tbody tr:last-child th, .pr tbody tr:last-child td { border-bottom: none; }
    
    .pr td.pr-yes { color: #14100a; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .pr-table-check { width: 1.1rem; height: 1.1rem; color: #31d189; flex-shrink: 0; }

    .pr-process { background: #eaf3ef; }
    .pr-process-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); margin: 0; padding: 0; border: 1px solid rgba(7,24,19,0.15); border-radius: 8px; overflow: hidden; list-style: none; }
    .pr-process-grid li { min-width: 0; padding: clamp(1.25rem,2.5vw,2rem); background: rgba(255,255,255,0.58); }
    .pr-process-grid li + li { border-left: 1px solid rgba(7,24,19,0.13); }
    .pr-process-grid span { display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border-radius: 50%; background: #071813; color: #32d18a; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; }
    .pr-process-grid h3 { margin: 1.5rem 0 0; font-size: 1.08rem; letter-spacing: 0; }
    .pr-process-grid p { margin: 0.55rem 0 0; color: #61706a; font-size: 0.89rem; line-height: 1.52; }

    .pr-faq { padding-block: clamp(4rem,8vw,7.5rem); background: #fff; }
    .pr-faq-layout { display: grid; grid-template-columns: minmax(14rem,0.72fr) minmax(0,1.35fr); gap: clamp(2.5rem,8vw,8rem); align-items: start; }
    .pr-faq-title { position: sticky; top: 7.5rem; }
    .pr-faq-title h2 { max-width: 24rem; }
    .pr-faq-list { border-top: 1px solid #dce2df; }
    .pr-faq-list details { border-bottom: 1px solid #dce2df; }
    .pr-faq-list summary { min-height: 4.4rem; padding: 1.25rem 0; display: flex; align-items: center; justify-content: space-between; gap: 1.2rem; cursor: pointer; font-size: clamp(1rem,0.45vw + 0.92rem,1.18rem); font-weight: 600; list-style: none; }
    .pr-faq-list summary::-webkit-details-marker { display: none; }
    .pr-faq-list summary span { flex: 0 0 auto; color: #0088aa; font-size: 1.45rem; font-weight: 400; transition: transform 0.2s ease; }
    .pr-faq-list details[open] summary span { transform: rotate(45deg); }
    .pr-faq-list details > p { max-width: 48rem; margin: -0.2rem 0 1.4rem; color: #626d68; font-size: 0.95rem; line-height: 1.65; }

    .pr-end { padding: clamp(3.8rem,7vw,6.5rem) clamp(1.25rem,5vw,4rem); background: #f4f7f6; }
    .pr-end-inner { width: min(82rem,100%); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .pr-end h2 { max-width: 38rem; }
    .pr-end-actions { display: flex; align-items: center; justify-content: flex-end; gap: 1.1rem; flex-wrap: wrap; }
    .pr-text-link { color: #14100a; font-size: 0.95rem; font-weight: 700; text-underline-offset: 0.25em; }

    .pr a:focus-visible, .pr summary:focus-visible { outline: 3px solid #22d68c; outline-offset: 4px; }

    @media screen and (max-width: 1050px) {
      .pr-plan-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
      .pr-plan.is-featured { grid-column: 1 / -1; }
      .pr-process-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
      .pr-process-grid li:nth-child(3) { border-left: none; border-top: 1px solid rgba(7,24,19,0.13); }
      .pr-process-grid li:nth-child(4) { border-top: 1px solid rgba(7,24,19,0.13); }
    }

    @media screen and (max-width: 820px) {
      .pr-truth-inner { grid-template-columns: auto minmax(0,1fr); }
      .pr-truth a { grid-column: 2; }
      .pr-factor-layout, .pr-faq-layout { grid-template-columns: 1fr; gap: 2rem; }
      .pr-factor-intro, .pr-faq-title { position: static; }
      .pr-factor-intro h2, .pr-faq-title h2 { max-width: 34rem; }
      .pr-release-grid { grid-template-columns: 1fr; }
      .pr-capabilities + .pr-capabilities { border-left: none; border-top: 1px solid rgba(237,248,242,0.14); }
      .pr-end-inner { display: grid; grid-template-columns: 1fr; align-items: start; }
      .pr-end-actions { justify-content: flex-start; }
    }

    @media screen and (max-width: 600px) {
      .pr { width: 100vw; max-width: 100vw; }
      .pr .evd-hero { width: 100vw; max-width: 100vw; padding-inline: 1.25rem; }
      .pr .evd-hero-inner { width: calc(100vw - 2.5rem); max-width: calc(100vw - 2.5rem); min-width: 0; margin-inline: 0; }
      .pr .evd-hero-inner > * { max-width: 100%; overflow-wrap: anywhere; }
      .pr-wrap, .pr-truth-inner { width: 100vw; max-width: 100vw; padding-inline: 1.25rem; }
      .pr-truth p, .pr-truth a { max-width: 100%; overflow-wrap: anywhere; white-space: normal; }
      .pr-kicker { font-size: 0.68rem !important; }
      .pr-truth-inner { grid-template-columns: 1fr; align-items: start; gap: 0.65rem; }
      .pr-truth span { justify-self: start; }
      .pr-truth a { grid-column: 1; }
      .pr-plan-grid { grid-template-columns: 1fr; }
      .pr-plan.is-featured { grid-column: auto; }
      .pr-plan-top { align-items: center; }
      .pr-capabilities ul { grid-template-columns: 1fr; }
      .pr-capabilities li:nth-last-child(2) { border-bottom: 1px solid rgba(237,248,242,0.08); }
      .pr-process-grid { grid-template-columns: 1fr; }
      .pr-process-grid li + li, .pr-process-grid li:nth-child(3), .pr-process-grid li:nth-child(4) { border-left: none; border-top: 1px solid rgba(7,24,19,0.13); }
      .pr-end-actions { display: grid; width: 100%; justify-items: start; }
      .pr-end .evd-hero-cta { width: min(100%,20rem); }
    }

    @media (prefers-reduced-motion: reduce) {
      .pr *, .pr *::before, .pr *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
    }`;

  return renderPage({
    title: "Enterprise Pricing | EVADA",
    description:
      "Review EVADA plan availability, current Enterprise capabilities, quote inputs and the controlled onboarding path for a tenant-isolated security workspace.",
    css,
    body,
  });
}
