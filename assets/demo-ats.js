(() => {
  "use strict";

  const employers = [
    {
      name: "Klipline Logistics",
      role: "Dispatch coordinator",
      location: "Gqeberha · On site",
      price: "R25,000",
      need: "A depot manager needs one queue for applications instead of sorting CVs across inboxes.",
      scope: ["One recruitment team and one job intake form", "Custom screening fields for dispatch experience", "Shared shortlist and interview stages"],
      applicants: [
        ["Lwazi Cekiso", 4, ["Route planning", "Excel", "Dispatch"], "Shortlisted", "Coordinated daily dispatch for a regional fleet and resolved late deliveries with warehouse teams."],
        ["Nadia Davids", 2, ["Excel", "Customer service"], "Applied", "Handled customer updates and investigated delivery exceptions for a regional courier."],
        ["Ruan Botha", 5, ["Dispatch", "Fleet scheduling"], "Interview", "Scheduled vehicle allocations and maintained driver handover logs across two depots."],
        ["Thuli Ntuli", 1, ["Route planning", "Customer service"], "Applied", "Planned routes during a logistics internship and helped respond to shipment enquiries."],
        ["Jesse Daniels", 3, ["Excel", "Fleet scheduling"], "Reviewed", "Built weekly allocation sheets and tracked vehicle availability for a field services company."]
      ]
    },
    {
      name: "Asterwell Clinics",
      role: "Clinic administrator",
      location: "Cape Town · On site",
      price: "R68,000",
      need: "Three practices hire independently but want consistent review criteria and a shared view of interview progress.",
      scope: ["Separate hiring queues for each practice", "Configurable criteria and reviewer permissions", "Interview scheduling and hiring reports"],
      applicants: [
        ["Mika van Zyl", 3, ["Scheduling", "Billing"], "Interview", "Managed bookings and followed up outstanding accounts at a medical practice."],
        ["Busi Maseko", 5, ["Patient records", "Scheduling", "Billing"], "Shortlisted", "Ran front-desk operations and trained new staff on appointment and records workflows."],
        ["Carmen Petersen", 2, ["Customer service", "Scheduling"], "Applied", "Coordinated appointments and communications for a community support organisation."],
        ["Sizwe Mabena", 4, ["Patient records", "Billing"], "Reviewed", "Maintained patient files and checked supporting documentation for billing."],
        ["Lerato Diale", 1, ["Patient records", "Customer service"], "Applied", "Supported reception and filing during a clinic administration placement."]
      ]
    },
    {
      name: "Copperfern Energy",
      role: "Field operations analyst",
      location: "Johannesburg · Hybrid",
      price: "R185,000",
      need: "A growing operations team wants hiring managers, regional leads and HR to review the same pipeline with clear ownership.",
      scope: ["Multiple regions with role-specific workflows", "Approval steps, audit history and reporting", "HR system and calendar integration"],
      applicants: [
        ["Naledi Mathe", 6, ["Power BI", "SQL", "Field reporting"], "Interview", "Consolidated field reports and built a service dashboard for regional operations leads."],
        ["Kiran Naidoo", 4, ["SQL", "Excel", "Field reporting"], "Shortlisted", "Automated weekly service reports and built data quality checks for job records."],
        ["Aya Mbeki", 2, ["Power BI", "Excel"], "Reviewed", "Built operations dashboards and worked with supervisors to agree on reporting definitions."],
        ["Luke Daniels", 5, ["SQL", "Process mapping"], "Applied", "Documented work-order processes and connected separate records for a maintenance team."],
        ["Zinhle Khumalo", 3, ["Field reporting", "Process mapping"], "Applied", "Tracked field team workloads and helped standardise service handovers."]
      ]
    }
  ];

  const stages = ["Applied", "Reviewed", "Shortlisted", "Interview", "Offer", "Closed"];
  const byId = (id) => document.getElementById(id);
  const business = byId("ats-business");
  const stage = byId("ats-stage");
  const skill = byId("ats-skill");
  const search = byId("ats-search");
  const experience = byId("ats-experience");
  const metrics = byId("ats-metrics");
  const list = byId("ats-list");
  const profile = byId("ats-profile-content");
  const profileTitle = byId("ats-profile-title");
  const status = byId("ats-status");

  const applicantQueues = employers.map(({ applicants }) =>
    applicants.map(([name, years, skills, currentStage, summary]) => ({
      name, years, skills, stage: currentStage, summary
    }))
  );

  let selectedApplicant = null;
  let queue = applicantQueues[0];

  function setOptions(select, options) {
    select.replaceChildren(...options.map(([value, label]) => new Option(label, value)));
  }

  function renderQueue() {
    const query = search.value.trim().toLowerCase();
    const matches = queue.filter((applicant) =>
      (!stage.value || applicant.stage === stage.value) &&
      (!skill.value || applicant.skills.includes(skill.value)) &&
      applicant.years >= Number(experience.value) &&
      (!query || [applicant.name, ...applicant.skills].some((value) => value.toLowerCase().includes(query)))
    );
    list.replaceChildren();
    for (const applicant of matches) {
      const row = list.insertRow();
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lab-button";
      button.textContent = applicant.name;
      button.setAttribute("aria-pressed", String(applicant === selectedApplicant));
      button.addEventListener("click", () => {
        selectedApplicant = applicant;
        status.textContent = "";
        renderQueue();
        renderProfile();
        profileTitle.focus();
      });
      row.insertCell().append(button);
      row.insertCell().textContent = `${applicant.years} yr${applicant.years === 1 ? "" : "s"}`;
      row.insertCell().textContent = applicant.stage;
    }
    byId("ats-result-count").textContent = matches.length
      ? `${matches.length} of ${queue.length} applicants`
      : "No applicants match. Try adjusting the review criteria.";
    const totals = [
      ["Applicants", queue.length],
      ["Shortlisted", queue.filter((item) => item.stage === "Shortlisted").length],
      ["Interview", queue.filter((item) => item.stage === "Interview").length]
    ];
    metrics.innerHTML = totals.map(([label, count]) =>
      `<div class="lab-metric"><strong>${count}</strong>${label}</div>`
    ).join("");
  }

  function renderProfile() {
    if (!selectedApplicant) {
      profileTitle.textContent = "Applicant details";
      profile.innerHTML = "<p>Choose an applicant to review their experience and update their stage.</p>";
      return;
    }

    const applicant = selectedApplicant;
    profileTitle.textContent = applicant.name;
    profile.innerHTML = `
      <p class="lab-muted">${applicant.years} years of relevant experience · ${applicant.stage}</p>
      <p>${applicant.summary}</p>
      <p>${applicant.skills.map((value) => `<span class="lab-chip">${value}</span>`).join(" ")}</p>
      <form class="lab-controls">
        <label>Move to stage <select class="lab-input" name="nextStage"></select></label>
        <button type="submit" class="lab-button">Save stage</button>
      </form>`;
    const form = profile.querySelector("form");
    const nextStage = form.elements.nextStage;
    setOptions(nextStage, stages.map((value) => [value, value]));
    nextStage.value = applicant.stage;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      applicant.stage = nextStage.value;
      renderQueue();
      renderProfile();
      profileTitle.focus();
      status.textContent = `${applicant.name} is now in ${applicant.stage}.`;
    });
  }

  function selectEmployer() {
    const employer = employers[Number(business.value)];
    queue = applicantQueues[Number(business.value)];
    selectedApplicant = null;
    search.value = "";
    experience.value = "0";
    stage.value = "";
    status.textContent = "";
    byId("ats-job").textContent = employer.role;
    setOptions(skill, [["", "Any skill"], ...Array.from(new Set(queue.flatMap((item) => item.skills))).sort().map((value) => [value, value])]);
    byId("ats-scope").innerHTML = `
      <p class="lab-kicker">Fictional employer</p>
      <h2>${employer.name}</h2>
      <p class="lab-muted">${employer.location}</p>
      <p>${employer.need}</p>
      <h3>Example scope</h3>
      <ul class="lab-list">${employer.scope.map((item) => `<li>${item}</li>`).join("")}</ul>
      <div class="lab-quote">
        <span class="lab-number">${employer.price}</span>
        <span class="lab-muted">Indicative setup price</span>
      </div>
      <a class="lab-link" href="contact.html">Discuss your hiring workflow ↗</a>`;
    renderQueue();
    renderProfile();
  }

  setOptions(business, employers.map(({ name }, index) => [String(index), name]));
  setOptions(stage, [["", "All stages"], ...stages.map((value) => [value, value])]);
  setOptions(experience, [["0", "Any experience"], ["2", "2+ years"], ["4", "4+ years"]]);
  business.addEventListener("change", selectEmployer);
  search.addEventListener("input", renderQueue);
  for (const filter of [stage, skill, experience]) {
    filter.addEventListener("change", renderQueue);
  }
  selectEmployer();
})();
