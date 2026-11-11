(() => {
  "use strict";

  const plans = [
    {
      id: "micro",
      name: "Micro",
      fee: 49,
      setup: 1490,
      setupName: "Micro Launch",
      maxUsers: 5,
      pages: 1,
      summary:
        "A simple hosted website with help when the platform has a fault.",
      highlights: [
        "1 template page and 1 request form",
        "1 GB storage · 10 GB monthly transfer",
        "Weekly website backup · 4 copies",
        "Platform fault response target of 2 business days",
      ],
      allowance: 0,
      response: "2 business days",
      setupScope:
        "One template page, up to 5 sections and 10 listed services, supplied logo/text/images, one contact or appointment-request form, one domain connection, one revision round and a 30-minute owner handover.",
    },
    {
      id: "essential",
      name: "Essential",
      fee: 399,
      setup: 4990,
      setupName: "Essential Launch",
      maxUsers: 50,
      pages: 5,
      summary:
        "Remote help for the people, accounts and computers in your business.",
      highlights: [
        "Up to 5 website pages",
        "1 cloud workspace · 1 computer per user",
        "30 support minutes per user each month",
        "First response target of 1 business day",
      ],
      allowance: 30,
      response: "1 business day",
      setupScope:
        "Up to 5 template pages with supplied content, one enquiry form and domain connection, basic page titles/descriptions/indexing setup, eligible Google Business Profile assistance, up to 10 new accounts in one workspace, two revision rounds and a 60-minute handover.",
    },
    {
      id: "care",
      name: "Care",
      fee: 599,
      setup: 7990,
      setupName: "Care Onboarding",
      maxUsers: 50,
      pages: 5,
      summary:
        "More support time, primary-device reviews and daily website backups.",
      highlights: [
        "Essential coverage with device inventory",
        "Monthly patch-status review and agreed updates",
        "60 support minutes per user each month",
        "First response target of 4 business hours",
      ],
      allowance: 60,
      response: "4 business hours",
      setupScope:
        "Essential Launch plus inventory and enrolment of up to 10 supported existing computers, a baseline MFA/access and patch-status review, a join/leave checklist and a documented provider and licence register.",
    },
    {
      id: "operations",
      name: "Operations",
      fee: 899,
      setup: 11990,
      setupName: "Operations Onboarding",
      maxUsers: 50,
      pages: 8,
      summary:
        "More hands-on support and scheduled changes to agreed template workflows.",
      highlights: [
        "Care coverage with up to 8 website pages",
        "90 support minutes per user each month",
        "2 scheduled workflow-change hours per business",
        "First response target of 2 business hours",
      ],
      allowance: 90,
      response: "2 business hours",
      setupScope:
        "Care Onboarding plus up to 8 template pages, configuration of one existing template workflow with up to 5 steps using supported tools and agreed inputs, and a 90-minute handover.",
    },
  ];

  const currency = (amount) =>
    "R" +
    new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/\s/g, ",");
  const getPlan = (id) => plans.find((plan) => plan.id === id) || plans[0];
  function estimate(id, users) {
    const plan = getPlan(id);
    const additionalPairs = plan.id === "micro" ? 0 : Math.max(0, users - 10);
    return {
      plan,
      users,
      monthly: plan.fee * users,
      setup: plan.setup + additionalPairs * 250,
      additionalPairs,
      supportMinutes: plan.allowance * users,
    };
  }
  window.Ultimate2kPricing = { plans, currency, getPlan, estimate };

  const calculator = document.querySelector("#price-calculator");
  if (!calculator) return;

  const cardList = document.querySelector("#price-cards");
  cardList.innerHTML = plans
    .map(
      (plan) => `
    <article class="pricing-card" id="${plan.id}">
      <span class="pricing-label">${plan.id === "micro" ? "1–5 users" : "1–50 users"} · Remote service</span>
      <h2>${plan.name}</h2>
      <p>${plan.summary}</p>
      <div class="pricing-fee">${currency(plan.fee)}</div>
      <div class="pricing-unit">per active user / month</div>
      <ul>${plan.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p><strong>${currency(plan.setup)} once</strong><br>${plan.setupName}</p>
      <a class="price-button" href="#calculator" data-select-plan="${plan.id}">Calculate ${plan.name}</a>
    </article>`,
    )
    .join("");

  document.querySelector("#price-setup-list").innerHTML = plans
    .map(
      (plan) => `
    <article class="price-setup"><h3>${plan.setupName}</h3><div class="setup-cost">${currency(plan.setup)} once</div><p>${plan.setupScope}</p></article>
  `,
    )
    .join("");

  const planField = document.querySelector("#price-plan");
  const usersField = document.querySelector("#price-users");
  const enquiry = document.querySelector("#price-enquiry");
  const error = document.querySelector("#price-error");

  function update() {
    const plan = getPlan(planField.value);
    usersField.max = String(plan.maxUsers);
    document.querySelector("#price-user-help").textContent =
      plan.id === "micro"
        ? "Micro supports 1–5 named users and one business/site."
        : "Managed plans support 1–50 named users on the standard cloud stack.";
    const users = Number(usersField.value);
    const valid =
      usersField.value !== "" &&
      Number.isInteger(users) &&
      users >= 1 &&
      users <= plan.maxUsers;
    usersField.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid
      ? ""
      : `Enter a whole number from 1 to ${plan.maxUsers} for ${plan.name}.`;
    enquiry.setAttribute("aria-disabled", String(!valid));
    if (!valid) {
      enquiry.removeAttribute("href");
      ["#price-monthly", "#price-setup", "#price-allowance"].forEach((id) => {
        document.querySelector(id).textContent = "—";
      });
      document.querySelector("#price-setup-detail").textContent =
        "Choose a valid user count to calculate setup.";
      return;
    }
    const quote = estimate(plan.id, users);
    document.querySelector("#price-monthly").textContent =
      currency(quote.monthly) + " / month";
    document.querySelector("#price-setup").textContent =
      currency(quote.setup) + " once";
    document.querySelector("#price-allowance").textContent = plan.allowance
      ? quote.supportMinutes + " pooled minutes / month"
      : "Hosted platform fault support";
    document.querySelector("#price-setup-detail").textContent =
      quote.additionalPairs
        ? `${plan.setupName} ${currency(plan.setup)} + ${quote.additionalPairs} additional supported user/device pairs at R250 each.`
        : `${plan.setupName}. ${plan.id === "micro" ? "One template page within the fixed launch scope." : "Includes setup for up to 10 new users and, on Care/Operations, up to 10 supported existing computers."}`;
    document.querySelector("#price-support-detail").textContent = plan.allowance
      ? `Time is pooled across the business with no rollover. First response target is ${plan.response} during staffed service hours.`
      : "Fault-ticket first response target is 2 business days. Personal device/app support and content changes are separately quoted.";
    const industry = new URLSearchParams(location.search).get("industry");
    enquiry.href = `contact.html?plan=${plan.id}&users=${users}${industry ? "&industry=" + encodeURIComponent(industry) : ""}`;
  }

  planField.addEventListener("change", () => {
    const plan = getPlan(planField.value);
    if (Number(usersField.value) > plan.maxUsers)
      usersField.value = String(plan.maxUsers);
    update();
  });
  usersField.addEventListener("input", update);
  cardList.addEventListener("click", (event) => {
    const link = event.target.closest("[data-select-plan]");
    if (!link) return;
    planField.value = link.dataset.selectPlan;
    if (Number(usersField.value) > getPlan(planField.value).maxUsers)
      usersField.value = String(getPlan(planField.value).maxUsers);
    update();
  });

  const params = new URLSearchParams(location.search);
  if (plans.some((plan) => plan.id === params.get("plan")))
    planField.value = params.get("plan");
  const initialUsers = Number(params.get("users"));
  if (
    Number.isInteger(initialUsers) &&
    initialUsers >= 1 &&
    initialUsers <= getPlan(planField.value).maxUsers
  )
    usersField.value = String(initialUsers);
  update();
})();
