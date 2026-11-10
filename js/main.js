// The entry point of the landing page: it starts every feature.
//
// WHY one file per feature: each file is short, has one job and can be read
// alone. This file is the table of contents.
//
// No "DOMContentLoaded" is needed: a <script type="module"> always runs
// after the HTML is parsed.
import { initTheme } from './theme.js';
import { initMobileMenu } from './mobile-menu.js';
import { initHeaderShadow } from './header-shadow.js';
import { initActiveNav } from './active-nav.js';
import { initTabs } from './tabs.js';
import { initCalculator } from './calculator-ui.js';
import { initPricing } from './pricing-ui.js';

const features = [
  initTheme,
  initMobileMenu,
  initHeaderShadow,
  initActiveNav,
  initTabs,
  initCalculator,
  initPricing,
];

for (const startFeature of features) {
  // If one feature breaks, the others should still start.
  try {
    startFeature();
  } catch (error) {
    console.error(error);
  }
}
