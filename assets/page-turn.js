(() => {
  "use strict";
  if (!/^https?:$/.test(location.protocol)) return;
  const reduced = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.body.classList.contains("motion-paused");
  const overlay = document.createElement("div");
  overlay.className = "page-turn";
  overlay.hidden = true;
  overlay.innerHTML = `<div class="turn-sheet" aria-hidden="true"><span>ULTIMATE2K / NEXT CHAPTER</span></div><div class="turn-wait"><svg viewBox="0 0 220 150" aria-hidden="true"><path class="turn-web" d="M112 63L196 18M112 63L196 28M112 63L196 38"/><path class="turn-corner" d="M196 8v100l-29-22 29-78"/><g class="turn-hero"><path d="M84 72l12 30-24 31m24-31 24 30M88 80l24-17m-24 17-20 15"/><ellipse cx="81" cy="55" rx="14" ry="17"/><path class="turn-eyes" d="m72 52 7 4-5 4zm18 0-7 4 5 4z"/><path class="turn-mask" d="M81 38v34m-13-17h27m-24-11 20 22m0-22L71 66"/></g><path class="turn-ground" d="M45 136h95"/></svg><p role="status" aria-live="polite">Turning the page…</p><div class="turn-controls"><button type="button" data-retry>Try again</button><button type="button" data-cancel>Stay here</button></div></div>`;
  document.body.append(overlay);
  let active = false,
    destination,
    controller,
    retryTimer,
    slowTimer,
    attempt = 0,
    previousFocus;
  const status = overlay.querySelector("[role=status]");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function clear() {
    clearTimeout(retryTimer);
    clearTimeout(slowTimer);
    controller?.abort();
  }
  function stop() {
    active = false;
    attempt++;
    clear();
    overlay.hidden = true;
    overlay.classList.remove("is-open", "is-waiting", "is-arriving");
    document.body.classList.remove("turn-locked");
    document.querySelector("main")?.removeAttribute("inert");
    previousFocus?.focus();
  }
  async function load() {
    if (!active) return;
    clearTimeout(retryTimer);
    controller?.abort();
    const token = ++attempt;
    controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(destination.href, {
        signal: controller.signal,
        credentials: "same-origin",
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("text/html")
      )
        throw new Error("Page unavailable");
      await response.text();
      if (!active || token !== attempt) return;
      clearTimeout(slowTimer);
      status.textContent = "Ready. Here we go!";
      overlay.classList.remove("is-waiting");
      await delay(reduced() ? 0 : 250);
      if (!active || token !== attempt) return;
      try {
        sessionStorage.setItem(
          "u2k-page-turn",
          JSON.stringify({ url: destination.href, at: Date.now() }),
        );
      } catch (_) {}
      location.assign(destination.href);
    } catch (_) {
      if (!active || token !== attempt) return;
      overlay.classList.add("is-waiting");
      status.textContent = navigator.onLine
        ? "This page is taking a little longer. Still trying…"
        : "No connection. Our web developer is working on it…";
      retryTimer = setTimeout(load, 3500);
    } finally {
      clearTimeout(timeout);
    }
  }
  overlay.querySelector("[data-retry]").addEventListener("click", load);
  overlay.querySelector("[data-cancel]").addEventListener("click", stop);
  window.addEventListener("online", () => {
    if (active) load();
  });
  document.addEventListener("keydown", (e) => {
    if (active && e.key === "Escape") stop();
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) stop();
  });
  document.addEventListener("click", async (e) => {
    const link = e.target.closest("a[href]");
    if (
      !link ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    )
      return;
    const url = new URL(link.href, location.href);
    if (
      url.origin !== location.origin ||
      (url.pathname === location.pathname && url.search === location.search) ||
      !/\/(?:index(?:\.html)?|services(?:\.html)?|about(?:\.html)?|team(?:\.html)?|contact(?:\.html)?)?$/.test(
        url.pathname,
      )
    )
      return;
    e.preventDefault();
    if (active) return;
    previousFocus = link;
    destination = url;
    active = true;
    overlay.hidden = false;
    overlay.classList.toggle("turn-still", reduced());
    document.body.classList.add("turn-locked");
    document.querySelector("main")?.setAttribute("inert", "");
    status.textContent = "Turning the page…";
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    slowTimer = setTimeout(() => {
      if (active) {
        overlay.classList.add("is-waiting");
        status.textContent = "One stubborn page. Give us a moment…";
        overlay.querySelector("[data-cancel]").focus();
      }
    }, 1200);
    await delay(reduced() ? 0 : 480);
    if (active) load();
  });
  try {
    const entry = JSON.parse(sessionStorage.getItem("u2k-page-turn"));
    sessionStorage.removeItem("u2k-page-turn");
    const canonical = (value) => {
      const u = new URL(value);
      u.pathname = u.pathname.replace(/\.html$/, "").replace(/\/index$/, "/");
      return u.href;
    };
    if (
      entry &&
      canonical(entry.url) === canonical(location.href) &&
      Date.now() - entry.at < 20000
    ) {
      overlay.hidden = false;
      overlay.classList.add("is-arriving");
      if (reduced()) overlay.classList.add("turn-still");
      const reveal = () => {
        setTimeout(() => {
          overlay.classList.add("arrival-done");
          setTimeout(
            () => {
              overlay.hidden = true;
              overlay.classList.remove("is-arriving", "arrival-done");
            },
            reduced() ? 0 : 700,
          );
        }, 50);
      };
      if (document.readyState === "complete") reveal();
      else window.addEventListener("load", reveal, { once: true });
    }
  } catch (_) {}
})();
