(() => {
  "use strict";
  const body = document.body;
  if (!body) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionAllowed = () => !reduced.matches && !body.classList.contains("motion-paused");
  const controlSelector = ".button, .price-button, .text-link, .nav-contact, .landing-contact";
  function enhanceControl(control) {
    if (control.dataset.presentationControl) return;
    control.dataset.presentationControl = "true";
    const isButton = control.matches(".button, .price-button");
    control.classList.add(isButton ? "presentation-action" : "presentation-link");
    let arrow = control.querySelector(':scope > span[aria-hidden="true"]');
    if (!arrow) {
      // Keep the accessible label as ordinary text, with one decorative arrow.
      const tail = control.lastChild;
      const match = tail && tail.nodeType === Node.TEXT_NODE && tail.textContent.match(/([↗→↓])\s*$/);
      if (match) {
        tail.textContent = tail.textContent.replace(/([↗→↓])\s*$/, "").trimEnd();
        arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = match[1];
        control.append(arrow);
      } else if (isButton) {
        arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        control.append(arrow);
      }
    }
    if (!arrow || !/^[↗→↓]$/.test(arrow.textContent.trim())) return;
    const direction = arrow.textContent.trim();
    arrow.classList.add("presentation-arrow");
    if (direction === "→") {
      arrow.style.setProperty("--arrow-out-y", "0%");
      arrow.style.setProperty("--arrow-in-y", "0%");
    } else if (direction === "↓") {
      arrow.style.setProperty("--arrow-out-x", "0%");
      arrow.style.setProperty("--arrow-out-y", "125%");
      arrow.style.setProperty("--arrow-in-x", "0%");
      arrow.style.setProperty("--arrow-in-y", "-125%");
    }
    const glyph = document.createElement("span");
    glyph.className = "presentation-arrow-glyph";
    glyph.textContent = direction;
    arrow.replaceChildren(glyph);
  }
  function enhanceWithin(root) {
    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
    if (root.matches && root.matches(controlSelector)) enhanceControl(root);
    root.querySelectorAll(controlSelector).forEach(enhanceControl);
    if (root.matches && root.matches("a.ux-card")) root.classList.add("presentation-card");
    root.querySelectorAll("a.ux-card").forEach(card => card.classList.add("presentation-card"));
  }
  enhanceWithin(document);
  // Estimator cards and enquiry actions can be generated after initial load.
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(enhanceWithin)))
    .observe(body, { childList: true, subtree: true });
  const header = document.querySelector(".site-header");
  // IntersectionObserver changes header treatment only at this boundary;
  // there is no continuous scroll-position handler or layout polling.
  if (header) {
    body.classList.toggle("presentation-scrolled", window.scrollY > 80);
    if ("IntersectionObserver" in window) {
      const boundary = document.createElement("span");
      boundary.setAttribute("aria-hidden", "true");
      boundary.style.cssText = "position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none";
      body.prepend(boundary);
      const headerObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry) body.classList.toggle("presentation-scrolled", !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      headerObserver.observe(boundary);
    }
  }
  // Content is fully visible before enhancement. We animate only on entry,
  // never conceal entire sections, and leave the default visible if IO fails.
  if (!("IntersectionObserver" in window)) return;
  const selectors = [
    "main .ux-section-intro > h2", "main .section-head h2",
    "main .cast-intro h2", "main .ux-service-row > div > h2",
    "main .ux-card", "main .cast-card", "main .price-setup",
    "main .ux-process > li", "main .pricing-section > h2"
  ].join(",");
  const elements = [...document.querySelectorAll(selectors)];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      entry.target.dataset.presentationSeen = "true";
      if (!motionAllowed()) return;
      const target = entry.target;
      const siblings = target.parentElement ? [...target.parentElement.children] : [];
      const index = Math.max(0, siblings.indexOf(target));
      target.style.setProperty("--presentation-delay", `${Math.min(index, 3) * 65}ms`);
      target.classList.add("presentation-enter");
      target.addEventListener("animationend", () => target.classList.remove("presentation-enter"), { once: true });
    });
  }, { threshold: .08, rootMargin: "0px 0px -16px 0px" });
  elements.forEach(element => observer.observe(element));
  const clearEntrances = () => {
    if (!motionAllowed()) document.querySelectorAll(".presentation-enter").forEach(element => element.classList.remove("presentation-enter"));
  };
  reduced.addEventListener("change", clearEntrances);
  new MutationObserver(clearEntrances).observe(body, { attributes: true, attributeFilter: ["class"] });
})();
