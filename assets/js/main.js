/* ============================================================
   MAHMOUD SHEHATA — Portfolio Shared JS
   main.js · v3
   ============================================================ */

(function () {
  "use strict";

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => revealObs.observe(el));
  } else {
    // Fallback: show all immediately
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ── Footer year ── */
  document.querySelectorAll(".footer-year, .js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
