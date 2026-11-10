// Picks light or dark mode BEFORE the page is drawn.
//
// WHY this is a separate, normal script (not a module) in <head>:
// modules run after the HTML is parsed. A dark-mode visitor would first see a
// white page and then a jump to dark. A normal script in <head> runs first.
//
// Order of choice: 1) what the visitor picked before, 2) the system setting.
(function () {
  var saved = null;

  // Some private modes block localStorage and throw an error. The page must still load.
  try {
    saved = localStorage.getItem('driftnote-theme');
  } catch (error) {
    saved = null;
  }

  var systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved === 'dark' || saved === 'light' ? saved : systemIsDark ? 'dark' : 'light';

  // css/base/tokens.css changes the colors when <html data-theme="dark">.
  document.documentElement.setAttribute('data-theme', theme);
})();
