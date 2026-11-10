// The newsletter form: it checks the email in the browser and shows a message.
//
// IMPORTANT: nothing is sent and nothing is saved. There is no fetch() and no
// localStorage in this file, on purpose. The input in the HTML also has no
// "name" attribute, so the browser could not send it even without JavaScript.

// A simple check: some text, an @, some text, a dot, some text. No spaces.
// It does not prove the address exists. Only a real email could do that.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message, or an empty string when the email looks fine. */
export function getEmailError(value) {
  const email = value.trim();
  if (email === '') return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email, for example name@example.com.';
  return '';
}

export function initNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const errorText = form.querySelector('[data-error]');
  const successText = form.querySelector('[data-success]');

  function showError(message) {
    const hasError = message !== '';
    errorText.textContent = message;
    errorText.hidden = !hasError;
    // aria-invalid tells screen readers that this field has a problem.
    input.setAttribute('aria-invalid', String(hasError));
  }

  form.addEventListener('submit', (event) => {
    // Stop the browser from sending the form and reloading the page.
    event.preventDefault();

    const message = getEmailError(input.value);
    showError(message);

    if (message) {
      successText.textContent = '';
      // Focus goes back to the field, so the visitor can fix it right away.
      // The error is linked with aria-describedby, so it is read out too.
      input.focus();
      return;
    }

    successText.textContent = 'Thanks! This is a demo, so your email was not sent or saved.';
    form.reset();
  });

  input.addEventListener('input', () => {
    successText.textContent = '';
    // After a failed try, check again on every key press,
    // so the error disappears as soon as the email is fixed.
    if (input.getAttribute('aria-invalid') === 'true') {
      showError(getEmailError(input.value));
    }
  });
}
