// Highlights the nav link of the section the visitor is reading.
//
// WHY IntersectionObserver and not a scroll listener: the browser tells us
// only when a section enters or leaves, instead of running code on every
// scrolled pixel.

// The negative margins shrink the "viewport" to a thin line, 40% from the top.
// The section that crosses this line is the current one.
const READING_LINE = '-40% 0px -60% 0px';

export function initActiveNav() {
  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Look-up table: section id -> its nav link.
  const linkBySectionId = new Map();
  for (const link of links) {
    linkBySectionId.set(link.hash.slice(1), link);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = linkBySectionId.get(entry.target.id);
        if (entry.isIntersecting) {
          // aria-current also tells screen readers which link is the current one.
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: READING_LINE },
  );

  for (const sectionId of linkBySectionId.keys()) {
    const section = document.getElementById(sectionId);
    if (section) observer.observe(section);
  }
}
