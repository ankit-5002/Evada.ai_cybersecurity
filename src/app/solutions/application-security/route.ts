import { renderPage } from "../../lib/shell";

export async function GET() {
  const body = `
<div class="evd-page sl-detail">
  <section class="evd-hero evd-hero--cube">
    <div class="evd-hero-inner">
      <div class="sl-breadcrumb">
        <a href="/solutions">&larr; All Solutions</a>
        <span aria-hidden="true">/</span>
        <span>Pillar 02</span>
      </div>
      <p class="sl-kicker">Full Lifecycle Application Assurance</p>
      <h1>Application Security (AppSec Suite)</h1>
      <p>Embed static code analysis, runtime dynamic testing, secrets detection, dependency scanning, and UK Cyber Essentials Plus pre-assessment directly into your software delivery lifecycle.</p>
      <div class="evd-hero-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Secure your code pipeline</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
        <a href="/book-demo" class="evd-hero-secondary">Request AppSec demo</a>
      </div>
    </div>
    <div class="evd-hero-fade" aria-hidden="true"></div>
  </section>

  <section class="sl-detail-overview" aria-label="Solution Overview">
    <div class="sl-detail-container">
      <div class="sl-metric-row">
        <div class="sl-metric-card">
          <span class="sl-metric-val">Shift-Left</span>
          <span class="sl-metric-lbl">Continuous CI/CD Gates</span>
          <p>Block high-risk vulnerabilities directly inside GitHub, GitLab, and Bitbucket pull requests.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">CE+</span>
          <span class="sl-metric-lbl">UK Cyber Essentials Plus</span>
          <p>Automated pre-assessment checks matching UK NCSC and IASME audit requirements.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">100%</span>
          <span class="sl-metric-lbl">Secrets &amp; Key Detection</span>
          <p>High-entropy token analysis prevents catastrophic credential leaks across repos.</p>
        </div>
        <div class="sl-metric-card">
          <span class="sl-metric-val">Full SAST &amp; DAST</span>
          <span class="sl-metric-lbl">Dual-Engine Verification</span>
          <p>Correlate static code vulnerabilities with dynamic runtime exploitability proof.</p>
        </div>
      </div>

      <div class="sl-feature-section">
        <div class="sl-section-heading">
          <p class="sl-section-kicker">AppSec Suite Modules</p>
          <h2>Comprehensive application security from commit to cloud</h2>
          <p class="sl-section-desc">Deliver secure software faster with unified code analysis, software composition governance, and automated compliance auditing.</p>
        </div>

        <div class="sl-features-grid">
          <article class="sl-feature-box">
            <div class="sl-feature-icon">01</div>
            <h3>SAST (Static Application Security Testing)</h3>
            <p>Scan raw source code across major languages (TypeScript, JavaScript, Python, Go, Java, C#, PHP) for structural flaws, injection vectors, cross-site scripting (XSS), insecure deserialization, and unsafe cryptography before compilation.</p>
            <ul class="sl-feature-bullets">
              <li>Abstract Syntax Tree (AST) deep data-flow analysis</li>
              <li>OWASP Top 10 and CWE/SANS Top 25 mapping</li>
              <li>Developer-friendly PR comments with exact fix diffs</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">02</div>
            <h3>DAST (Dynamic Application Security Testing)</h3>
            <p>Assess running staging and production web applications and REST/GraphQL APIs from the outside in. EVADA dynamically simulates real-world requests, parameter tampering, and header injections without requiring source code access.</p>
            <ul class="sl-feature-bullets">
              <li>Authenticated black-box and grey-box API testing</li>
              <li>Session token handling and stateful business flow validation</li>
              <li>Server-side request forgery (SSRF) and SQLi fuzzing</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">03</div>
            <h3>Secrets Scanning</h3>
            <p>Prevent credential compromise with real-time detection of high-entropy strings, AWS/Azure access keys, private SSH keys, database connection strings, and third-party API tokens committed to repositories or build logs.</p>
            <ul class="sl-feature-bullets">
              <li>Pre-commit git hooks and server-side repo scanning</li>
              <li>Validation checks to verify whether discovered keys are live</li>
              <li>Automated revocation guidance and rotation workflows</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">04</div>
            <h3>Dependency Scanning (SCA)</h3>
            <p>Generate a complete Software Bill of Materials (SBOM) and identify vulnerabilities (CVEs) across direct and transitive open-source dependencies in npm, pip, Maven, NuGet, and Go modules.</p>
            <ul class="sl-feature-bullets">
              <li>Comprehensive SBOM generation (CycloneDX &amp; SPDX)</li>
              <li>Real-time alerting on newly published zero-day CVEs</li>
              <li>Automated pull requests with safe library upgrade paths</li>
            </ul>
          </article>

          <article class="sl-feature-box">
            <div class="sl-feature-icon">05</div>
            <h3>CI/CD Pipeline Security</h3>
            <p>Enforce security guardrails directly inside GitHub Actions, GitLab CI, Azure DevOps, and Jenkins. Set customizable quality gates that fail builds only on verified critical findings or policy violations.</p>
            <ul class="sl-feature-bullets">
              <li>Policy-as-code configuration and branch protection</li>
              <li>Custom threshold rules per environment (Dev vs. Prod)</li>
              <li>Fast, incremental scanning that won't slow down deployment</li>
            </ul>
          </article>

          <article class="sl-feature-box sl-feature-box--highlight">
            <div class="sl-feature-icon">06</div>
            <h3>CE+ Pre-Assessment (Cyber Essentials Plus)</h3>
            <p>Specifically calibrated for UK organizations preparing for government and commercial tenders. EVADA runs automated pre-audit checks covering boundary firewalls, secure configuration, user access control, malware protection, and patch management.</p>
            <ul class="sl-feature-bullets">
              <li>Pre-configured checks mapped to UK NCSC / IASME standards</li>
              <li>Gap analysis highlighting non-compliant assets and settings</li>
              <li>Downloadable audit-ready technical evidence reports</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-flow-section evd-lightsec">
    <div class="sl-detail-container">
      <div class="sl-section-heading">
        <p class="sl-section-kicker">Developer Integration</p>
        <h2>Built into the modern DevOps pipeline</h2>
      </div>

      <div class="sl-steps-grid">
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 1</span>
          <h4>Code Commit &amp; Pre-Push</h4>
          <p>Local hooks detect hardcoded secrets and syntax vulnerabilities before code leaves the developer machine.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 2</span>
          <h4>Pull Request SAST &amp; SCA</h4>
          <p>Automated scanning analyzes diffs and dependencies, posting actionable suggestions inline.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 3</span>
          <h4>Build &amp; Staging DAST</h4>
          <p>Dynamic fuzzing assesses live endpoints in staging environments to verify runtime security.</p>
        </div>
        <div class="sl-step-item">
          <span class="sl-step-badge">Phase 4</span>
          <h4>Audit &amp; CE+ Compliance</h4>
          <p>Continuous validation aggregates evidence into verifiable Cyber Essentials Plus documentation.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sl-end evd-lightsec">
    <div class="sl-end-inner">
      <div>
        <p>UK Cyber Compliance &amp; AppSec</p>
        <h2>Ready to secure your application lifecycle?</h2>
      </div>
      <div class="sl-end-actions">
        <a href="/signup" class="evd-hero-cta"><span class="evd-cta-label">Get started with AppSec</span><span class="evd-cta-arrow" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M9.13548 13.6304L8.42288 12.9773L13.0102 8.45044H1.29688V7.54957H13.0102L8.42288 3.0227L9.13548 2.36957L14.7027 8L9.13548 13.6304Z" fill="currentColor"></path></svg></span></a>
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
    .sl-breadcrumb a { color: #38bdf8; text-decoration: none; transition: color 0.2s; }
    .sl-breadcrumb a:hover { color: #7dd3fc; text-decoration: underline; }

    .sl-kicker { margin-bottom: 0.9rem !important; color: #38bdf8 !important; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.78rem !important; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .sl-detail .evd-hero-inner > p:not(.sl-kicker) { max-width: 48rem; }

    .sl-detail-overview { padding: clamp(4rem, 6vw, 6.5rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-detail-container { width: min(84rem, 100%); margin: 0 auto; }

    .sl-metric-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: clamp(3.5rem, 5vw, 5rem); }
    .sl-metric-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.75rem 1.5rem; text-align: left; }
    .sl-metric-val { display: block; font-size: clamp(1.8rem, 2.3vw, 2.5rem); font-weight: 800; color: #38bdf8; line-height: 1; margin-bottom: 0.5rem; }
    .sl-metric-lbl { display: block; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.04em; margin-bottom: 0.6rem; }
    .sl-metric-card p { margin: 0; font-size: 0.84rem; line-height: 1.45; color: rgba(255,255,255,0.65); }

    .sl-section-heading { margin-bottom: clamp(2.5rem, 4vw, 3.5rem); text-align: left; max-width: 50rem; }
    .sl-section-kicker { color: #38bdf8; font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .sl-section-heading h2 { font-size: clamp(1.8rem, 2.8vw, 2.6rem); line-height: 1.15; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin: 0 0 1rem; }
    .sl-section-desc { font-size: 1.05rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0; }

    .sl-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
    .sl-feature-box { background: rgba(14,26,36,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: clamp(1.75rem, 3vw, 2.5rem); }
    .sl-feature-box--highlight { border-color: rgba(56,189,248,0.4); background: rgba(14,35,50,0.6); }
    .sl-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.2rem; height: 2.2rem; border-radius: 8px; background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.8rem; font-weight: 700; color: #38bdf8; margin-bottom: 1.25rem; }
    .sl-feature-box h3 { font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0 0 0.85rem; }
    .sl-feature-box p { font-size: 0.94rem; line-height: 1.6; color: rgba(255,255,255,0.7); margin: 0 0 1.25rem; }
    .sl-feature-bullets { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
    .sl-feature-bullets li { position: relative; padding-left: 1.25rem; font-size: 0.86rem; color: rgba(255,255,255,0.85); line-height: 1.45; }
    .sl-feature-bullets li::before { content: "→"; position: absolute; left: 0; color: #38bdf8; font-weight: bold; }

    .sl-flow-section { background: #f4f6f9; color: #14100a; padding: clamp(4rem, 6vw, 6rem) clamp(1.25rem, 5vw, 4rem); }
    .sl-flow-section .sl-section-heading h2 { color: #071018; }
    .sl-flow-section .sl-section-kicker { color: #0284c7; }
    
    .sl-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .sl-step-item { background: #ffffff; border: 1px solid rgba(20,16,10,0.1); border-radius: 12px; padding: 1.75rem 1.5rem; }
    .sl-step-badge { display: inline-block; padding: 0.28rem 0.55rem; border-radius: 6px; background: #e0f2fe; border: 1px solid rgba(56,189,248,0.4); font-family: 'Aeonik Mono', ui-monospace, monospace; font-size: 0.68rem; font-weight: 700; color: #0369a1; text-transform: uppercase; margin-bottom: 1rem; }
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
    title: "Application Security (AppSec Suite & CE+) | EVADA",
    description:
      "Comprehensive AppSec suite delivering SAST, DAST, secrets scanning, software composition analysis (SCA), CI/CD pipelines, and UK Cyber Essentials Plus pre-assessment.",
    css,
    body,
  });
}
