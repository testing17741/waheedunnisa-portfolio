/**
 * Contact Form Controller: Client Validation, DPDP Compliance, and API Submission
 */

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('academic-contact-form');
    if (!form) return;

    const alertBox = document.getElementById('form-alert-box');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

    function showAlert(type, message) {
      if (!alertBox) return;
      alertBox.className = `form-alert ${type}`;
      alertBox.textContent = message;
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearErrors() {
      if (alertBox) {
        alertBox.className = 'form-alert';
        alertBox.textContent = '';
      }
      form.querySelectorAll('.field-error-msg').forEach((el) => {
        el.textContent = '';
        el.classList.remove('visible');
      });
      form.querySelectorAll('.is-invalid').forEach((el) => {
        el.classList.remove('is-invalid');
      });
    }

    function setFieldError(fieldId, errorMsg) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(`${fieldId}-error`);
      if (field) field.classList.add('is-invalid');
      if (errEl) {
        errEl.textContent = errorMsg;
        errEl.classList.add('visible');
      }
    }

    function validateClient() {
      clearErrors();
      let isValid = true;

      const fullName = (document.getElementById('contact-name')?.value || '').trim();
      const email = (document.getElementById('contact-email')?.value || '').trim();
      const subject = document.getElementById('contact-subject')?.value || '';
      const message = (document.getElementById('contact-message')?.value || '').trim();
      const dpdpConsent = document.getElementById('contact-dpdp')?.checked || false;

      // 1. Name validation
      if (!fullName || fullName.length < 2) {
        setFieldError('contact-name', 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      } else if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
        setFieldError('contact-name', 'Name contains unsupported characters.');
        isValid = false;
      }

      // 2. Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setFieldError('contact-email', 'Please provide a valid email address.');
        isValid = false;
      }

      // 3. Subject validation
      if (!subject) {
        setFieldError('contact-subject', 'Please select an inquiry category.');
        isValid = false;
      }

      // 4. Message validation
      if (!message || message.length < 15) {
        setFieldError('contact-message', 'Message must contain at least 15 characters.');
        isValid = false;
      }

      // 5. DPDP Consent validation
      if (!dpdpConsent) {
        const consentErr = document.getElementById('contact-dpdp-error');
        if (consentErr) {
          consentErr.textContent = 'Consent is required to submit your inquiry under India DPDP Act 2023.';
          consentErr.classList.add('visible');
        }
        isValid = false;
      }

      return isValid;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateClient()) {
        showAlert('error', 'Please resolve the highlighted fields above before submitting.');
        return;
      }

      // Set loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Delivering Inquiry...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      const payload = {
        fullName: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        affiliation: document.getElementById('contact-affiliation')?.value.trim() || '',
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value.trim(),
        dpdpConsent: document.getElementById('contact-dpdp').checked,
        website: document.getElementById('contact-hp')?.value || '' // Honeypot trap
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok && result.success) {
          showAlert(
            'success',
            `Inquiry received successfully. Reference Identifier: ${result.data.inquiryId}. Ms. Waheedunnisa Chaudri will review your academic message.`
          );
          form.reset();
        } else {
          // Field-specific errors from backend
          if (result.error && result.error.details) {
            Object.entries(result.error.details).forEach(([key, errors]) => {
              const fieldMap = {
                fullName: 'contact-name',
                email: 'contact-email',
                affiliation: 'contact-affiliation',
                subject: 'contact-subject',
                message: 'contact-message',
                dpdpConsent: 'contact-dpdp'
              };
              const mappedId = fieldMap[key];
              if (mappedId) setFieldError(mappedId, errors[0]);
            });
            showAlert('error', 'Validation error. Please verify the marked inputs.');
          } else {
            showAlert('error', (result.error && result.error.message) || 'Failed to submit inquiry. Please try again.');
          }
        }
      } catch (err) {
        if (console && console.warn) console.warn('Network error submitting contact form', err);
        showAlert('error', 'A network error occurred while sending your message. Please check your connection.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Academic Inquiry';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initContactForm);
})();
