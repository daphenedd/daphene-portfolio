/* ==========================================================================
   ABOUT
   Two interactive pieces, both horizontal: a life gallery that scrolls
   sideways, and a story timeline whose nodes act as tabs over one shared
   reading panel.

   Everything you are likely to edit is in the two places below:
     1. GALLERY       the photographs and their captions
     2. (story copy)  lives in about.html, inside the .st-panel elements

   The CV link is not here: it lives in js/main.js, because every page's
   navigation needs it.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. GALLERY

     Replace each entry with a real photograph. Keep width and height equal to
     the file's real pixel dimensions: the row sizes every image to one common
     height and lets the width follow, so the ratio has to be truthful or the
     layout will shift as images load.
     ---------------------------------------------------------------------- */

  var GALLERY = [
    { src: "assets/about/gallery/graduation.jpg", width: 1200, height: 1600,
      alt: "Wearing a laurel wreath and holding a certificate in front of a Politecnico di Milano graduation backdrop",
      caption: "Graduation day", location: "Politecnico di Milano" },
    { src: "assets/about/gallery/duomo.jpg", width: 1080, height: 1440,
      alt: "Graduation in duomo”",
      caption: "Graduation day in the piazza", location: "Duomo di Milano" },
    { src: "assets/about/gallery/desk.jpg", width: 1320, height: 746,
      alt: "Mid-yawn at a desk while writing in a notebook, a laptop open alongside and a shelf of magazines behind",
      caption: "Not every hour of it was glamorous", location: "" },
    { src: "assets/about/gallery/cohort.jpg", width: 1200, height: 1600,
      alt: "Three class photographs stacked together, each a large group gathered outside a university building",
      caption: "Erasmus Sustainable summer school", location: "" },
    { src: "assets/about/gallery/mountains-clouds.jpg", width: 1440, height: 1080,
      alt: "Standing on a grassy slope with one arm raised, jagged peaks and heavy cloud behind",
      caption: "Somewhere with better weather than forecast", location: "" },
    { src: "assets/about/gallery/bouldering.jpg", width: 1080, height: 1440,
      alt: "Mid-climb on an indoor bouldering wall, reaching for a green hold",
      caption: "Still bad at the overhangs", location: "" },
    { src: "assets/about/gallery/hike-group.jpg", width: 1600, height: 1067,
      alt: "Nine people in hiking gear lined up on grass, arms raised, mountains behind them",
      caption: "Everyone made it back down", location: "Leeco with haier people" },
    { src: "assets/about/gallery/summit-four.jpg", width: 1200, height: 1600,
      alt: "Four people seen from behind with backpacks, arms raised towards a mountain ridge under cloud",
      caption: "The part of the walk nobody complains about", location: "" },
    { src: "assets/about/gallery/underwater.jpg", width: 1440, height: 1080,
      alt: "Looking down through clear turquoise water at a diver below",
      caption: "Clearer than it looks from the surface", location: "" },
    { src: "assets/about/gallery/pasture-cow.jpg", width: 1035, height: 1600,
      alt: "Standing on green alpine pasture beside a black and white cow",
      caption: "She was there first", location: "" },
    { src: "assets/about/gallery/wetsuits.jpg", width: 1440, height: 1080,
      alt: "Six people in wetsuits and hoods crowded into frame, snow on the ground behind",
      caption: "Cold water, warmer company", location: "" },
    { src: "assets/about/gallery/snow-sunset.jpg", width: 1080, height: 1488,
      alt: "Standing on snow at sunset with an ice axe raised overhead, a band of cloud along the horizon",
      caption: "Up early enough for this", location: "" },
    { src: "assets/about/gallery/bird-above-clouds.jpg", width: 1440, height: 960,
      alt: "A bird in flight over a rocky ridge, a sea of cloud filling the valley beyond",
      caption: "Above the cloud line", location: "" },
    { src: "assets/about/gallery/winter-run.jpg", width: 1201, height: 1600,
      alt: "Three runners in matching pink race shirts with race numbers, tinsel and Santa hats",
      caption: "Marathon with cute christmas", location: "Lecco" }
  ];

  /* ====================================================================== */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------------
     LIFE GALLERY

     One horizontal row. Native overflow scrolling carries touch and trackpad
     for free; the extras here are pointer dragging, the arrows, the progress
     bar and the counter.
     ---------------------------------------------------------------------- */

  (function gallery() {
    var track = $("[data-gallery-track]");
    if (!track) return;

    var prev = $("[data-gallery-prev]");
    var next = $("[data-gallery-next]");
    var bar = $("[data-gallery-bar]");
    var counter = $("[data-gallery-counter]");
    var dialog = $("[data-gallery-dialog]");
    var dialogImg = $("[data-gallery-dialog-img]");
    var dialogCap = $("[data-gallery-dialog-caption]");

    /* --- build the row from the data above ---
       Each item carries only its aspect ratio. The shared row height lives in
       about.css as --row-h, so the two cannot drift apart and the height can
       change per breakpoint without touching this file. */

    GALLERY.forEach(function (photo, i) {
      var fig = document.createElement("figure");
      fig.className = "lg-item";
      fig.style.setProperty("--ar", photo.width + " / " + photo.height);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lg-shot";
      btn.setAttribute("aria-label", "Enlarge photograph " + (i + 1) + " of " + GALLERY.length);

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.width = photo.width;
      img.height = photo.height;
      img.loading = i < 3 ? "eager" : "lazy";
      img.decoding = "async";
      img.draggable = false;

      btn.appendChild(img);
      fig.appendChild(btn);

      if (photo.caption || photo.location) {
        var cap = document.createElement("figcaption");
        cap.className = "lg-caption";
        cap.textContent = photo.caption || "";
        if (photo.location) {
          var loc = document.createElement("span");
          loc.className = "lg-location";
          loc.textContent = photo.location;
          cap.appendChild(loc);
        }
        fig.appendChild(cap);
      }

      btn.addEventListener("click", function () {
        if (suppressClick) return;      /* the pointer was dragging, not clicking */
        open(i);
      });

      track.appendChild(fig);
    });

    var items = $$(".lg-item", track);

    /* --- progress bar and counter, both from the real scroll position --- */

    function span() { return track.scrollWidth - track.clientWidth; }

    /* Item positions are page-relative (offsetParent is the page, not the
       track), so everything converts through the first item's offset. */
    function originOf() { return items.length ? items[0].offsetLeft : 0; }
    function targetFor(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      return items[i].offsetLeft - originOf();
    }

    function currentIndex() {
      /* The leading photo: the first one still showing at the left edge.
         Measuring from the centre instead would report "2 of 8" before the
         reader has scrolled at all. */
      var edge = track.scrollLeft + originOf() + 8;
      for (var i = 0; i < items.length; i++) {
        if (items[i].offsetLeft + items[i].offsetWidth > edge) return i;
      }
      return items.length - 1;
    }

    function update() {
      var max = span();
      if (bar) {
        var frac = max > 0 ? track.scrollLeft / max : 0;
        bar.style.setProperty("--progress", Math.min(1, Math.max(0, frac)));
      }
      if (counter) {
        counter.textContent = (currentIndex() + 1) + " / " + GALLERY.length;
      }
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= max - 1;
    }

    /* The scroll event is not a reliable trigger here: with scroll snapping
       on, it can stay silent through a whole gesture. So position is polled
       on a frame loop that starts on any interaction and stops once the
       track has been still for a moment. Idle cost is nil. */
    var pumping = false;
    var lastX = -1;
    var still = 0;

    function pump() {
      if (track.scrollLeft !== lastX) {
        lastX = track.scrollLeft;
        still = 0;
        update();
      } else {
        still++;
      }
      if (still < 24) requestAnimationFrame(pump);
      else pumping = false;
    }

    function kick() {
      if (pumping) { still = 0; return; }
      pumping = true;
      still = 0;
      requestAnimationFrame(pump);
    }

    ["scroll", "wheel", "touchstart", "touchmove", "pointerdown", "keydown"]
      .forEach(function (type) {
        track.addEventListener(type, kick, { passive: true });
      });
    window.addEventListener("resize", update);

    /* --- arrows ---
       scrollBy({behavior:"smooth"}) is silently cancelled by scroll snapping,
       so the animation is driven here instead, with snapping suspended for
       its duration and restored at the end. */

    function glideTo(x) {
      var max = span();
      x = Math.max(0, Math.min(max, x));

      if (reduced) { track.scrollLeft = x; update(); return; }

      var from = track.scrollLeft;
      var delta = x - from;
      if (!delta) return;

      var t0 = performance.now();
      var dur = 420;
      track.style.scrollSnapType = "none";

      requestAnimationFrame(function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        track.scrollLeft = from + delta * eased;
        update();
        if (p < 1) requestAnimationFrame(step);
        else track.style.scrollSnapType = "";
      });
    }

    function nudge(dir) {
      /* Move a screenful, then land on an item edge so the row stays tidy. */
      var reach = track.scrollLeft + dir * Math.max(240, track.clientWidth * 0.8);
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < items.length; i++) {
        var d = Math.abs(targetFor(i) - reach);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      if (targetFor(best) === track.scrollLeft) best += dir;
      glideTo(targetFor(best));
    }

    if (prev) prev.addEventListener("click", function () { nudge(-1); });
    if (next) next.addEventListener("click", function () { nudge(1); });

    /* --- pointer dragging on desktop ---
       A drag past a few pixels sets suppressClick, so releasing over a photo
       does not also open it. The flag clears on the next frame, after the
       click event that the same gesture produces has already fired. */

    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    var moved = 0;
    var suppressClick = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;   /* let native touch scrolling run */
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    track.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        moved = Math.abs(dx);
        suppressClick = true;
        if (track.hasPointerCapture && !track.hasPointerCapture(e.pointerId)) {
          track.setPointerCapture(e.pointerId);
        }
      }
      track.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      requestAnimationFrame(function () { suppressClick = false; });
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    /* --- enlarged view --- */

    function open(i) {
      if (!dialog || !dialogImg) return;
      var photo = GALLERY[i];
      dialogImg.src = photo.src;
      dialogImg.alt = photo.alt;
      dialogImg.width = photo.width;
      dialogImg.height = photo.height;
      if (dialogCap) {
        dialogCap.textContent = [photo.caption, photo.location]
          .filter(Boolean).join(" · ");
      }
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    if (dialog) {
      /* Clicking the backdrop closes. The <img> sits inside a wrapper, so a
         click landing on the dialog itself is a click outside the picture. */
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog) dialog.close();
      });
      var closeBtn = $("[data-gallery-dialog-close]", dialog);
      if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    }

    update();
  })();

  /* ------------------------------------------------------------------------
     STORY TIMELINE

     Nodes are tabs, the reading panel below is the tabpanel. One chapter
     shows at a time; chapter 02 starts selected.
     ---------------------------------------------------------------------- */

  (function story() {
    var rail = $("[data-story-rail]");
    if (!rail) return;

    var tabs = $$("[data-story-tab]", rail);
    var panels = $$("[data-story-panel]");
    var prev = $("[data-story-prev]");
    var next = $("[data-story-next]");
    var position = $("[data-story-position]");
    if (!tabs.length || !panels.length) return;

    var current = tabs.findIndex(function (t) {
      return t.getAttribute("aria-selected") === "true";
    });
    if (current < 0) current = 1;   /* chapter 02 by default */

    /* Restart a one-shot animation: removing the class is not enough on its
       own, because the class goes back on in the same frame and the browser
       never sees a change. Reading offsetWidth forces the reflow between. */
    function replay(el, cls) {
      if (reduced || !el) return;
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    }

    function select(i, focusTab) {
      var moved = current !== i;
      current = Math.max(0, Math.min(tabs.length - 1, i));

      tabs.forEach(function (tab, n) {
        var on = n === current;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.setAttribute("tabindex", on ? "0" : "-1");
        tab.classList.toggle("is-selected", on);
        tab.classList.toggle("is-past", n < current);
        if (!on) tab.classList.remove("is-picking");
      });

      panels.forEach(function (panel, n) {
        panel.hidden = n !== current;
      });

      /* Only on a real change of chapter, so the first paint is still. */
      if (moved) {
        replay(tabs[current], "is-picking");
        replay(panels[current], "is-entering");
      }

      if (position) {
        position.textContent =
          String(current + 1).padStart(2, "0") + " / " +
          String(tabs.length).padStart(2, "0");
      }
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === tabs.length - 1;

      /* Keep the selected node visible when the rail is scrolled sideways,
         without dragging the whole page around. */
      var tab = tabs[current];
      var left = tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2;
      rail.scrollTo({ left: left, behavior: reduced ? "auto" : "smooth" });

      if (focusTab) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select(i + 1, true); }
        else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select(i - 1, true); }
        else if (k === "Home") { e.preventDefault(); select(0, true); }
        else if (k === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });

    if (prev) prev.addEventListener("click", function () { select(current - 1); });
    if (next) next.addEventListener("click", function () { select(current + 1); });

    select(current);
  })();
})();
