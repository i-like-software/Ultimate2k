(() => {
  const companies = [
    {
      name: "Kiteframe Studio", type: "Creative studio · 12 staff", price: "R30,000",
      scope: "A cloud workspace for three sources, staff search, one shared calendar and a lightweight operations dashboard.",
      sources: ["WhatsApp", "Email", "Drive"],
      records: [
        ["WhatsApp", "Beacon campaign approval", "Client work", "Nandi", "The Beacon campaign artwork is approved. Nandi owns production and the team must deliver final files on Friday.", "This week"],
        ["Email", "Who approves supplier invoices?", "Finance", "Maya", "Send supplier invoices to Maya in Finance. Purchase orders above R10,000 also require studio director approval.", "This week"],
        ["Drive", "Studio equipment booking", "Operations", "Leo", "Book studio cameras and lighting in the shared calendar. Leo can approve after-hours bookings.", "Earlier"],
        ["Email", "Beacon handover checklist", "Client work", "Nandi", "Package source files, export the social versions and attach the approval email before handing over.", "This week"],
        ["Drive", "New starter checklist", "Operations", "Leo", "Request a laptop and workspace access two working days before a new team member starts.", "Earlier"]
      ],
      events: [
        ["09", "09:00", "Monday studio planning", "Operations", "Leo"],
        ["11", "11:30", "Supplier invoice review", "Finance", "Maya"],
        ["13", "14:00", "Beacon campaign handover", "Client work", "Nandi"]
      ]
    },
    {
      name: "Stonepath Field Services", type: "Field operations · 85 staff", price: "R185,000",
      scope: "Staff and management views, WhatsApp and CRM connectors, role-based access, mobile-friendly search and calendar exports for dispatch.",
      sources: ["WhatsApp", "Email", "CRM", "Documents"],
      records: [
        ["CRM", "Riverside pump service case", "Dispatch", "Thabo", "Case SP-108 needs a replacement seal. Thabo owns dispatch. The technician visit is on Wednesday at 10:00.", "This week"],
        ["WhatsApp", "Riverside site access", "Field team", "Lindi", "Use the south gate for the Riverside visit. Lindi has the gate contact and will meet the technician at reception.", "This week"],
        ["Documents", "Vehicle inspection procedure", "Field team", "Lindi", "Complete the vehicle checklist before your first dispatch. Report a safety issue to Lindi and hold the vehicle until cleared.", "Earlier"],
        ["Email", "Spare parts purchase approval", "Finance", "Seth", "For purchases above R5,000, send the case number and supplier quote to Seth for approval.", "Earlier"],
        ["CRM", "Hillview maintenance renewal", "Dispatch", "Thabo", "Hillview's renewal is ready for review. Confirm the revised service window with the customer before closing the task.", "This week"]
      ],
      events: [
        ["09", "08:30", "Dispatch capacity check", "Dispatch", "Thabo"],
        ["11", "10:00", "Riverside technician visit", "Field team", "Lindi"],
        ["12", "15:00", "Spare parts approval review", "Finance", "Seth"]
      ]
    },
    {
      name: "Meridian Freight Network", type: "Multi-site logistics · 1,400 staff", price: "R2,400,000",
      scope: "A multi-site deployment with identity integration, permission-aware search, warehouse and CRM connectors, auditing, an operations app and management reporting.",
      sources: ["WhatsApp", "Email", "CRM", "Warehouse", "Documents"],
      records: [
        ["Warehouse", "Bay 4 outbound exception", "Warehouse", "Anele", "Shipment MF-441 is paused at Bay 4 for a label mismatch. Anele owns the exception and will confirm a revised pickup window.", "This week"],
        ["CRM", "Harbourside client escalation", "Client services", "Samira", "Harbourside has asked for an update on shipment MF-441. Samira owns customer communication and will follow up after the warehouse review.", "This week"],
        ["WhatsApp", "Durban shift handover", "Warehouse", "Anele", "Confirm the outbound exception list before 15:00. Escalate missed collection slots to the warehouse lead.", "This week"],
        ["Email", "Access review and audit owners", "IT operations", "Jules", "Jules coordinates access reviews. Site managers should confirm role changes by Thursday and attach approvals to the audit register.", "Earlier"],
        ["Documents", "Incident escalation guide", "IT operations", "Jules", "Log incidents in the operations queue and include the affected site. The on-call owner will assign severity and coordinate follow-up.", "Earlier"]
      ],
      events: [
        ["09", "08:00", "Regional capacity review", "Warehouse", "Anele"],
        ["11", "13:00", "Bay 4 shipment review", "Client services", "Samira"],
        ["12", "10:00", "Access and audit review", "IT operations", "Jules"]
      ]
    }
  ];
  const picker = document.querySelector("#hub-business");
  const tabs = document.querySelector("#hub-tabs");
  const view = document.querySelector("#hub-view");
  const scope = document.querySelector("#hub-scope");
  const active = () => companies[Number(picker.value)];
  let panel = "search";
  const ignored = new Set(["a", "an", "and", "at", "can", "do", "for", "i", "in", "is", "me", "of", "on", "the", "to", "what", "when", "where", "who", "with"]);

  function find(query, source = "") {
    const tokens = (query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(word => !ignored.has(word));
    return active().records
      .filter(record => !source || record[0] === source)
      .map(record => ({ record, matches: tokens.filter(word => record.join(" ").toLowerCase().includes(word)).length }))
      .filter(result => !tokens.length || result.matches)
      .sort((a, b) => b.matches - a.matches)
      .map(result => result.record);
  }

  function recordCard([source, title, team, owner, detail]) {
    return `<article class="lab-record"><span class="lab-chip">${source}</span><h3>${title}</h3><p>${detail}</p><p class="lab-muted">${team} · Owner: ${owner}</p></article>`;
  }

  function renderSearch() {
    view.innerHTML = `<h2>Search the workspace</h2><p class="lab-muted">Find a document, decision, case or person. Try “approval”, “handover” or an owner’s name.</p><div class="lab-controls"><label>Search <input class="lab-input" id="hub-query" type="search" placeholder="Ask about a case or topic"></label><label>Source <select class="lab-input" id="hub-source"><option value="">All sources</option>${active().sources.map(source => `<option>${source}</option>`).join("")}</select></label></div><p class="lab-muted" id="hub-count" aria-live="polite"></p><div id="hub-results" class="lab-stack"></div>`;
    const query = document.querySelector("#hub-query");
    const source = document.querySelector("#hub-source");
    function update() {
      const results = find(query.value, source.value);
      document.querySelector("#hub-count").textContent = `${results.length} source record${results.length === 1 ? "" : "s"}`;
      document.querySelector("#hub-results").innerHTML = results.map(recordCard).join("") || "<p>No matches. Try another term or switch sources.</p>";
    }
    query.addEventListener("input", update);
    source.addEventListener("change", update);
    update();
  }

  function renderCalendar() {
    view.innerHTML = `<h2>Shared calendar</h2><p class="lab-muted">9–13 November 2026 · South Africa Standard Time · Sample week</p><div class="lab-controls"><label>Team <select id="hub-team" class="lab-input"><option value="">All teams</option>${active().events.map(event => `<option>${event[3]}</option>`).join("")}</select></label><button type="button" class="lab-button" id="hub-export">Download calendar (.ics)</button></div><div class="lab-stack" id="hub-events"></div>`;
    const team = document.querySelector("#hub-team");
    const events = () => active().events.filter(event => !team.value || event[3] === team.value);
    function update() {
      document.querySelector("#hub-events").innerHTML = events().map(([day, time, title, group, owner]) => `<article class="lab-record"><span class="lab-chip">${day} NOV · ${time}</span><h3>${title}</h3><p>${group} · Host: ${owner}</p></article>`).join("");
    }
    team.addEventListener("change", update);
    document.querySelector("#hub-export").addEventListener("click", () => {
      const body = events().flatMap(event => {
        const [day, time, title, , owner] = event;
        const index = active().events.indexOf(event);
        const [hour, minute] = time.split(":");
        const utc = `${String(Number(hour) - 2).padStart(2, "0")}${minute}00`;
        return ["BEGIN:VEVENT", `UID:hub-${picker.value}-${day}-${index}@ultimate2k.co.za`, "DTSTAMP:20261106T080000Z", `DTSTART:202611${day}T${utc}Z`, "DURATION:PT30M", `SUMMARY:Demo - ${title}`, `DESCRIPTION:Fictional sample hosted by ${owner}`, "END:VEVENT"];
      });
      const url = URL.createObjectURL(new Blob([["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ultimate2k//Knowledge Hub Demo//EN", ...body, "END:VCALENDAR", ""].join("\r\n")], { type: "text/calendar" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ultimate2k-demo-calendar.ics";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    update();
  }

  function renderDashboard() {
    view.innerHTML = `<h2>Management overview</h2><div class="lab-controls"><label>Record period <select class="lab-input" id="hub-period"><option value="">All sample records</option><option>This week</option><option>Earlier</option></select></label></div><div id="hub-summary" aria-live="polite"></div>`;
    const period = document.querySelector("#hub-period");
    function update() {
      const records = active().records.filter(record => !period.value || record[5] === period.value);
      const owners = new Set(records.map(record => record[3]));
      document.querySelector("#hub-summary").innerHTML = `<div class="lab-metrics"><div class="lab-metric"><strong>${records.length}</strong> Records</div><div class="lab-metric"><strong>${active().sources.length}</strong> Sources</div><div class="lab-metric"><strong>${owners.size}</strong> Owners</div></div><h3>Who owns what?</h3><ul class="lab-list">${[...owners].map(owner => `<li><strong>${owner}</strong> · ${[...new Set(records.filter(record => record[3] === owner).map(record => record[2]))].join(", ")}</li>`).join("")}</ul>`;
    }
    period.addEventListener("change", update);
    update();
  }

  function renderChat() {
    view.innerHTML = `<h2>WhatsApp assistant</h2><p class="lab-muted">Simulated conversation. Ask about a topic to retrieve a sourced answer from this company’s demo records.</p><form id="hub-chat"><label>Message <input class="lab-input" id="hub-message" required maxlength="180" placeholder="Who owns this case?"></label><p><button type="submit" class="lab-button">Send demo message</button></p></form><div id="hub-response" role="status"></div>`;
    document.querySelector("#hub-chat").addEventListener("submit", event => {
      event.preventDefault();
      const query = document.querySelector("#hub-message").value.trim();
      const response = document.querySelector("#hub-response");
      if (!query) return;
      const hasTopic = (query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).some(word => !ignored.has(word));
      const [match] = hasTopic ? find(query) : [];
      response.innerHTML = match ? recordCard(match) : "<p>I couldn’t find a matching source. Try a project, case number or person.</p>";
    });
  }

  function render() {
    const company = active();
    scope.innerHTML = `<p class="lab-kicker">Fictional organisation</p><h2>${company.name}</h2><p class="lab-muted">${company.type}</p><p>${company.scope}</p><p class="lab-quote">Indicative project cost<strong class="lab-number">${company.price}</strong></p><p class="lab-muted">Scope and pricing depend on sources, access rules, deployment and support.</p><a class="lab-link" href="contact.html?service=systems-integration">Discuss a knowledge hub →</a>`;
    tabs.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", button.dataset.view === panel));
    ({ search: renderSearch, calendar: renderCalendar, dashboard: renderDashboard, chat: renderChat })[panel]();
  }

  companies.forEach((company, index) => picker.add(new Option(company.name, index)));
  picker.addEventListener("change", render);
  tabs.addEventListener("click", event => {
    const button = event.target.closest("button[data-view]");
    if (!button) return;
    panel = button.dataset.view;
    render();
  });
  render();
})();
