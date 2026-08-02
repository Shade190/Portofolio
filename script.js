document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Page loader ---------- */
  document.body.classList.add("loading");
  const loader = document.createElement("div");
  loader.id = "pageLoader";
  loader.innerHTML = `
    <div class="loader-mark">Porto<span class="loader-spark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5c.5 4.8 2.2 7.5 6.5 8.5-4.3 1-6 3.7-6.5 8.5-.5-4.8-2.2-7.5-6.5-8.5 4.3-1 6-3.7 6.5-8.5z"/></svg></span>folio</div>
    <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>
  `;
  document.body.prepend(loader);

  function hideLoader() {
    document.body.classList.remove("loading");
    loader.classList.add("hidden");
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) heroContent.classList.add("hero-loaded");
    setTimeout(() => loader.remove(), 900);
  }
  window.addEventListener("load", () => {
    setTimeout(hideLoader, prefersReducedMotion ? 0 : 1400);
  });
  setTimeout(hideLoader, 2600);

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  document.body.appendChild(progressBar);
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  const savedTheme = localStorage.getItem("theme");

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
  applyTheme(savedTheme ? savedTheme === "dark" : true);

  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ---------- Header scroll state + active link ---------- */
  const header = document.querySelector("header");
  const backToTop = document.querySelector(".back-to-top");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("show", y > 500);

    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (y >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector(".hamburger");
  const navLinksWrap = document.querySelector(".nav-links");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinksWrap.classList.toggle("active");
  });
  navLinksWrap.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinksWrap.classList.remove("active");
    })
  );

  /* ---------- Smooth scroll for data-scroll buttons + anchors ---------- */
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* ---------- Hero title reveal ---------- */
  requestAnimationFrame(() => {
    document.querySelector(".hero-title").classList.add("ready");
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal, .section-header");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Certificate cards reveal with gentle stagger */
  const certObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          certObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".certificate-grid").forEach((grid) => {
    [...grid.children].forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
      certObserver.observe(card);
    });
  });

  /* Project cards reveal with gentle stagger */
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          projectObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".project-card").forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
    projectObserver.observe(card);
  });

  /* ---------- Staggered groups (about tags, contact details) ---------- */
  document.querySelectorAll(".stagger-group").forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".stagger-group").forEach((el) => staggerObserver.observe(el));

  /* Stagger skill items */
  document.querySelectorAll(".skills-list").forEach((list) => {
    [...list.children].forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  /* ---------- Skill progress bars + counting percentage ---------- */
  const skillItems = document.querySelectorAll(".skill-item");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector(".progress-fill");
          const pctLabel = entry.target.querySelector(".skill-pct");
          const width = parseInt(fill.dataset.width, 10);
          entry.target.classList.add("visible");
          requestAnimationFrame(() => {
            fill.style.width = width + "%";
          });
          if (pctLabel && !prefersReducedMotion) {
            const duration = 1100;
            const start = performance.now();
            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              pctLabel.textContent = Math.round(eased * width) + "%";
              if (p < 1) requestAnimationFrame(tick);
              else pctLabel.textContent = width + "%";
            }
            requestAnimationFrame(tick);
          }
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillItems.forEach((item) => skillObserver.observe(item));

  /* Skills section header accent */
  const skillsSection = document.querySelector(".skills");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillsSection.classList.add("visible");
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillsObserver.observe(skillsSection);
  }

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1200;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((el) => statObserver.observe(el));

  /* ---------- Project filter (quiet crossfade) ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      projectCards.forEach((card) => card.classList.add("morph-out"));

      setTimeout(() => {
        projectCards.forEach((card) => {
          const match = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("hidden", !match);
          card.classList.remove("morph-out");
          if (match) {
            card.classList.remove("morph-in");
            void card.offsetWidth;
            card.classList.add("morph-in");
          }
        });
      }, 260);
    });
  });

  /* ---------- Image modal (certificates + projects) ---------- */
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalClose = document.querySelector(".modal-close");

  document.querySelectorAll(".clickable-image").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.preventDefault();
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Contact form (demo, no backend) — quiet success state ---------- */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-primary");
    const original = btn.innerHTML;
    btn.innerHTML = '<svg class="check-draw" viewBox="0 0 24 24" width="18" height="18"><path d="M4 12.5l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Message Sent!';
    btn.classList.add("success");
    form.reset();
    form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("filled", "focused"));
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove("success");
    }, 2400);
  });

  /* ---------- Floating labels (contact form) ---------- */
  document.querySelectorAll(".form-group").forEach((group) => {
    const field = group.querySelector("input, textarea");
    if (!field) return;
    function syncFilled() {
      group.classList.toggle("filled", field.value.trim().length > 0);
    }
    field.addEventListener("focus", () => group.classList.add("focused"));
    field.addEventListener("blur", () => {
      group.classList.remove("focused");
      syncFilled();
    });
    field.addEventListener("input", syncFilled);
    syncFilled();
  });

  /* ---------- Cursor spotlight sheen (certificates + projects) ---------- */
  if (canHover) {
    function attachSpotlight(el) {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      });
    }
    document.querySelectorAll(".certificate-card, .project-card").forEach(attachSpotlight);
  }

  /* ---------- Subtle hero parallax on scroll ---------- */
  if (!prefersReducedMotion) {
    const heroEl = document.querySelector(".hero");
    const heroContentEl = document.querySelector(".hero-content");
    function updateHeroParallax() {
      if (!heroEl || !heroContentEl) return;
      const rect = heroEl.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      if (progress > 0) {
        heroContentEl.style.transform = `translateY(${progress * 50}px)`;
        heroContentEl.style.opacity = String(1 - progress * 0.9);
      } else {
        heroContentEl.style.transform = "";
        heroContentEl.style.opacity = "";
      }
    }
    window.addEventListener("scroll", updateHeroParallax, { passive: true });
    updateHeroParallax();
  }

  /* ---------- Ambient floating particles in hero (subtle) ---------- */
  const hero = document.querySelector(".hero");
  if (!prefersReducedMotion && hero) {
    const particleWrap = document.createElement("div");
    particleWrap.className = "particles";
    hero.appendChild(particleWrap);
    const count = window.innerWidth < 768 ? 6 : 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 2.5 + 1.5;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `-10px`;
      p.style.animationDuration = `${Math.random() * 10 + 14}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = Math.random() * 0.4 + 0.15;
      particleWrap.appendChild(p);
    }
  }

  /* ---------- Subtle parallax on hero orbs (mouse, desktop only) ---------- */
  if (!prefersReducedMotion && hero && canHover) {
    hero.addEventListener("mousemove", (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const relX = (e.clientX / w - 0.5) * 2;
      const relY = (e.clientY / h - 0.5) * 2;
      document.querySelectorAll(".orb").forEach((orb, i) => {
        const strength = (i + 1) * 4;
        orb.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      });
    });
  }

  /* ---------- Marquee ticker content ---------- */
  const tickerTrack = document.getElementById("tickerTrack");
  if (tickerTrack) {
    const items = [
      "HTML5", "CSS3", "JavaScript", "PHP", "Python", "UI/UX Design",
      "Cybersecurity", "Web Development", "Figma", "Git",
    ];
    const buildSet = () =>
      items
        .map((t) => `<span class="ticker-item">${t}<i class="fas fa-circle"></i></span>`)
        .join("");
    tickerTrack.innerHTML = buildSet() + buildSet();
  }

  /* ---------- Scrollspy dots nav (desktop) ---------- */
  (function buildScrollspy() {
    const spySections = [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ];
    const wrap = document.createElement("div");
    wrap.className = "scrollspy";
    spySections.forEach((s) => {
      const dot = document.createElement("div");
      dot.className = "scrollspy-dot";
      dot.dataset.target = s.id;
      dot.dataset.label = s.label;
      dot.addEventListener("click", () => {
        const target = document.getElementById(s.id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
      wrap.appendChild(dot);
    });
    document.body.appendChild(wrap);

    const dots = wrap.querySelectorAll(".scrollspy-dot");
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dots.forEach((d) =>
              d.classList.toggle("active", d.dataset.target === entry.target.id)
            );
          }
        });
      },
      { threshold: 0.5 }
    );
    spySections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) spyObserver.observe(el);
    });
  })();
});