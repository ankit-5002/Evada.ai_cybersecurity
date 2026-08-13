import { renderPage } from "../../lib/shell";

export async function GET() {
  const body = `
<div class="evd-page sl-detail">
  <section class="evd-hero evd-hero--shard-left">
    <div class="evd-hero-inner">
      <div class="sl-breadcrumb">
        <a href="/solutions">&larr; All Solutions</a>
        <span aria-hidden="true">/</span>
        <span>Pillar 04</span>
      </div>
      <p class="sl-kicker">Enterprise Telemetry &amp; Autonomous SOC</p>
      <h1>SIEM and Security Operations</h1>
      <p>Unify enterprise logs, correlate multi-cloud telemetry, detect stealthy behavioral anomalies, and accelerate incident response through automated SOC playbooks.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Explore SIEM operations</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Schedule SOC briefing</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="sl-detail-overview" aria-label="Solution Overview">
    <div class="sl-detail-container">
      <div class="sl-metric-row">
        <div class="sl-metric-card">
          <span class="sl-metric-val">&lt; 1 sec</span>
          <span class="sl-metric-lbl">Log Query &amp; Ingestion</span>
          <p>Ultra-fast distributed search across terabytes of enterprise event telemetry.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">90%</span>
          <span class="sl-metric-lbl">Alert Noise Reduction</span>
          <p>Intelligent correlation and deduplication filter out repetitive benign alerts.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">SOAR</span>
          <span class="sl-metric-lbl">Automated Playbooks</span>
          <p>Instant containment, token revocation, and firewall updates in seconds.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">AI Baseline</span>
          <span class="sl-metric-lbl">Behavioral Anomaly Detection</span>
          <p>Continuous machine learning uncovers compromised identities and insider risks.</p>
        </div>
      </div>

      <div class="sl-feature-section">
        <div class="sl-section-heading">
          <p class="sl-section-kicker">Security Operations Architecture</p>
          <h2>Centralized telemetry and autonomous incident resolution</h2>
          <p class="sl-section-desc">Empower your SOC analysts with high-fidelity context, cross-system event correlation, and automated incident triage workflows that drastically reduce MTTD and MTTR.</p>
        </div>

        <div class="sl-features-grid">
          <article class="sl-feature-box">
            <div class="sl-feature-icon">01</div>
            <h3>SIEM (Security Information &amp; Event Management)</h3>
            <p>Cloud-native, multi-tenant SIEM providing centralized aggregation, hot storage, and lightning-fast search across hybrid corporate environments. Index and visualize audit logs, authentication records, and network flows in real time.</p>
            <ul class="sl-feature-bullets">
              <li>High-throughput ingestion supporting standard Syslog, JSON, and APIs</li>
              <li>Elastic retention policies with tamper-proof immutable log storage</li>
              <li>Pre-built compliance dashboards for ISO 27001, SOC 2, and Cyber Essentials</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">02</div>
            <h3>Log Collection &amp; Correlation</h3>
            <p>Automatically parse and normalize unstructured logs from AWS, Azure, GCP, Kubernetes, Cisco, Fortinet, Active Directory, and Okta into a standardized event schema for multi-vector correlation.</p>
            <ul class="sl-feature-bullets">
              <li>Cross-platform correlation linking identity, endpoint, and network data</li>
              <li>Automatic schema normalization (OCSF and ECS compliant)</li>
              <li>Distributed query engine with live streaming event inspection</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">03</div>
            <h3>Alerting &amp; Incident Workflow</h3>
            <p>Transform raw security signals into prioritized incident cases. Custom alert rules, dynamic severity scoring, and alert grouping prevent alert fatigue and ensure tier-1 analysts focus on genuine threats.</p>
            <ul class="sl-feature-bullets">
              <li>Dynamic risk-weighted incident escalation paths</li>
              <li>Automated alert deduplication and suppression rules</li>
              <li>Full case management with evidence timeline reconstruction</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">04</div>
            <h3>AI-Assisted Detection</h3>
            <p>Machine learning models baseline standard user, device, and service behaviors across your enterprise to spot subtle anomalies such as impossible travel logins, credential dumping, and lateral privilege escalation.</p>
            <ul class="sl-feature-bullets">
              <li>User and Entity Behavior Analytics (UEBA)</li>
              <li>Automated triage suggestions and context summaries for analysts</li>
              <li>Zero-day behavioral detection without static signature dependencies</li>
            </ul>
          </article>

          <article class="sl-feature-box sl-feature-box--wide">
            <div class="sl-feature-icon">05</div>
            <h3>SOC Automation (SOAR)</h3>
            <p>Automate response actions with custom security playbooks. When high-confidence threats are validated, EVADA can immediately isolate infected endpoints, disable compromised accounts, block malicious IPs, and alert on-call teams.</p>
            <ul class="sl-feature-bullets">
              <li>No-code &amp; Python-extensible automated response playbooks</li>
              <li>Instant one-click host isolation and firewall rule deployment</li>
              <li>Direct integration with Slack, Microsoft Teams, PagerDuty, and Webhooks</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-flow-section evd-lightsec">
    <div class="sl-detail-container">
      <div class="sl-section-heading">
        <p class="sl-section-kicker">SOC Operational Workflow</p>
        <h2>From high-volume log ingestion to automated resolution</h2>
      </div>

      <div class="sl-steps-grid">
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 1</span>
          <h4>Distributed Log Collection</h4>
          <p>Telemetry from firewalls, clouds, endpoints, and identity providers streams into EVADA.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 2</span>
          <h4>AI Correlation &amp; Analytics</h4>
          <p>Events are normalized, correlated, and evaluated against behavioral baselines.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 3</span>
          <h4>High-Priority Incident Triage</h4>
          <p>Incidents are created with complete forensic timelines and prioritized by severity.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 4</span>
          <h4>SOAR Playbook Execution</h4>
          <p>Automated or human-approved playbooks isolate threats and enforce remediation.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-end evd-lightsec">
    <div class="sl-end-inner">
      <div>
        <p>Next-Gen Security Operations</p>
        <h2>Ready to modernize your SOC with AI &amp; SIEM?</h2>
      </div>
      <div class="sl-end-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Get started with SIEM</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
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
    .sl-breadcrumb a { color: #fbbf24; text-decoration: none; transition: color 0.2s; }
    .sl-breadcrumb a:hover { color: #fde68a; text-decoration: underline; }

    .sl-kicker { margin-bottom: 0.9rem !important; color: #fbbf24 !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl-detail .evd-hero-inner > p:not(.sl-kicker) { max-width: 48rem; }

    .sl-detail-overview { padding: clamp(4rem, 6vw, 6.5rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-detail-container { width: min(84rem, 100%); margin: 0 auto; }

    .sl-metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: clamp(3.5rem, 5vw, 5rem); }
    .sl-metric-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.75rem 1.5rem; text-align: left; }
    .sl-metric-val { display: block; font-size: clamp(1.8rem, 2.3vw, 2.5rem); font-weight: 800; color: #fbbf24; line-height: 1; margin-bottom: 0.5rem; }
    .sl-metric-lbl { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.04em; margin-bottom: 0.6rem; }
    .sl-metric-card p { margin: 0; font-size: 0.84rem; line-height: 1.45; color: rgba(255,255,255,0.65); }

    .sl-section-heading { margin-bottom: clamp(2.5rem, 4vw, 3.5rem); text-align: left; max-width: 50rem; }
    .sl-section-kicker { color: #fbbf24; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .sl-section-heading h2 { font-size: clamp(1.8rem, 2.8vw, 2.6rem); line-height: 1.15; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin: 0 0 1rem; }
    .sl-section-desc { font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0; }

    .sl-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
    .sl-feature-box { background: rgba(14,26,36,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: clamp(1.75rem, 3vw, 2.5rem); }
    .sl-feature-box--wide { grid-column: span 2; }
    .sl-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.2rem; height: 2.2rem; border-radius: 8px; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.8rem; font-weight: 700; color: #fbbf24; margin-bottom: 1.25rem; }
    .sl-feature-box h3 { font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0 0 0.85rem; }
    .sl-feature-box p { font-size: 0.94rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0 0 1.25rem; }
    .sl-feature-bullets { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
    .sl-feature-bullets li { position: relative; padding-left: 1.25rem; font-size: 0.86rem; color: rgba(255,255,255,0.85); line-height: 1.45; }
    .sl-feature-bullets li::before { content: "→"; position: absolute; left: 0; color: #fbbf24; font-weight: bold; }

    .sl-flow-section { background: #f4f6f9; color: #14100a; padding: clamp(4rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-flow-section .sl-section-heading h2 { color: #071018; }
    .sl-flow-section .sl-section-kicker { color: #b45309; }
    
    .sl-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .sl-step-item { background: #ffffff; border: 1px solid rgba(20,16,10,0.1); border-radius: 12px; padding: 1.75rem 1.5rem; }
    .sl-step-badge { display: inline-block; padding: 0.28rem 0.55rem; border-radius: 6px; background: #fef3c7; border: 1px solid rgba(251,191,36,0.4); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; color: #b45309; text-transform: uppercase; margin-bottom: 1rem; }
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
    title: "SIEM and Security Operations | EVADA",
    description:
      "Cloud-native SIEM, distributed log collection and correlation, intelligent alerting, behavioral AI anomaly detection, and automated SOC response playbooks.",
    css,
    body,
  });
}
