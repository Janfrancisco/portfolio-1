// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });
}

// Set current year in footer
const currentYearElements = document.querySelectorAll("#current-year");
currentYearElements.forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Contact form submission
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Show success message
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");

    // Reset form
    contactForm.reset();
  });
}

// Set active navigation link based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";

  // Desktop navigation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active", "text-blue-900");
    link.classList.add("text-gray-900", "hover:text-blue-900");

    const linkHref = link.getAttribute("href");

    // Check if link matches current page or if we're on home
    const isActive =
      linkHref === currentPage ||
      (linkHref === "index.html" &&
        (currentPage === "" ||
          currentPage === "/" ||
          currentPage === "index.html"));

    if (isActive) {
      link.classList.add("active", "text-blue-900");
      link.classList.remove("text-gray-900");
    }
  });

  // Mobile navigation
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("bg-blue-900/10", "text-blue-900", "font-semibold");
    link.classList.add("text-gray-900", "hover:text-blue-900");

    const linkHref = link.getAttribute("href");

    // Check if link matches current page or if we're on home
    const isActive =
      linkHref === currentPage ||
      (linkHref === "index.html" &&
        (currentPage === "" ||
          currentPage === "/" ||
          currentPage === "index.html"));

    if (isActive) {
      link.classList.add("bg-blue-900/10", "text-blue-900", "font-semibold");
      link.classList.remove("text-gray-900");
    }
  });
});
