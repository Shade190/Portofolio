// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Image Popup Modal Functionality
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".modal-close");

// Open modal when clicking on clickable images
document.querySelectorAll(".clickable-image").forEach((img) => {
  img.addEventListener("click", function (e) {
    e.stopPropagation();
    modalImage.src = this.src;
    imageModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// Close modal when clicking close button
if (modalClose) {
  modalClose.addEventListener("click", function () {
    imageModal.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

// Close modal when clicking outside the image
imageModal.addEventListener("click", function (e) {
  if (e.target === imageModal) {
    imageModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && imageModal.classList.contains("active")) {
    imageModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Header scroll effect with enhanced styling
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Theme Toggle - Dark Mode
const themeToggle = document.querySelector(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

// Check localStorage for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || (!savedTheme && prefersDark.matches)) {
  document.body.classList.add("dark-mode");
  if (themeToggle) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    themeToggle.innerHTML = isDarkMode
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  });
}

// Mobile hamburger menu toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

// Project Filter Functionality
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const filterValue = this.getAttribute("data-filter");

    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    // Filter projects with animation
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filterValue === "all" || category === filterValue) {
        card.classList.remove("hidden");
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => {
          card.classList.add("hidden");
        }, 300);
      }
    });
  });
});

// Form submission with validation
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector("textarea").value;

    if (name && email && message) {
      alert("Thank you, " + name + "! I will get back to you soon at " + email);
      this.reset();
    } else {
      alert("Please fill in all fields");
    }
  });
}

// Enhanced animation on scroll with Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe project cards and skill bars
document
  .querySelectorAll(".project-card, .skill-item, .about-image")
  .forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Animate skill bars on scroll
const skillObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressFill = entry.target.querySelector(".progress-fill");
        if (progressFill && !progressFill.classList.contains("animated")) {
          const width = progressFill.style.width;
          progressFill.style.width = "0%";
          progressFill.classList.add("animated");

          setTimeout(() => {
            progressFill.style.transition = "width 0.8s ease";
            progressFill.style.width = width;
          }, 100);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".progress").forEach((progress) => {
  skillObserver.observe(progress);
});

// Smooth page load animation
window.addEventListener("load", function () {
  document.body.style.opacity = 1;
});
