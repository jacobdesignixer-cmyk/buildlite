/**
 * BuildLite - Main Application Entry
 * Initializes scroll reveals, architectural counters, and event listeners.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  console.log('BuildLite Modular Website initialized.');

  // Intersection Observer for subtle scroll reveal effects
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Animated counters for stats section
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            el.textContent = current + suffix;
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // Interactive Axonometric Exploded Diagram Hotspots (Section 1)
  const hotspots = document.querySelectorAll('.axon-hotspot');
  const calloutBoxes = document.querySelectorAll('.axon-callout-card');

  hotspots.forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      const targetId = spot.getAttribute('data-callout');
      calloutBoxes.forEach(box => {
        box.classList.toggle('highlighted', box.getAttribute('id') === targetId);
      });
    });
    spot.addEventListener('mouseleave', () => {
      calloutBoxes.forEach(box => box.classList.remove('highlighted'));
    });
  });
});
