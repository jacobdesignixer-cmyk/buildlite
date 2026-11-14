/**
 * BuildLite - Scroll-Controlled Architectural Frame Animation Hero
 * Renders 120 extracted frames showing the architectural ASSEMBLY
 * of the BuildLite modular building synchronized with scroll position.
 * 
 * Frame 0   = Dismantled / exploded house (Starting state at top of page)
 * Frame 119 = Fully assembled modular building (Final state after scrolling)
 */

(function () {
  'use strict';

  const TOTAL_FRAMES = 120; // frame_000000.jpg through frame_000119.jpg
  // Starting at dismantled house (frame 0) and assembling as you scroll down (frame 119)
  const START_FRAME_INDEX = 0;   // Dismantled / Exploded
  const END_FRAME_INDEX = 119;   // Fully Assembled in green outdoor yard

  // DOM elements
  const heroSection = document.getElementById('hero-track');
  const canvas = document.getElementById('hero-canvas');
  const heroOverlay = document.getElementById('hero-overlay');
  const scrollPrompt = document.getElementById('scroll-prompt');
  const heroBadge = document.getElementById('hero-breakdown-badge');
  const frameProgressBar = document.getElementById('frame-progress-bar');
  const frameCounter = document.getElementById('frame-counter');

  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  // Frame Cache
  const frames = new Array(TOTAL_FRAMES);
  const frameLoaded = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;

  // Animation State
  let currentFrame = START_FRAME_INDEX;
  let targetFrame = START_FRAME_INDEX;
  let isTicking = false;
  let isInitialFrameRendered = false;

  // Helper to construct frame URL
  function getFrameUrl(index) {
    const padded = String(index).padStart(6, '0');
    return `public/scroll-frames/frame_${padded}.jpg`;
  }

  // Preloading Strategy:
  // 1. Load initial frame (0 - Dismantled) with highest priority
  // 2. Load neighboring frames (1 up to 25) immediately
  // 3. Progressively load remaining frames in chunks up to 119
  function preloadFrames() {
    // 1. Initial dismantled frame
    loadSingleFrame(START_FRAME_INDEX, () => {
      renderFrame(START_FRAME_INDEX);
      isInitialFrameRendered = true;

      // 2. Load next immediate assembly frames
      for (let i = START_FRAME_INDEX + 1; i <= Math.min(TOTAL_FRAMES - 1, START_FRAME_INDEX + 20); i++) {
        loadSingleFrame(i);
      }

      // Also pre-cache final frame so end state is instant
      loadSingleFrame(END_FRAME_INDEX);

      // 3. Progressively load remainder
      scheduleRemainingLoads();
    });
  }

  function loadSingleFrame(index, callback) {
    if (frames[index]) {
      if (callback) callback(frames[index]);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    img.src = getFrameUrl(index);

    img.onload = () => {
      frames[index] = img;
      frameLoaded[index] = true;
      loadedCount++;

      if (frameProgressBar) {
        const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        frameProgressBar.style.width = percent + '%';
        if (percent >= 100) {
          setTimeout(() => {
            const preloader = document.getElementById('hero-preloader-indicator');
            if (preloader) preloader.style.opacity = '0';
          }, 400);
        }
      }

      if (!isInitialFrameRendered && index === START_FRAME_INDEX) {
        renderFrame(START_FRAME_INDEX);
        isInitialFrameRendered = true;
      }

      if (callback) callback(img);
    };

    img.onerror = () => {
      console.warn(`Failed to load frame ${index}`);
    };
  }

  function scheduleRemainingLoads() {
    let nextIndex = START_FRAME_INDEX + 21;

    function loadNextBatch() {
      const batchSize = 6;
      let count = 0;
      while (nextIndex < TOTAL_FRAMES && count < batchSize) {
        loadSingleFrame(nextIndex);
        nextIndex++;
        count++;
      }

      if (nextIndex < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadNextBatch, { timeout: 200 });
        } else {
          setTimeout(loadNextBatch, 25);
        }
      }
    }

    loadNextBatch();
  }

  // Draw frame on canvas with aspect ratio preservation
  function renderFrame(index) {
    // Find closest loaded frame if requested frame is still downloading
    let imgToDraw = frames[index];
    if (!imgToDraw || !frameLoaded[index]) {
      let offset = 1;
      while (offset < TOTAL_FRAMES) {
        if (index - offset >= 0 && frameLoaded[index - offset]) {
          imgToDraw = frames[index - offset];
          break;
        }
        if (index + offset < TOTAL_FRAMES && frameLoaded[index + offset]) {
          imgToDraw = frames[index + offset];
          break;
        }
        offset++;
      }
    }

    if (!imgToDraw) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgWidth = imgToDraw.naturalWidth || 1280;
    const imgHeight = imgToDraw.naturalHeight || 720;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasAspect > imgAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    }

    // Fill canvas background to match frame edges
    ctx.fillStyle = '#171c18';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the image frame
    ctx.drawImage(imgToDraw, drawX, drawY, drawWidth, drawHeight);

    if (frameCounter) {
      const displayFrameNum = Math.min(TOTAL_FRAMES, Math.round(index) + 1);
      frameCounter.textContent = `${displayFrameNum} / ${TOTAL_FRAMES}`;
    }
  }

  // Handle Resize
  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    renderFrame(Math.round(currentFrame));
  }

  // Scroll Synchronization
  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(updateScrollAnimation);
      isTicking = true;
    }
  }

  function updateScrollAnimation() {
    isTicking = false;

    const rect = heroSection.getBoundingClientRect();
    const scrollDistance = heroSection.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    // Calculate scroll fraction: 0 at top, 1 when hero finishes scrubbing
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollDistance, 0), 1);

    // Map progress 0 -> 1 to Frame index 0 (dismantled) -> 119 (assembled)
    targetFrame = START_FRAME_INDEX + progress * (END_FRAME_INDEX - START_FRAME_INDEX);

    // Smooth lerp for buttery 60fps rendering
    currentFrame += (targetFrame - currentFrame) * 0.45;
    if (Math.abs(targetFrame - currentFrame) < 0.05) {
      currentFrame = targetFrame;
    }

    renderFrame(Math.round(currentFrame));

    // UI Overlays responsive to scroll
    if (heroOverlay) {
      // Fade out headline and CTA in first 20% of scroll so visitor focuses on assembly
      const textFade = Math.max(0, 1 - progress * 4.5);
      heroOverlay.style.opacity = textFade.toFixed(3);
      heroOverlay.style.transform = `translateY(${(-progress * 70).toFixed(1)}px)`;
      heroOverlay.style.pointerEvents = textFade < 0.1 ? 'none' : 'auto';
    }

    if (scrollPrompt) {
      const promptFade = Math.max(0, 1 - progress * 6);
      scrollPrompt.style.opacity = promptFade.toFixed(3);
    }

    if (heroBadge) {
      // Badge appears during the assembly process (progress > 0.15 and < 0.95)
      if (progress > 0.15 && progress < 0.95) {
        const badgeOpacity = Math.min(1, (progress - 0.15) * 4);
        heroBadge.style.opacity = badgeOpacity.toFixed(3);
        heroBadge.style.transform = 'translateY(0)';
      } else {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(12px)';
      }
    }

    // Continue loop if still smoothing
    if (Math.abs(targetFrame - currentFrame) >= 0.05) {
      requestAnimationFrame(updateScrollAnimation);
      isTicking = true;
    }
  }

  // Initialize
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  handleResize();
  preloadFrames();
})();
