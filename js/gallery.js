/**
 * BuildLite - Project Gallery & Lightbox Controller
 * Provides filterable portfolio cards and a fullscreen high-res lightbox
 * for authentic BuildLite photography and architectural diagrams.
 */

(function () {
  'use strict';

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => b.classList.toggle('active', b === btn));

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Lightbox Modal
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    function openLightbox(src, title, desc) {
      lightboxImg.src = src;
      if (lightboxTitle) lightboxTitle.textContent = title || '';
      if (lightboxDesc) lightboxDesc.textContent = desc || '';
      lightbox.classList.add('is-active');
      document.body.classList.add('modal-open');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-active');
      document.body.classList.remove('modal-open');
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    }

    // Attach click to gallery items
    document.querySelectorAll('[data-lightbox-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.getAttribute('data-full-img') || trigger.querySelector('img')?.src;
        const title = trigger.getAttribute('data-title') || trigger.querySelector('.gallery-card-title')?.textContent;
        const desc = trigger.getAttribute('data-desc') || trigger.querySelector('.gallery-card-desc')?.textContent;
        if (src) {
          openLightbox(src, title, desc);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
        closeLightbox();
      }
    });
  }
})();
