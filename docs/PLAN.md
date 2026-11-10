# Driftnote landing page: the plan

Driftnote is a **fictional** note-taking app. This project is a demo landing page
built with only HTML, CSS and vanilla JavaScript.

## Goals

- A complete, professional landing page with 9 sections.
- No framework, no UI library, no build step. It runs from any static server.
- Easy to explain: small files, one job per file, comments that say WHY.
- Accessible: semantic HTML, keyboard support, visible focus, good contrast.
- Honest: no fake testimonials, logos or user numbers. No data is sent anywhere.

## Rules I follow while building

1. Build one section at a time.
2. After each section: run the tests, look at it in a real browser, make one commit.
3. Never say "it works" without running it and reading the output.

## Sections (build order)

| # | Section | Main files |
|---|---------|------------|
| 0 | Foundation: tokens, reset, typography, a11y | `css/base/*` |
| 1 | Sticky header, nav, dark mode, mobile menu | `css/layout/header.css`, `js/theme*.js`, `js/mobile-menu.js`, `js/header-shadow.js`, `js/active-nav.js` |
| 2 | Hero with app mockup | `css/layout/hero.css`, `css/components/mockup.css` |
| 3 | Features: 6 cards | `css/components/cards.css` |
| 4 | Interactive demo: tabs | `css/components/tabs.css`, `js/tabs.js` |
| 5 | "Time saved" calculator | `js/calculator.js` (pure), `js/calculator-ui.js` |
| 6 | Pricing with Monthly/Yearly | `js/pricing.js` (pure + data), `js/pricing-ui.js` |
| 7 | FAQ accordion | `js/faq.js` |
| 8 | Newsletter form | `js/newsletter.js` |
| 9 | Footer, `privacy.html`, `404.html` | `css/layout/footer.css`, `css/layout/simple-page.css` |
| + | Scroll reveal, back to top | `js/reveal.js`, `js/back-to-top.js` |
| + | Meta tags, favicon, `og-image.png` | `index.html`, `favicon.svg` |

## Folder structure

```
index.html  privacy.html  404.html
icons.svg            one file with the logo and every icon (SVG sprite)
css/base/            tokens (variables), reset, typography, accessibility
css/layout/          page grid, header, hero, footer, simple pages
css/components/      buttons, cards, mockup, tabs, calculator, pricing, faq, form
js/                  ES modules, one file per feature; main.js starts them
tests/               Vitest tests for the two pure modules
docs/                this plan, HOW_IT_WORKS.md, screenshot
```

## Decisions (and why)

- **One `<link>` per CSS file, not `@import`.** The browser can download all
  files at the same time. `@import` makes it wait for the first file first.
- **Icons live in `icons.svg`** and pages use `<use href="icons.svg#name">`.
  Each icon is written once and shared by all three pages.
- **Pure functions are separate from the DOM.** `calculator.js` and `pricing.js`
  only do math. `*-ui.js` files connect them to the page. Only the pure files
  are tested.
- **Prices come from one object** (`PLANS` in `js/pricing.js`).
- **Dark mode** = the same CSS variables with different values under
  `[data-theme="dark"]`. A tiny script in `<head>` sets the theme before the
  first paint, so there is no flash.
- **Content first.** Text is in the HTML, not created by JavaScript. FAQ
  answers are open in the HTML and JavaScript closes them, so they can still
  be read if JavaScript fails.
- **The newsletter input has no `name` attribute.** A field without a name is
  never part of a form submission, so the email cannot be sent by accident.

## Known limits (decided before coding)

- **`index.html` will be longer than 120 lines.** Nine sections of real content
  do not fit, and HTML cannot be split into files without a build step or
  JavaScript. Every CSS and JS file stays under about 120 lines.
- **`og-image.png` is in the project root, not in a `public/` folder.** On
  Vercel, a `public/` folder in a no-framework project becomes the web root,
  and `index.html` would no longer be served.

## Testing

- `npm test` runs Vitest on `tests/calculator.test.js` and `tests/pricing.test.js`.
- Manual checks at 360, 768 and 1280 px, in light and dark mode, keyboard only.
- Lighthouse (mobile and desktop). Target: 90+ in all four categories.

## Publish

1. Show the GitHub login and wait for confirmation.
2. `gh repo create driftnote-landing --public ...`
3. `npx vercel --prod --yes`, then check `/`, `/privacy.html` and a missing page with curl.
4. Connect the repo to Vercel for automatic deploys.
5. Set `og:image` to the absolute production URL, update the README, push.
