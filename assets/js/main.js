(function () {
  'use strict';

  // Footer year (Eastern Arabic-Indic digits, e.g. ٢٠٢٦ not 2026)
  var yearEl = document.getElementById('year');
  if (yearEl) {
    var indicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    var year = String(new Date().getFullYear());
    yearEl.textContent = year.replace(/[0-9]/g, function (d) { return indicDigits[+d]; });
  }

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Screenshot lightbox
  var shotCards = Array.prototype.slice.call(document.querySelectorAll('.shot-card'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;
  var lastFocused = null;

  var shots = shotCards.map(function (card) {
    var img = card.querySelector('img');
    return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
  });

  function openLightbox(index) {
    if (!shots.length) return;
    currentIndex = (index + shots.length) % shots.length;
    var shot = shots[currentIndex];
    lightboxImg.setAttribute('src', shot.src);
    lightboxImg.setAttribute('alt', shot.alt);
    lastFocused = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function showRelative(delta) {
    openLightbox(currentIndex + delta);
  }

  shotCards.forEach(function (card, index) {
    card.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showRelative(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { showRelative(1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showRelative(-1);
    if (event.key === 'ArrowLeft') showRelative(1);
  });

  // Fade-in reveal for feature cards / screenshots as they enter view
  var revealTargets = document.querySelectorAll('.feature-card, .shot-card');
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  }
})();
