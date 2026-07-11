'use strict';

const THEME_KEY = 'pd-theme';
const LIGHT = 'light';
const DARK = 'dark';
let listenersInstalled = false;

function isTheme(value) {
  return value === LIGHT || value === DARK;
}

function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isTheme(value) ? value : '';
  } catch {
    return '';
  }
}

function readSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? DARK
    : LIGHT;
}

export function getPreferredTheme() {
  return readStoredTheme() || readSystemTheme();
}

function syncToggleButtons(theme) {
  const isDark = theme === DARK;
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    const label = btn.querySelector('[data-theme-label]');
    if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
  });
}

export function applyTheme(theme, { persist = false } = {}) {
  const next = theme === DARK ? DARK : LIGHT;
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;
  if (document.body) document.body.dataset.theme = next;

  if (persist) {
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  }

  syncToggleButtons(next);
  return next;
}

export function setTheme(theme) {
  return applyTheme(theme, { persist: true });
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme === DARK ? DARK : LIGHT;
  return setTheme(current === DARK ? LIGHT : DARK);
}

export function initTheme() {
  applyTheme(getPreferredTheme());

  if (listenersInstalled) return;
  listenersInstalled = true;

  document.addEventListener('click', (event) => {
    const target = event.target && typeof event.target.closest === 'function'
      ? event.target.closest('[data-theme-toggle]')
      : null;
    if (!target) return;
    event.preventDefault();
    toggleTheme();
  });

  window.addEventListener('storage', (event) => {
    if (event.key && event.key !== THEME_KEY) return;
    applyTheme(getPreferredTheme());
  });
}
