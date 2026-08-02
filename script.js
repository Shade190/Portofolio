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

  /* ---------- Nebula + aurora + starfield canvas (hero background) ---------- */
  (function initHeroScene() {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const heroEl = document.querySelector(".hero");
    const supportsCtxFilter = "filter" in ctx;
    let stars = [];
    let clusters = [];
    let nebulaBlobs = [];
    let auroraBands = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function buildField() {
      w = heroEl.offsetWidth;
      h = heroEl.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Nebula — large soft drifting color blobs, blurred like clouds of gas */
      nebulaBlobs = [
        { cx: 0.18, cy: 0.28, r: 0.42, color: "99,102,241", alpha: 0.55, sx: 0.05, sy: 0.04, speed: 0.00018, phase: 0 },
        { cx: 0.82, cy: 0.18, r: 0.34, color: "56,189,248", alpha: 0.4, sx: 0.04, sy: 0.05, speed: 0.00022, phase: 2 },
        { cx: 0.55, cy: 0.55, r: 0.4, color: "129,140,248", alpha: 0.32, sx: 0.06, sy: 0.03, speed: 0.00015, phase: 4 },
        { cx: 0.88, cy: 0.75, r: 0.3, color: "236,72,153", alpha: 0.22, sx: 0.03, sy: 0.05, speed: 0.0002, phase: 1 },
        { cx: 0.22, cy: 0.85, r: 0.32, color: "217,119,6", alpha: 0.14, sx: 0.04, sy: 0.03, speed: 0.00019, phase: 3 },
      ];

      /* Aurora — flowing wavy ribbons sweeping across the hero */
      auroraBands = [
        { baseY: 0.22, amp: 0.07, freq: 1.6, speed: 0.00028, phase: 0.4, thickness: 0.16, colorTop: "129,140,248", colorMid: "103,232,249", alpha: 0.32 },
        { baseY: 0.42, amp: 0.09, freq: 1.2, speed: 0.00021, phase: 2.1, thickness: 0.2, colorTop: "165,180,252", colorMid: "236,72,153", alpha: 0.22 },
        { baseY: 0.66, amp: 0.06, freq: 1.9, speed: 0.00025, phase: 4.0, thickness: 0.14, colorTop: "56,189,248", colorMid: "129,140,248", alpha: 0.2 },
      ];

      /* Scattered background stars */
      const starCount = Math.round((w * h) / 8500);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.5, 1.6),
          baseAlpha: rand(0.25, 0.85),
          twinkleSpeed: rand(0.0006, 0.0022),
          phase: rand(0, Math.PI * 2),
        });
      }

      /* Constellation clusters: small groups of brighter stars linked by faint lines,
         tucked into corners so they don't clutter the hero text */
      const zones = [
        { cx: w * 0.1, cy: h * 0.18, spread: Math.min(w, h) * 0.16 },
        { cx: w * 0.9, cy: h * 0.14, spread: Math.min(w, h) * 0.14 },
        { cx: w * 0.06, cy: h * 0.78, spread: Math.min(w, h) * 0.15 },
        { cx: w * 0.94, cy: h * 0.82, spread: Math.min(w, h) * 0.15 },
      ];
      clusters = zones.map((z) => {
        const n = Math.round(rand(4, 6));
        const pts = [];
        for (let i = 0; i < n; i++) {
          pts.push({
            x: z.cx + rand(-z.spread, z.spread),
            y: z.cy + rand(-z.spread, z.spread),
            r: rand(1.3, 2.2),
            phase: rand(0, Math.PI * 2),
          });
        }
        const links = [];
        for (let i = 0; i < pts.length - 1; i++) links.push([i, i + 1]);
        return { pts, links };
      });
    }

    function drawNebula(t) {
      ctx.save();
      if (supportsCtxFilter) ctx.filter = `blur(${Math.max(w, h) * 0.09}px)`;
      ctx.globalCompositeOperation = "screen";
      for (const b of nebulaBlobs) {
        const tt = prefersReducedMotion ? 0 : t;
        const cx = (b.cx + Math.sin(tt * b.speed + b.phase) * b.sx) * w;
        const cy = (b.cy + Math.cos(tt * b.speed * 1.3 + b.phase) * b.sy) * h;
        const r = b.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${b.color},${b.alpha})`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawAurora(t) {
      ctx.save();
      if (supportsCtxFilter) ctx.filter = `blur(${Math.max(18, h * 0.025)}px)`;
      ctx.globalCompositeOperation = "screen";
      const tt = prefersReducedMotion ? 0 : t;
      for (const band of auroraBands) {
        const steps = 40;
        const topPts = [];
        const botPts = [];
        for (let i = 0; i <= steps; i++) {
          const xf = i / steps;
          const x = xf * w;
          const edgeFade = Math.sin(Math.PI * xf); /* fades out at left/right edges */
          const wave = Math.sin(xf * band.freq * Math.PI * 2 + band.phase + tt * band.speed) * band.amp * h;
          const yTop = band.baseY * h + wave - band.thickness * h * 0.5 * edgeFade;
          const yBot = band.baseY * h + wave + band.thickness * h * 0.5 * edgeFade;
          topPts.push([x, yTop]);
          botPts.push([x, yBot]);
        }
        ctx.beginPath();
        ctx.moveTo(topPts[0][0], topPts[0][1]);
        for (const p of topPts) ctx.lineTo(p[0], p[1]);
        for (let i = botPts.length - 1; i >= 0; i--) ctx.lineTo(botPts[i][0], botPts[i][1]);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, band.baseY * h - band.thickness * h, 0, band.baseY * h + band.thickness * h);
        grad.addColorStop(0, `rgba(${band.colorTop},0)`);
        grad.addColorStop(0.5, `rgba(${band.colorMid},${band.alpha})`);
        grad.addColorStop(1, `rgba(${band.colorTop},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    }

    function drawStars(t) {
      for (const s of stars) {
        const twinkle = prefersReducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(s.baseAlpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
    }

    function drawConstellations(t) {
      for (const c of clusters) {
        ctx.strokeStyle = "rgba(165,180,252,0.28)";
        ctx.lineWidth = 1;
        for (const [a, b] of c.links) {
          const p1 = c.pts[a], p2 = c.pts[b];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        for (const p of c.pts) {
          const twinkle = prefersReducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 0.0015 + p.phase);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(0.85 * twinkle).toFixed(3)})`;
          ctx.shadowColor = "rgba(165,180,252,0.9)";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      drawNebula(t);
      drawAurora(t);
      drawStars(t);
      drawConstellations(t);
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }

    buildField();
    requestAnimationFrame(draw);
    if (prefersReducedMotion) draw(0);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildField, 200);
    });
  })();

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