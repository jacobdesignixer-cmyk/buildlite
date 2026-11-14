/**
 * BuildLite - Packages & Product Showcase Controller
 * Handles interactive package tier switching, specification comparisons,
 * and pre-populating quote consultation requests.
 */

(function () {
  'use strict';

  // Package Switcher Tabs
  const packageButtons = document.querySelectorAll('.package-tab-btn');
  const packagePanels = document.querySelectorAll('.package-detail-card');

  if (packageButtons.length > 0 && packagePanels.length > 0) {
    packageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPackage = btn.getAttribute('data-package');

        // Toggle active button state
        packageButtons.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Toggle panel visibility
        packagePanels.forEach(panel => {
          const matches = panel.getAttribute('data-package') === targetPackage;
          panel.classList.toggle('active', matches);
          if (matches) {
            panel.classList.add('fade-in');
            setTimeout(() => panel.classList.remove('fade-in'), 300);
          }
        });
      });
    });
  }

  // Application Tabs (Section 5)
  const appTabs = document.querySelectorAll('.app-tab-btn');
  const appCards = document.querySelectorAll('.app-showcase-panel');

  if (appTabs.length > 0 && appCards.length > 0) {
    appTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetApp = tab.getAttribute('data-app');

        appTabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        appCards.forEach(card => {
          const matches = card.getAttribute('data-app') === targetApp;
          card.classList.toggle('active', matches);
        });
      });
    });
  }

  // Pre-fill consultation modal from package buttons
  document.querySelectorAll('[data-select-package]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkg = btn.getAttribute('data-select-package');
      const modalSelect = document.getElementById('consult-package');
      if (modalSelect && pkg) {
        modalSelect.value = pkg;
      }
      // Open modal if function exists
      if (window.openConsultModal) {
        window.openConsultModal();
      }
    });
  });
})();
