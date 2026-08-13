import { renderPage } from "../../lib/shell";

export async function GET() {
  const body = `
<div class="evd-page sl-detail">
  <section class="evd-hero evd-hero--shard">
    <div class="evd-hero-inner">
      <div class="sl-breadcrumb">
        <a href="/solutions">&larr; All Solutions</a>
        <span aria-hidden="true">/</span>
        <span>Pillar 03</span>
      </div>
      <p class="sl-kicker">Proactive Threat Intelligence</p>
      <h1>Threat Monitoring and Analysis</h1>
      <p>Gain continuous visibility into active threat actors, leaked corporate credentials, exfiltration risks, and adversary attack paths aligned with the MITRE ATT&CK enterprise framework.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Explore threat intelligence</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Request threat briefing</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="sl-detail-overview" aria-label="Solution Overview">
    <div class="sl-detail-container">
      <div class="sl-metric-row">
        <div class="sl-metric-card">
          <span class="sl-metric-val">MITRE</span>
          <span class="sl-metric-lbl">ATT&amp;CK TTP Mapping</span>
          <p>Every security event and vulnerability is indexed against standardized adversary tactics.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">24/7</span>
          <span class="sl-metric-lbl">Dark Web Surveillance</span>
          <p>Continuous monitoring of underground forums, marketplaces, and paste repositories.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">Graph</span>
          <span class="sl-metric-lbl">Attack Path Discovery</span>
          <p>Dynamic topological mapping visualizing chained perimeter-to-core attack trajectories.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">Native</span>
          <span class="sl-metric-lbl">Microsoft Defender Sync</span>
          <p>Bidirectional telemetry integration for automated endpoint and cloud threat response.</p>
        </div>
      </div>

      <div class="sl-feature-section">
        <div class="sl-section-heading">
          <p class="sl-section-kicker">Threat Intelligence &amp; Analysis Architecture</p>
          <h2>Proactive defence across external and internal vectors</h2>
          <p class="sl-section-desc">Move beyond reactive alerting. EVADA correlates global threat intelligence feeds with your live network topology to stop breaches before adversaries establish persistence.</p>
        </div>

        <div class="sl-features-grid">
          <article class="sl-feature-box">
            <div class="sl-feature-icon">01</div>
            <h3>MITRE ATT&amp;CK Mapping</h3>
            <p>Classify security posture and discovered exposures across the standard MITRE ATT&CK Matrix. Security teams can instantly identify which adversary tactics (Reconnaissance, Initial Access, Lateral Movement, Exfiltration) are vulnerable in their environment.</p>
            <ul class="sl-feature-bullets">
              <li>Granular TTP (Tactics, Techniques, &amp; Procedures) mapping</li>
              <li>Heatmap visualizations highlighting enterprise defensive gaps</li>
              <li>Direct threat mitigation advice based on MITRE D3FEND</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">02</div>
            <h3>Threat Intelligence</h3>
            <p>Ingest high-fidelity global cyber threat intelligence feeds enriched with IOCs, threat actor attribution, emerging zero-day exploitability ratings, and industry-specific targeting telemetry.</p>
            <ul class="sl-feature-bullets">
              <li>Real-time IOC enrichment (malicious IPs, hashes, domains)</li>
              <li>Automated risk scoring based on active in-the-wild exploitation</li>
              <li>Tailored intelligence alerts relevant to your tech stack</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">03</div>
            <h3>AI-Assisted Threat Analysis</h3>
            <p>Leverage neural reasoning models to filter signal from noise. The AI correlates disparate events across your infrastructure to detect low-and-slow reconnaissance, credential stuffing, and evasive adversary traversal.</p>
            <ul class="sl-feature-bullets">
              <li>Machine-learning anomaly detection and correlation</li>
              <li>Automated incident root-cause hypothesis generation</li>
              <li>Natural language threat query assistant for security analysts</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">04</div>
            <h3>Dark Web Monitoring</h3>
            <p>Proactively monitor illicit darknet marketplaces, cybercrime Telegram channels, hacker forums, and breach data dumps to detect compromised employee credentials, corporate tokens, and confidential customer records.</p>
            <ul class="sl-feature-bullets">
              <li>Domain-wide credential leak detection with password hashing</li>
              <li>Executive and VIP identity exposure surveillance</li>
              <li>Automated alert triggers for instant password reset policies</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">05</div>
            <h3>DLP (Data Leak Prevention)</h3>
            <p>Detect unauthorized data movement, cloud storage misconfigurations, and external exfiltration pathways. Monitor sensitive intellectual property, PII, and financial records against compliance boundaries.</p>
            <ul class="sl-feature-bullets">
              <li>Public cloud bucket and repository leak discovery</li>
              <li>Sensitive data regex and machine-learning pattern recognition</li>
              <li>GDPR, UK Data Protection Act, and PCI-DSS compliance checks</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">06</div>
            <h3>Network Mapping &amp; Attack Path Discovery</h3>
            <p>Visualize your entire digital perimeter and internal network connections as an interactive graph. Discover reachable assets, unauthenticated gateways, and chained vulnerabilities that create lateral attack paths.</p>
            <ul class="sl-feature-bullets">
              <li>Automated perimeter topological graph generation</li>
              <li>Critical attack path calculation and choke-point identification</li>
              <li>Host, service, and protocol dependency visualization</li>
            </ul>
          </article>

          <article class="sl-feature-box sl-feature-box--wide">
            <div class="sl-feature-icon">07</div>
            <h3>Microsoft Defender Integration</h3>
            <p>Seamlessly integrate with Microsoft Defender for Endpoint, Defender for Cloud, and Microsoft Sentinel. Stream EVADA risk findings into your Defender security portal and orchestrate unified isolation policies.</p>
            <ul class="sl-feature-bullets">
              <li>Bidirectional incident sync with Microsoft Defender XDR</li>
              <li>Automated host isolation based on EVADA exploit verification</li>
              <li>Enriched endpoint telemetry with external attack surface context</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-flow-section evd-lightsec">
    <div class="sl-detail-container">
      <div class="sl-section-heading">
        <p class="sl-section-kicker">Continuous Intelligence Cycle</p>
        <h2>From global threat feeds to targeted mitigation</h2>
      </div>

      <div class="sl-steps-grid">
        <div class="sl-step-item">
          <span class="sl-step-badge">Stage 1</span>
          <h4>Global Telemetry Ingestion</h4>
          <p>Feeds from dark web monitoring, IOC databases, and MITRE feeds stream into EVADA.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Stage 2</span>
          <h4>Asset Correlation &amp; AI Analysis</h4>
          <p>AI maps threats directly against your active asset inventory and network topology.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Stage 3</span>
          <h4>Attack Path Identification</h4>
          <p>Chained lateral vectors are mapped out, revealing high-priority exposure points.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Stage 4</span>
          <h4>Defensive Orchestration</h4>
          <p>Sync with Microsoft Defender and internal tools to neutralize identified threats.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-end evd-lightsec">
    <div class="sl-end-inner">
      <div>
        <p>Enterprise Threat Intelligence</p>
        <h2>Ready to map and neutralize attack paths?</h2>
      </div>
      <div class="sl-end-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Deploy threat monitoring</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
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
    .sl-breadcrumb a { color: #c084fc; text-decoration: none; transition: color 0.2s; }
    .sl-breadcrumb a:hover { color: #e9d5ff; text-decoration: underline; }

    .sl-kicker { margin-bottom: 0.9rem !important; color: #c084fc !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl-detail .evd-hero-inner > p:not(.sl-kicker) { max-width: 48rem; }

    .sl-detail-overview { padding: clamp(4rem, 6vw, 6.5rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-detail-container { width: min(84rem, 100%); margin: 0 auto; }

    .sl-metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: clamp(3.5rem, 5vw, 5rem); }
    .sl-metric-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.75rem 1.5rem; text-align: left; }
    .sl-metric-val { display: block; font-size: clamp(1.8rem, 2.3vw, 2.5rem); font-weight: 800; color: #c084fc; line-height: 1; margin-bottom: 0.5rem; }
    .sl-metric-lbl { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.04em; margin-bottom: 0.6rem; }
    .sl-metric-card p { margin: 0; font-size: 0.84rem; line-height: 1.45; color: rgba(255,255,255,0.65); }

    .sl-section-heading { margin-bottom: clamp(2.5rem, 4vw, 3.5rem); text-align: left; max-width: 50rem; }
    .sl-section-kicker { color: #c084fc; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .sl-section-heading h2 { font-size: clamp(1.8rem, 2.8vw, 2.6rem); line-height: 1.15; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin: 0 0 1rem; }
    .sl-section-desc { font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0; }

    .sl-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
    .sl-feature-box { background: rgba(14,26,36,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: clamp(1.75rem, 3vw, 2.5rem); }
    .sl-feature-box--wide { grid-column: span 2; }
    .sl-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.2rem; height: 2.2rem; border-radius: 8px; background: rgba(192,132,252,0.12); border: 1px solid rgba(192,132,252,0.3); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.8rem; font-weight: 700; color: #c084fc; margin-bottom: 1.25rem; }
    .sl-feature-box h3 { font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0 0 0.85rem; }
    .sl-feature-box p { font-size: 0.94rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0 0 1.25rem; }
    .sl-feature-bullets { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
    .sl-feature-bullets li { position: relative; padding-left: 1.25rem; font-size: 0.86rem; color: rgba(255,255,255,0.85); line-height: 1.45; }
    .sl-feature-bullets li::before { content: "→"; position: absolute; left: 0; color: #c084fc; font-weight: bold; }

    .sl-flow-section { background: #f4f6f9; color: #14100a; padding: clamp(4rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-flow-section .sl-section-heading h2 { color: #071018; }
    .sl-flow-section .sl-section-kicker { color: #7e22ce; }
    
    .sl-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .sl-step-item { background: #ffffff; border: 1px solid rgba(20,16,10,0.1); border-radius: 12px; padding: 1.75rem 1.5rem; }
    .sl-step-badge { display: inline-block; padding: 0.28rem 0.55rem; border-radius: 6px; background: #f3e8ff; border: 1px solid rgba(192,132,252,0.4); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; color: #7e22ce; text-transform: uppercase; margin-bottom: 1rem; }
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
    title: "Threat Monitoring and Analysis | EVADA",
    description:
      "Enterprise threat monitoring, MITRE ATT&CK mapping, dark web surveillance, DLP exfiltration safeguards, attack path discovery, and Microsoft Defender integration.",
    css,
    body,
  });
}
