/**
 * International Reddy Bhavan – Tirupati
 * main.js — All interactive behaviours
 */

/* =============================================================
   1. NAVBAR — darken on scroll
   ============================================================= */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

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
   ============================================================= */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* =============================================================
   4. HERO IMAGE SLIDER — 4 slides, 5s interval, fade crossfade
   ============================================================= */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg');
  const dots   = document.querySelectorAll('.hero-dot');
  if (slides.length < 2) return;

  let current = 0;
  let timer   = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  // Dot click
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.slide, 10));
      startAuto();
    });
  });

  startAuto();
})();


/* =============================================================
   5. HERO PARALLAX — subtle background shift on scroll
   ============================================================= */
(function initParallax() {
  const slides = document.querySelectorAll('.hero-bg');
  if (!slides.length) return;

  function onScroll() {
    const offset = 'calc(50% + ' + (window.scrollY * 0.3) + 'px)';
    slides.forEach(function (slide) {
      slide.style.backgroundPositionY = offset;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* =============================================================
   6. SHOWCASE LIGHTBOX
   ============================================================= */
(function initLightbox() {
  const items    = document.querySelectorAll('.showcase-item');
  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');
  if (!lightbox || !items.length) return;

  let current = 0;
  const srcs  = Array.from(items).map(function (el) { return el.dataset.src; });

  function open(idx) {
    current = (idx + srcs.length) % srcs.length;
    img.src = srcs[current];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { open(current - 1); });
  nextBtn.addEventListener('click', function () { open(current + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
  });
})();


/* =============================================================
   7. (Testimonials removed — replaced with Chairman's Letter)
   ============================================================= */


/* =============================================================
   8. SMOOTH SCROLL — navbar + amenity card anchor links with offset
      Also briefly highlights the target facility item on arrival
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
        ? document.getElementById('navbar').offsetHeight : 0;

      // Extra offset so the facility photo isn't hidden under nav
      const extraOffset = target.classList.contains('facility-item') ? 40 : 10;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navHeight - extraOffset,
        behavior: 'smooth'
      });

      // Gold pulse highlight on facility items when navigated to
      if (target.classList.contains('facility-item')) {
        target.classList.add('highlight-pulse');
        setTimeout(function () { target.classList.remove('highlight-pulse'); }, 1800);
      }
    });
  });
})();


/* =============================================================
   9. ACTIVE NAV LINK — highlight current section
   ============================================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navH = document.getElementById('navbar')
    ? document.getElementById('navbar').offsetHeight + 20 : 80;

  function onScroll() {
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - navH) current = s.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.style.color = link.getAttribute('href') === '#' + current ? '#E6B84A' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
