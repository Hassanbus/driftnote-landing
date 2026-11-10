# How Driftnote works

This file explains every file in the project in simple English.
For each file you get three things:

- **WHAT** it is,
- **WHY** it exists,
- **HOW** it works.

After that you find the order to rebuild the project from scratch, and 15 interview
questions with short answers.

Line counts: every CSS and JavaScript file is under 120 lines. `index.html` is the one
exception (about 560 lines), because HTML cannot be split into files without a build
step or JavaScript.

---

## 1. The big picture

```
Browser opens index.html
  -> loads the CSS files (one <link> each, all at the same time)
  -> runs js/theme-init.js (sets light or dark mode before anything is drawn)
  -> draws the page (it is already complete: all text is in the HTML)
  -> runs js/main.js (a module), which starts each feature
```

Three ideas are used everywhere:

1. **Content first.** The text is in the HTML. JavaScript only adds behavior.
2. **State lives in attributes.** `aria-expanded`, `aria-selected`, `aria-current`,
   `hidden` and `data-theme` hold the state. CSS reads them. Screen readers read them too.
3. **Classes are for style, `data-*` attributes are for JavaScript.** If you rename a
   class, no script breaks.

---

## 2. Pages

### `index.html`
- **WHAT:** The landing page with all nine sections.
- **WHY:** One page, one file, so the order of the sections is easy to see.
- **HOW:** Semantic elements (`header`, `nav`, `main`, `section`, `footer`). Each section
  has an `id` for the nav links and `aria-labelledby` that points to its heading.
  `data-reveal` marks blocks that fade in. `data-*` attributes are hooks for JavaScript.

### `privacy.html`
- **WHAT:** A short privacy page.
- **WHY:** Even a demo should say what happens with data: nothing is collected.
- **HOW:** It loads only the CSS it needs and `js/simple-page.js` for the theme button.

### `404.html`
- **WHAT:** The "page not found" page.
- **WHY:** Vercel shows this file for every address that does not exist.
- **HOW:** All paths start with `/` (for example `/css/base/tokens.css`). The page can be
  shown for an address like `/a/b/c`, where a relative path would point to the wrong folder.
  `<meta name="robots" content="noindex">` keeps it out of search results.

---

## 3. Images and icons

### `icons.svg`
- **WHAT:** One SVG file with the logo and every icon (an "SVG sprite").
- **WHY:** Each icon is drawn once and used on all three pages.
- **HOW:** Every icon is a `<symbol>` with an `id`. A page shows one with
  `<svg class="icon"><use href="icons.svg#search"/></svg>`. The paths have no color.
  They inherit `stroke` and `fill` from the CSS of the page, so they follow dark mode.

### `favicon.svg` and `favicon.ico`
- **WHAT:** The small icon in the browser tab.
- **WHY:** Two files: modern browsers use the sharp SVG, older ones use the `.ico`.
- **HOW:** The SVG has fixed colors, because a favicon cannot read the page's CSS.
  The `.ico` holds a 32 x 32 PNG of the same drawing.

### `og-image.png`
- **WHAT:** The preview picture for shared links (1200 x 630 pixels).
- **WHY:** Chat apps and social networks show it next to the link.
- **HOW:** A Playwright screenshot of the hero. The script is not in this repository,
  because `package.json` is only for the tests. The `og:image` tag in `index.html`
  needs the full `https://` address of this file, because apps that build link
  previews do not understand short paths.

### `docs/screenshot.png`, `docs/screenshot-dark.png`
- **WHAT:** Screenshots for the README.
- **WHY:** Readers see the result before they open the site.
- **HOW:** Playwright screenshots at 1280 x 800 in light and dark mode.

---

## 4. CSS: `css/base/`

### `tokens.css`
- **WHAT:** All design values as CSS variables: colors, spacing, font sizes, radius, shadows.
- **WHY:** A value is defined once. Dark mode only has to change the color values.
- **HOW:** `:root { --color-bg: ... }` for light mode and `[data-theme="dark"] { ... }`
  with the same names for dark mode. Big headings use `clamp(min, fluid, max)`.

### `reset.css`
- **WHAT:** A small reset.
- **WHY:** Browsers have different default styles. The reset gives one starting point.
- **HOW:** `box-sizing: border-box`, no default margins, form controls inherit the font.
  `[hidden] { display: none !important; }` makes sure a hidden element stays hidden even
  when a class sets `display: grid`.

### `typography.css`
- **WHAT:** Text styles: body, headings, links, `.lead`, `.eyebrow`, `.check-list`.
- **WHY:** Text looks the same in every section.
- **HOW:** The check marks of `.check-list` are drawn in CSS: a small box with only a
  left and a bottom border, rotated by 45 degrees.

### `a11y.css`
- **WHAT:** Accessibility helpers.
- **WHY:** Keyboard and screen reader users need them on every page.
- **HOW:** `:focus-visible` draws a clear focus ring. `.skip-link` jumps to the content.
  `.visually-hidden` hides text on screen but keeps it for screen readers.
  `scroll-padding` keeps targets clear of the sticky header and the back to top button.
  `@media (prefers-reduced-motion: reduce)` switches animations off.

---

## 5. CSS: `css/layout/`

### `page.css`
- **WHAT:** The page frame: `.container`, `.section`, `.section-head`.
- **WHY:** Every section has the same width and spacing.
- **HOW:** `width: min(100% - 2rem, 72rem)` centers the content with side space on phones.
  `body` is a flex column, so the footer stays at the bottom on short pages.

### `header.css`
- **WHAT:** The sticky header, the nav and the mobile menu panel.
- **WHY:** The nav should always be reachable.
- **HOW:** `position: sticky; top: 0`. On small screens the nav is a panel that is shown
  only when the menu button has `aria-expanded="true"`. From 60rem up it sits in the header row.

### `hero.css`
- **WHAT:** The first screen: text on the left, mockup on the right.
- **WHY:** It has its own layout and a soft glow in the background.
- **HOW:** One grid column on small screens, two from 60rem up. The glow is a `::before`
  layer with two radial gradients.

### `footer.css`
- **WHAT:** The footer.
- **WHY:** The same footer is used on all three pages.
- **HOW:** A grid: brand on the left, links on the right, a note in a full row below.

### `simple-page.css`
- **WHAT:** Styles for `privacy.html` and `404.html`.
- **WHY:** The home page does not need them, so it does not load this file.
- **HOW:** `.prose` adds space between text blocks. `.error-page` centers the 404 message.

---

## 6. CSS: `css/components/`

### `buttons.css`
- **WHAT:** `.btn`, `.icon-btn`, `.icon` and `.logo`.
- **WHY:** Buttons and icons look the same everywhere.
- **HOW:** Buttons are at least 44 pixels high, a good size for fingers. The menu and
  theme buttons hold two icons each. CSS shows the right one by reading `aria-expanded`
  or `data-theme`.

### `cards.css`
- **WHAT:** The `.card` box and the features grid.
- **WHY:** Features, the calculator and pricing all use the same card.
- **HOW:** The grid has 1 column, then 2 from 40rem, then 3 from 60rem.

### `mockup.css`, `mockup-notes.css`, `mockup-views.css`
- **WHAT:** The fake app window in the hero and in the demo tabs.
- **WHY:** Drawing it in HTML and CSS means no image download, and it follows dark mode.
- **HOW:** `.app` is a container (`container-type: inline-size`). `@container` rules show
  two or three columns based on the width of the mockup itself, not of the screen.
  In the HTML the mockup has `role="img"` and an `aria-label`, so a screen reader hears
  one clear description instead of many loose words.

### `tabs.css`
- **WHAT:** The look of the demo tabs and panels.
- **WHY:** It belongs to one feature, so it has its own file.
- **HOW:** The selected tab is styled with `[aria-selected="true"]`. A visible panel
  plays a short fade animation.

### `calculator.css`
- **WHAT:** The sliders and the result box.
- **WHY:** It belongs to one feature.
- **HOW:** Native sliders with `accent-color` for the brand color. `tabular-nums` keeps
  the digits the same width, so the number does not wobble.

### `billing-switch.css` and `pricing.css`
- **WHAT:** The Monthly / Yearly switch and the three plan cards.
- **WHY:** Two files keep each one short.
- **HOW:** The switch is two radio buttons. The real inputs are invisible but still
  there, so Tab and the arrow keys work. Each card is a flex column, and the feature list
  has `flex: 1`, which pushes all buttons to the same height.

### `faq.css`
- **WHAT:** The FAQ accordion.
- **WHY:** It belongs to one feature.
- **HOW:** The arrow icon rotates when the button has `aria-expanded="true"`.

### `newsletter.css`
- **WHAT:** The newsletter block and the form.
- **WHY:** It belongs to one feature.
- **HOW:** The input turns red when it has `aria-invalid="true"`. The error is also
  written as text, so the message never depends on color alone.

### `scroll.css`
- **WHAT:** The reveal animation and the back to top button.
- **WHY:** Both react to scrolling.
- **HOW:** `.reveal-wait` hides a block and `.reveal-in` plays the animation.
  The button is `position: fixed` and uses `visibility: hidden` while it is not needed,
  which also takes it out of the Tab order.

---

## 7. JavaScript: `js/`

### `theme-init.js`
- **WHAT:** A tiny normal script (not a module) in `<head>`.
- **WHY:** Modules run late. Without this file a dark mode user would see a white flash.
- **HOW:** It reads the saved choice from `localStorage`. If there is none, it asks the
  system with `matchMedia('(prefers-color-scheme: dark)')`. Then it sets
  `data-theme` on `<html>`.

### `main.js`
- **WHAT:** The entry point of the landing page.
- **WHY:** One place that shows which features exist.
- **HOW:** It imports one `init...` function per feature and calls each one inside
  `try / catch`. If one feature breaks, the others still start.

### `simple-page.js`
- **WHAT:** The entry point of `privacy.html` and `404.html`.
- **WHY:** These pages only need the theme button.
- **HOW:** It imports and calls `initTheme()`.

### `theme.js`
- **WHAT:** The dark mode button.
- **WHY:** People want to choose, and the choice should be remembered.
- **HOW:** A click flips `data-theme`, updates `aria-pressed` and saves the choice in
  `localStorage`. Saving is inside `try / catch`, because private modes can block it.

### `mobile-menu.js`
- **WHAT:** Opens and closes the mobile menu.
- **WHY:** On a small screen the links do not fit in the header.
- **HOW:** It only changes `aria-expanded` on the button. CSS does the rest.
  Escape closes the menu and moves focus back to the button. A click outside or on a
  link closes it too.

### `header-shadow.js`
- **WHAT:** Adds a shadow to the header after scrolling.
- **WHY:** The shadow shows that content is moving under the header.
- **HOW:** A `scroll` listener with `{ passive: true }` toggles the class `is-scrolled`.

### `active-nav.js`
- **WHAT:** Highlights the nav link of the section you are reading.
- **WHY:** It shows where you are on a long page.
- **HOW:** An `IntersectionObserver` with a `rootMargin` that turns the screen into a
  thin line, 40% from the top. The section that crosses the line gets
  `aria-current="location"` on its link.

### `tabs.js`
- **WHAT:** The demo tabs.
- **WHY:** They show three views without making the page longer.
- **HOW:** `selectTab()` sets `aria-selected`, `tabindex` and `hidden`. Left and Right
  arrows, Home and End move between the tabs. Only the selected tab has `tabindex="0"`,
  so the Tab key goes from the tab straight into its panel.

### `calculator.js` (pure, tested)
- **WHAT:** The math of the calculator.
- **WHY:** Math without DOM code is easy to test and to reuse.
- **HOW:** `hoursSavedPerMonth(notes, minutes)` =
  notes x minutes x 22 working days x 50% saved, divided by 60, rounded to one decimal.
  Bad or negative input counts as 0.

### `calculator-ui.js`
- **WHAT:** Connects the sliders to the math.
- **WHY:** DOM code stays separate from the math.
- **HOW:** It listens for `input` events, calls the pure function and writes the result
  with `textContent`. `aria-valuetext` lets a screen reader say "10 notes per day".

### `pricing.js` (pure, tested)
- **WHAT:** The `PLANS` object and the price functions.
- **WHY:** One source of truth: to change a price you edit one number.
- **HOW:** `yearlyPrice()` multiplies the monthly price by 10 (12 months minus 2 free).
  `getPriceInfo(plan, period)` returns the price text, the period text and a short note.
  It throws an error for an unknown plan, so a typo cannot show a wrong price.

### `pricing-ui.js`
- **WHAT:** Writes the prices into the cards.
- **WHY:** The HTML holds no prices. They all come from `pricing.js`.
- **HOW:** Each card has `data-plan="plus"`. On load, and on every `change` of the
  radio buttons, it fills `[data-price]`, `[data-period]` and `[data-note]`.

### `faq.js`
- **WHAT:** The accordion.
- **WHY:** Six open answers would make the page very long.
- **HOW:** On start it closes every answer except the first one. On a click it closes
  all of them and opens the clicked one. `aria-expanded` and `hidden` always change together.

### `newsletter.js`
- **WHAT:** Checks the email and shows a message.
- **WHY:** It shows form validation without sending data.
- **HOW:** `submit` is stopped with `preventDefault()`. `getEmailError()` returns a
  message or an empty string. On an error, focus goes back to the field, and the error
  is linked with `aria-describedby`. There is no `fetch()` in this file.

### `reveal.js`
- **WHAT:** The fade-in while scrolling.
- **WHY:** It makes the page feel alive without hiding content from anyone.
- **HOW:** It hides only the blocks that are below the screen, then an
  `IntersectionObserver` reveals each one once. It does nothing if the visitor asked
  for reduced motion.

### `back-to-top.js`
- **WHAT:** Shows the back to top button after 600 pixels of scrolling.
- **WHY:** A long page needs a fast way back.
- **HOW:** The button is a normal link to `#top`. The script only toggles a class.

---

## 8. Tests and project files

### `tests/calculator.test.js`, `tests/pricing.test.js`
- **WHAT:** 34 Vitest tests for the two pure files.
- **WHY:** They prove the math and protect it when the code changes.
- **HOW:** Each test calls a function and compares the result with `expect(...)`.
  They cover normal values, the slider limits, bad input and unknown plans.

### `package.json`, `package-lock.json`
- **WHAT:** The npm files.
- **WHY:** Only to install and run Vitest. The site itself needs no install.
- **HOW:** `npm test` runs `vitest run`. `"type": "module"` lets Node read `import`.

### `.gitignore`, `.gitattributes`, `.vercelignore`
- **WHAT:** Three small settings files.
- **WHY:** They keep the repository and the deploy clean.
- **HOW:** `.gitignore` keeps `node_modules` out of Git. `.gitattributes` keeps the same
  line endings on every computer. `.vercelignore` keeps tests and docs off the live site.

### `README.md`, `docs/PLAN.md`, `docs/HOW_IT_WORKS.md`
- **WHAT:** The documentation.
- **WHY:** A project is only finished when another person can understand it.
- **HOW:** The README is the short overview. The plan was written before coding.
  This file is the long explanation.

---

## 9. Rebuild it from scratch

Build one step, look at it in the browser, then commit.

1. `git init`, add `.gitignore`, write a short plan.
2. `css/base/tokens.css`: choose the colors, spacing and font sizes first.
3. `css/base/reset.css`, `typography.css`, `a11y.css`.
4. `icons.svg` with the logo, and `package.json` with Vitest.
5. `index.html` with only the `<head>`, the skip link and the header.
6. `css/layout/page.css`, `header.css`, `css/components/buttons.css`.
7. `js/theme-init.js`, `theme.js`, `mobile-menu.js`, `header-shadow.js`, `active-nav.js`, `main.js`.
8. The hero: HTML, `hero.css`, then the mockup with `mockup.css` and `mockup-notes.css`.
9. The features: six cards and `cards.css`.
10. The demo: the tabs HTML, `tabs.css`, `mockup-views.css`, `tabs.js`.
11. The calculator: write `calculator.js` and its tests first, then the HTML, `calculator.css`, `calculator-ui.js`.
12. The pricing: write `pricing.js` and its tests first, then the HTML, `billing-switch.css`, `pricing.css`, `pricing-ui.js`.
13. The FAQ: HTML with all answers open, `faq.css`, `faq.js`.
14. The newsletter: HTML, `newsletter.css`, `newsletter.js`.
15. The footer, then `privacy.html` and `404.html` with `footer.css`, `simple-page.css`, `simple-page.js`.
16. `reveal.js`, `back-to-top.js`, `scroll.css`.
17. Meta tags, `favicon.svg`, `favicon.ico`, `og-image.png`.
18. Test: 360, 768 and 1280 px, light and dark, keyboard only, Lighthouse.
19. Write the README, push to GitHub, deploy to Vercel.

---

## 10. Fifteen interview questions

### HTML

**1. Why do you use `header`, `nav`, `main`, `section` and `footer` instead of `div`?**
They say what the content is. Screen readers can jump between these parts, and search
engines understand the page better. A `div` says nothing.

**2. The mockup is made of many `div` and `p` elements. How does a screen reader handle it?**
The mockup has `role="img"` and an `aria-label`. The screen reader treats it as one image
and reads the label, like alt text. It does not read every small piece.

**3. Why does the newsletter form have `novalidate`, and why has the input no `name`?**
`novalidate` turns off the browser's own error bubbles, so I can show my own messages.
A field without a `name` is never part of a form submission. Even if JavaScript fails,
the email cannot be sent.

### CSS

**4. How does dark mode work, and how do you stop the white flash?**
All colors are CSS variables. `[data-theme="dark"]` gives the same variables new values.
A small normal script in `<head>` sets `data-theme` before the page is drawn.
A module would run too late.

**5. Your menu button was visible on desktop at first. What was wrong?**
`.menu-toggle { display: none }` and `.icon-btn { display: inline-grid }` have the same
strength (one class each). Then the later rule wins, and `buttons.css` loads later.
I wrote `.site-header .menu-toggle`: two classes beat one, whatever the file order is.

**6. What is a container query, and why did you use one?**
A media query looks at the screen width. A container query looks at the width of a
parent element. The mockup is wide in the hero and narrow in the tabs, so it decides
its columns from its own width.

**7. How is the page responsive?**
Grids start with one column and get more columns at `min-width` breakpoints.
`minmax(0, 1fr)` lets columns shrink. `clamp()` makes headings grow with the screen.
The container uses `min(100% - 2rem, 72rem)`.

### DOM

**8. Why is there no `DOMContentLoaded` listener?**
`<script type="module">` always runs after the HTML is parsed, so the elements exist.
Only `theme-init.js` is a normal script, and it only touches `<html>`.

**9. What is a pure function, and why did you split `calculator.js` and `calculator-ui.js`?**
A pure function gives the same output for the same input and changes nothing outside.
`calculator.js` only does math, so Vitest can test it without a browser.
`calculator-ui.js` reads the sliders and writes the result with `textContent`.

### Events

**10. What is event delegation? Where do you use it?**
One listener on a parent handles events from its children, found with
`event.target.closest(...)`. The tab list, the FAQ and the nav each use one listener
instead of one per button.

**11. What is the difference between `input` and `change`? What does `preventDefault()` do?**
`input` fires on every small move of a slider, so the result is live. `change` fires
when a value is final, which fits the radio buttons. `preventDefault()` stops the
browser's own action: the form does not reload the page, and Home or End do not scroll.

**12. Why `IntersectionObserver` and not a scroll listener?**
A scroll listener runs many times per second and needs position math. The observer
calls my code only when an element enters or leaves an area. For the simple header
shadow I do use a scroll listener, marked `passive` so it never blocks scrolling.

### Accessibility

**13. How do the tabs work with a keyboard and a screen reader?**
Roles: `tablist`, `tab`, `tabpanel`. `aria-selected` marks the active tab and
`aria-controls` points to its panel. Only the active tab has `tabindex="0"`.
Arrow keys, Home and End move between tabs. Tab goes into the panel.

**14. What do `aria-expanded`, `aria-current` and `aria-pressed` do here?**
They describe state. `aria-expanded` says if the menu or an FAQ answer is open.
`aria-current` marks the nav link of the current section. `aria-pressed` says if dark
mode is on. My CSS reads the same attributes, so the look always matches.

**15. How can someone use this page without a mouse, and with less motion?**
The skip link is the first Tab stop. Every control is a real link, button or input, and
`:focus-visible` shows a clear ring. Escape closes the menu. With
`prefers-reduced-motion`, CSS cuts animations and `reveal.js` does not start.
