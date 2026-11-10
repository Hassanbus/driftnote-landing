// The mobile menu (the "hamburger" button).
// The only state is aria-expanded on the button. CSS shows or hides the menu
// by reading that attribute, so JavaScript never touches styles here.

// Must match the breakpoint in css/layout/header.css.
const DESKTOP_QUERY = '(min-width: 60rem)';

export function initMobileMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  if (!button || !nav) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
  }

  button.addEventListener('click', () => setOpen(!isOpen()));

  // Choosing a link means the visitor is done with the menu.
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Escape is the usual key to close things. Focus goes back to the button,
  // so keyboard users do not lose their place on the page.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  // A click or tap outside the menu closes it too.
  document.addEventListener('click', (event) => {
    const clickedInside = button.contains(event.target) || nav.contains(event.target);
    if (isOpen() && !clickedInside) setOpen(false);
  });

  // On a wide screen the button is hidden, so the "open" state must not stay behind.
  window.matchMedia(DESKTOP_QUERY).addEventListener('change', () => setOpen(false));
}
