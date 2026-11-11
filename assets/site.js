(() => {
  "use strict";
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const groups = [...document.querySelectorAll(".nav-group")];
  const closeMenu = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  groups.forEach((group) =>
    group.addEventListener("toggle", () => {
      if (group.open)
        groups
          .filter((other) => other !== group)
          .forEach((other) => {
            other.open = false;
          });
    }),
  );
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-group"))
      groups.forEach((group) => {
        group.open = false;
      });
    if (!event.target.closest(".site-header")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const open = groups.find((group) => group.open);
      if (open) {
        open.open = false;
        open.querySelector("summary").focus();
      } else if (nav.classList.contains("open")) {
        closeMenu();
        menu.focus();
      }
    }
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.querySelector(".motion-toggle");
  let paused = reduced.matches;
  try {
    const preference = sessionStorage.getItem("u2k-motion");
    if (preference !== null) paused = preference === "paused";
  } catch (_) {
    /* Storage is optional. */
  }
  function setMotion(value) {
    paused = value;
    document.body.classList.toggle("motion-paused", value);
    motionButton.setAttribute("aria-pressed", String(value));
    motionButton.innerHTML = value
      ? 'Resume motion <span aria-hidden="true">▶</span>'
      : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
  }
  setMotion(paused);
  motionButton.addEventListener("click", () => {
    setMotion(!paused);
    try {
      sessionStorage.setItem("u2k-motion", paused ? "paused" : "playing");
    } catch (_) {}
  });
  reduced.addEventListener("change", (event) => setMotion(event.matches));
  if ("IntersectionObserver" in window) {
    document.body.classList.add("js-motion");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((other) =>
          other.setAttribute("aria-pressed", String(other === button)),
        );
      document.querySelectorAll("[data-category]").forEach((card) => {
        card.hidden =
          button.dataset.filter !== "all" &&
          button.dataset.filter !== card.dataset.category;
      });
    }),
  );
  document.querySelectorAll(".cast-colour").forEach(button => button.addEventListener("click", () => {button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));}));
  const form = document.querySelector("#brief-form");
  if (form) {
    const params = new URLSearchParams(location.search);
    const chosen = params.get("plan") || params.get("service");
    if (
      [...form.elements.service.options].some(
        (option) => option.value === chosen,
      )
    )
      form.elements.service.value = chosen;
    if (form.elements.users) {
      const users = Number(params.get("users"));
      if (Number.isInteger(users) && users >= 1 && users <= 500) {
        form.elements.users.value = String(users);
      }
    }
    if (form.elements.industry) {
      const industries = {
        salons: "Salon or beauty business",
        "estate-agencies": "Estate agency",
        practices: "Independent practice",
        "service-businesses": "Other service business",
      };
      const industry = industries[params.get("industry")];
      if (industry) form.elements.industry.value = industry;
    }
    const estimateBox = document.querySelector("#enquiry-estimate");
    const pricing = window.Ultimate2kPricing;
    function estimateSummary() {
      if (!pricing || !estimateBox) return "";
      const selected = form.elements.service.value;
      const plan = pricing.plans.find(item => item.id === selected);
      const users = Number(form.elements.users.value);
      if (!plan) { estimateBox.hidden = true; return ""; }
      estimateBox.hidden = false;
      if (!Number.isInteger(users) || users < 1 || users > plan.maxUsers) {
        const note = "This team size is outside " + plan.name + "’s standard range of 1–" + plan.maxUsers + " users. We’ll discuss a suitable plan or custom quote; no standard estimate is being confirmed.";
        estimateBox.textContent = note;
        return note;
      }
      const quote = pricing.estimate(plan.id, users);
      const note = plan.name + " for " + users + (users === 1 ? " user: " : " users: ") + pricing.currency(quote.monthly) + "/month + " + pricing.currency(quote.setup) + " one-off setup. Indicative service estimate; domain, mailbox licences, other supplier fees and agreed additions are separate. Final scope and costs are confirmed before work starts.";
      estimateBox.textContent = note;
      return note;
    }
    form.elements.service.addEventListener("change", estimateSummary);
    form.elements.users.addEventListener("input", estimateSummary);
    estimateSummary();
    let briefUrl;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const label = form.elements.service.selectedOptions[0].textContent;
      const estimate = estimateSummary();
      const brief = `ULTIMATE2K — BUSINESS IT ENQUIRY\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company") || "Not specified"}\nIndustry: ${data.get("industry") || "Not specified"}\nPeople: ${data.get("users") || "Not specified"}\nInterest: ${label}\n${estimate ? "Estimate: " + estimate + "\n" : ""}\nREQUIREMENTS\n${data.get("message")}\n\nPrepared locally. Send this enquiry to info@ultimate2k.co.za.\n`;
      form.querySelector(".brief-result")?.remove();
      if (briefUrl) URL.revokeObjectURL(briefUrl);
      briefUrl = URL.createObjectURL(
        new Blob([brief], { type: "text/plain;charset=utf-8" }),
      );
      const result = document.createElement("div");
      result.className = "brief-result";
      const outputLabel = document.createElement("label");
      outputLabel.textContent = "Your enquiry draft";
      const output = document.createElement("textarea");
      output.readOnly = true;
      output.rows = 10;
      output.value = brief;
      outputLabel.append(output);
      const download = document.createElement("a");
      download.className = "text-link";
      download.href = briefUrl;
      download.download = "ultimate2k-project-brief.txt";
      download.textContent = "Download your brief ↓";
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "copy-brief";
      copy.textContent = "Copy brief";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(brief);
          copy.textContent = "Copied";
        } catch (_) {
          output.focus();
          output.select();
          copy.textContent = "Selected — use your copy shortcut";
        }
      });
      const email = document.createElement("a");
      email.className = "button";
      email.textContent = "Open email app ↗";
      email.href = `mailto:info@ultimate2k.co.za?subject=Ultimate2k%20business%20IT%20enquiry&body=${encodeURIComponent(brief)}`;
      result.append(outputLabel, email, download, copy);
      form.append(result);
      form.querySelector(".form-status").textContent =
        "Your enquiry is ready. Open your email app to send it, or copy the draft into webmail addressed to info@ultimate2k.co.za.";
      output.focus();
    });
  }
})();
