// Connects the calculator sliders to the page.
// The math lives in calculator.js. This file only reads inputs and writes outputs.
import { hoursSavedPerMonth, hoursSavedPerYear } from './calculator.js';

export function initCalculator() {
  const calculator = document.querySelector('[data-calculator]');
  if (!calculator) return;

  const notesInput = calculator.querySelector('#notes-per-day');
  const minutesInput = calculator.querySelector('#minutes-per-note');
  const notesLabel = calculator.querySelector('[data-notes-value]');
  const minutesLabel = calculator.querySelector('[data-minutes-value]');
  const monthOutput = calculator.querySelector('[data-hours-month]');
  const yearOutput = calculator.querySelector('[data-hours-year]');

  function update() {
    // Slider values are text, for example "10" or "2.5".
    const notes = notesInput.value;
    const minutes = minutesInput.value;
    const hoursPerMonth = hoursSavedPerMonth(notes, minutes);

    const notesText = `${notes} ${notes === '1' ? 'note' : 'notes'}`;
    const minutesText = `${minutes} ${minutes === '1' ? 'minute' : 'minutes'}`;

    notesLabel.textContent = notesText;
    minutesLabel.textContent = `${minutes} min`;

    // aria-valuetext lets a screen reader say "10 notes per day", not only "10".
    notesInput.setAttribute('aria-valuetext', `${notesText} per day`);
    minutesInput.setAttribute('aria-valuetext', `${minutesText} per note`);

    // toFixed(1) always shows one decimal ("22.0"), so the layout does not jump.
    monthOutput.textContent = hoursPerMonth.toFixed(1);
    yearOutput.textContent = String(hoursSavedPerYear(hoursPerMonth));
  }

  // "input" fires again and again while a slider moves, so the result is live.
  calculator.addEventListener('input', update);

  // Show the first result right away, for the default slider positions.
  update();
}
