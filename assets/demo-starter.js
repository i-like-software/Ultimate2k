(() => {
  const businesses = [
    { name: "Copper Kettle Repairs", sector: "Local service / fictional", brief: "A mobile appliance repair team needs a simple website, a business inbox and a verified listing so customers can find its service area.", workspace: "Domain email only", options: ["listing"] },
    { name: "Juniper Studio", sector: "Appointments / fictional", brief: "A small wellness studio needs a service menu, appointment booking and Google Workspace accounts for its team.", workspace: "Google Workspace", options: ["listing", "pages", "booking"] },
    { name: "Harbour Supply Co.", sector: "Wholesale / fictional", brief: "A growing wholesaler needs a product catalogue, enquiry routing, a showroom listing and Microsoft 365 accounts.", workspace: "Microsoft 365", options: ["listing", "pages", "booking", "profiles", "catalogue", "automation"] }
  ];
  const options = [
    { id: "listing", label: "Google Business Profile setup", price: 0, description: "Set up an eligible storefront or service area and guide the owner through verification." },
    { id: "pages", label: "Additional website pages", price: 3500, description: "Dedicated service, about and contact pages." },
    { id: "booking", label: "Booking and enquiry flow", price: 3000, description: "Connect a booking tool or build a structured enquiry form." },
    { id: "profiles", label: "Business profile setup", price: 1800, description: "Set up agreed business accounts and add consistent branding." },
    { id: "catalogue", label: "Product or service catalogue", price: 4500, description: "Build a browsable catalogue that routes enquiries to the team." },
    { id: "automation", label: "Launch workflow automation", price: 3200, description: "Route enquiries, notify staff and track enquiries in one place." }
  ];
  const business = document.querySelector("#starter-business");
  const workspace = document.querySelector("#starter-workspace");
  const optionList = document.querySelector("#starter-options");
  const currency = amount => "R" + amount.toLocaleString("en-ZA").replace(/\s/g, ",");

  businesses.forEach((item, index) => business.add(new Option(item.name, index)));
  options.forEach(item => {
    const row = document.createElement("li");
    row.innerHTML = `<label><input type="checkbox" value="${item.id}"><span>${item.label}<small>${item.description}</small></span><span class="lab-value">${item.price ? currency(item.price) : "Included"}</span></label>`;
    optionList.append(row);
  });

  function updateQuote() {
    const checked = new Set([...optionList.querySelectorAll("input:checked")].map(input => input.value));
    const total = 4000 + options.filter(item => checked.has(item.id)).reduce((sum, item) => sum + item.price, 0);
    document.querySelector("#starter-total").textContent = currency(total);
    document.querySelector("#starter-retainer").textContent = currency(total / 10);
    document.querySelector("#starter-workspace-note").textContent = workspace.value === "Domain email only"
      ? "Set up mailboxes on your domain and configure email delivery."
      : `Set up ${workspace.value} business accounts and connect your domain. Licences are billed separately.`;
  }

  function selectBusiness() {
    const selected = businesses[Number(business.value)];
    document.querySelector("#starter-sector").textContent = selected.sector;
    document.querySelector("#starter-name").textContent = selected.name;
    document.querySelector("#starter-brief").textContent = selected.brief;
    workspace.value = selected.workspace;
    optionList.querySelectorAll("input").forEach(input => { input.checked = selected.options.includes(input.value); });
    updateQuote();
  }

  business.addEventListener("change", selectBusiness);
  workspace.addEventListener("change", updateQuote);
  optionList.addEventListener("change", updateQuote);
  selectBusiness();
})();
