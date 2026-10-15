// Progressive enhancement for the marketing site (no framework, ~2 KB).
// 1. Reveal-on-scroll for [data-reveal]
// 2. Scroll progress (--p, 0 → 1) for [data-scroll-progress] sections (signature B)
// 3. Gentle pointer tilt for [data-tilt] inside [data-tilt-zone] (hero, mouse only)
// Without this script the page is complete and fully visible; it only adds motion.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 1 · Reveal. Mark what is already on screen as shown *before* enabling the hidden
  // state, so nothing above the fold flickers.
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var vh = window.innerHeight;
  items.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) el.setAttribute("data-shown", "");
  });
  root.classList.add("enhanced");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.setAttribute("data-shown", ""); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { if (!el.hasAttribute("data-shown")) io.observe(el); });
  } else {
    items.forEach(function (el) { el.setAttribute("data-shown", ""); });
  }

  // 2 · Scroll progress: --p goes 0 → 1 while a tall section scrolls past its
  // sticky stage. Reversible by construction; one rAF-throttled passive listener.
  var tracked = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-progress]"));
  if (tracked.length) {
    var queued = false;
    var update = function () {
      queued = false;
      var h = window.innerHeight;
      tracked.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -h || r.top > 2 * h) return; // far off screen: nothing to do
        var span = r.height - h;
        var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
        el.style.setProperty("--p", p.toFixed(4));
        var stage = el.firstElementChild;
        if (stage) stage.setAttribute("data-after", p > 0.5 ? "true" : "false");
      });
    };
    var onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  // 3 · Tilt: at most ±3° / ±2°, mouse pointers only, settles back on leave.
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  Array.prototype.forEach.call(document.querySelectorAll("[data-tilt-zone]"), function (zone) {
    var target = zone.querySelector("[data-tilt]");
    if (!target) return;
    var frame = 0, rx = 0, ry = 0;
    zone.addEventListener("pointermove", function (ev) {
      if (ev.pointerType !== "mouse" || !fine.matches || reduce.matches) return;
      var r = zone.getBoundingClientRect();
      ry = ((ev.clientX - r.left) / r.width - 0.5) * 6;
      rx = -((ev.clientY - r.top) / r.height - 0.5) * 4;
      if (!frame) frame = requestAnimationFrame(function () {
        frame = 0;
        target.style.transform = "perspective(1600px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
    });
    zone.addEventListener("pointerleave", function () { target.style.transform = ""; });
  });
})();
