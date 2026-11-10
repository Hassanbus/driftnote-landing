// The FAQ accordion: click a question to show its answer.
// Only one answer is open at a time.
//
// In the HTML every answer is visible. WHY: if JavaScript fails to load,
// people can still read everything. This file then closes the answers and
// turns the questions into working toggles ("progressive enhancement").

export function initFaq() {
  const faq = document.querySelector('[data-faq]');
  if (!faq) return;

  const buttons = [...faq.querySelectorAll('button[aria-controls]')];

  function setOpen(button, open) {
    // aria-expanded tells screen readers if the answer is shown or hidden.
    button.setAttribute('aria-expanded', String(open));

    // aria-controls holds the id of the answer that belongs to this question.
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    answer.hidden = !open;
  }

  // Start with only the first answer open.
  buttons.forEach((button, index) => setOpen(button, index === 0));

  faq.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button[aria-controls]');
    if (!clickedButton) return;

    const wasOpen = clickedButton.getAttribute('aria-expanded') === 'true';

    // One open at a time: close them all, then open the clicked one.
    // If it was already open, it just stays closed.
    for (const button of buttons) {
      setOpen(button, false);
    }
    if (!wasOpen) setOpen(clickedButton, true);
  });
}
