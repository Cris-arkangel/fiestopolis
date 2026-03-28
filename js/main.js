// ===========================
// Fiestopolis - Main JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initContactForm();
});

// ===========================
// Navbar - Scroll Effect
// ===========================
function initNavbar() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // Smooth scroll + active link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu if open
          closeMobileMenu();
        }
      }
    });
  });

  // Highlight active section on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(l => l.classList.remove('nav__link--active'));
          link.classList.add('nav__link--active');
        }
      }
    });
  });
}

// ===========================
// Mobile Menu (Hamburger)
// ===========================
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  toggle.classList.remove('active');
  menu.classList.remove('active');
  document.body.style.overflow = '';
}

// ===========================
// Scroll Animations (Intersection Observer)
// ===========================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    elements.forEach(el => el.classList.add('visible'));
  }
}

// ===========================
// Contact Form Validation
// ===========================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nombre = form.querySelector('#nombre');
    const email = form.querySelector('#email');
    const telefono = form.querySelector('#telefono');
    const mensaje = form.querySelector('#mensaje');

    let isValid = true;

    // Name validation
    if (!nombre.value.trim()) {
      showError(nombre, 'nombre-error', 'Por favor, introduce tu nombre');
      isValid = false;
    } else if (nombre.value.trim().length < 2) {
      showError(nombre, 'nombre-error', 'El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    // Email validation
    if (!email.value.trim()) {
      showError(email, 'email-error', 'Por favor, introduce tu email');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'email-error', 'Por favor, introduce un email valido');
      isValid = false;
    }

    // Phone validation
    if (!telefono.value.trim()) {
      showError(telefono, 'telefono-error', 'Por favor, introduce tu telefono');
      isValid = false;
    } else if (!isValidPhone(telefono.value.trim())) {
      showError(telefono, 'telefono-error', 'Por favor, introduce un telefono valido');
      isValid = false;
    }

    // Message validation
    if (!mensaje.value.trim()) {
      showError(mensaje, 'mensaje-error', 'Por favor, escribe un mensaje');
      isValid = false;
    } else if (mensaje.value.trim().length < 10) {
      showError(mensaje, 'mensaje-error', 'El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    }

    if (isValid) {
      // Show success message
      const successMsg = document.getElementById('form-success');
      successMsg.classList.add('show');
      form.reset();

      // Hide success after 5 seconds
      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 5000);
    }
  });

  // Remove error on input
  const inputs = form.querySelectorAll('.form__input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errorSpan = input.parentElement.querySelector('.form__error');
      if (errorSpan) errorSpan.textContent = '';
    });
  });
}

function showError(input, errorId, message) {
  input.classList.add('error');
  const errorSpan = document.getElementById(errorId);
  if (errorSpan) errorSpan.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.form__input').forEach(input => {
    input.classList.remove('error');
  });
  document.querySelectorAll('.form__error').forEach(span => {
    span.textContent = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // Accept various phone formats: digits, spaces, +, -, (, )
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}
