import { renderPage } from "../../lib/shell";

export async function GET() {
  const body = `
<div class="evd-page sl-detail">
  <section class="evd-hero evd-hero--dual">
    <div class="evd-hero-inner">
      <div class="sl-breadcrumb">
        <a href="/solutions">&larr; All Solutions</a>
        <span aria-hidden="true">/</span>
        <span>Pillar 01</span>
      </div>
      <p class="sl-kicker">Autonomous Cyber Validation</p>
      <h1>AI Penetration Testing</h1>
      <p>Continuous, autonomous security assessments that discover attack chains, simulate real-world adversarial tactics, and validate exploitability safely under strict authorization controls.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Start autonomous validation</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Request technical demo</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="sl-detail-overview" aria-label="Solution Overview">
    <div class="sl-detail-container">
      <div class="sl-metric-row">
        <div class="sl-metric-card">
          <span class="sl-metric-val">100%</span>
          <span class="sl-metric-lbl">Verified Scope Enforcement</span>
          <p>Every target requires cryptographic DNS TXT or HTTP challenge before testing.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">0</span>
          <span class="sl-metric-lbl">Production Disruption</span>
          <p>Sandboxed payloads with non-destructive proof-of-concept exploit verification.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">24/7</span>
          <span class="sl-metric-lbl">Continuous Probing</span>
          <p>Instant detection and retesting whenever applications or APIs are updated.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">Automated</span>
          <span class="sl-metric-lbl">Jira &amp; ServiceNow Sync</span>
          <p>Validated findings automatically route into developer and ticketing queues.</p>
        </div>
      </div>

      <div class="sl-feature-section">
        <div class="sl-section-heading">
          <p class="sl-section-kicker">Core Technical Capabilities</p>
          <h2>Governed, end-to-end penetration testing architecture</h2>
          <p class="sl-section-desc">EVADA combines state-of-the-art LLM reasoning with deterministic scanning engines to perform in-depth adversarial assessments without human bottlenecking.</p>
        </div>

        <div class="sl-features-grid">
          <article class="sl-feature-box">
            <div class="sl-feature-icon">01</div>
            <h3>Autonomous AI Pentesting</h3>
            <p>Adaptive agents orchestrate dynamic, multi-stage reconnaissance and execution. The AI agent analyzes target responses, evaluates attack surfaces, and pivots methodically through discovered authorization flaws, injection points, and logic bugs.</p>
            <ul class="sl-feature-bullets">
              <li>Dynamic reconnaissance and perimeter fingerprinting</li>
              <li>Multi-step logic flaw and authentication bypass discovery</li>
              <li>Real-time reasoning engine with human override controls</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">02</div>
            <h3>Automated Vulnerability Scanning</h3>
            <p>High-throughput automated scanning engines continuously probe web applications, API endpoints, microservices, and network ports for known CVEs, outdated packages, TLS misconfigurations, and improper access controls.</p>
            <ul class="sl-feature-bullets">
              <li>OWASP Top 10 and API Security Top 10 coverage</li>
              <li>Automated crawling with authenticated session preservation</li>
              <li>Granular rate-limiting and target load throttling</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">03</div>
            <h3>Exploitation Simulation</h3>
            <p>Unlike conventional scanners that flag theoretical risks, EVADA safely simulates exploitation in isolated sandboxes to confirm actual reachability and impact. If a vulnerability cannot be exploited, it is de-prioritized.</p>
            <ul class="sl-feature-bullets">
              <li>Definitive proof-of-exploit verification</li>
              <li>Zero false-positive noise for engineering teams</li>
              <li>Safe payload constraints with execution guardrails</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">04</div>
            <h3>Remediation Guidance</h3>
            <p>Every validated finding includes detailed, code-level remediation instructions tailored to the developer's framework. Teams receive line-by-line code recommendations, config patches, and verification reproduction scripts.</p>
            <ul class="sl-feature-bullets">
              <li>Context-aware code snippets and framework patches</li>
              <li>Direct links to CWE and CVE knowledge bases</li>
              <li>Step-by-step reproduction cURL and HTTP payloads</li>
            </ul>
          </article>

          <article class="sl-feature-box sl-feature-box--wide">
            <div class="sl-feature-icon">05</div>
            <h3>Ticketing &amp; Workflow Automation</h3>
            <p>Seamlessly bridge the gap between security discovery and engineering resolution. EVADA integrates directly into enterprise ITSM workflows to create, update, and close tickets automatically when retests verify resolution.</p>
            <ul class="sl-feature-bullets">
              <li>Bidirectional Jira, GitHub Issues, and ServiceNow integration</li>
              <li>Automated status updates on one-click re-testing</li>
              <li>Customizable SLA tracking and escalation notifications</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-flow-section evd-lightsec">
    <div class="sl-detail-container">
      <div class="sl-section-heading">
        <p class="sl-section-kicker">Operational Workflow</p>
        <h2>How EVADA executes safe penetration testing</h2>
      </div>

      <div class="sl-steps-grid">
        <div class="sl-step-item">
          <span class="sl-step-badge">Step 1</span>
          <h4>Scope &amp; Ownership Verification</h4>
          <p>Prove domain control via DNS TXT or HTTP token challenge before any scanning is permitted.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Step 2</span>
          <h4>Autonomous Recon &amp; Discovery</h4>
          <p>AI agents map endpoints, parameter structures, APIs, and exposed surfaces safely.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Step 3</span>
          <h4>Exploit Simulation &amp; Triage</h4>
          <p>Simulate exploitability in a sandbox to eliminate false positives and score real business risk.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Step 4</span>
          <h4>Remediation &amp; One-Click Retest</h4>
          <p>Developers apply code fixes and trigger automated retests to verify resolution immediately.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-end evd-lightsec">
    <div class="sl-end-inner">
      <div>
        <p>UK &amp; Global Enterprise Security</p>
        <h2>Ready to run your first autonomous AI pentest?</h2>
      </div>
      <div class="sl-end-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Get started today</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/solutions" class="sl-text-link">Explore other solutions &rarr;</a>
      </div>
    </div>
  </section>
</div>`;

  const css = `
    .evd-hero { --evd-hero-blend: #071018; }
    .sl-detail { width: 100%; max-width: 100%; overflow: clip; background: #071018; color: #e9f2ed; }
    .sl-detail *, .sl-detail *::before, .sl-detail *::after { box-sizing: border-box; }
    
    .sl-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 1.25rem; }
    .sl-breadcrumb a { color: #2ECE82; text-decoration: none; transition: color 0.2s; }
    .sl-breadcrumb a:hover { color: #52e89d; text-decoration: underline; }

    .sl-kicker { margin-bottom: 0.9rem !important; color: #31d189 !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl-detail .evd-hero-inner > p:not(.sl-kicker) { max-width: 48rem; }

    .sl-detail-overview { padding: clamp(4rem, 6vw, 6.5rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-detail-container { width: min(84rem, 100%); margin: 0 auto; }

    .sl-metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: clamp(3.5rem, 5vw, 5rem); }
    .sl-metric-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.75rem 1.5rem; text-align: left; }
    .sl-metric-val { display: block; font-size: clamp(2rem, 2.5vw, 2.75rem); font-weight: 800; color: #2ECE82; line-height: 1; margin-bottom: 0.5rem; }
    .sl-metric-lbl { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.04em; margin-bottom: 0.6rem; }
    .sl-metric-card p { margin: 0; font-size: 0.84rem; line-height: 1.45; color: rgba(255,255,255,0.65); }

    .sl-section-heading { margin-bottom: clamp(2.5rem, 4vw, 3.5rem); text-align: left; max-width: 50rem; }
    .sl-section-kicker { color: #2ECE82; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .sl-section-heading h2 { font-size: clamp(1.8rem, 2.8vw, 2.6rem); line-height: 1.15; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin: 0 0 1rem; }
    .sl-section-desc { font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0; }

    .sl-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
    .sl-feature-box { background: rgba(14,26,36,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: clamp(1.75rem, 3vw, 2.5rem); }
    .sl-feature-box--wide { grid-column: span 2; }
    .sl-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.2rem; height: 2.2rem; border-radius: 8px; background: rgba(46,205,128,0.12); border: 1px solid rgba(46,205,128,0.3); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.8rem; font-weight: 700; color: #2ECE82; margin-bottom: 1.25rem; }
    .sl-feature-box h3 { font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0 0 0.85rem; }
    .sl-feature-box p { font-size: 0.94rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0 0 1.25rem; }
    .sl-feature-bullets { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
    .sl-feature-bullets li { position: relative; padding-left: 1.25rem; font-size: 0.86rem; color: rgba(255,255,255,0.85); line-height: 1.45; }
    .sl-feature-bullets li::before { content: "→"; position: absolute; left: 0; color: #2ECE82; font-weight: bold; }

    .sl-flow-section { background: #f4f6f9; color: #14100a; padding: clamp(4rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-flow-section .sl-section-heading h2 { color: #071018; }
    .sl-flow-section .sl-section-kicker { color: #087547; }
    
    .sl-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .sl-step-item { background: #ffffff; border: 1px solid rgba(20,16,10,0.1); border-radius: 12px; padding: 1.75rem 1.5rem; }
    .sl-step-badge { display: inline-block; padding: 0.28rem 0.55rem; border-radius: 6px; background: #eafff4; border: 1px solid rgba(46,205,128,0.4); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; color: #087547; text-transform: uppercase; margin-bottom: 1rem; }
    .sl-step-item h4 { font-size: 1.05rem; font-weight: 700; color: #071018; margin: 0 0 0.6rem; }
    .sl-step-item p { font-size: 0.86rem; line-height: 1.5; color: #4f5a55; margin: 0; }

    .sl-end { padding: clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem); background: #ffffff; color: #14100a; }
    .sl-end-inner { width: min(84rem, 100%); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .sl-end h2 { margin: 0; max-width: 36rem; font-size: clamp(1.8rem,2.5vw + 0.9rem,2.8rem); line-height: 1.15; font-weight: 700; color: #071018; letter-spacing: -0.01em; }
    .sl-end-actions { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; justify-content: flex-end; }
    .sl-text-link { color: #071018; font-size: 0.95rem; font-weight: 700; text-decoration: underline; text-underline-offset: 0.25em; }

    @media screen and (max-width: 1024px) {
      .sl-metric-row { grid-template-columns: repeat(2, 1fr); }
      .sl-features-grid { grid-template-columns: 1fr; }
      .sl-feature-box--wide { grid-column: span 1; }
      .sl-steps-grid { grid-template-columns: repeat(2, 1fr); }
      .sl-end-inner { flex-direction: column; align-items: flex-start; }
    }

    @media screen and (max-width: 640px) {
      .sl-metric-row { grid-template-columns: 1fr; }
      .sl-steps-grid { grid-template-columns: 1fr; }
      .sl-end-actions { width: 100%; display: grid; }
      .sl-end .evd-hero-cta { width: 100%; }
    }
  `;

  return renderPage({
    title: "AI Penetration Testing Solution | EVADA",
    description:
      "Autonomous AI penetration testing, automated vulnerability scanning, proof-of-exploit simulation, and ticketing workflow automation.",
    css,
    body,
  });
}
