/**
 * BuildLite - Consultation & Quote Modal Controller
 * Handles booking requests, interactive package selection, and form validation.
 */

(function () {
  'use strict';

  const modal = document.getElementById('consult-modal');
  const modalClose = document.getElementById('consult-modal-close');
  const consultForm = document.getElementById('consult-form');
  const consultSuccess = document.getElementById('consult-success');
  const modalTriggers = document.querySelectorAll('[data-open-consult]');

  function openConsultModal(defaultPackage) {
    if (!modal) return;
    if (defaultPackage) {
      const pkgSelect = document.getElementById('consult-package');
      if (pkgSelect) pkgSelect.value = defaultPackage;
    }
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    if (consultSuccess) consultSuccess.style.display = 'none';
    if (consultForm) {
      consultForm.style.display = 'block';
      const firstInput = consultForm.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeConsultModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  window.openConsultModal = openConsultModal;
  window.closeConsultModal = closeConsultModal;

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.getAttribute('data-package-pref');
      openConsultModal(pkg);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeConsultModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeConsultModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeConsultModal();
    }
  });

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consult-name')?.value;
      const email = document.getElementById('consult-email')?.value;
      const pkg = document.getElementById('consult-package')?.value;

      // Simulated smooth submission
      const submitBtn = consultForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      setTimeout(() => {
        if (consultForm) consultForm.style.display = 'none';
        if (consultSuccess) {
          consultSuccess.style.display = 'block';
          const successDetails = document.getElementById('success-details');
          if (successDetails) {
            successDetails.textContent = `Thank you, ${name}! Your consultation request for the ${pkg || 'BuildLite Modular System'} has been received. Our Burlington architectural engineering team will contact you at ${email} within 24 hours.`;
          }
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Consultation Request';
        }
      }, 700);
    });
  }
})();
