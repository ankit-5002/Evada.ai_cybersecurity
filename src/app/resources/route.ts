import { renderPage } from "../lib/shell";

type ResourceCategory = "start" | "operate" | "govern";

type ResourceGuide = {
  id: string;
  category: ResourceCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  outcome: string;
  steps: string[];
};

const GUIDES: ResourceGuide[] = [
  {
    id: "authorize-an-asset",
    category: "start",
    categoryLabel: "Getting started",
    title: "Authorize an Asset",
    summary:
      "Create a controlled target and prove ownership before any scanner can reach it.",
    outcome: "A verified Asset that is eligible for compatible scanners.",
    steps: [
      "Add the website, API endpoint or hostname to the current workspace.",
      "Choose DNS TXT or HTTP file verification and publish the exact challenge value.",
      "Verify ownership. EVADA keeps scanning blocked until the proof succeeds.",
    ],
  },
  {
    id: "run-a-web-baseline",
    category: "operate",
    categoryLabel: "Scanner workflow",
    title: "Run a Web App baseline",
    summary:
      "Assess an authorized web application with the released passive OWASP ZAP workflow.",
    outcome: "Stored raw evidence and normalized Findings for the selected Asset.",
    steps: [
      "Select Web App Scanner and a compatible verified Asset.",
      "Submit the baseline job. Queue limits and duplicate protection are applied first.",
      "Track the lifecycle while the isolated worker scans, uploads and normalizes evidence.",
    ],
  },
  {
    id: "review-tls-configuration",
    category: "operate",
    categoryLabel: "Scanner workflow",
    title: "Review TLS and certificate posture",
    summary:
      "Inspect certificate, protocol and cipher configuration without running a web-content test.",
    outcome: "Transport-security evidence and deduplicated TLS Findings.",
    steps: [
      "Select TLS/SSL Scanner and an active hostname or web Asset.",
      "Queue the assessment against the Asset snapshot approved by the workspace.",
      "Review certificate and transport Findings after normalization completes.",
    ],
  },
  {
    id: "triage-findings",
    category: "operate",
    categoryLabel: "Remediation",
    title: "Triage normalized Findings",
    summary:
      "Move from raw scanner output to a deduplicated, tenant-scoped remediation queue.",
    outcome: "Clear ownership, workflow status and evidence for each security issue.",
    steps: [
      "Filter Findings by Asset, severity, scanner and workflow state.",
      "Open a Finding to review affected locations, observations and remediation guidance.",
      "Assign a decision, record the change and retest after remediation.",
    ],
  },
  {
    id: "issue-a-vapt-report",
    category: "govern",
    categoryLabel: "Evidence",
    title: "Issue an immutable VAPT report",
    summary:
      "Freeze the current Asset and Finding state into a controlled evidence package.",
    outcome: "PDF and JSON artifacts backed by an immutable snapshot hash.",
    steps: [
      "Choose the report scope from the current tenant Assets and Findings.",
      "Create the snapshot before the report worker renders any artifact.",
      "Prepare short-lived download links and retain the audit trail for every download.",
    ],
  },
  {
    id: "manage-team-access",
    category: "govern",
    categoryLabel: "Access control",
    title: "Manage Team access",
    summary:
      "Give each member only the modules and actions needed inside one organization.",
    outcome: "An active membership with a defined role, scope and access duration.",
    steps: [
      "Add the member and select Viewer, Admin or a Custom module profile.",
      "The member completes secure account setup without exposing a password to the owner.",
      "EVADA checks membership and permissions before resolving the tenant database.",
    ],
  },
  {
    id: "understand-scan-controls",
    category: "govern",
    categoryLabel: "Operations",
    title: "Understand scan queue controls",
    summary:
      "See how fair admission, member limits and active duplicate locks protect capacity.",
    outcome: "Predictable scanner execution without duplicate work or cross-tenant access.",
    steps: [
      "Each request is checked against member, tenant and platform outstanding limits.",
      "One active scan is allowed for each tenant, Asset and scanner-type combination.",
      "Leases, timeout, cancellation and reconciliation release capacity when work ends.",
    ],
  },
  {
    id: "follow-the-audit-trail",
    category: "govern",
    categoryLabel: "Auditability",
    title: "Follow the workspace audit trail",
    summary:
      "Trace identity, Asset, scan, Finding, report and Team events from one ledger.",
    outcome: "An attributable history of user actions and background operations.",
    steps: [
      "Use Activity Log filters to locate the module, actor, object or event.",
      "Review security access events separately from operational tenant events.",
      "Use event identifiers and timestamps when investigating or exporting evidence.",
    ],
  },
];

function renderGuide(guide: ResourceGuide) {
  const searchable = [
    guide.categoryLabel,
    guide.title,
    guide.summary,
    guide.outcome,
    ...guide.steps,
  ]
    .join(" ")
    .toLowerCase();

  return `
    <details class="rs-guide" id="${guide.id}" data-category="${guide.category}" data-search="${searchable}">
      <summary>
        <span class="rs-guide-meta"><span>${guide.categoryLabel}</span><span class="rs-live">Available now</span></span>
        <span class="rs-guide-title">${guide.title}</span>
        <span class="rs-guide-summary">${guide.summary}</span>
        <span class="rs-guide-open"><span class="rs-guide-open-label">Open guide</span><span class="rs-chevron" aria-hidden="true"></span></span>
      </summary>
      <div class="rs-guide-body">
        <ol>
          ${guide.steps.map((step) => `<li><span>${step}</span></li>`).join("")}
        </ol>
        <p><strong>Outcome</strong><span>${guide.outcome}</span></p>
      </div>
    </details>`;
}

export async function GET() {
  const body = `
<div class="evd-page rs">
  <section class="evd-hero evd-hero--shard-left">
    <div class="evd-hero-inner">
      <span class="rs-hero-label">EVADA resource center</span>
      <h1>Guidance for the work your team actually does.</h1>
      <p>Follow EVADA's real workflow from authorized scope to controlled scans, normalized Findings, immutable reports and attributable access.</p>
      <div class="evd-hero-actions">
        <a href="#resource-library" class="evd-hero-cta"><span class="evd-cta-label">Browse operational guides</span><span class="evd-cta-arrow" aria-hidden="true">&#8595;</span></a>
        <a href="/platform" class="evd-hero-secondary">Explore the platform</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="rs-workflow evd-lightsec" aria-labelledby="workflow-title">
    <div class="rs-section-inner">
      <div class="rs-section-heading">
        <span class="rs-eyebrow">One connected workflow</span>
        <h2 id="workflow-title">Start with scope. Finish with evidence.</h2>
        <p>Each guide maps to a released EVADA capability, so the advice matches the product your team can use today.</p>
      </div>
      <ol class="rs-workflow-grid">
        <li><span>01</span><strong>Authorize</strong><p>Create an Asset and prove control of the target.</p></li>
        <li><span>02</span><strong>Assess</strong><p>Run a compatible Web or TLS scanner in the background.</p></li>
        <li><span>03</span><strong>Triage</strong><p>Review deduplicated Findings and remediation evidence.</p></li>
        <li><span>04</span><strong>Report</strong><p>Issue an immutable PDF and JSON evidence package.</p></li>
      </ol>
    </div>
  </section>

  <section id="resource-library" class="rs-library evd-lightsec" aria-labelledby="library-title">
    <div class="rs-section-inner">
      <div class="rs-library-head">
        <div class="rs-section-heading">
          <span class="rs-eyebrow">Resource library</span>
          <h2 id="library-title">Find the next safe step</h2>
          <p>Search by task or narrow the library to setup, daily operations or governance.</p>
        </div>
        <p class="rs-result-count" aria-live="polite"><strong id="resource-count">${GUIDES.length}</strong> guides shown</p>
      </div>

      <div class="rs-toolbar" role="search">
        <label class="rs-search">
          <span class="sr-only">Search resources</span>
          <span aria-hidden="true">&#8981;</span>
          <input id="resource-search" type="search" autocomplete="off" placeholder="Search Assets, scans, Findings, reports or access" />
        </label>
        <div class="rs-filters" aria-label="Filter resources by category">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="start" aria-pressed="false">Getting started</button>
          <button type="button" data-filter="operate" aria-pressed="false">Operate</button>
          <button type="button" data-filter="govern" aria-pressed="false">Govern</button>
        </div>
      </div>

      <div class="rs-guide-grid">
        ${GUIDES.map(renderGuide).join("")}
      </div>
      <div id="resource-empty" class="rs-empty" hidden>
        <strong>No matching guide</strong>
        <p>Try a broader term or select All.</p>
      </div>
    </div>
  </section>

  <section class="rs-boundary" aria-labelledby="boundary-title">
    <div class="rs-section-inner rs-boundary-grid">
      <div>
        <span class="rs-eyebrow">Evidence boundary</span>
        <h2 id="boundary-title">Operational evidence is not a certification claim.</h2>
      </div>
      <div class="rs-boundary-copy">
        <p>EVADA helps teams collect attributable Assets, scan evidence, Findings, reports and activity records. Those records can support control reviews and audit preparation.</p>
        <p>Certification, legal interpretation and regulatory sign-off remain with your qualified assessor, legal adviser or auditor.</p>
      </div>
    </div>
  </section>

  <section class="rs-end">
    <div class="rs-section-inner rs-end-inner">
      <div>
        <span class="rs-eyebrow">See the workflow live</span>
        <h2>Bring your own security process.</h2>
        <p>We will map EVADA's released workflow to your authorized Assets, team controls and evidence needs.</p>
      </div>
      <a href="/book-demo" class="evd-hero-cta"><span class="evd-cta-label">Request a demo</span><span class="evd-cta-arrow" aria-hidden="true">&#8594;</span></a>
    </div>
  </section>
</div>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    var search = document.getElementById("resource-search");
    var count = document.getElementById("resource-count");
    var empty = document.getElementById("resource-empty");
    var guides = Array.prototype.slice.call(document.querySelectorAll(".rs-guide"));
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var activeFilter = "all";

    function applyFilters() {
      var query = search && search.value ? search.value.trim().toLowerCase() : "";
      var visible = 0;
      guides.forEach(function (guide) {
        var categoryMatch = activeFilter === "all" || guide.getAttribute("data-category") === activeFilter;
        var searchMatch = !query || (guide.getAttribute("data-search") || "").indexOf(query) !== -1;
        var show = categoryMatch && searchMatch;
        guide.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";
        filters.forEach(function (item) {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        applyFilters();
      });
    });

    if (search) search.addEventListener("input", applyFilters);

    guides.forEach(function (guide) {
      guide.addEventListener("toggle", function () {
        if (!guide.open) return;
        guides.forEach(function (other) {
          if (other !== guide) other.open = false;
        });
      });
    });

    if (window.location.hash) {
      var linkedGuide = document.querySelector(window.location.hash);
      if (linkedGuide && linkedGuide.matches("details.rs-guide")) linkedGuide.open = true;
    }
  });
</script>`;

  const css = `
    .rs { background: #fff; color: #11150f; }
    .rs-hero-label, .rs-eyebrow { display: block; color: #22c97f; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: .78rem; font-weight: 700; line-height: 1.4; text-transform: uppercase; letter-spacing: 0; }
    .rs .evd-hero { --evd-hero-blend: #f7f9f8; }
    .rs .evd-hero-inner { max-width: 72rem; }
    .rs .evd-hero h1 { max-width: 17ch; margin-top: 1rem; }
    .rs .evd-hero p { max-width: 45rem; }
    .rs .evd-hero-cta { min-width: 15.5rem; }
    .rs-section-inner { width: min(100% - 3rem, 82rem); margin: 0 auto; }
    .rs-section-heading { max-width: 48rem; }
    .rs-section-heading h2, .rs-boundary h2, .rs-end h2 { margin: .8rem 0 0; max-width: 23ch; font-size: clamp(2rem, 3vw, 3.1rem); font-weight: 600; line-height: 1.06; letter-spacing: 0; }
    .rs-section-heading > p, .rs-end p { margin: 1rem 0 0; max-width: 44rem; color: #657067; font-size: 1.06rem; line-height: 1.65; }

    .rs-workflow { padding: 5.5rem 0 5rem; background: #f7f9f8; }
    .rs-workflow .rs-eyebrow, .rs-library .rs-eyebrow { color: #087f50; }
    .rs-workflow-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 3rem 0 0; padding: 0; list-style: none; border-top: 1px solid #cad2cd; border-bottom: 1px solid #cad2cd; }
    .rs-workflow-grid li { min-width: 0; padding: 1.75rem 1.5rem 1.9rem; border-right: 1px solid #cad2cd; }
    .rs-workflow-grid li:first-child { padding-left: 0; }
    .rs-workflow-grid li:last-child { border-right: 0; }
    .rs-workflow-grid span { display: block; color: #087f50; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: .78rem; font-weight: 700; }
    .rs-workflow-grid strong { display: block; margin-top: 1.15rem; font-size: 1.2rem; }
    .rs-workflow-grid p { margin: .55rem 0 0; color: #66716a; font-size: .96rem; line-height: 1.55; }

    .rs-library { padding: 5.5rem 0 6rem; background: #fff; }
    .rs-library-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; }
    .rs-result-count { flex: 0 0 auto; margin: 0 0 .35rem; color: #66716a; font-size: .9rem; }
    .rs-result-count strong { color: #11150f; font-size: 1.25rem; }
    .rs-toolbar { display: grid; grid-template-columns: minmax(16rem, 1fr) auto; gap: 1rem; align-items: center; margin-top: 2.5rem; padding: .85rem; border: 1px solid #d8dfda; border-radius: 8px; background: #f7f9f8; }
    .rs-search { display: flex; min-width: 0; height: 3.2rem; align-items: center; gap: .75rem; padding: 0 1rem; border: 1px solid #d1d9d4; border-radius: 6px; background: #fff; color: #087f50; }
    .rs-search input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #11150f; font: inherit; }
    .rs-search input::placeholder { color: #7a857d; }
    .rs-filters { display: flex; gap: .35rem; }
    .rs-filters button { min-height: 3.2rem; border: 1px solid transparent; border-radius: 6px; padding: 0 1rem; background: transparent; color: #4f5c54; font: inherit; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .rs-filters button:hover { background: #eef3f0; color: #11150f; }
    .rs-filters button[aria-pressed="true"] { border-color: #0d1d17; background: #0d1d17; color: #fff; }
    .rs-search:focus-within, .rs-filters button:focus-visible, .rs-guide summary:focus-visible { outline: 3px solid rgba(34, 201, 127, .28); outline-offset: 2px; }

    .rs-guide-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
    .rs-guide { min-width: 0; align-self: start; border: 1px solid #d8dfda; border-radius: 8px; background: #fff; overflow: clip; }
    .rs-guide[hidden] { display: none; }
    .rs-guide[open] { border-color: #20b974; box-shadow: 0 20px 45px -36px rgba(5, 24, 16, .8); }
    .rs-guide summary { display: grid; min-height: 15rem; padding: 1.5rem; cursor: pointer; list-style: none; }
    .rs-guide summary::-webkit-details-marker { display: none; }
    .rs-guide-meta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; align-self: start; color: #087f50; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: .72rem; font-weight: 700; text-transform: uppercase; }
    .rs-live { color: #087f50; padding: .35rem .55rem; border: 1px solid #b9e8cf; border-radius: 999px; background: #edfbf4; }
    .rs-guide-title { display: block; align-self: end; margin-top: 2.25rem; font-size: 1.45rem; font-weight: 600; line-height: 1.15; }
    .rs-guide-summary { display: block; margin-top: .7rem; color: #66716a; font-size: .98rem; line-height: 1.55; }
    .rs-guide-open { display: flex; align-items: center; justify-content: space-between; gap: 1rem; align-self: end; margin-top: 1.5rem; color: #11150f; font-size: .88rem; font-weight: 700; }
    .rs-chevron { width: .65rem; height: .65rem; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg); transition: transform .2s ease; }
    .rs-guide[open] .rs-chevron { transform: rotate(225deg); }
    .rs-guide[open] .rs-guide-open-label { font-size: 0; }
    .rs-guide[open] .rs-guide-open-label::after { content: "Close guide"; font-size: .88rem; }
    .rs-guide-body { padding: 0 1.5rem 1.5rem; border-top: 1px solid #e3e8e5; }
    .rs-guide-body ol { margin: 0; padding: 1.35rem 0 0; list-style: none; counter-reset: guide-step; }
    .rs-guide-body li { display: grid; grid-template-columns: 1.75rem 1fr; gap: .65rem; color: #4f5c54; font-size: .93rem; line-height: 1.55; counter-increment: guide-step; }
    .rs-guide-body li + li { margin-top: .85rem; }
    .rs-guide-body li::before { content: counter(guide-step); display: grid; width: 1.55rem; height: 1.55rem; place-items: center; border-radius: 50%; background: #0d1d17; color: #fff; font-size: .72rem; font-weight: 700; }
    .rs-guide-body > p { display: grid; grid-template-columns: auto 1fr; gap: .85rem; margin: 1.35rem 0 0; padding-top: 1.2rem; border-top: 1px solid #e3e8e5; color: #4f5c54; font-size: .92rem; line-height: 1.5; }
    .rs-guide-body > p strong { color: #087f50; }
    .rs-empty { margin-top: 1rem; padding: 3rem 1.5rem; border: 1px dashed #bdc8c1; border-radius: 8px; text-align: center; }
    .rs-empty strong { font-size: 1.2rem; }
    .rs-empty p { margin: .45rem 0 0; color: #66716a; }

    .rs-boundary { padding: 5rem 0; background: #0b1713; color: #edf5f0; }
    .rs-boundary-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(2rem, 7vw, 7rem); align-items: start; }
    .rs-boundary h2 { max-width: 18ch; }
    .rs-boundary-copy { padding-left: 2rem; border-left: 1px solid rgba(237, 245, 240, .2); }
    .rs-boundary-copy p { margin: 0; color: rgba(237, 245, 240, .68); font-size: 1.04rem; line-height: 1.68; }
    .rs-boundary-copy p + p { margin-top: 1.2rem; }

    .rs-end { padding: 4.5rem 0; background: #e9f7ef; }
    .rs-end .rs-eyebrow { color: #087f50; }
    .rs-end-inner { display: flex; align-items: flex-end; justify-content: space-between; gap: 3rem; }
    .rs-end h2 { color: #11150f; }
    .rs-end .evd-hero-cta { flex: 0 0 auto; min-width: 13rem; }

    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

    @media (max-width: 980px) {
      .rs-workflow-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .rs-workflow-grid li:nth-child(2) { border-right: 0; }
      .rs-workflow-grid li:nth-child(-n+2) { border-bottom: 1px solid #cad2cd; }
      .rs-workflow-grid li:nth-child(3) { padding-left: 0; }
      .rs-toolbar { grid-template-columns: 1fr; }
      .rs-filters { overflow-x: auto; padding-bottom: .15rem; scrollbar-width: thin; }
    }

    @media (max-width: 720px) {
      .rs { width: 100vw; max-width: 100vw; overflow-x: clip; }
      .rs .evd-hero { width: 100vw; max-width: 100vw; padding-inline: 1.25rem; }
      .rs .evd-hero-inner { width: calc(100vw - 2.5rem); max-width: calc(100vw - 2.5rem); min-width: 0; margin-inline: 0; }
      .rs .evd-hero-inner > *, .rs-section-heading, .rs-section-heading > *, .rs-boundary-grid > *, .rs-end-inner > * { min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
      .rs .evd-hero p, .rs-section-heading, .rs-section-heading > p {
        display: block !important;
        width: 100% !important;
        inline-size: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        max-inline-size: 100% !important;
        flex: 0 1 auto !important;
        white-space: normal !important;
        text-wrap: wrap !important;
        overflow: visible !important;
        overflow-wrap: anywhere !important;
        word-break: normal !important;
      }
      .rs .evd-hero p { width: 100% !important; inline-size: auto !important; max-width: 34ch !important; max-inline-size: 34ch !important; }
      .rs-section-heading { width: 100% !important; inline-size: auto !important; max-width: 100% !important; max-inline-size: 100% !important; }
      .rs-section-heading > p { width: 100% !important; inline-size: auto !important; max-width: 31ch !important; max-inline-size: 31ch !important; }
      .rs-section-inner { box-sizing: border-box; width: 100vw; max-width: 100vw; padding-inline: 1rem; }
      .rs-workflow, .rs-library { padding-top: 4rem; padding-bottom: 4rem; }
      .rs-library-head, .rs-end-inner { align-items: flex-start; flex-direction: column; }
      .rs-guide-grid { grid-template-columns: 1fr; }
      .rs-guide summary { min-height: 0; }
      .rs-boundary-grid { grid-template-columns: 1fr; gap: 2rem; }
      .rs-boundary-copy { padding: 1.5rem 0 0; border-left: 0; border-top: 1px solid rgba(237, 245, 240, .2); }
      .rs-end .evd-hero-cta { width: min(100%, 20rem); }
    }

    @media (max-width: 520px) {
      .rs-workflow-grid { grid-template-columns: 1fr; }
      .rs-workflow-grid li { padding: 1.35rem 0; border-right: 0; border-bottom: 1px solid #cad2cd; }
      .rs-workflow-grid li:nth-child(-n+2) { border-bottom: 1px solid #cad2cd; }
      .rs-workflow-grid li:last-child { border-bottom: 0; }
      .rs-toolbar { padding: .65rem; }
      .rs-filters button { padding: 0 .85rem; }
      .rs-guide-meta { align-items: flex-start; }
      .rs-guide-body > p { grid-template-columns: 1fr; gap: .35rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .rs-guide *, .rs-filters * { scroll-behavior: auto !important; transition: none !important; }
    }
  `;

  return renderPage({
    title: "Security Resources | EVADA",
    description:
      "Practical EVADA guides for Asset authorization, Web and TLS scanning, Findings, VAPT reports, Team access and auditable scanner operations.",
    css,
    body,
  });
}
