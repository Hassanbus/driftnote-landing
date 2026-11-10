// Tests for the pure calculator functions.
// Run them with: npm test
import { describe, expect, it } from 'vitest';
import {
  SHARE_OF_SEARCH_TIME_SAVED,
  WORK_DAYS_PER_MONTH,
  hoursSavedPerMonth,
  hoursSavedPerYear,
  roundToOneDecimal,
  toPositiveNumber,
} from '../js/calculator.js';

describe('toPositiveNumber', () => {
  it('keeps positive numbers as they are', () => {
    expect(toPositiveNumber(7)).toBe(7);
    expect(toPositiveNumber(0.5)).toBe(0.5);
  });

  it('converts slider text to a number', () => {
    expect(toPositiveNumber('12')).toBe(12);
    expect(toPositiveNumber('2.5')).toBe(2.5);
  });

  it('turns broken or negative input into 0', () => {
    for (const badValue of ['abc', '', null, undefined, NaN, Infinity, -3, '-1']) {
      expect(toPositiveNumber(badValue)).toBe(0);
    }
  });
});

describe('roundToOneDecimal', () => {
  it('rounds to one decimal place', () => {
    expect(roundToOneDecimal(3.666)).toBe(3.7);
    expect(roundToOneDecimal(3.64)).toBe(3.6);
    expect(roundToOneDecimal(8.25)).toBe(8.3);
  });

  it('leaves whole numbers alone', () => {
    expect(roundToOneDecimal(5)).toBe(5);
    expect(roundToOneDecimal(0)).toBe(0);
  });
});

describe('hoursSavedPerMonth', () => {
  it('follows the formula step by step', () => {
    // 10 notes x 2 minutes = 20 minutes a day
    // x 22 working days = 440 minutes a month
    // half of that is saved = 220 minutes = 3.666... hours
    expect(hoursSavedPerMonth(10, 2)).toBe(3.7);
  });

  it('uses the named assumptions', () => {
    const expected = roundToOneDecimal((12 * 3 * WORK_DAYS_PER_MONTH * SHARE_OF_SEARCH_TIME_SAVED) / 60);
    expect(hoursSavedPerMonth(12, 3)).toBe(expected);
    expect(expected).toBe(6.6);
  });

  it('gives a whole number when the math is exact', () => {
    expect(hoursSavedPerMonth(30, 4)).toBe(22);
  });

  it('accepts the text values that sliders give', () => {
    expect(hoursSavedPerMonth('10', '2')).toBe(3.7);
    expect(hoursSavedPerMonth('20', '0.5')).toBe(1.8);
  });

  it('works at both ends of the sliders', () => {
    expect(hoursSavedPerMonth(1, 0.5)).toBe(0.1);
    expect(hoursSavedPerMonth(40, 10)).toBe(73.3);
  });

  it('is 0 when one input is 0', () => {
    expect(hoursSavedPerMonth(0, 5)).toBe(0);
    expect(hoursSavedPerMonth(5, 0)).toBe(0);
  });

  it('treats negative or broken input as 0 instead of crashing', () => {
    expect(hoursSavedPerMonth(-5, 2)).toBe(0);
    expect(hoursSavedPerMonth('abc', 2)).toBe(0);
    expect(hoursSavedPerMonth(undefined, undefined)).toBe(0);
  });

  it('grows when an input grows', () => {
    expect(hoursSavedPerMonth(11, 2)).toBeGreaterThan(hoursSavedPerMonth(10, 2));
    expect(hoursSavedPerMonth(10, 3)).toBeGreaterThan(hoursSavedPerMonth(10, 2));
  });

  it('doubles when the notes double', () => {
    expect(hoursSavedPerMonth(10, 3)).toBe(5.5);
    expect(hoursSavedPerMonth(20, 3)).toBe(11);
  });

  it('is pure: the same input always gives the same output', () => {
    expect(hoursSavedPerMonth(15, 2.5)).toBe(hoursSavedPerMonth(15, 2.5));
  });
});

describe('hoursSavedPerYear', () => {
  it('multiplies by 12 and rounds to a whole number', () => {
    expect(hoursSavedPerYear(5.5)).toBe(66);
    expect(hoursSavedPerYear(3.7)).toBe(44);
  });

  it('is 0 for 0 or broken input', () => {
    expect(hoursSavedPerYear(0)).toBe(0);
    expect(hoursSavedPerYear('abc')).toBe(0);
  });
});
