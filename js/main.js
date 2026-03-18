/**
 * International Reddy Bhavan – Tirupati
 * main.js — Scroll animations, navbar, parallax, mobile menu
 */

/* =============================================================
   1. NAVBAR — darken on scroll
   ============================================================= */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* =============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================= */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* =============================================================
   3. SCROLL-REVEAL — IntersectionObserver
   Elements with class .reveal animate in when they enter view
   ============================================================= */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Use IntersectionObserver if available; fall back to instant visibility
  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,       // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px' // slight offset from bottom
    }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* =============================================================
   4. HERO PARALLAX — subtle shift on scroll
   ============================================================= */
(function initParallax() {
  const slides = document.querySelectorAll('.hero-bg');
  if (!slides.length) return;

  function onScroll() {
    const offset = 'calc(50% + ' + (window.scrollY * 0.35) + 'px)';
    slides.forEach(function (slide) {
      slide.style.backgroundPositionY = offset;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* =============================================================
   6. SMOOTH SCROLL — for navbar anchor links
   (Handled by CSS scroll-behavior: smooth, but this adds
   offset compensation for the fixed navbar height)
   ============================================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 0;

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* =============================================================
   7. ACTIVE NAV LINK — highlight current section in navbar
   ============================================================= */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navHeight = document.getElementById('navbar')
    ? document.getElementById('navbar').offsetHeight + 20
    : 80;

  function onScroll() {
    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - navHeight;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#E6B84A';
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
