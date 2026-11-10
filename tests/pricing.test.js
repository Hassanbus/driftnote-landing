// Tests for the pricing data and the pure pricing functions.
// Run them with: npm test
import { describe, expect, it } from 'vitest';
import {
  BILLING_PERIODS,
  FREE_MONTHS_PER_YEAR,
  PLANS,
  formatPrice,
  getPriceInfo,
  yearlyPrice,
  yearlySavings,
} from '../js/pricing.js';

describe('PLANS data', () => {
  it('has exactly three plans', () => {
    expect(Object.keys(PLANS)).toEqual(['free', 'plus', 'team']);
  });

  it('gives every plan a name and a price that is not negative', () => {
    for (const plan of Object.values(PLANS)) {
      expect(plan.name).toBeTypeOf('string');
      expect(plan.monthlyPrice).toBeGreaterThanOrEqual(0);
    }
  });

  it('offers monthly and yearly billing', () => {
    expect(BILLING_PERIODS).toEqual(['monthly', 'yearly']);
  });
});

describe('yearlyPrice', () => {
  it('gives two months free', () => {
    expect(FREE_MONTHS_PER_YEAR).toBe(2);
    expect(yearlyPrice(6)).toBe(60); // 10 months x $6
    expect(yearlyPrice(12)).toBe(120);
  });

  it('keeps a free plan free', () => {
    expect(yearlyPrice(0)).toBe(0);
  });

  it('is always cheaper than 12 monthly payments for paid plans', () => {
    for (const plan of Object.values(PLANS)) {
      if (plan.monthlyPrice > 0) {
        expect(yearlyPrice(plan.monthlyPrice)).toBeLessThan(plan.monthlyPrice * 12);
      }
    }
  });
});

describe('yearlySavings', () => {
  it('is the price of the free months', () => {
    expect(yearlySavings(6)).toBe(12);
    expect(yearlySavings(0)).toBe(0);
  });

  it('adds up: yearly price + savings = 12 monthly payments', () => {
    expect(yearlyPrice(12) + yearlySavings(12)).toBe(12 * 12);
  });
});

describe('formatPrice', () => {
  it('shows whole dollars without decimals', () => {
    expect(formatPrice(0)).toBe('$0');
    expect(formatPrice(60)).toBe('$60');
  });

  it('shows cents with two decimals', () => {
    expect(formatPrice(4.5)).toBe('$4.50');
  });
});

describe('getPriceInfo', () => {
  it('returns the monthly price of a plan', () => {
    expect(getPriceInfo('plus', 'monthly')).toEqual({
      amount: 6,
      price: '$6',
      period: 'per month',
      note: 'Billed every month',
    });
  });

  it('returns the yearly price with the savings', () => {
    expect(getPriceInfo('plus', 'yearly')).toEqual({
      amount: 60,
      price: '$60',
      period: 'per year',
      note: '2 months free: you save $12 a year',
    });
  });

  it('says "per user" for the team plan', () => {
    expect(getPriceInfo('team', 'monthly').period).toBe('per user, per month');
    expect(getPriceInfo('team', 'yearly').period).toBe('per user, per year');
    expect(getPriceInfo('team', 'yearly').price).toBe('$120');
  });

  it('keeps the free plan at $0 for both periods', () => {
    for (const period of BILLING_PERIODS) {
      const info = getPriceInfo('free', period);
      expect(info.price).toBe('$0');
      expect(info.note).toBe('No payment needed');
    }
  });

  it('reads the price from PLANS and does not hard-code it', () => {
    expect(getPriceInfo('team', 'monthly').amount).toBe(PLANS.team.monthlyPrice);
  });

  it('throws for an unknown plan', () => {
    expect(() => getPriceInfo('gold', 'monthly')).toThrow('Unknown plan: gold');
    expect(() => getPriceInfo('toString', 'monthly')).toThrow('Unknown plan');
  });

  it('throws for an unknown billing period', () => {
    expect(() => getPriceInfo('plus', 'weekly')).toThrow('Unknown billing period: weekly');
  });
});
