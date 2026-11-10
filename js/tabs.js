// Tabs for the interactive demo (Write, Organize, Search).
//
// The keyboard rules follow the WAI-ARIA "Tabs" pattern:
// - Tab key: goes to the selected tab, then on to the panel (not through every tab)
// - Left / Right arrow: previous / next tab, and it wraps around at the ends
// - Home / End: first / last tab
// For this, only the selected tab has tabindex="0". The others have "-1".

export function initTabs() {
  const tabList = document.querySelector('[role="tablist"]');
  if (!tabList) return;

  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  function selectTab(selectedTab) {
    for (const tab of tabs) {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;

      // aria-controls holds the id of the panel that belongs to this tab.
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !isSelected;
    }
  }

  // One listener on the list handles all tabs ("event delegation").
  tabList.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) selectTab(tab);
  });

  tabList.addEventListener('keydown', (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    const nextIndex = getNextIndex(event.key, currentIndex, tabs.length);
    if (nextIndex === null) return;

    // Without this, Home and End would also scroll the page.
    event.preventDefault();
    selectTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
}

/** Which tab comes next for this key? Returns null for keys we do not handle. */
function getNextIndex(key, currentIndex, count) {
  if (currentIndex === -1) return null;

  switch (key) {
    case 'ArrowRight':
      return (currentIndex + 1) % count; // after the last tab comes the first
    case 'ArrowLeft':
      return (currentIndex - 1 + count) % count; // before the first comes the last
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
