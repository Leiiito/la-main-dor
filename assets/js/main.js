document.addEventListener('DOMContentLoaded', () => {
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

  function setActiveTab(tab) {
    activeTab = normalize(tab);
    filters.forEach((btn) => {
      const isActive = normalize(btn.dataset.tab) === activeTab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    // If no search query, show only active panel; if query exists, handled in applySearch()
    applySearch();
  }

  function showOnlyPanel(panelId) {
    panels.forEach((p) => {
      p.classList.toggle('is-active', normalize(p.id) === normalize(panelId));
    });
  }

  function showAllPanels() {
    panels.forEach((p) => p.classList.add('is-active'));
  }

  function applySearch() {
    const q = searchInput ? normalize(searchInput.value) : '';

    if (q) {
      // Search across ALL prestations: show all panels but hide non-matching cards
      showAllPanels();

      panels.forEach((panel) => {
        const cards = Array.from(panel.querySelectorAll('.card.service'));
        let visibleInPanel = 0;
        cards.forEach((card) => {
          const text = normalize(card.innerText || '');
          const ok = text.includes(q);
          card.style.display = ok ? '' : 'none';
          if (ok) visibleInPanel += 1;
        });
        // If a panel has 0 results, hide the whole panel for cleanliness
        panel.style.display = visibleInPanel ? '' : 'none';
      });
    } else {
      // No search: reset display and show only active tab
      panels.forEach((panel) => {
        panel.style.display = '';
        Array.from(panel.querySelectorAll('.card.service')).forEach((card) => {
          card.style.display = '';
        });
      });
      showOnlyPanel(activeTab);
    }

    updateCounts(q);
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

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      // If search query is active, clicking a tab will clear search and go to that tab (more intuitive)
      if (searchInput && searchInput.value.trim().length) {
        searchInput.value = '';
      }
      setActiveTab(btn.dataset.tab);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  // Init
  showOnlyPanel(activeTab);
  updateCounts('');
});