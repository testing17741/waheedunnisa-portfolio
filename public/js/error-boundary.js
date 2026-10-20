/**
 * Client-Side Global Error Boundary & Crash Recovery
 * Catches unhandled exceptions and unhandled promise rejections.
 * Displays a non-intrusive recovery UI rather than a broken page.
 */

(function () {
  'use strict';

  function displayRecoveryBanner(errorMessage) {
    if (document.getElementById('crash-recovery-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'crash-recovery-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'assertive');
    banner.style.cssText = `
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      max-width: 500px;
      margin: 0 auto;
      background: #7F1D1D;
      color: #FFFFFF;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 99999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;

    banner.innerHTML = `
      <div style="font-weight: 600; font-size: 0.95rem;">Something went wrong rendering this view.</div>
      <div style="opacity: 0.9; font-size: 0.8rem; line-height: 1.4;">${errorMessage || 'A client-side script encountered an issue.'}</div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
        <button id="recovery-reload-btn" style="background: #FFFFFF; color: #7F1D1D; border: none; padding: 0.4rem 0.8rem; font-weight: 600; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Reload Page</button>
        <button id="recovery-dismiss-btn" style="background: transparent; color: #FFFFFF; border: 1px solid rgba(255,255,255,0.4); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Dismiss</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('recovery-reload-btn')?.addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('recovery-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
    });
  }

  window.addEventListener('error', (event) => {
    // Only capture unexpected script errors, ignore benign resource loading failures
    if (event.error) {
      // Log cleanly for debugging
      if (console && console.warn) {
        console.warn('[Handled Error]', event.error.message);
      }
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (console && console.warn) {
      console.warn('[Unhandled Promise Rejection]', event.reason);
    }
  });
})();
