import { renderPage } from "../lib/shell";

type SolutionPillar = {
  id: string;
  n: string;
  title: string;
  badge: string;
  isComingSoon?: boolean;
  href?: string;
  capabilities: string[];
  tone: string;
  visualType: "ai-pentest" | "appsec" | "threat" | "siem" | "grc" | "tprm";
};

const SOLUTIONS: SolutionPillar[] = [
  {
    id: "ai-penetration-testing",
    n: "01",
    title: "AI Penetration Testing",
    badge: "Autonomous Pentesting",
    href: "/solutions/ai-penetration-testing",
    capabilities: [
      "Autonomous AI Pentesting",
      "Automated Vulnerability Scanning",
      "Exploitation Simulation",
      "Remediation Guidance",
      "Ticketing & Workflow Automation",
    ],
    tone: "emerald",
    visualType: "ai-pentest",
  },
  {
    id: "application-security",
    n: "02",
    title: "Application Security (AppSec Suite)",
    badge: "Full Lifecycle AppSec",
    href: "/solutions/application-security",
    capabilities: [
      "SAST",
      "DAST",
      "Secrets Scanning",
      "Dependency Scanning",
      "CI/CD Pipeline Security",
      "CE+ Pre-Assessment",
    ],
    tone: "cyan",
    visualType: "appsec",
  },
  {
    id: "threat-monitoring",
    n: "03",
    title: "Threat Monitoring and Analysis",
    badge: "Threat Intelligence",
    href: "/solutions/threat-monitoring",
    capabilities: [
      "MITRE ATT&CK Mapping",
      "Threat Intelligence",
      "AI-Assisted Threat Analysis",
      "Dark Web Monitoring",
      "DLP (Data Leak Prevention)",
      "Network Mapping & Attack Path Discovery",
      "Microsoft Defender Integration",
    ],
    tone: "violet",
    visualType: "threat",
  },
  {
    id: "siem-security-operations",
    n: "04",
    title: "SIEM and Security Operations",
    badge: "Security Operations",
    href: "/solutions/siem-security-operations",
    capabilities: [
      "SIEM",
      "Log Collection & Correlation",
      "Alerting & Incident Workflow",
      "AI-Assisted Detection",
      "SOC Automation",
    ],
    tone: "amber",
    visualType: "siem",
  },
  {
    id: "governance-risk-compliance",
    n: "05",
    title: "Governance, Risk & Compliance (GRC)",
    badge: "Coming Soon!",
    isComingSoon: true,
    capabilities: [
      "Multi-framework control mapping, including ISO 27001, GDPR, SOC2 and HIPAA",
      "Automated evidence collection",
      "Policy & risk management",
      "Continuous compliance monitoring",
      "Audit-ready reporting",
    ],
    tone: "rose",
    visualType: "grc",
  },
  {
    id: "tprm",
    n: "06",
    title: "TPRM",
    badge: "Coming Soon!",
    isComingSoon: true,
    capabilities: [
      "Supplier due diligence",
      "Supplier Risk Scoring",
      "Supplier Security Monitoring",
      "SLA & Compliance Tracking",
      "Continuous Vendor Assessment",
    ],
    tone: "blue",
    visualType: "tprm",
  },
];

function renderCardVisual(visualType: SolutionPillar["visualType"]) {
  switch (visualType) {
    case "ai-pentest":
      return `
        <div class="sl-viz sl-viz--ai">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">Autonomous Exploit Agent</span>
            <span class="sl-viz-status sl-viz-status--live">ACTIVE SCAN</span>
          </div>
          <div class="sl-viz-terminal">
            <p class="sl-viz-line sl-viz-dim">&gt; Initializing target scope: api.enterprise.internal</p>
            <p class="sl-viz-line sl-viz-dim">&gt; Probing authentication boundaries &amp; logic flows...</p>
            <p class="sl-viz-line sl-viz-warn">&gt; Potential vector: Auth header state traversal</p>
            <p class="sl-viz-line sl-viz-success">&gt; Sandboxed exploit simulation: Confirmed (Zero Impact)</p>
          </div>
          <div class="sl-viz-footer-row">
            <div class="sl-viz-metric">
              <span class="sl-viz-metric-lbl">Confidence</span>
              <span class="sl-viz-metric-val">100% Confirmed</span>
            </div>
            <div class="sl-viz-metric">
              <span class="sl-viz-metric-lbl">False Positives</span>
              <span class="sl-viz-metric-val sl-viz-success">0 Filtered</span>
            </div>
          </div>
        </div>`;
    case "appsec":
      return `
        <div class="sl-viz sl-viz--appsec">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">CI/CD AppSec Pipeline</span>
            <span class="sl-viz-status sl-viz-status--passed">BUILD GATED</span>
          </div>
          <div class="sl-viz-pipeline">
            <div class="sl-pipe-step">
              <span class="sl-pipe-check">✓</span>
              <div class="sl-pipe-info"><strong>SAST Code Analysis</strong><span>OWASP Top 10 Passed</span></div>
            </div>
            <div class="sl-pipe-step">
              <span class="sl-pipe-check">✓</span>
              <div class="sl-pipe-info"><strong>Secrets Scanner</strong><span>0 Exposed Credentials</span></div>
            </div>
            <div class="sl-pipe-step">
              <span class="sl-pipe-check">✓</span>
              <div class="sl-pipe-info"><strong>UK CE+ Audit Pre-Check</strong><span>NCSC Guidelines Aligned</span></div>
            </div>
          </div>
        </div>`;
    case "threat":
      return `
        <div class="sl-viz sl-viz--threat">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">MITRE ATT&amp;CK &amp; Threat Telemetry</span>
            <span class="sl-viz-status sl-viz-status--sync">MS DEFENDER SYNC</span>
          </div>
          <div class="sl-viz-grid-preview">
            <div class="sl-viz-box">
              <span class="sl-viz-box-num">T1190</span>
              <span class="sl-viz-box-lbl">Initial Access</span>
            </div>
            <div class="sl-viz-box">
              <span class="sl-viz-box-num">T1078</span>
              <span class="sl-viz-box-lbl">Valid Accounts</span>
            </div>
            <div class="sl-viz-box">
              <span class="sl-viz-box-num">T1021</span>
              <span class="sl-viz-box-lbl">Lateral Movement</span>
            </div>
            <div class="sl-viz-box">
              <span class="sl-viz-box-num">T1048</span>
              <span class="sl-viz-box-lbl">Exfiltration</span>
            </div>
          </div>
          <div class="sl-viz-badge-row">
            <span class="sl-intel-badge">Dark Web Monitoring: Active</span>
            <span class="sl-intel-badge">DLP Guard: Enabled</span>
          </div>
        </div>`;
    case "siem":
      return `
        <div class="sl-viz sl-viz--siem">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">SIEM &amp; Telemetry Stream</span>
            <span class="sl-viz-status sl-viz-status--live">1.2M EPS</span>
          </div>
          <div class="sl-viz-stream">
            <div class="sl-stream-row">
              <span class="sl-stream-tag sl-stream-tag--auth">AUTH</span>
              <span class="sl-stream-text">Azure AD &middot; MFA Challenge Verified</span>
              <span class="sl-stream-time">now</span>
            </div>
            <div class="sl-stream-row">
              <span class="sl-stream-tag sl-stream-tag--net">FIREWALL</span>
              <span class="sl-stream-text">Edge Gateway &middot; Ingress Normalized</span>
              <span class="sl-stream-time">1s</span>
            </div>
            <div class="sl-stream-row">
              <span class="sl-stream-tag sl-stream-tag--soar">SOAR</span>
              <span class="sl-stream-text">Playbook: Auto-Containment Ready</span>
              <span class="sl-stream-time">2s</span>
            </div>
          </div>
        </div>`;
    case "grc":
      return `
        <div class="sl-viz sl-viz--grc">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">Multi-Framework Compliance</span>
            <span class="sl-viz-status sl-viz-status--audit">ROADMAP</span>
          </div>
          <div class="sl-viz-bars">
            <div class="sl-bar-row">
              <div class="sl-bar-lbl"><span>ISO 27001:2022</span><strong>Framework Ready</strong></div>
              <div class="sl-bar-track"><div class="sl-bar-fill" style="width: 100%"></div></div>
            </div>
            <div class="sl-bar-row">
              <div class="sl-bar-lbl"><span>UK / EU GDPR</span><strong>Control Mapped</strong></div>
              <div class="sl-bar-track"><div class="sl-bar-fill" style="width: 100%"></div></div>
            </div>
            <div class="sl-bar-row">
              <div class="sl-bar-lbl"><span>SOC 2 Type II</span><strong>Telemetry Ready</strong></div>
              <div class="sl-bar-track"><div class="sl-bar-fill" style="width: 100%"></div></div>
            </div>
          </div>
        </div>`;
    case "tprm":
      return `
        <div class="sl-viz sl-viz--tprm">
          <div class="sl-viz-header">
            <div class="sl-viz-dots"><span></span><span></span><span></span></div>
            <span class="sl-viz-title">Supply Chain Risk Engine</span>
            <span class="sl-viz-status sl-viz-status--score">ROADMAP</span>
          </div>
          <div class="sl-viz-tprm-grid">
            <div class="sl-tprm-stat">
              <span class="sl-tprm-stat-val">360°</span>
              <span class="sl-tprm-stat-lbl">Vendor Due Diligence</span>
            </div>
            <div class="sl-tprm-stat">
              <span class="sl-tprm-stat-val">24/7</span>
              <span class="sl-tprm-stat-lbl">Continuous Monitoring</span>
            </div>
          </div>
          <div class="sl-tprm-sla">
            <span>Automated Supplier Scoring</span>
            <strong class="sl-viz-success">In Development</strong>
          </div>
        </div>`;
  }
}

export async function GET() {
  const body = `
<div class="evd-page sl">
  <section class="evd-hero evd-hero--monolith">
    <div class="evd-hero-inner">
      <p class="sl-kicker">Enterprise Security Solutions</p>
      <h1>Comprehensive Solutions for Governed Cyber Defence</h1>
      <p>From autonomous penetration testing and full-lifecycle AppSec to proactive threat intelligence, SIEM operations, GRC, and Third-Party Risk Management (TPRM), EVADA delivers unified risk validation tailored for UK and global enterprises.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Explore the platform</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Request a demo</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="sl-release" aria-label="Enterprise capability matrix">
    <div class="sl-release-inner">
      <span class="sl-release-label">Enterprise Suite</span>
      <p>AI Pentesting &middot; AppSec (SAST/DAST/CE+) &middot; Threat Intelligence &middot; Next-Gen SIEM &middot; GRC &amp; TPRM</p>
      <a href="/platform#modules">View platform architecture &rarr;</a>
    </div>
  </section>

  <section class="sl-stack-section" aria-label="Solutions Stacking Cards">
    <div class="sl-stack-wrapper">
      <div class="sl-stack-header">
        <p class="sl-section-kicker">Architecture &amp; Capabilities</p>
        <h2>Enterprise Security Solutions</h2>
        <p class="sl-stack-sub">Scroll to explore each governed solution domain built on EVADA's tenant-isolated architecture.</p>
      </div>

      <div class="sl-stack-container">
        ${SOLUTIONS.map(
          (solution, index) => `
        <article id="${solution.id}" class="sl-stack-card sl-stack-card--${solution.tone} ${solution.isComingSoon ? "sl-stack-card--soon" : ""}" style="--stack-index: ${index};">
          <div class="sl-card-left">
            <div class="sl-card-meta">
              <span class="sl-card-num">${solution.n}</span>
              ${
                solution.isComingSoon
                  ? `<span class="sl-card-badge sl-card-badge--highlight-soon">
                      <span class="sl-soon-pulse" aria-hidden="true"></span>
                      ${solution.badge}
                    </span>`
                  : `<span class="sl-card-badge">${solution.badge}</span>`
              }
            </div>
            <h3 class="sl-card-title">${solution.title}</h3>

            <div class="sl-card-body">
              <ul class="sl-capability-list">
                ${solution.capabilities
                  .map(
                    (cap) => `
                <li class="sl-cap-item">
                  <span class="sl-cap-bullet" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="sl-cap-label">${cap}</span>
                </li>`,
                  )
                  .join("")}
              </ul>
            </div>

            <div class="sl-card-footer">
              ${
                solution.href
                  ? `<a href="${solution.href}" class="sl-detail-btn" aria-label="Explore dedicated ${solution.title} page">
                      <span>Explore Dedicated Solution</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>`
                  : `<div class="sl-soon-status-bar">
                      <span class="sl-soon-dot"></span>
                      <span>In Active Development &middot; Coming Soon</span>
                    </div>`
              }
            </div>
          </div>

          <div class="sl-card-right">
            ${renderCardVisual(solution.visualType)}
          </div>
        </article>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section class="sl-starts evd-lightsec" id="practical-starting-points">
    <div class="sl-starts-inner">
      <div class="sl-section-heading sl-anim-header">
        <p class="sl-section-kicker-cyan">PRACTICAL STARTING POINTS</p>
        <h2 class="sl-starts-title">Two ways teams start.</h2>
      </div>
      <div class="sl-starts-grid">
        <article class="sl-start-card sl-anim-card-1">
          <div class="sl-start-visual">
            <img src="/img-adhoc.webp" alt="Start with authorized validation" loading="lazy" />
            <div class="sl-visual-overlay" aria-hidden="true"></div>
          </div>
          <h3>Start with authorized validation</h3>
          <p>Verify ownership, select a compatible Asset and run the released Web App or TLS/SSL scanner under explicit permissions and queue controls.</p>
          <a href="/platform#security-workflow" class="sl-start-pill-btn">
            <span>Review the workflow</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </article>
        <article class="sl-start-card sl-anim-card-2">
          <div class="sl-start-visual">
            <img src="/img-compliance.webp" alt="Build a defensible evidence cycle" loading="lazy" />
            <div class="sl-visual-overlay" aria-hidden="true"></div>
          </div>
          <h3>Build a defensible evidence cycle</h3>
          <p>Turn scan evidence into Findings, retest after remediation and preserve an immutable PDF and JSON report for internal assurance or incident follow-up.</p>
          <a href="/platform#modules" class="sl-start-pill-btn">
            <span>Explore the modules</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </article>
      </div>
      <p class="sl-assurance-note">EVADA records technical evidence and workflow history. It does not certify an organization or replace an independent compliance assessment.</p>
    </div>
  </section>

  <section class="sl-end evd-lightsec">
    <div class="sl-end-inner">
      <div>
        <p>Tailored Consultation</p>
        <h2>Ready to transform your enterprise security posture?</h2>
      </div>
      <div class="sl-end-actions">
        <a href="/book-demo" class="evd-hero-cta"><span class="evd-cta-label">Book an executive demo</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/contact" class="sl-text-link">Speak with our UK team</a>
      </div>
    </div>
  </section>
</div>

<script>
  (function() {
    const startsSec = document.getElementById('practical-starting-points');
    if (!startsSec) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startsSec.classList.add('is-in-view');
        }
      });
    }, { threshold: 0.15 });

    observer.observe(startsSec);
  })();
</script>`;

  const css = `
    .evd-hero { --evd-hero-blend: #071018; }
    .sl { width: 100%; max-width: 100%; background: #071018; color: #e9f2ed; }
    .sl *, .sl *::before, .sl *::after { box-sizing: border-box; }
    .sl-kicker { margin-bottom: 0.9rem !important; color: #31d189 !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl .evd-hero-inner > p:not(.sl-kicker) { max-width: 48rem; }
    .sl section[id], .sl article[id] { scroll-margin-top: 7rem; }

    .sl-release { border-block: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: #e9f2ed; }
    .sl-release-inner { width: min(84rem, 100%); margin: 0 auto; padding: 1.1rem clamp(1.25rem,5vw,4rem); display: flex; align-items: center; justify-content: space-between; gap: 1rem 1.75rem; }
    .sl-release-label { padding: 0.42rem 0.68rem; border: 1px solid rgba(46,205,128,0.35); border-radius: 999px; background: rgba(46,205,128,0.12); color: #2ECE82; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; flex-shrink: 0; }
    .sl-release p { margin: 0; color: rgba(255,255,255,0.78); font-size: 0.92rem; line-height: 1.45; white-space: nowrap; }
    .sl-release a { color: #2ECE82; font-size: 0.9rem; font-weight: 700; text-decoration: none; white-space: nowrap; transition: color 0.2s; flex-shrink: 0; }
    .sl-release a:hover { color: #52e89d; text-decoration: underline; text-underline-offset: 0.2em; }

    .sl-stack-section {
      padding: clamp(4.5rem, 7vw, 7rem) clamp(1.25rem, 5vw, 4rem);
      background: linear-gradient(180deg, #0a402b 0%, #0e563a 40%, #106243 70%, #0a422d 100%);
      position: relative;
    }
    .sl-stack-section::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1000px;
      height: 480px;
      background: radial-gradient(circle at 50% 0%, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 80%);
      pointer-events: none;
    }
    .sl-stack-wrapper { width: min(84rem, 100%); margin: 0 auto; position: relative; z-index: 2; }
    .sl-stack-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 48rem;
      margin: 0 auto clamp(2.5rem, 4.5vw, 4rem);
    }
    .sl-section-kicker {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      font-family: 'Aeonik Mono', ui-monospace, monospace;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin: 0 auto 0.9rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    }
    .sl-stack-header h2 {
      font-family: 'Roobert', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: clamp(2rem, 3.2vw, 2.85rem);
      line-height: 1.18;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: -0.025em;
      margin: 0 0 0.85rem;
      text-wrap: balance;
    }
    .sl-stack-sub {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 1.05rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 auto;
      max-width: 40rem;
      text-wrap: balance;
    }

    /* Sticky Stacking Cards Container */
    .sl-stack-container {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
      position: relative;
      padding-bottom: 8rem;
    }

    .sl-stack-card {
      position: sticky;
      top: calc(5.5rem + calc(var(--stack-index) * 24px));
      z-index: calc(var(--stack-index) + 1);
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: #091a24;
      backdrop-filter: blur(20px);
      box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.4), 0 25px 60px rgba(0, 0, 0, 0.6);
      padding: clamp(1.85rem, 3.5vw, 2.75rem);
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
      gap: clamp(2rem, 4vw, 3.5rem);
      align-items: center;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    }

    .sl-stack-card:hover {
      box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.5), 0 30px 70px rgba(0, 0, 0, 0.8), 0 0 35px -10px rgba(46, 205, 128, 0.2);
    }

    .sl-stack-card--emerald { border-color: rgba(46, 205, 128, 0.28); background: linear-gradient(135deg, #0e1e28 0%, #09151e 100%); }
    .sl-stack-card--cyan { border-color: rgba(56, 189, 248, 0.28); background: linear-gradient(135deg, #0e202e 0%, #091722 100%); }
    .sl-stack-card--violet { border-color: rgba(168, 85, 247, 0.28); background: linear-gradient(135deg, #16182c 0%, #0d101e 100%); }
    .sl-stack-card--amber { border-color: rgba(251, 191, 36, 0.28); background: linear-gradient(135deg, #1e1b12 0%, #11100a 100%); }
    .sl-stack-card--rose { border-color: rgba(244, 63, 94, 0.35); background: linear-gradient(135deg, #221219 0%, #130a0f 100%); }
    .sl-stack-card--blue { border-color: rgba(96, 165, 250, 0.35); background: linear-gradient(135deg, #101c2c 0%, #0a121c 100%); }

    .sl-card-left { display: flex; flex-direction: column; justify-content: space-between; }
    .sl-card-meta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.15rem; }
    .sl-card-num { display: inline-flex; align-items: center; justify-content: center; width: 2.2rem; height: 2.2rem; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.82rem; font-weight: 700; color: #2ECE82; }
    .sl-card-badge { padding: 0.32rem 0.65rem; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
    
    /* Prominently Highlighted Coming Soon Badge */
    .sl-card-badge--highlight-soon {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.42rem 0.95rem;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.35) 100%);
      border: 1.5px solid #f43f5e;
      color: #ffe4e6;
      font-weight: 800;
      font-size: 0.74rem;
      letter-spacing: 0.06em;
      box-shadow: 0 0 18px rgba(244, 63, 94, 0.45), inset 0 0 10px rgba(244, 63, 94, 0.2);
    }
    .sl-soon-pulse {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: #f43f5e;
      box-shadow: 0 0 8px #f43f5e;
      animation: sl-pulse 1.8s infinite;
    }
    @keyframes sl-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.35); opacity: 0.5; }
    }

    .sl-card-title { font-size: clamp(1.4rem, 2vw, 1.85rem); font-weight: 700; color: #ffffff; margin: 0 0 1.35rem; letter-spacing: -0.01em; line-height: 1.25; }

    .sl-card-body { margin-bottom: 1.75rem; }
    .sl-capability-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
    .sl-cap-item { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4; color: rgba(255,255,255,0.9); }
    .sl-cap-bullet { width: 1.2rem; height: 1.2rem; border-radius: 50%; background: rgba(46,205,128,0.15); border: 1px solid rgba(46,205,128,0.4); color: #2ECE82; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.12rem; }
    .sl-cap-bullet svg { width: 0.7rem; height: 0.7rem; }
    .sl-cap-label { font-weight: 500; }

    .sl-stack-card--cyan .sl-cap-bullet { background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.4); color: #38bdf8; }
    .sl-stack-card--violet .sl-cap-bullet { background: rgba(168,85,247,0.15); border-color: rgba(168,85,247,0.4); color: #c084fc; }
    .sl-stack-card--amber .sl-cap-bullet { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.4); color: #fbbf24; }
    .sl-stack-card--rose .sl-cap-bullet { background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.4); color: #fb7185; }
    .sl-stack-card--blue .sl-cap-bullet { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.4); color: #60a5fa; }

    .sl-detail-btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 1rem; width: auto; min-width: 220px; padding: 0.85rem 1.35rem; border-radius: 8px; background: rgba(46,205,128,0.12); border: 1px solid rgba(46,205,128,0.35); color: #2ECE82; font-size: 0.9rem; font-weight: 700; text-decoration: none; transition: all 0.2s ease; }
    .sl-detail-btn:hover { background: #2ECE82; color: #071018; border-color: #2ECE82; }
    .sl-detail-btn svg { transition: transform 0.2s ease; }
    .sl-detail-btn:hover svg { transform: translateX(3px); }

    .sl-soon-status-bar { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1.1rem; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px dashed rgba(244, 63, 94, 0.4); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem; font-weight: 700; color: rgba(255, 255, 255, 0.7); }
    .sl-soon-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; background: #f43f5e; box-shadow: 0 0 6px #f43f5e; }

    /* Visual Panels on the Right */
    .sl-card-right { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    .sl-viz { width: 100%; background: rgba(7, 16, 24, 0.75); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 1.5rem; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08); }
    .sl-viz-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 1rem; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.74rem; }
    .sl-viz-dots { display: flex; gap: 0.35rem; }
    .sl-viz-dots span { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: rgba(255, 255, 255, 0.2); }
    .sl-viz-title { font-weight: 700; color: rgba(255, 255, 255, 0.8); }
    .sl-viz-status { font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .sl-viz-status--live { background: rgba(46, 205, 128, 0.15); color: #2ECE82; border: 1px solid rgba(46, 205, 128, 0.4); }
    .sl-viz-status--passed { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
    .sl-viz-status--sync { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
    .sl-viz-status--audit { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); }
    .sl-viz-status--score { background: rgba(96, 165, 250, 0.15); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.4); }

    .sl-viz-terminal { font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem; display: grid; gap: 0.5rem; margin-bottom: 1.25rem; line-height: 1.45; }
    .sl-viz-dim { color: rgba(255, 255, 255, 0.5); }
    .sl-viz-warn { color: #f59e0b; }
    .sl-viz-success { color: #2ECE82; }

    .sl-viz-footer-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.85rem; font-family: 'Aeonik Mono', ui-monospace, monospace; }
    .sl-viz-metric-lbl { display: block; font-size: 0.68rem; color: rgba(255, 255, 255, 0.45); }
    .sl-viz-metric-val { font-size: 0.85rem; font-weight: 700; color: #ffffff; }

    .sl-viz-pipeline { display: grid; gap: 0.85rem; }
    .sl-pipe-step { display: flex; align-items: center; gap: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 0.75rem 1rem; border-radius: 8px; }
    .sl-pipe-check { display: flex; align-items: center; justify-content: center; width: 1.4rem; height: 1.4rem; border-radius: 50%; background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 800; font-size: 0.75rem; }
    .sl-pipe-info strong { display: block; font-size: 0.85rem; color: #ffffff; }
    .sl-pipe-info span { font-size: 0.76rem; color: rgba(255, 255, 255, 0.55); }

    .sl-viz-grid-preview { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; margin-bottom: 1rem; }
    .sl-viz-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.85rem; border-radius: 8px; text-align: center; }
    .sl-viz-box-num { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.85rem; font-weight: 700; color: #c084fc; }
    .sl-viz-box-lbl { font-size: 0.76rem; color: rgba(255, 255, 255, 0.7); }
    .sl-viz-badge-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .sl-intel-badge { font-size: 0.74rem; font-family: 'Aeonik Mono', ui-monospace, monospace; padding: 0.35rem 0.65rem; border-radius: 6px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.8); }

    .sl-viz-stream { display: grid; gap: 0.65rem; font-family: 'Aeonik Mono', ui-monospace, monospace; }
    .sl-stream-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.76rem; }
    .sl-stream-tag { font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 3px; }
    .sl-stream-tag--auth { background: rgba(46, 205, 128, 0.15); color: #2ECE82; }
    .sl-stream-tag--net { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .sl-stream-tag--soar { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .sl-stream-text { color: rgba(255, 255, 255, 0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sl-stream-time { color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; }

    .sl-viz-bars { display: grid; gap: 0.85rem; }
    .sl-bar-row { display: grid; gap: 0.35rem; font-family: 'Aeonik Mono', ui-monospace, monospace; }
    .sl-bar-lbl { display: flex; justify-content: space-between; font-size: 0.78rem; color: rgba(255, 255, 255, 0.85); }
    .sl-bar-track { height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
    .sl-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #fb7185, #f43f5e); }

    .sl-viz-tprm-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem; margin-bottom: 1rem; }
    .sl-tprm-stat { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.85rem; border-radius: 8px; text-align: center; }
    .sl-tprm-stat-val { display: block; font-size: 1.25rem; font-weight: 800; color: #60a5fa; margin-bottom: 0.2rem; }
    .sl-tprm-stat-lbl { font-size: 0.72rem; color: rgba(255, 255, 255, 0.6); }
    .sl-tprm-sla { display: flex; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.85rem; font-size: 0.8rem; }

    /* Practical Starting Points Section with Smooth Modern Animation */
    .sl-starts { background: #ffffff; color: #14100a; padding: clamp(4.5rem,7vw,7rem) clamp(1.25rem,5vw,4rem); }
    .sl-starts-inner { width: min(84rem, 100%); margin: 0 auto; }
    .sl-section-kicker-cyan { margin: 0 0 0.75rem; color: #087547; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl-starts-title { font-size: clamp(2.2rem, 3.5vw, 3.2rem); font-weight: 700; color: #071018; letter-spacing: -0.025em; line-height: 1.1; margin: 0 0 2.5rem; }

    .sl-starts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(2rem, 4vw, 3.5rem); }
    
    .sl-start-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .sl-start-visual {
      position: relative;
      width: 100%;
      border-radius: 14px;
      overflow: hidden;
      background: #071018;
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 24px rgba(7, 20, 31, 0.08);
      border: 1px solid rgba(7, 20, 31, 0.08);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
    }
    .sl-start-visual img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sl-visual-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at 50% 100%, rgba(46, 205, 128, 0.15), transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .sl-start-card:hover .sl-start-visual {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -10px rgba(7, 20, 31, 0.18), 0 0 25px -5px rgba(46, 205, 128, 0.25);
      border-color: rgba(46, 205, 128, 0.45);
    }
    .sl-start-card:hover .sl-start-visual img {
      transform: scale(1.025);
    }
    .sl-start-card:hover .sl-visual-overlay {
      opacity: 1;
    }

    .sl-start-card h3 {
      font-size: clamp(1.35rem, 1.8vw, 1.65rem);
      font-weight: 700;
      color: #071018;
      margin: 0 0 0.75rem;
      letter-spacing: -0.01em;
      transition: color 0.25s ease;
    }
    .sl-start-card:hover h3 {
      color: #087547;
    }
    .sl-start-card p { font-size: 0.95rem; line-height: 1.6; color: #4f5a55; margin: 0 0 1.5rem; flex-grow: 1; }
    
    .sl-start-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.8rem 1.65rem;
      border-radius: 999px;
      background: #07141f;
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(7, 20, 31, 0.12);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sl-start-pill-btn svg {
      transition: transform 0.25s ease;
    }
    .sl-start-pill-btn:hover {
      background: #087547;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(8, 117, 71, 0.35);
    }
    .sl-start-pill-btn:hover svg {
      transform: translateX(4px);
    }

    /* Scroll In-View Fade Up Animation */
    .sl-anim-header, .sl-anim-card-1, .sl-anim-card-2 {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sl-starts.is-in-view .sl-anim-header {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.05s;
    }
    .sl-starts.is-in-view .sl-anim-card-1 {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.18s;
    }
    .sl-starts.is-in-view .sl-anim-card-2 {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.32s;
    }

    .sl-assurance-note { max-width: 58rem; margin: 3rem 0 0; color: #69716d; font-size: 0.88rem; line-height: 1.55; }

    .sl-end { padding: clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem); background: #ffffff; color: #14100a; }
    .sl-end-inner { width: min(84rem, 100%); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .sl-end h2 { margin: 0; max-width: 36rem; font-size: clamp(1.8rem,2.5vw + 0.9rem,2.8rem); line-height: 1.15; font-weight: 700; color: #071018; letter-spacing: -0.01em; }
    .sl-end-actions { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; justify-content: flex-end; }
    .sl-text-link { color: #071018; font-size: 0.95rem; font-weight: 700; text-underline-offset: 0.25em; text-decoration: underline; }

    .sl a:focus-visible { outline: 3px solid #2ECE82; outline-offset: 4px; }

    @media screen and (max-width: 960px) {
      .sl-stack-card {
        grid-template-columns: 1fr;
        gap: 1.75rem;
        top: calc(4.5rem + calc(var(--stack-index) * 16px));
        border-radius: 20px;
        padding: 1.75rem;
      }
      .sl-starts-grid { grid-template-columns: 1fr; }
      .sl-end-inner { flex-direction: column; align-items: flex-start; }
      .sl-end-actions { justify-content: flex-start; }
    }

    @media screen and (max-width: 640px) {
      .sl-release-inner { grid-template-columns: 1fr; gap: 0.75rem; }
      .sl-stack-card { padding: 1.35rem; }
      .sl-detail-btn { width: 100%; }
      .sl-end-actions { width: 100%; display: grid; }
      .sl-end .evd-hero-cta { width: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .sl-stack-card, .sl-detail-btn, .sl a, .sl-start-visual, .sl-start-visual img, .sl-start-pill-btn { transition: none !important; transform: none !important; }
      .sl-anim-header, .sl-anim-card-1, .sl-anim-card-2 { opacity: 1 !important; transform: none !important; }
      .sl-stack-card { position: relative !important; top: auto !important; }
    }`;

  return renderPage({
    title: "Cybersecurity Solutions & Capabilities | EVADA",
    description:
      "Enterprise cybersecurity solutions across AI Penetration Testing, Application Security (AppSec Suite & CE+), Threat Monitoring, SIEM Operations, GRC, and Third-Party Risk Management (TPRM).",
    css,
    body,
  });
}
