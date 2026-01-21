document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Mobile nav toggle
  // =========================
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================
  // Prestations tabs + global search
  // =========================
  const filters = Array.from(document.querySelectorAll('.filter'));
  const panels = Array.from(document.querySelectorAll('.services-panel'));
  const searchInput = document.getElementById('prestationSearch');

  const normalize = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  let activeTab =
    normalize(document.querySelector('.filter.is-active')?.dataset.tab) || 'ongles';

  function showOnlyPanel(panelId) {
    panels.forEach((p) => p.classList.toggle('is-active', normalize(p.id) === normalize(panelId)));
  }
  function showAllPanels() {
    panels.forEach((p) => p.classList.add('is-active'));
  }

  function updateCounts(q) {
    filters.forEach((btn) => {
      const panelId = normalize(btn.dataset.tab);
      const panel = document.getElementById(panelId);
      const countEl = btn.querySelector('.count');
      if (!panel || !countEl) return;

      const cards = Array.from(panel.querySelectorAll('.card.service'));
      let n = 0;
      cards.forEach((card) => {
        const text = normalize(card.innerText || '');
        if (!q || text.includes(q)) n += 1;
      });
      countEl.textContent = n ? String(n) : '';
    });
  }

  function applySearch() {
    const q = searchInput ? normalize(searchInput.value) : '';

    if (q) {
      // Search across all prestations
      showAllPanels();
      panels.forEach((panel) => {
        const cards = Array.from(panel.querySelectorAll('.card.service'));
        let visible = 0;
        cards.forEach((card) => {
          const text = normalize(card.innerText || '');
          const ok = text.includes(q);
          card.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });
        panel.style.display = visible ? '' : 'none';
      });
    } else {
      // Reset
      panels.forEach((panel) => {
        panel.style.display = '';
        Array.from(panel.querySelectorAll('.card.service')).forEach((card) => (card.style.display = ''));
      });
      showOnlyPanel(activeTab);
    }

    updateCounts(q);
  }

  function setActiveTab(tab) {
    activeTab = normalize(tab);
    filters.forEach((btn) => {
      const isActive = normalize(btn.dataset.tab) === activeTab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (searchInput && searchInput.value.trim().length) searchInput.value = '';
    applySearch();
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  if (searchInput) searchInput.addEventListener('input', applySearch);

  // Init
  showOnlyPanel(activeTab);
  updateCounts('');

  // =========================
  // Lightbox (gallery)
  // =========================
  const gallery = document.querySelector('[data-gallery]');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) {
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }
  }

  if (gallery) {
    gallery.querySelectorAll('img').forEach((img) => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});