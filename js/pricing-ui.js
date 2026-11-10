// Shows the prices on the page and reacts to the Monthly / Yearly switch.
// The numbers come from pricing.js. This file only writes them into the HTML.
import { getPriceInfo } from './pricing.js';

export function initPricing() {
  const billing = document.querySelector('[data-billing]');
  const cards = document.querySelectorAll('[data-plan]');
  if (!billing || !cards.length) return;

  const status = document.querySelector('[data-billing-status]');

  function showPrices(billingPeriod) {
    for (const card of cards) {
      // data-plan="plus" in the HTML tells us which plan this card shows.
      const info = getPriceInfo(card.dataset.plan, billingPeriod);
      card.querySelector('[data-price]').textContent = info.price;
      card.querySelector('[data-period]').textContent = info.period;
      card.querySelector('[data-note]').textContent = info.note;
    }
  }

  // The switch is two radio buttons, so "change" fires when another one is picked.
  billing.addEventListener('change', (event) => {
    const billingPeriod = event.target.value;
    showPrices(billingPeriod);
    // A hidden status line tells screen reader users that the prices changed.
    status.textContent = `Prices now show ${billingPeriod} billing.`;
  });

  // Some browsers remember the chosen radio button after a reload,
  // so read the real state instead of assuming "monthly".
  showPrices(billing.querySelector('input:checked').value);
}
