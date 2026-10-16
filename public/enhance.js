// Progressive enhancement for the marketing site (no framework, under 2 KB).
// 1. Reveal-on-scroll for [data-reveal]
// 2. Gentle pointer tilt for [data-tilt] inside [data-tilt-zone] (hero, mouse only)
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
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.setAttribute("data-shown", ""); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { if (!el.hasAttribute("data-shown")) io.observe(el); });
  } else {
    items.forEach(function (el) { el.setAttribute("data-shown", ""); });
  }
  // Safety net: a fast flick, the End key or a jump to an anchor can carry an item
  // past the viewport between observer samples. On each scroll frame, show anything
  // whose top has already passed the fold (all reads first, then all writes).
  var pending = items.filter(function (el) { return !el.hasAttribute("data-shown"); });
  var sweepQueued = false;
  var sweep = function () {
    sweepQueued = false;
    var limit = window.innerHeight * 0.92;
    var tops = pending.map(function (el) { return el.getBoundingClientRect().top; });
    var keep = [];
    pending.forEach(function (el, i) {
      if (el.hasAttribute("data-shown")) return;
      if (tops[i] < limit) { el.setAttribute("data-shown", ""); if (io) io.unobserve(el); }
      else keep.push(el);
    });
    pending = keep;
    if (!pending.length) { window.removeEventListener("scroll", onSweep); window.removeEventListener("resize", onSweep); }
  };
  var onSweep = function () { if (!sweepQueued) { sweepQueued = true; requestAnimationFrame(sweep); } };
  if (pending.length) {
    window.addEventListener("scroll", onSweep, { passive: true });
    window.addEventListener("resize", onSweep);
  }

  // 2 · Tilt: at most ±3° / ±2°, mouse pointers only, settles back on leave.
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
