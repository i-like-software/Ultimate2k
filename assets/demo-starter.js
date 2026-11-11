(() => {
  "use strict";
  const pricing = window.Ultimate2kPricing;
  if (!pricing) return;

  const examples = [
    {
      name: "Juniper Beauty Studio",
      sector: "Salon / fictional example",
      plan: "micro",
      users: 1,
      brief:
        "A solo salon owner needs a one-page service menu and appointment-request form. They maintain their own tools and want help if the hosted website has a fault.",
      scope:
        "Micro Launch supplies the template page, up to 5 sections and 10 listed services, a request form, domain connection, one revision and a 30-minute handover. The owner supplies content.",
    },
    {
      name: "Cedar & Key Estates",
      sector: "Estate agency / fictional example",
      plan: "essential",
      users: 4,
      brief:
        "Four agents need a small brochure website, business workspace administration and remote help with their primary computers.",
      scope:
        "Essential Launch supplies up to 5 template pages, one enquiry form, basic metadata/indexing setup and four new workspace accounts. Property-feed integrations and old email migration get a separate scope.",
    },
    {
      name: "Northfield Independent Practice",
      sector: "Independent practice / fictional example",
      plan: "care",
      users: 12,
      brief:
        "Twelve staff need business IT administration, device patch-status reviews and a public appointment-request website.",
      scope:
        "Care Onboarding covers the fixed launch scope plus the baseline access review, inventory and join/leave checklist. Two additional supported user/device pairs add R500. Forms collect public appointment requests without clinical patient details.",
    },
    {
      name: "Signal House Advisory",
      sector: "Service business / fictional example",
      plan: "operations",
      users: 18,
      brief:
        "An eighteen-person advisory team needs more support time and scheduled updates to an agreed enquiry-routing workflow.",
      scope:
        "Operations Onboarding includes up to 8 template pages, one existing supported workflow with up to 5 steps and a 90-minute handover. Eight additional supported user/device pairs add R2,000.",
    },
  ];
  const business = document.querySelector("#starter-business");
  const planField = document.querySelector("#starter-plan");
  const usersField = document.querySelector("#starter-users");
  const enquiry = document.querySelector("#starter-enquiry");

  examples.forEach((example, index) =>
    business.add(new Option(example.name, String(index))),
  );
  pricing.plans.forEach((plan) =>
    planField.add(
      new Option(
        plan.name + " · " + pricing.currency(plan.fee) + "/user/month",
        plan.id,
      ),
    ),
  );

  function updateEstimate() {
    const plan = pricing.getPlan(planField.value);
    usersField.max = String(plan.maxUsers);
    const users = Number(usersField.value);
    const valid =
      usersField.value !== "" &&
      Number.isInteger(users) &&
      users >= 1 &&
      users <= plan.maxUsers;
    usersField.setAttribute("aria-invalid", String(!valid));
    document.querySelector("#starter-user-help").textContent =
      plan.id === "micro"
        ? "Micro supports 1–5 named users in one business/site."
        : "Managed plans support 1–50 named users on the standard cloud stack.";
    document.querySelector("#starter-error").textContent = valid
      ? ""
      : "Enter a whole number from 1 to " + plan.maxUsers + ".";
    enquiry.setAttribute("aria-disabled", String(!valid));
    document.querySelector("#starter-plan-scope").textContent = plan.setupScope;
    document.querySelector("#starter-plan-response").textContent =
      plan.allowance
        ? plan.allowance +
          " assisted support minutes/user/month, pooled across the business with no rollover. First response target " +
          plan.response +
          " during staffed hours."
        : "Hosted platform fault help and self-service guides. First response target 2 business days. Personal device/app support, website content edits and mailbox hosting are separately priced.";
    if (!valid) {
      document.querySelector("#starter-total").textContent = "—";
      document.querySelector("#starter-monthly").textContent = "—";
      enquiry.removeAttribute("href");
      return;
    }
    const quote = pricing.estimate(plan.id, users);
    document.querySelector("#starter-total").textContent = pricing.currency(
      quote.setup,
    );
    document.querySelector("#starter-monthly").textContent = pricing.currency(
      quote.monthly,
    );
    document.querySelector("#starter-setup-detail").textContent =
      quote.additionalPairs
        ? pricing.currency(plan.setup) +
          " fixed setup + " +
          quote.additionalPairs +
          " additional supported user/device pairs at R250 each."
        : plan.setupName + " within the stated fixed scope.";
    enquiry.href = "contact.html?plan=" + plan.id + "&users=" + users;
  }

  function selectExample() {
    const example = examples[Number(business.value)];
    document.querySelector("#starter-sector").textContent = example.sector;
    document.querySelector("#starter-name").textContent = example.name;
    document.querySelector("#starter-brief").textContent = example.brief;
    document.querySelector("#starter-example-scope").textContent =
      example.scope;
    planField.value = example.plan;
    usersField.value = String(example.users);
    updateEstimate();
  }

  business.addEventListener("change", selectExample);
  usersField.addEventListener("input", updateEstimate);
  planField.addEventListener("change", () => {
    const maxUsers = pricing.getPlan(planField.value).maxUsers;
    if (Number(usersField.value) > maxUsers)
      usersField.value = String(maxUsers);
    updateEstimate();
  });
  selectExample();
})();
