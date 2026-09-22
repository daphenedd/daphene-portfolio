/* Progressive enhancement only. Every page is fully readable with JS off —
   the reveal styles are scoped to .js, which is set by an inline script
   in <head>. */

(function () {
  "use strict";

  var reduced = window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     1. Header gets a surface once the page scrolls past the top.
     --------------------------------------------------------------- */

  var header = document.querySelector(".site-header");

  function setHeaderState() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  /* ---------------------------------------------------------------
     2. Scroll reveal.

        [data-reveal]       fades and rises into place
        [data-reveal-image] the picture settles from 1.06 back to 1

        A rAF-throttled sweep rather than IntersectionObserver: an observer
        can miss an element entirely when the page jumps (flick-scroll,
        End key, an in-page anchor), leaving it stuck invisible. Testing
        for "top edge is above the trigger line" also catches everything
        the jump skipped past, because their top is simply negative.
     --------------------------------------------------------------- */

  var pending = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal], [data-reveal-image]")
  );

  var ticking = false;

  function sweep() {
    ticking = false;

    /* Trigger just before the element's top edge reaches the bottom of the
       viewport, so the motion resolves as it settles into reading position. */
    var line = window.innerHeight * 0.94;

    for (var i = pending.length - 1; i >= 0; i--) {
      if (pending[i].getBoundingClientRect().top < line) {
        pending[i].classList.add("is-visible");
        pending.splice(i, 1);
      }
    }

    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  function onScroll() {
    setHeaderState();

    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sweep);
  }

  if (reduced) {
    pending.forEach(function (el) { el.classList.add("is-visible"); });
    pending = [];
  }

  setHeaderState();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* One frame's delay so the hero animates in rather than starting revealed. */
  if (pending.length) requestAnimationFrame(sweep);

  /* ---------------------------------------------------------------
     3. Mark the current page in the nav. A project page keeps "Work" lit.
     --------------------------------------------------------------- */

  var here = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach(function (link) {
    var target = link.getAttribute("href").split("/").pop().split("#")[0];
    var onHome = here === "index.html" || here === "";
    var isWork = link.dataset.nav === "work";

    var active = isWork ? !onHome && here !== "about.html"
                        : target === here;

    if (active) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------------------------------------------------------------
     4. Footer year.
     --------------------------------------------------------------- */

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
