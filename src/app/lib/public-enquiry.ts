import { renderPage } from "./shell";

const icons = {
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>`,
  group: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.2"/><path d="M3.4 20a5.6 5.6 0 0 1 11.2 0M16 5.4a3 3 0 0 1 0 5.9M17.4 20a5.6 5.6 0 0 0-3.1-5"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5M16 4h4v4"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v11H9l-4 3v-3H4Z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8.2 3.8 10 8.1 7.7 10a15.5 15.5 0 0 0 6.3 6.3l1.9-2.3 4.3 1.8v3a2 2 0 0 1-2 2C9.9 20.8 3.2 14.1 3.2 5.8a2 2 0 0 1 2-2Z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
};

const arrow = `<svg viewBox="0 0 16 16" fill="none"><path d="M9.14 13.63 8.42 12.98 13.01 8.45H1.3v-.9h11.71L8.42 3.02l.72-.65L14.7 8l-5.56 5.63Z" fill="currentColor"/></svg>`;

type EnquiryKind = "contact" | "demo";

const content = {
  contact: {
    title: "Contact | EVADA",
    description: "Talk to EVADA about continuous security validation and protecting your environment.",
    eyebrow: "Contact EVADA",
    heading: "Tell us what you are trying to protect.",
    summary:
      "A short conversation is usually enough to tell you whether EVADA fits and what it would take to get validation running on your estate.",
    formEyebrow: "Start a conversation",
    formHeading: "Talk to our security team",
    formSummary: "Tell us the outcome you need. A real person will reply within one working day.",
    topic: "Public website enquiry",
    button: "Send message",
    success: "Message sent. The EVADA team will reply within one working day.",
    visual: "/hero-shard.webp",
    responseLabel: "Response target",
    responseValue: "Within one working day",
    contextLabel: "Best for",
    contextValue: "Product, security and commercial questions",
  },
  demo: {
    title: "Request a Demo | EVADA",
    description: "Request a guided EVADA product demo for your security programme.",
    eyebrow: "Product walkthrough",
    heading: "See EVADA in action.",
    summary:
      "Bring your security goals. We will show how EVADA turns verified Assets, scanner evidence and Findings into controlled action.",
    formEyebrow: "Request a demo",
    formHeading: "Plan your walkthrough",
    formSummary: "Share a little context so we can focus the session on your operating model.",
    topic: "Request a demo",
    button: "Request demo",
    success: "Demo request received. We will contact you within one working day.",
    visual: "/hero-monolith.webp",
    responseLabel: "Walkthrough",
    responseValue: "Tailored to your programme",
    contextLabel: "Covers",
    contextValue: "Assets, scans, Findings and evidence",
  },
} as const;

function field(
  label: string,
  name: string,
  icon: keyof typeof icons,
  placeholder: string,
  type = "text",
  required = false,
  autocomplete = "",
) {
  return `<label class="pe-field"><span class="pe-sr-only">${label}</span><div class="pe-control"><input type="${type}" name="${name}" placeholder="${label}" ${required ? "required" : ""} ${autocomplete ? `autocomplete="${autocomplete}"` : ""}></div></label>`;
}

function selectField(
  label: string,
  name: string,
  icon: keyof typeof icons,
  options: string[],
) {
  return `<label class="pe-field"><span class="pe-sr-only">${label}</span><div class="pe-control pe-control--select"><select name="${name}"><option value="" disabled selected>${label}</option>${options.map((option) => `<option value="${option}">${option}</option>`).join("")}</select><span class="pe-select-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div></label>`;
}

function contactCard(title: string, detail: string, icon: keyof typeof icons, link?: string) {
  const content = `<div class="pe-card-icon">${icons[icon]}</div><div class="pe-card-text"><strong>${title}</strong><span>${detail}</span></div><div class="pe-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>`;
  return link ? `<a href="${link}" class="pe-contact-card">${content}</a>` : `<div class="pe-contact-card">${content}</div>`;
}

function contactDetails() {
  return `<div class="pe-contact-list">
    ${contactCard("Email us", "info@evada.ai", "mail", "mailto:info@evada.ai")}
    ${contactCard("Call us", "020 3916 6414<br>07723 115384", "phone", "tel:+442039166414")}
    ${contactCard("Our location", "124 City Road<br>London, EC1V 2NX", "building")}
    ${contactCard("Company", "Netforte Consulting Ltd<br>England &amp; Wales", "briefcase")}
  </div>`;
}

function phoneField() {
  return `<label class="pe-field"><span class="pe-sr-only">Phone (optional)</span>
    <div class="pe-control" style="display: flex; padding-left: 0;">
      <select name="countryCode" style="width: auto; padding: 1rem 0.5rem 1rem 0.75rem; border-right: 1px solid rgba(255,255,255,0.1); border-radius: 8px 0 0 8px; appearance: auto;">
        <option value="+44" selected>+44</option>
        <option value="+1">+1</option>
        <option value="+61">+61</option>
        <option value="+91">+91</option>
        <option value="+49">+49</option>
        <option value="+33">+33</option>
        <option value="+971">+971</option>
      </select>
      <input type="tel" name="phone" placeholder="Phone (optional)" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
    </div>
  </label>`;
}

function demoSteps() {
  return `<ol class="pe-demo-steps">
    <li><b>01</b><span><strong>Map your programme</strong>We focus the session on your Assets, workflows and assurance goals.</span></li>
    <li><b>02</b><span><strong>Walk the live workflow</strong>See validation, Findings, evidence and VAPT reporting connected end to end.</span></li>
    <li><b>03</b><span><strong>Review enterprise controls</strong>Cover tenant isolation, approvals, RBAC and scanner operations.</span></li>
  </ol>`;
}

function formFields(kind: EnquiryKind) {
  const common = `<div class="pe-row">${field("Full name", "fullName", "user", "Jane Okafor", "text", true, "name")}${field("Work email", "workEmail", "mail", "jane@company.com", "email", true, "email")}</div>
    <div class="pe-row">${field("Company", "company", "building", "Company Ltd", "text", false, "organization")}${selectField("Team size", "size", "group", ["1 to 50", "51 to 250", "251 to 1000", "1000+", "MSP or partner"])}</div>`;

  if (kind === "contact") {
    return `${common}<div class="pe-row">${selectField("Enquiry type", "enquiryType", "target", ["Platform and product", "Security programme", "Enterprise access", "MSP or partnership", "Commercial question", "Other"])}${phoneField()}</div>
      <label class="pe-field"><span class="pe-sr-only">What would you like to solve?</span><div class="pe-control pe-control--area"><textarea name="message" rows="3" placeholder="Message" required></textarea></div></label>`;
  }

  return `${common}<div class="pe-row">${selectField("Your role", "role", "briefcase", ["Security leader", "Security engineer", "IT leader", "Compliance leader", "MSP or partner", "Other"])}${selectField("Primary objective", "objective", "target", ["Security validation", "AI-assisted pentesting", "VAPT reporting", "Compliance evidence", "MSP operations", "Platform evaluation"])}</div>
    <div class="pe-row">${selectField("Evaluation timeline", "timeline", "clock", ["Exploring options", "Within 3 months", "Within 6 months", "This year", "No fixed timeline"])}${phoneField()}</div>
    <label class="pe-field"><span class="pe-sr-only">What should we cover?</span><div class="pe-control pe-control--area"><textarea name="message" rows="2" placeholder="Message"></textarea></div></label>`;
}

function pageBody(kind: EnquiryKind) {
  const copy = content[kind];
  const isContact = kind === "contact";

  return `<div class="evd-page pe-page pe-page--${kind}">
    <div class="pe-bg-glow"></div>
    <div class="pe-bg-text">${isContact ? "CONTACT" : "DEMO"}</div>
    <section class="pe-split" aria-labelledby="pe-title">
      <div class="pe-story">
        <div class="pe-story-inner">
          <div class="pe-eyebrow-pill">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/></svg>
            ${copy.eyebrow}
          </div>
          <h1 id="pe-title">${copy.heading}</h1>
          <p class="pe-summary">${copy.summary}</p>
          <dl class="pe-context-new">
            <div><dt>${copy.responseLabel}</dt><dd>${copy.responseValue}</dd></div>
            <div><dt>${copy.contextLabel}</dt><dd>${copy.contextValue}</dd></div>
          </dl>
          ${isContact ? contactDetails() : demoSteps()}
          <div class="pe-quick-new"><span>${isContact ? "Prefer to see it first?" : "Need an answer before booking?"}</span><a href="${isContact ? "/book-demo" : "/contact"}">${isContact ? "Request a guided demo" : "Contact our team"}</a></div>
        </div>
      </div>
      <div class="pe-form-panel">
        <form class="pe-form" id="public-enquiry-form" data-kind="${kind}" data-topic="${copy.topic}" data-success="${copy.success}">
          ${formFields(kind)}
          <input type="text" name="website" tabindex="-1" autocomplete="off" class="pe-honeypot" aria-hidden="true">
          <button class="pe-submit" type="submit" data-label="${copy.button}"><span>${copy.button}</span></button>
          <p class="pe-status" id="public-enquiry-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </div>${formScript()}`;
}

function formScript() {
  return `<script>
    (function () {
      var form = document.getElementById("public-enquiry-form");
      var status = document.getElementById("public-enquiry-status");
      if (!form || !status) return;
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        var button = form.querySelector("button[type=submit]");
        var data = new FormData(form);
        var kind = form.getAttribute("data-kind") || "contact";
        var details = [];
        details.push("Team size: " + String(data.get("size") || "Not provided"));
        if (kind === "contact") {
          details.push("Enquiry type: " + String(data.get("enquiryType") || "Not provided"));
        } else {
          details.push("Role: " + String(data.get("role") || "Not provided"));
          details.push("Primary objective: " + String(data.get("objective") || "Not provided"));
          details.push("Evaluation timeline: " + String(data.get("timeline") || "Not provided"));
        }
        var message = String(data.get("message") || "").trim();
        if (message) details.push("Details: " + message);
        status.className = "pe-status is-pending";
        status.textContent = "Sending securely...";
        form.setAttribute("aria-busy", "true");
        if (button) {
          button.disabled = true;
          var buttonLabel = button.querySelector("span");
          if (buttonLabel) buttonLabel.textContent = "Sending...";
        }
        try {
          var response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: String(data.get("fullName") || ""),
              workEmail: String(data.get("workEmail") || ""),
              company: String(data.get("company") || ""),
              phone: String(data.get("phone") || ""),
              topic: form.getAttribute("data-topic") || "Website enquiry",
              message: details.join("\\n"),
              website: String(data.get("website") || "")
            })
          });
          var payload = await response.json().catch(function () { return {}; });
          if (!response.ok) throw new Error(payload.error || "Unable to send this request.");
          form.reset();
          status.className = "pe-status is-success";
          status.textContent = form.getAttribute("data-success") || "Request sent successfully.";
        } catch (error) {
          status.className = "pe-status is-error";
          status.textContent = error instanceof Error ? error.message : "Unable to send this request. Please try again.";
        } finally {
          form.removeAttribute("aria-busy");
          if (button) {
            button.disabled = false;
            var restoredLabel = button.querySelector("span");
            if (restoredLabel) restoredLabel.textContent = button.getAttribute("data-label") || "Submit";
          }
        }
      });
    })();
  </script>`;
}

const css = `
  .navigation { position: absolute; }
  body .navigation .evd-pill.glass-panel, body.evd-on-light .navigation .evd-pill.glass-panel { 
    backdrop-filter: blur(12px) saturate(180%) !important; 
    -webkit-backdrop-filter: blur(12px) saturate(180%) !important; 
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
  }
  body .navigation .evd-pill a:not(.evd-cta), body.evd-on-light .navigation .evd-pill a:not(.evd-cta) {
    color: #fff !important;
  }
  
  .pe-page { width: 100%; max-width: 100%; min-width: 0; overflow-x: clip; background: #040907; color: #ffffff; position: relative; }
  .pe-bg-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 80vw; height: 80vh; background: radial-gradient(circle at center top, rgba(39, 201, 129, 0.12) 0%, transparent 60%); pointer-events: none; }
  .pe-bg-text { position: absolute; top: 12vh; left: 50%; transform: translateX(-50%); font-size: 22vw; font-weight: 800; color: rgba(255, 255, 255, 0.1); line-height: 1; pointer-events: none; z-index: 0; user-select: none; }
  
  .pe-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4rem; width: 100%; max-width: 76rem; margin: 0 auto; min-width: 0; min-height: 100svh; overflow: visible; position: relative; z-index: 1; padding: 6.5rem 2rem 5rem; }
  
  .pe-story { position: relative; width: 100%; align-self: center; }
  .pe-story-inner { position: relative; width: 100%; max-width: 100%; min-width: 0; }
  
  .pe-eyebrow-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 40px; font-size: 0.8rem; font-weight: 500; color: #fff; margin-bottom: 2rem; }
  .pe-eyebrow-pill svg { width: 1rem; height: 1rem; opacity: 0.6; }
  
  .pe-story h1 { margin: 0 0 1rem; font-size: 3.2rem; line-height: 1.1; letter-spacing: -0.02em; font-weight: 500; }
  .pe-summary { margin: 0 0 3.5rem; max-width: 28rem; color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.6; }
  
  .pe-contact-list { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 100%; }
  .pe-contact-card { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1.1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; color: #fff; text-decoration: none; transition: background 0.2s, border-color 0.2s; }
  .pe-contact-card:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.12); }
  .pe-card-icon { display: flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 8px; background: rgba(255, 255, 255, 0.05); color: #fff; flex-shrink: 0; }
  .pe-card-icon svg { width: 1.1rem; height: 1.1rem; }
  .pe-card-text { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
  .pe-card-text strong { font-size: 0.95rem; font-weight: 500; }
  .pe-card-text span { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); line-height: 1.3; }
  .pe-card-arrow { display: none; }
  
  .pe-demo-steps { list-style: none; display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; max-width: 32rem; }
  .pe-demo-steps li { display: flex; gap: 1rem; align-items: flex-start; padding: 1rem 0; background: transparent; border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0; }
  .pe-demo-steps b { display: flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; background: rgba(46, 205, 128, 0.1); border: 1px solid rgba(46, 205, 128, 0.2); color: #2ecd80; border-radius: 50%; font-size: 0.85rem; flex-shrink: 0; }
  .pe-demo-steps span { color: rgba(255, 255, 255, 0.6); font-size: 0.9rem; line-height: 1.4; display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.15rem; }
  .pe-demo-steps strong { color: #fff; font-size: 1rem; font-weight: 500; }
  
  .pe-form-panel { align-self: center; width: 100%; max-width: 40rem; justify-self: end; }
  .pe-form { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 2rem; backdrop-filter: blur(16px); }
  
  .pe-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; }
  .pe-field { display: block; margin-bottom: 1rem; }
  .pe-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
  
  .pe-control { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; transition: border-color 0.2s, background 0.2s; }
  .pe-control:focus-within { border-color: rgba(255, 255, 255, 0.15); background: rgba(255, 255, 255, 0.05); }
  .pe-control input, .pe-control select, .pe-control textarea { width: 100%; background: transparent; border: none; outline: none; padding: 1rem 1.25rem; color: #fff; font-size: 0.95rem; }
  .pe-control input::placeholder, .pe-control textarea::placeholder, .pe-control select:invalid { color: rgba(255, 255, 255, 0.4); }
  .pe-control select { appearance: none; cursor: pointer; }
  .pe-control--select { position: relative; }
  .pe-control--select select { padding-right: 3.25rem; }
  .pe-select-arrow { position: absolute; top: 50%; right: 1.2rem; width: 1rem; height: 1rem; display: grid; place-items: center; color: rgba(255,255,255,.68); pointer-events: none; transform: translateY(-50%); transition: color .2s, transform .2s; }
  .pe-select-arrow svg { width: .85rem; height: .85rem; }
  .pe-control--select:hover .pe-select-arrow, .pe-control--select:focus-within .pe-select-arrow { color: #2ecd80; transform: translateY(-50%) translateY(1px); }
  .pe-control select option { background: #111; color: #fff; }
  .pe-control textarea { min-height: 8rem; resize: vertical; padding-top: 1rem; }
  
  .pe-submit { width: 100%; background: #2ecd80; color: #07140f; border: none; border-radius: 8px; padding: 1.1rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, background 0.2s; margin-top: 0.5rem; }
  .pe-submit:hover { background: #56dfa0; transform: translateY(-1px); }
  .pe-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
  .pe-status { display: none; margin-top: 1rem; padding: 1rem; border-radius: 8px; font-size: 0.9rem; text-align: center; }
  .pe-status:not(:empty) { display: block; }
  .pe-status.is-pending { background: rgba(255, 255, 255, 0.05); color: #fff; }
  .pe-status.is-success { background: rgba(46, 205, 128, 0.1); color: #2ecd80; border: 1px solid rgba(46, 205, 128, 0.2); }
  .pe-status.is-error { background: rgba(255, 60, 60, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 60, 60, 0.2); }
  
  .pe-honeypot { position: absolute !important; left: -10000px !important; width: 1px !important; height: 1px !important; opacity: 0 !important; }
  
  @media (prefers-reduced-motion: no-preference) {
    .pe-story-inner, .pe-form { animation: pe-enter .65s cubic-bezier(.16,1,.3,1) both; }
    .pe-form { animation-delay: .08s; }
    @keyframes pe-enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
  
  @media (max-width: 900px) {
    .pe-split { grid-template-columns: 1fr; gap: 3rem; padding-top: 5rem; }
    .pe-bg-text { font-size: 25vw; top: 12vh; }
    .pe-story h1 { font-size: 2.8rem; }
    .pe-form-panel { justify-self: center; }
  }
  @media (max-width: 640px) {
    .pe-row { grid-template-columns: 1fr; gap: 0; }
    .pe-form { padding: 1.5rem; }
    .pe-context-new, .pe-contact-list { grid-template-columns: 1fr; }
  }

  .pe-context-new { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin: 0 0 1.5rem; }
  .pe-context-new div { padding: 0.8rem 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; }
  .pe-context-new dt { color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
  .pe-context-new dd { margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 0.85rem; line-height: 1.4; }
  .pe-quick-new { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; }
  .pe-quick-new a { color: #fff; font-weight: 500; text-decoration: none; border-bottom: 1px solid rgba(255, 255, 255, 0.3); transition: border-color 0.2s; }
  .pe-quick-new a:hover { border-color: #fff; }
  @media (max-width: 640px) {
    .pe-split { width:100%; padding:5.25rem 1rem 3rem; }
    .pe-story h1 { max-width:100%; font-size:clamp(2.15rem,11vw,2.75rem); overflow-wrap:break-word; }
    .pe-summary { margin-bottom:2rem; }
    .pe-context-new, .pe-contact-list { grid-template-columns:1fr; }
    .pe-form-panel, .pe-story, .pe-story-inner { min-width:0; max-width:100%; }
  }
`;

export function renderPublicEnquiry(kind: EnquiryKind) {
  const copy = content[kind];
  return renderPage({
    title: copy.title,
    description: copy.description,
    css,
    body: pageBody(kind),
    lightNav: kind === "contact" || kind === "demo",
  });
}
