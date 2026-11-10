// The dark mode button.
// theme-init.js already picked the first theme. This file handles the clicks.

// The same key is used in theme-init.js. Keep the two in sync.
const STORAGE_KEY = 'driftnote-theme';

export function initTheme() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;

  const root = document.documentElement;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    // aria-pressed tells screen readers if "Dark mode" is on or off.
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  // Make the button match the theme that theme-init.js chose.
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

  button.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

function saveTheme(theme) {
  // The choice stays in this browser only. It is never sent anywhere.
  // Private modes can block localStorage, so a failure here is ignored:
  // the button still works, the choice is just not remembered.
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Nothing to do.
  }
}
