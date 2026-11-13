// Theme switching, responsive navigation, active-section highlighting and contact-form validation.
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const savedTheme = localStorage.getItem("mourya-portfolio-theme");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
applyTheme(savedTheme || "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("mourya-portfolio-theme", nextTheme);
});

// Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-link");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
      });
    }
  });
}, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
sections.forEach(section => observer.observe(section));

// Contact form: front-end validation only; no message is sent to a server.
const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("contact-name");
  const email = document.getElementById("contact-email");
  const message = document.getElementById("contact-message");
  [name, email, message].forEach(field => field.classList.remove("invalid"));
  feedback.textContent = "";
  feedback.classList.remove("error");

  let valid = true;
  if (!name.value.trim()) { name.classList.add("invalid"); valid = false; }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) { email.classList.add("invalid"); valid = false; }
  if (!message.value.trim()) { message.classList.add("invalid"); valid = false; }

  if (!valid) {
    feedback.textContent = "Please enter a name, a valid email address and a message.";
    feedback.classList.add("error");
    return;
  }
  feedback.textContent = `Thanks, ${name.value.trim()}! Your details passed validation. This demo form does not send messages.`;
  contactForm.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

// Reveal each section gently without moving nested cards or changing page layout.
const revealSections = document.querySelectorAll("main section");
revealSections.forEach(section => section.classList.add("section-reveal"));
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.04, rootMargin: "0px 0px -20px 0px" });
revealSections.forEach(section => revealObserver.observe(section));

// Floating icon-only back-to-top control.
const backTopButton = document.getElementById("back-top-button");
window.addEventListener("scroll", () => {
  backTopButton.classList.toggle("visible", window.scrollY > 420);
}, { passive: true });
backTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
