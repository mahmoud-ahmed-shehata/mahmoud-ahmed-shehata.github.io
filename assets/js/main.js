/* ============================================================
   MAHMOUD SHEHATA — Portfolio Shared JS
   main.js · v3
   ============================================================ */

(function () {
  "use strict";

  /* ── Nav scroll state ── */
  const siteNav =
    document.querySelector(".site-nav") ||
    document.querySelector(".site-header") ||
    document.querySelector("header");
  if (siteNav) {
    function throttle(fn, delay) {
      let lastCall = 0;
      let timeout = null;
      return function (...args) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);
        if (remaining <= 0) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          lastCall = now;
          fn.apply(this, args);
        } else if (!timeout) {
          timeout = setTimeout(() => {
            lastCall = Date.now();
            timeout = null;
            fn.apply(this, args);
          }, remaining);
        }
      };
    }

    const onScroll = () => {
      siteNav.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", throttle(onScroll, 100), {
      passive: true,
    });
    onScroll();
  }

  /* ── Active nav link (single-page) ── */
  const navLinks = document.querySelectorAll(
    ".nav-links a[data-section], .nav-drawer a[data-section]",
  );
  if (navLinks.length) {
    const sections = [];
    navLinks.forEach((link) => {
      const id = link.dataset.section;
      if (id) {
        const el = document.getElementById(id);
        if (el)
          sections.push({
            el,
            links: document.querySelectorAll(`[data-section="${id}"]`),
          });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sections.forEach((s) =>
              s.links.forEach((l) => l.classList.remove("active")),
            );
            const match = sections.find((s) => s.el === entry.target);
            if (match) match.links.forEach((l) => l.classList.add("active"));
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s.el));
  }

  /* ── Hamburger / Drawer ── */
  const hamburger = document.querySelector(".nav-hamburger");
  const drawer = document.querySelector(".nav-drawer");
  const overlay = document.querySelector(".nav-overlay");

  function openDrawer() {
    hamburger?.classList.add("open");
    hamburger?.setAttribute("aria-expanded", "true");
    drawer?.classList.add("open");
    drawer?.setAttribute("aria-hidden", "false");
    overlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    hamburger?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    drawer?.classList.remove("open");
    drawer?.setAttribute("aria-hidden", "true");
    overlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  hamburger?.addEventListener("click", () => {
    hamburger.classList.contains("open") ? closeDrawer() : openDrawer();
  });

  overlay?.addEventListener("click", closeDrawer);

  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

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

  /* ── WhatsApp Float ── */
  const waFloat = document.querySelector(".wa-float");
  if (waFloat) {
    const waBtn = waFloat.querySelector(".wa-btn") || waFloat;
    let collapseTimer = null;

    // Mobile: tap expands for 3.5s then collapses
    waFloat.addEventListener("click", (e) => {
      const isMobile = window.matchMedia("(hover: none)").matches;
      if (isMobile) {
        waFloat.classList.add("expanded");
        clearTimeout(collapseTimer);
        collapseTimer = setTimeout(() => {
          waFloat.classList.remove("expanded");
        }, 3500);
      }
      // Desktop hover is handled by CSS :hover
    });

    // Desktop: clean up expanded class on mouse leave (CSS handles hover)
    waFloat.addEventListener("mouseleave", () => {
      clearTimeout(collapseTimer);
      waFloat.classList.remove("expanded");
    });
  }

  /* ── Footer year ── */
  document.querySelectorAll(".footer-year, .js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ── Certificate links: verify availability, fallback to contact ── */
  try {
    const certLinks = document.querySelectorAll(".btn-cert");
    certLinks.forEach((link) => {
      const pdf = link.getAttribute("href");
      if (!pdf || pdf === "#") return;
      link.addEventListener("click", async function (e) {
        e.preventDefault();
        try {
          const res = await fetch(pdf, { method: "HEAD" });
          if (res && res.ok) {
            // file exists — navigate to it so browser can download/open
            window.location.href = pdf;
            return;
          }
        } catch (err) {
          // network or not found
        }
        const titleEl =
          this.closest(".cert-card")?.querySelector(".cert-title");
        const certName = titleEl ? titleEl.textContent.trim() : "";
        if (
          confirm(
            certName +
              " is not available on the server. Contact via email to request a copy?",
          )
        ) {
          window.location.href =
            "mailto:m@mahmoudshehata.com?subject=" +
            encodeURIComponent("Request: " + certName);
        }
      });
    });
  } catch (e) {
    // ignore
  }
})();
