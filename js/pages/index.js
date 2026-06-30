/**
 * Pages Index — barrel file (kept for compatibility).
 * Actual page renderers are loaded individually in index.html.
 * This file exists in case anything references a pages namespace.
 */

const PhoenixPages = {
  dashboard:  typeof renderDashboard  === 'function' ? renderDashboard  : null,
  markets:    typeof renderMarkets    === 'function' ? renderMarkets    : null,
  analysis:   typeof renderAnalysis   === 'function' ? renderAnalysis   : null,
  orderflow:  typeof renderOrderflow  === 'function' ? renderOrderflow  : null,
  whales:     typeof renderWhales     === 'function' ? renderWhales     : null,
  signals:    typeof renderSignals    === 'function' ? renderSignals    : null,
  backtest:   typeof renderBacktest   === 'function' ? renderBacktest   : null,
  portfolio:  typeof renderPortfolio  === 'function' ? renderPortfolio  : null,
  ai:         typeof renderAI         === 'function' ? renderAI         : null,
  aichat:     typeof renderAIChat     === 'function' ? renderAIChat     : null,
  beginner:   typeof renderBeginner   === 'function' ? renderBeginner   : null,
  protools:   typeof renderProtools   === 'function' ? renderProtools   : null,
  journal:    typeof renderJournal    === 'function' ? renderJournal    : null,
  shortcuts:  typeof renderShortcuts  === 'function' ? renderShortcuts  : null,
};
