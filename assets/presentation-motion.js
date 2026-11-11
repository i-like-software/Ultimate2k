(() => {
  "use strict";
  const body = document.body;
  if (!body) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionAllowed = () => !reduced.matches && !body.classList.contains("motion-paused");
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
