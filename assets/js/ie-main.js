(function() {
  'use strict';

  // --- Nav scroll behavior ---
  var nav = document.getElementById('ie-nav');
  if (nav) {
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.scrollY > 60) {
            nav.classList.add('ie-nav--scrolled');
          } else {
            nav.classList.remove('ie-nav--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial state
    if (window.scrollY > 60) {
      nav.classList.add('ie-nav--scrolled');
    }
  }

  // --- Mobile nav toggle ---
  var toggleBtn = document.getElementById('ie-nav-toggle');
  var navLinks = document.getElementById('ie-nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
      var isOpen = navLinks.classList.toggle('ie-nav__links--open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- Frame fade-in on scroll (IntersectionObserver) ---
  var frames = document.querySelectorAll('.ie-frame');
  if (frames.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ie-frame--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    frames.forEach(function(frame) {
      observer.observe(frame);
    });
  } else {
    // Fallback: show all frames immediately
    frames.forEach(function(frame) {
      frame.classList.add('ie-frame--visible');
    });
  }
})();