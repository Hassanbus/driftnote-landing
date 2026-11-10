// Scroll reveal: blocks fade in the first time they scroll into view.
//
// Three safety rules:
// 1. Nothing is hidden in the HTML or in the CSS. This file hides only the
//    blocks that are below the screen when it starts. If JavaScript fails,
//    every block is simply visible.
// 2. People who ask their system for less motion get no reveal at all.
// 3. Each block is revealed once and then left alone.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// The bottom 10% of the screen does not count as "in view" yet,
// so a block starts to appear when it is clearly on screen.
const VIEW_MARGIN = '0px 0px -10% 0px';

export function initReveal() {
  const blocks = document.querySelectorAll('[data-reveal]');
  if (!blocks.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        // Swap "waiting" for "coming in": the CSS animation does the rest.
        entry.target.classList.replace('reveal-wait', 'reveal-in');
        // Stop watching this block, so it never animates a second time.
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: VIEW_MARGIN },
  );

  for (const block of blocks) {
    // Blocks that are already on screen stay as they are: no flicker on load.
    const isBelowScreen = block.getBoundingClientRect().top > window.innerHeight;
    if (isBelowScreen) {
      block.classList.add('reveal-wait');
      observer.observe(block);
    }
  }
}
