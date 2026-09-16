const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
const keepScrolled = header?.classList.contains("is-scrolled");

const updateHeader = () => {
  if (!header || keepScrolled) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

if (header && !keepScrolled) {
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const about = document.getElementById("about");
if (about && "IntersectionObserver" in window) {
  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          about.classList.add("is-inview");
          aboutObserver.unobserve(about);
        }
      });
    },
    { threshold: 0.28 }
  );
  aboutObserver.observe(about);
} else if (about) {
  about.classList.add("is-inview");
}

const parallaxSections = document.querySelectorAll("[data-parallax]");
if (parallaxSections.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxSections.forEach((section) => {
      const bg = section.querySelector(".package-parallax");
      if (!bg) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = (progress - 0.5) * Math.min(140, rect.height * 0.28);
      bg.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

document.querySelectorAll("[data-prefill]").forEach((el) => {
  el.addEventListener("click", () => {
    const text = el.getAttribute("data-prefill");
    if (text) sessionStorage.setItem("tmlContactPrefill", text);
  });
});

const contactMessage = document.querySelector('#contact-form textarea[name="Message"]');
if (contactMessage) {
  const stored = sessionStorage.getItem("tmlContactPrefill");
  if (stored) {
    contactMessage.value = stored;
    sessionStorage.removeItem("tmlContactPrefill");
  }
}
