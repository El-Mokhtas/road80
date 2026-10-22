/* ROAD 80 | شارع 80 — header + mobile drawer */
(function () {
  "use strict";

  var DESKTOP_MQ = window.matchMedia("(min-width: 1181px)");

  var body = document.body;
  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("menuToggle");
  var drawer = document.getElementById("mobileDrawer");
  var backdrop = document.getElementById("drawerBackdrop");
  var closeBtn = document.getElementById("drawerClose");
  var lastFocused = null;
  var hideTimer = null;

  /* ---------- Sticky header shadow ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active link ---------- */
  function normalize(path) {
    return path.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
  }
  var current = normalize(window.location.pathname);
  document.querySelectorAll(".nav-link, .drawer-link").forEach(function (link) {
    var target = normalize(new URL(link.getAttribute("href"), window.location.href).pathname);
    if (target === current) link.setAttribute("aria-current", "page");
  });

  /* ---------- Drawer ---------- */
  function focusables() {
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function openDrawer() {
    clearTimeout(hideTimer);
    lastFocused = document.activeElement;
    drawer.hidden = false;
    backdrop.hidden = false;
    // Force reflow so the slide-in transition runs after un-hiding.
    void drawer.offsetWidth;
    body.classList.add("drawer-open", "is-locked");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "إغلاق القائمة");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer(restoreFocus) {
    if (!body.classList.contains("drawer-open")) return;
    body.classList.remove("drawer-open", "is-locked");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح القائمة");
    document.removeEventListener("keydown", onKeydown);
    hideTimer = setTimeout(function () {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 320);
    if (restoreFocus !== false && lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeDrawer();
      return;
    }
    if (e.key !== "Tab") return;
    var items = focusables();
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener("click", function () {
    body.classList.contains("drawer-open") ? closeDrawer() : openDrawer();
  });
  closeBtn.addEventListener("click", function () { closeDrawer(); });
  backdrop.addEventListener("click", function () { closeDrawer(); });
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeDrawer(false);
  });
  DESKTOP_MQ.addEventListener("change", function (e) {
    if (e.matches) closeDrawer(false);
  });

  /* ---------- Analytics hooks (blueprint §10) ---------- */
  // Pushes to GTM's dataLayer once analytics is installed; no-op until then.
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-event]");
    if (!el || !window.dataLayer) return;
    window.dataLayer.push({ event: el.getAttribute("data-event"), link_url: el.href || "" });
  });
})();
