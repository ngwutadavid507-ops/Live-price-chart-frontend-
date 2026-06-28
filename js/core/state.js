/**
 * Phoenix Terminal — Global State
 * Assets populated from backend on boot.
 * Journal, portfolio, watchlist all from backend.
 */

class TerminalStore {
  constructor() {
    this.listeners = new Map();
    const savedIndicators = localStorage.getItem('phoenix_indicators');

    this.state = {
      currentPage:   'dashboard',
      wsConnected:   false,
      latency:       0,
      backendReady:  false,

      // Market Data (populated from backend on boot)
      assets:              [],
      parentTrackAssets:   [],

      // User Data (populated from backend on boot)
      watchlist:      [],
      journal:        [],
      paperPortfolio: {
        balance:     0,
        pnl24h:     0,
        pct24h:     0,
        positions:   [],
        total_value: 0,
      },

      // Analysis & Signals
      analysisCache:  {},
      signalCache:    [],
      marketSummary:  null,
      orderBook:      { bids: [], asks: [] },

      // AI Chat
      chatHistory: [
        {
          text:   "Hello! I'm Phoenix AI — your real-time crypto intelligence engine. Ask me about any market, signal, or trade setup.",
          sender: 'ai',
        }
      ],

      // Pro Tools
      customIndicators: savedIndicators ? JSON.parse(savedIndicators) : [
        { name: 'Custom EMA (21)',     base: 'Moving Average', period: 21 },
        { name: 'Volume-Weighted RSI', base: 'RSI',            period: 14 },
      ],

      // Settings
      settings: {
        theme:                 'dark',
        default_symbol:        'BTCUSDT',
        default_interval:      '1h',
        min_signal_confidence: 68,
      },
    };
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key).push(callback);
  }

  setState(key, newValue) {
    this.state[key] = newValue;
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(newValue));
    }
  }

  getState(key) { return this.state[key]; }

  setAnalysis(symbol, result) {
    const cache = { ...this.state.analysisCache };
    cache[symbol] = result;
    this.setState('analysisCache', cache);
  }

  getAnalysis(symbol) {
    return this.state.analysisCache[symbol] || null;
  }

  saveToStorage(key, storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(this.state[key]));
  }
}

const globalStore = new TerminalStore();
