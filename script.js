document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Page loader ---------- */
  document.body.classList.add("loading");
  const loader = document.createElement("div");
  loader.id = "pageLoader";
  loader.innerHTML = `
    <div class="loader-text-wrap" id="loaderTextWrap">
      <div class="loader-mark welcome">Welcome</div>
    </div>
    <div class="loader-bar-track">
      <div class="loader-bar-fill"></div>
    </div>
    <div style="display:flex;gap:6px;margin-top:4px;">
      <span class="loader-dot" style="animation-delay:0s"></span>
      <span class="loader-dot" style="animation-delay:0.2s"></span>
      <span class="loader-dot" style="animation-delay:0.4s"></span>
    </div>
  `;
  document.body.prepend(loader);

  // Add floating particles inside loader
  const loaderParticles = document.createElement("div");
  loaderParticles.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;";
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "loader-particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${40 + Math.random() * 30}%`;
    p.style.animationDelay = `${Math.random() * 2.4}s`;
    p.style.animationDuration = `${2 + Math.random() * 2}s`;
    loaderParticles.appendChild(p);
  }
  loader.insertBefore(loaderParticles, loader.firstChild);

  function hideLoader() {
    document.body.classList.remove("loading");
    loader.classList.add("hidden");
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) heroContent.classList.add("hero-loaded");
    setTimeout(() => loader.remove(), 1000);
  }
  window.addEventListener("load", () => {
    setTimeout(hideLoader, prefersReducedMotion ? 0 : 2800);
  });
  setTimeout(hideLoader, 4200);

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
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-scale, .certificate-card, .section-header"
  );
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

/* Stagger certificate cards */
document.querySelectorAll(".certificate-grid").forEach((grid) => {
  [...grid.children].forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });
});

/* Stagger skill items */
document.querySelectorAll(".skills-list").forEach((list) => {
  [...list.children].forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
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
        requestAnimationFrame(() => {
          fill.style.width = width + "%";
        });
        if (pctLabel && !prefersReducedMotion) {
          const duration = 1200;
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
          const duration = 1400;
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

  /* ---------- Project filter (morph crossfade) ---------- */
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
            void card.offsetWidth; // restart animation
            card.classList.add("morph-in");
          }
        });
      }, 300);
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

  /* ---------- Contact form (demo, no backend) — liquid success morph ---------- */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-primary");
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = "linear-gradient(135deg, #10b981, #06b6d4)";
    btn.classList.add("success");
    fireConfetti(btn);
    form.reset();
    form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("filled", "focused"));
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = "";
      btn.classList.remove("success");
    }, 2600);
  });

  /* ---------- Magnetic buttons (desktop only) ---------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn, .btn-small").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relX = (x / rect.width - 0.5) * 12;
        const relY = (y / rect.height - 0.5) * 12;
        btn.style.transform = `translate(${relX}px, ${relY}px)`;
        btn.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
        btn.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

/* ---------- Custom cursor: dot + ring with hover states ---------- */
if (!prefersReducedMotion && canHover) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    function animateRing() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, .clickable-image, input, textarea, .filter-btn, .about-tags span";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(hoverTargets)) ring.classList.add("hovering");
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(hoverTargets)) ring.classList.remove("hovering");
    });

    const heroSection = document.querySelector(".hero");
    const cursorDarkObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                dot.classList.toggle("on-dark", entry.isIntersecting);
                ring.classList.toggle("on-dark", entry.isIntersecting);
            });
        },
        { threshold: 0.3 }
    );
    if (heroSection) cursorDarkObserver.observe(heroSection);
}

/* ---------- Hero scroll-linked parallax ---------- */
if (!prefersReducedMotion) {
    const heroEl = document.querySelector(".hero");
    const heroContentEl = document.querySelector(".hero-content");
    const auroraEl = document.querySelector(".hero-bg");
    const gridEl = document.querySelector(".grid-overlay");
    function updateParallax() {
        if (!heroEl) return;
        const rect = heroEl.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        if (heroContentEl) {
            heroContentEl.style.transform = `translateY(${progress * 90}px)`;
            heroContentEl.style.opacity = String(1 - progress * 1.1);
        }
        if (auroraEl) auroraEl.style.transform = `translateY(${progress * 40}px)`;
        if (gridEl) gridEl.style.transform = `translateY(${progress * 20}px)`;
    }
    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax();
}

  /* ---------- Floating labels (contact form) ---------- */
  document.querySelectorAll(".form-group").forEach((group) => {
    const field = group.querySelector("input, textarea");
    if (!field) return;
    if (field.tagName === "TEXTAREA") group.classList.add("textarea-group");
    field.setAttribute("placeholder", " ");
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

  /* ---------- Parallax orbs on mouse move (hero) ---------- */
  const heroBg = document.querySelector(".hero-bg");
  const hero = document.querySelector(".hero");
  if (!prefersReducedMotion && hero && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const relX = (e.clientX / w - 0.5) * 2;
      const relY = (e.clientY / h - 0.5) * 2;
      document.querySelectorAll(".orb").forEach((orb, i) => {
        const strength = (i + 1) * 6;
        orb.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      });
    });
  }

  /* ---------- Ambient floating particles in hero ---------- */
  if (!prefersReducedMotion) {
    const particleWrap = document.createElement("div");
    particleWrap.className = "particles";
    hero.appendChild(particleWrap);
    const count = window.innerWidth < 768 ? 8 : 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 3 + 1.5;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `-10px`;
      p.style.animationDuration = `${Math.random() * 12 + 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = Math.random() * 0.5 + 0.2;
      particleWrap.appendChild(p);
    }
  }

/* ---------- Constellation network effect (optimized for performance) ---------- */
if (!prefersReducedMotion && hero) {
    const canvas = document.createElement("canvas");
    canvas.className = "constellation-canvas";
    hero.insertBefore(canvas, hero.firstChild);
    const ctx = canvas.getContext("2d");
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const dotCount = window.innerWidth < 768 ? 12 : 24;
    const dots = [];
    const mouseRadius = 150;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    for (let i = 0; i < dotCount; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: Math.random() * 1.2 + 0.8,
            pulse: Math.random() * Math.PI * 2,
        });
    }

    let mouseX = -9999;
    let mouseY = -9999;
    let isHeroVisible = true;

    const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    heroObserver.observe(hero);

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    function drawConstellation() {
        if (!isHeroVisible) {
            requestAnimationFrame(drawConstellation);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            dot.x += dot.vx;
            dot.y += dot.vy;
            dot.pulse += 0.02;
            if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
            if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
            dot.x = Math.max(0, Math.min(canvas.width, dot.x));
            dot.y = Math.max(0, Math.min(canvas.height, dot.y));
        }

        for (let i = 0; i < dots.length; i++) {
            const dot = dots[i];
            const dx = dot.x - mouseX;
            const dy = dot.y - mouseY;
            const distSq = dx * dx + dy * dy;
            const mouseInfluence = distSq < mouseRadiusSq ? (1 - Math.sqrt(distSq) / mouseRadius) * 0.6 : 0;
            const pulseSize = dot.size + Math.sin(dot.pulse) * 0.6;
            const finalSize = Math.max(0.5, pulseSize + mouseInfluence * 1.5);

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${(0.35 + mouseInfluence * 0.35).toFixed(2)})`;
            ctx.fill();
        }

        requestAnimationFrame(drawConstellation);
    }
    requestAnimationFrame(drawConstellation);
}

  /* ---------- Mouse ripple effect on hero (pooled element) ---------- */
if (!prefersReducedMotion && hero) {
    const ripple = document.createElement("div");
    ripple.className = "hero-ripple";
    ripple.style.display = "none";
    hero.appendChild(ripple);
    let rippleTimeout;
    hero.addEventListener("mousemove", (e) => {
        if (rippleTimeout) return;
        rippleTimeout = setTimeout(() => { rippleTimeout = null; }, 100);
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.display = "";
        ripple.classList.remove("ripple-active");
        void ripple.offsetWidth;
        ripple.classList.add("ripple-active");
        setTimeout(() => { ripple.style.display = "none"; }, 1200);
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
    // duplicate content twice for seamless -50% loop
    tickerTrack.innerHTML = buildSet() + buildSet();
  }

  /* ---------- Cursor-follow 3D tilt (projects + certificates) ---------- */
  if (!prefersReducedMotion && canHover) {
    function attachTilt(el, maxTilt) {
      let raf = null;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.classList.add("tilting");
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateX(${-py * maxTilt}deg) rotateY(${px * maxTilt}deg) translateY(-8px) scale(1.015)`;
        });
      });
      el.addEventListener("mouseleave", () => {
        el.classList.remove("tilting");
        el.style.transform = "";
      });
    }
    document.querySelectorAll(".project-card").forEach((c) => attachTilt(c, 8));
    document.querySelectorAll(".certificate-card").forEach((c) => attachTilt(c, 10));
  }

  /* ---------- Scrollspy dots nav ---------- */
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

  /* ---------- Scramble text (hero subtitle) ---------- */
  if (!prefersReducedMotion) {
    const subtitle = document.querySelector(".hero-subtitle");
    if (subtitle) {
      const finalText = subtitle.textContent;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      subtitle.classList.add("scramble-ready");

      function runScramble() {
        let frame = 0;
        const totalFrames = 26;
        const revealPace = finalText.length / totalFrames;
        function tick() {
          let out = "";
          const revealedCount = Math.floor(frame * revealPace);
          for (let i = 0; i < finalText.length; i++) {
            const ch = finalText[i];
            if (ch === " ") { out += " "; continue; }
            if (i < revealedCount) out += ch;
            else out += chars[Math.floor(Math.random() * chars.length)];
          }
          subtitle.textContent = out;
          frame++;
          if (frame <= totalFrames) {
            requestAnimationFrame(tick);
          } else {
            subtitle.textContent = finalText;
          }
        }
        tick();
      }
      // Run once loader finishes (roughly matches hero reveal timing)
      setTimeout(runScramble, 1350);
    }
  }

  /* ---------- Confetti burst on successful submit ---------- */
  function fireConfetti(originEl) {
    if (prefersReducedMotion) return;
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const colors = ["#818cf8", "#22d3ee", "#fbbf24", "#34d399", "#f472b6"];
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 120;
      const flyX = Math.cos(angle) * distance;
      const flyY = Math.sin(angle) * distance - 40;
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--fly-to", `translate(${flyX}px, ${flyY}px)`);
      piece.style.setProperty("--fly-rot", `${Math.random() * 480 - 240}deg`);
      piece.style.animationDelay = `${Math.random() * 0.08}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1100);
    }
  }
});