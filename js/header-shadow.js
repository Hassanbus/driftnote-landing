// Gives the header a shadow after the page is scrolled.
// WHY: at the top the header blends into the page. Once content scrolls
// under it, the shadow shows that the header is a separate layer.

const SCROLL_LIMIT = 8; // pixels

export function initHeaderShadow() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_LIMIT);
  }

  // The page can load already scrolled (for example after a refresh).
  update();

  // "passive" promises the browser that we never block scrolling,
  // so scrolling stays smooth.
  window.addEventListener('scroll', update, { passive: true });
}
