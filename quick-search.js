'use strict';

const DEFAULTS = {
  title: 'Quick Search',
  subtitle: 'Find documents fast.',
  placeholder: 'Search documents',
  emptyText: 'No matching documents.',
  shortcutLabel: 'Ctrl/⌘K',
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function norm(s) {
  return String(s == null ? '' : s).toLowerCase().trim().replace(/\s+/g, ' ');
}

function ensureOverlay() {
  let el = document.getElementById('quickSearchModal');
  if (el) return el;

  el = document.createElement('div');
  el.id = 'quickSearchModal';
  el.className = 'modal modal--quick-search no-print';
  el.hidden = true;
  el.innerHTML = `
    <div class="modal__content modal__content--quick-search card" role="dialog" aria-modal="true" aria-labelledby="quickSearchTitle">
      <div class="quick-search__header">
        <div>
          <h2 class="card__title" id="quickSearchTitle">${DEFAULTS.title}</h2>
          <p id="quickSearchSubtitle" class="card__hint" style="margin-top:0.35rem;">${DEFAULTS.subtitle}</p>
        </div>
        <button type="button" class="modal__close" data-quick-close aria-label="Close quick search">&times;</button>
      </div>
      <div class="quick-search__inputrow">
        <input id="quickSearchInput" class="input quick-search__input" type="search" placeholder="${DEFAULTS.placeholder}" autocomplete="off" />
        <span class="quick-search__shortcut">${DEFAULTS.shortcutLabel}</span>
      </div>
      <div id="quickSearchStatus" class="quick-search__status" hidden></div>
      <div id="quickSearchResults" class="quick-search__results" role="listbox" aria-label="Search results"></div>
      <div class="quick-search__footer">
        <span>Search by title, client, document number, or keywords.</span>
        <span>Enter to open, Esc to close.</span>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  return el;
}

function renderItem(item, active) {
  const meta = item.meta ? `<div class="quick-search__meta">${esc(item.meta)}</div>` : '';
  return `
    <button type="button" class="quick-search__item${active ? ' quick-search__item--active' : ''}" role="option" aria-selected="${active ? 'true' : 'false'}" data-index="${item.index}">
      <div class="quick-search__icon quick-search__icon--${esc(item.kind || 'document')}">${esc((item.kindLabel || 'Doc').slice(0, 1))}</div>
      <div class="quick-search__body">
        <div class="quick-search__title">${esc(item.title || 'Untitled')}</div>
        ${meta}
      </div>
      <div class="quick-search__chev">↵</div>
    </button>
  `;
}

export function createQuickSearch({
  buttonId = null,
  title = DEFAULTS.title,
  subtitle = DEFAULTS.subtitle,
  placeholder = DEFAULTS.placeholder,
  emptyText = DEFAULTS.emptyText,
  shortcutLabel = DEFAULTS.shortcutLabel,
  getItems,
  onSelect,
} = {}) {
  if (typeof getItems !== 'function' || typeof onSelect !== 'function') {
    throw new Error('createQuickSearch requires getItems and onSelect callbacks.');
  }

  const modal = ensureOverlay();
  const input = modal.querySelector('#quickSearchInput');
  const results = modal.querySelector('#quickSearchResults');
  const status = modal.querySelector('#quickSearchStatus');
  const titleEl = modal.querySelector('#quickSearchTitle');
  const subtitleEl = modal.querySelector('#quickSearchSubtitle');
  const closeBtns = Array.from(modal.querySelectorAll('[data-quick-close]'));
  let items = [];
  let filtered = [];
  let activeIndex = 0;
  let open = false;
  let loading = false;
  let lastQuery = '';

  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;
  input.placeholder = placeholder;
  modal.querySelector('.quick-search__shortcut').textContent = shortcutLabel;

  function setStatus(text, hidden = false) {
    status.textContent = text || '';
    status.hidden = hidden || !text;
  }

  function applyFilter(query) {
    const q = norm(query);
    lastQuery = query;
    const source = items.slice();
    filtered = q
      ? source.filter((item) => norm([item.title, item.meta, item.keywords, item.kindLabel].filter(Boolean).join(' ')).includes(q))
      : source;
    activeIndex = filtered.length ? Math.min(activeIndex, filtered.length - 1) : 0;
    if (!filtered.length) {
      results.innerHTML = '';
      setStatus(emptyText, false);
      return;
    }
    setStatus('', true);
    results.innerHTML = filtered.map((item, idx) => renderItem({ ...item, index: idx }, idx === activeIndex)).join('');
  }

  async function refreshItems() {
    loading = true;
    setStatus('Searching documents…', false);
    results.innerHTML = '';
    try {
      const nextItems = await getItems();
      items = Array.isArray(nextItems) ? nextItems : [];
      loading = false;
      applyFilter(input.value);
    } catch (err) {
      loading = false;
      setStatus(err && err.message ? err.message : 'Quick search is temporarily unavailable.', false);
    }
  }

  function syncActive() {
    Array.from(results.querySelectorAll('.quick-search__item')).forEach((el, idx) => {
      const active = idx === activeIndex;
      el.classList.toggle('quick-search__item--active', active);
      el.setAttribute('aria-selected', String(active));
      if (active) el.scrollIntoView({ block: 'nearest' });
    });
  }

  async function selectActive() {
    if (!filtered.length) return;
    const item = filtered[activeIndex];
    close();
    await onSelect(item);
  }

  function openSearch() {
    if (open) return;
    open = true;
    modal.hidden = false;
    modal.classList.add('modal--visible');
    document.body.classList.add('quick-search-open');
    input.value = '';
    activeIndex = 0;
    setStatus('Loading documents…', false);
    results.innerHTML = '';
    refreshItems().finally(() => {
      if (open) input.focus();
    });
  }

  function close() {
    open = false;
    modal.classList.remove('modal--visible');
    modal.hidden = true;
    document.body.classList.remove('quick-search-open');
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  closeBtns.forEach((btn) => btn.addEventListener('click', close));
  input.addEventListener('input', () => {
    activeIndex = 0;
    applyFilter(input.value);
  });
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, Math.max(filtered.length - 1, 0)); syncActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); syncActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); await selectActive(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  results.addEventListener('click', async (e) => {
    const row = e.target.closest('.quick-search__item');
    if (!row) return;
    const idx = Number(row.dataset.index);
    if (Number.isNaN(idx) || !filtered[idx]) return;
    activeIndex = idx;
    await selectActive();
  });

  document.addEventListener('keydown', (e) => {
    const key = String(e.key || '').toLowerCase();
    const mod = e.metaKey || e.ctrlKey;
    if (mod && key === 'k') {
      const active = document.activeElement;
      if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) && !modal.contains(active)) return;
      e.preventDefault();
      openSearch();
      return;
    }
    if (!open) return;
    if (key === 'escape') { e.preventDefault(); close(); }
  });

  if (buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn) btn.addEventListener('click', openSearch);
  }

  return {
    open: openSearch,
    close,
    refresh: refreshItems,
    setItems(next) {
      items = Array.isArray(next) ? next : [];
      if (open) applyFilter(input.value);
    },
  };
}
