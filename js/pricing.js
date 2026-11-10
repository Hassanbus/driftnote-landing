// Pricing data and pure pricing math. No DOM in this file.
//
// WHY one data object: to change a price you edit one number here.
// The page (pricing-ui.js) and the tests (tests/pricing.test.js) both read it.
export const PLANS = {
  free: { name: 'Free', monthlyPrice: 0, perUser: false },
  plus: { name: 'Plus', monthlyPrice: 6, perUser: false },
  team: { name: 'Team', monthlyPrice: 12, perUser: true },
};

export const BILLING_PERIODS = ['monthly', 'yearly'];

const MONTHS_PER_YEAR = 12;
export const FREE_MONTHS_PER_YEAR = 2; // yearly billing = pay for 10 months, get 12

/** Price for one year when billed yearly. */
export function yearlyPrice(monthlyPrice) {
  return monthlyPrice * (MONTHS_PER_YEAR - FREE_MONTHS_PER_YEAR);
}

/** Money saved in one year by choosing yearly billing. */
export function yearlySavings(monthlyPrice) {
  return monthlyPrice * FREE_MONTHS_PER_YEAR;
}

/** Formats a number as dollars: 6 becomes "$6", 4.5 becomes "$4.50". */
export function formatPrice(amount) {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/**
 * Everything the page needs to show one plan for one billing period.
 * It throws an error for an unknown plan or period: a typo should fail loudly
 * instead of showing a wrong price.
 */
export function getPriceInfo(planId, billingPeriod) {
  // Object.hasOwn avoids surprises with built-in names such as "toString".
  if (!Object.hasOwn(PLANS, planId)) {
    throw new Error(`Unknown plan: ${planId}`);
  }
  if (!BILLING_PERIODS.includes(billingPeriod)) {
    throw new Error(`Unknown billing period: ${billingPeriod}`);
  }

  const plan = PLANS[planId];
  const isYearly = billingPeriod === 'yearly';
  const amount = isYearly ? yearlyPrice(plan.monthlyPrice) : plan.monthlyPrice;
  const unit = isYearly ? 'per year' : 'per month';

  return {
    amount,
    price: formatPrice(amount),
    period: plan.perUser ? `per user, ${unit}` : unit,
    note: getPriceNote(plan.monthlyPrice, isYearly),
  };
}

/** The small line under the price. */
function getPriceNote(monthlyPrice, isYearly) {
  if (monthlyPrice === 0) return 'No payment needed';
  if (!isYearly) return 'Billed every month';

  const savings = formatPrice(yearlySavings(monthlyPrice));
  return `${FREE_MONTHS_PER_YEAR} months free: you save ${savings} a year`;
}
