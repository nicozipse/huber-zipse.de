/* ============================================================
   CDU Enzkreis Pforzheim – Main JavaScript
   main.js
   ============================================================ */

'use strict';

/* ─── Mobile Navigation ─── */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.getElementById('primary-nav');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    toggle.classList.toggle('is-active', !isOpen);
    // Verhindern, dass Hintergrund scrollt wenn Menü offen
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Schließen mit Escape-Taste (WCAG 2.1.2)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // Schließen wenn Nav-Link geklickt (Single-Page)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── Sticky Header – Scrolled-Klasse ─── */
(function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // IntersectionObserver auf ein unsichtbares Sentinel-Element am Seitenanfang
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:100%;pointer-events:none;';
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    function (entries) {
      header.classList.toggle('site-header--scrolled', !entries[0].isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(sentinel);
})();

/* ─── Smooth Scroll für Browser ohne nativen Support ─── */
(function initSmoothScroll() {
  // Moderne Browser unterstützen scroll-behavior: smooth nativ.
  // Für Safari < 15.4 Polyfill via JS.
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─── Scroll-Reveal: Elemente sanft einblenden ─── */
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.news-card, .topic-tile, .event-item, .candidate-card, .reveal'
  );
  if (!elements.length || !window.IntersectionObserver) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(function (el, i) {
    el.classList.add('reveal-init');
    // Gestaffelte Animation
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    observer.observe(el);
  });
})();

/* ─── Aktives Navigationslink hervorheben ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + entry.target.id;
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();
