// The "back to top" button: it shows up after the page is scrolled down.
//
// The button is a normal link to #top, so the jump itself needs no
// JavaScript. This file only decides when the button is visible.

const SHOW_AFTER = 600; // pixels scrolled

export function initBackToTop() {
  const button = document.querySelector('[data-back-to-top]');
  if (!button) return;

  function update() {
    button.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
  }

  // The page can load already scrolled (for example after a refresh).
  update();
  window.addEventListener('scroll', update, { passive: true });
}
