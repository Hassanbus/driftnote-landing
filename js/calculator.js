// Pure math for the "time saved" calculator.
//
// "Pure" means: the same input always gives the same output, and the function
// touches nothing outside itself (no page, no storage, no network).
// WHY: pure functions are easy to test. See tests/calculator.test.js.

// The assumptions have names, so they are easy to find, explain and change.
export const WORK_DAYS_PER_MONTH = 22;
export const SHARE_OF_SEARCH_TIME_SAVED = 0.5; // example: search time is cut in half
export const MONTHS_PER_YEAR = 12;
const MINUTES_PER_HOUR = 60;

/**
 * Turns any input into a safe number.
 * Sliders give text ("2.5"), so we convert. Bad or negative input becomes 0.
 */
export function toPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

/** Rounds to one decimal place: 3.666 becomes 3.7. */
export function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Hours saved per month.
 *
 *   notes per day x minutes per note = minutes spent searching each day
 *   x working days per month         = minutes spent searching each month
 *   x share of that time saved       = minutes saved each month
 *   / 60                             = hours saved each month
 */
export function hoursSavedPerMonth(notesPerDay, minutesPerNote) {
  const minutesSearchingPerDay = toPositiveNumber(notesPerDay) * toPositiveNumber(minutesPerNote);
  const minutesSavedPerMonth = minutesSearchingPerDay * WORK_DAYS_PER_MONTH * SHARE_OF_SEARCH_TIME_SAVED;
  return roundToOneDecimal(minutesSavedPerMonth / MINUTES_PER_HOUR);
}

/** Hours saved per year, as a whole number. */
export function hoursSavedPerYear(hoursPerMonth) {
  return Math.round(toPositiveNumber(hoursPerMonth) * MONTHS_PER_YEAR);
}
