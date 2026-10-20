/**
 * Global App Controller: Theme Switcher, Navigation, Modals, Toasts
 */

(function () {
  'use strict';

  // 1. Theme Switcher (Light / Dark)
  const THEME_STORAGE_KEY = 'waheedunnisa_academic_theme';
  const htmlElement = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleIcons(theme);
  }

  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  function updateThemeToggleIcons(theme) {
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach((btn) => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }

  // 2. Mobile Navigation Toggle
  function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');

    if (!navToggle || !drawer) return;

    navToggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !navToggle.contains(e.target) && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Accessible Toast Notifications
  window.showToast = function (message, duration = 3000) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  };

  // 4. Modal Dialog Handlers
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button or first interactive element
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Global Keyboard Handling (Escape key closes drawer & modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        window.closeModal(openModal.id);
      }

      const drawer = document.querySelector('.mobile-drawer.open');
      if (drawer) {
        drawer.classList.remove('open');
        const navToggle = document.querySelector('.mobile-nav-toggle');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Modal Backdrop Click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      window.closeModal(e.target.id);
    }
  });

  // DOM Content Loaded Bindings
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();

    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
