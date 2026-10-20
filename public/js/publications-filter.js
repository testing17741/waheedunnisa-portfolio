/**
 * Publications Search, Filter, and Citation Generator
 */

(function () {
  'use strict';

  let publicationsData = [];

  async function loadPublications() {
    const container = document.getElementById('publications-grid');
    if (!container) return;

    try {
      const response = await fetch('/data/publications.json');
      if (!response.ok) throw new Error('Network error loading data');
      publicationsData = await response.json();
      renderPublications(publicationsData);
      initFilterControls();
    } catch (err) {
      if (console && console.warn) console.warn('Could not load publications', err);
      container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
          <p>Publications catalog is momentarily unavailable. Please refresh or try again shortly.</p>
        </div>
      `;
    }
  }

  function renderPublications(items) {
    const container = document.getElementById('publications-grid');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="font-weight: 600; color: var(--color-text);">No publications found matching your search criteria.</p>
          <button id="reset-filter-btn" class="btn btn-secondary btn-sm" style="margin-top: 1rem;">Reset Filters</button>
        </div>
      `;
      document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tab-btn[data-category="all"]')?.classList.add('active');
        const searchInput = document.getElementById('publication-search');
        if (searchInput) searchInput.value = '';
        renderPublications(publicationsData);
      });
      return;
    }

    container.innerHTML = items.map((pub) => `
      <article class="card" data-category="${pub.category}" id="pub-${pub.id}">
        <div class="card-header">
          <span class="badge ${pub.peerReviewed ? 'badge-primary' : 'badge-accent'}">
            ${pub.peerReviewed ? 'Peer-Reviewed' : 'Academic Publication'}
          </span>
          <span class="font-mono" style="font-size: var(--text-xs); color: var(--color-text-light);">
            ${pub.year}
          </span>
        </div>
        <h3 class="card-title">${escapeHtml(pub.title)}</h3>
        <p class="card-authors">
          ${pub.authors.map(a => a.includes('Waheedunnisa') ? `<strong>${escapeHtml(a)}</strong>` : escapeHtml(a)).join(', ')}
        </p>
        <p class="card-body">
          ${escapeHtml(pub.abstract.length > 220 ? pub.abstract.slice(0, 220) + '...' : pub.abstract)}
        </p>
        <div class="card-tags">
          ${(pub.keywords || []).slice(0, 3).map(k => `<span class="badge">${escapeHtml(k)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary btn-sm open-dossier-btn" data-id="${pub.id}" aria-label="View details for ${escapeHtml(pub.title)}">
            View Details
          </button>
          <button class="btn btn-primary btn-sm open-cite-btn" data-id="${pub.id}" aria-label="Cite ${escapeHtml(pub.title)}">
            Cite
          </button>
        </div>
      </article>
    `).join('');

    bindItemButtons();
  }

  function bindItemButtons() {
    document.querySelectorAll('.open-dossier-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pub = publicationsData.find(p => p.id === id);
        if (pub) showDossierModal(pub);
      });
    });

    document.querySelectorAll('.open-cite-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pub = publicationsData.find(p => p.id === id);
        if (pub) showCitationModal(pub);
      });
    });
  }

  function showDossierModal(pub) {
    const modal = document.getElementById('dossier-modal');
    if (!modal) return;

    document.getElementById('dossier-modal-title').textContent = pub.title;
    document.getElementById('dossier-modal-venue').textContent = pub.venue + (pub.volume ? ` (Vol. ${pub.volume}, Issue ${pub.issue})` : '');
    document.getElementById('dossier-modal-authors').textContent = pub.authors.join(', ');
    document.getElementById('dossier-modal-abstract').textContent = pub.abstract;

    const metaList = document.getElementById('dossier-modal-meta');
    metaList.innerHTML = `
      ${pub.paperId ? `<div class="card-spec-item"><span class="spec-key">Paper Identifier:</span> <span class="spec-val font-mono">${escapeHtml(pub.paperId)}</span></div>` : ''}
      ${pub.issn ? `<div class="card-spec-item"><span class="spec-key">ISSN:</span> <span class="spec-val font-mono">${escapeHtml(pub.issn)}</span></div>` : ''}
      <div class="card-spec-item"><span class="spec-key">Category:</span> <span class="spec-val">${escapeHtml(pub.category)}</span></div>
      <div class="card-spec-item"><span class="spec-key">Publication Year:</span> <span class="spec-val">${pub.year}</span></div>
    `;

    const actionContainer = document.getElementById('dossier-modal-actions');
    actionContainer.innerHTML = `
      ${pub.doiUrl ? `<a href="${pub.doiUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Official Journal Record</a>` : ''}
      ${pub.openAccessUrl ? `<a href="${pub.openAccessUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Open Access Document</a>` : ''}
    `;

    window.openModal('dossier-modal');
  }

  function showCitationModal(pub) {
    const modal = document.getElementById('citation-modal');
    if (!modal) return;

    document.getElementById('citation-paper-title').textContent = pub.title;
    document.getElementById('citation-apa-text').textContent = pub.apa;
    document.getElementById('citation-bibtex-text').textContent = pub.bibtex;

    document.getElementById('copy-apa-btn').onclick = () => {
      copyToClipboard(pub.apa, 'APA citation copied to clipboard.');
    };

    document.getElementById('copy-bibtex-btn').onclick = () => {
      copyToClipboard(pub.bibtex, 'BibTeX citation copied to clipboard.');
    };

    window.openModal('citation-modal');
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(successMsg);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      window.showToast(successMsg);
    } catch (e) { // eslint-disable-line no-unused-vars
      window.showToast('Could not copy automatically. Please select text manually.');
    }
    document.body.removeChild(textarea);
  }

  function initFilterControls() {
    const tabButtons = document.querySelectorAll('.tab-btn[data-category]');
    const searchInput = document.getElementById('publication-search');

    function applyFilters() {
      const activeBtn = document.querySelector('.tab-btn.active');
      const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      const filtered = publicationsData.filter((pub) => {
        const matchesCategory = category === 'all' || pub.category === category;
        const matchesQuery = !query || 
          pub.title.toLowerCase().includes(query) ||
          pub.abstract.toLowerCase().includes(query) ||
          (pub.keywords && pub.keywords.some(k => k.toLowerCase().includes(query))) ||
          pub.authors.some(a => a.toLowerCase().includes(query));

        return matchesCategory && matchesQuery;
      });

      renderPublications(filtered);
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', loadPublications);
})();
