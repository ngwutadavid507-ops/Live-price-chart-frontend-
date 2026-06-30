/**
 * Phoenix Terminal — Router
 * Handles page navigation and dispatching to page renderers.
 */

const PAGE_RENDERERS = {
  dashboard:  () => renderDashboard(),
  markets:    () => renderMarkets(),
  analysis:   () => renderAnalysis(),
  orderflow:  () => renderOrderflow(),
  whales:     () => renderWhales(),
  signals:    () => renderSignals(),
  backtest:   () => renderBacktest(),
  portfolio:  () => renderPortfolio(),
  ai:         () => renderAI(),
  aichat:     () => renderAIChat(),
  beginner:   () => renderBeginner(),
  protools:   () => renderProtools(),
  journal:    () => renderJournal(),
  shortcuts:  () => renderShortcuts(),
};

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  markets:    'Markets',
  analysis:   'Quant Analysis',
  orderflow:  'Order Flow',
  whales:     'Whale Tracker',
  signals:    'Signal Feed',
  backtest:   'Backtest Lab',
  portfolio:  'Portfolio',
  ai:         'AI Analytics',
  aichat:     'AI Chat',
  beginner:   'Beginner Hub',
  protools:   'Pro Suite',
  journal:    'Trade Journal',
  shortcuts:  'Shortcuts',
};

function navigateTo(page) {
  if (!PAGE_RENDERERS[page]) {
    console.warn(`Unknown page: ${page}`);
    return;
  }

  globalStore.setState('currentPage', page);

  // Update active nav link
  document.querySelectorAll('.nav-links li').forEach(li => {
    li.classList.toggle('active', li.dataset.page === page);
  });

  // Update page title
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

  // Render the page
  try {
    PAGE_RENDERERS[page]();
  } catch (e) {
    console.error(`Error rendering page "${page}":`, e);
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = `<div style="padding:20px;color:var(--danger)">
        Failed to load ${page}: ${e.message}
      </div>`;
    }
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function initRouter() {
  document.querySelectorAll('.nav-links li').forEach(li => {
    li.addEventListener('click', () => {
      const page = li.dataset.page;
      if (page) navigateTo(page);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
