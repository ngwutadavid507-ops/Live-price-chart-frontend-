/**
 * Phoenix Terminal — API Service
 * All HTTP calls go through here.
 */

const PHOENIX_API = 'https://live-price-chart-backend.onrender.com';

const apiService = {

  async _get(path, params = {}) {
    const url = new URL(`${PHOENIX_API}${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const t0  = performance.now();
    const res = await fetch(url.toString());
    const lat = Math.round(performance.now() - t0);
    const latNode = document.getElementById('networkLatency');
    if (latNode) latNode.textContent = `${lat}ms`;
    if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
    return res.json();
  },

  async _post(path, body = {}) {
    const res = await fetch(`${PHOENIX_API}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API POST ${path} → ${res.status}`);
    return res.json();
  },

  async _put(path, body = {}) {
    const res = await fetch(`${PHOENIX_API}${path}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API PUT ${path} → ${res.status}`);
    return res.json();
  },

  async _delete(path) {
    const res = await fetch(`${PHOENIX_API}${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`API DELETE ${path} → ${res.status}`);
    return res.json();
  },

  async health()       { return this._get('/health'); },
  async systemStatus() { return this._get('/'); },

  async getMarketPairs(limit = 100, search = '') {
    return this._get('/markets/pairs', { limit, search });
  },
  async getMarketSummary() { return this._get('/markets/summary'); },
  async getTicker()        { return this._get('/markets/ticker'); },
  async getTrending(limit = 20) {
    return this._get('/markets/trending', { limit });
  },
  async getCandles(symbol, interval = '1h', limit = 100) {
    return this._get(`/markets/candles/${symbol}`, { interval, limit });
  },

  async getAnalysis(symbol)    { return this._get(`/analysis/${symbol}`); },
  async getIndicators(symbol)  { return this._get(`/analysis/${symbol}/indicators`); },
  async getMarketScore(symbol) { return this._get(`/analysis/${symbol}/score`); },

  async scanSignals(minConfidence = 68) {
    return this._get('/signals/scan', { min_confidence: minConfidence });
  },
  async getSignal(symbol) { return this._get(`/signals/${symbol}`); },

  async getOrderFlow(symbol, source = 'binance', depth = 20) {
    return this._get(`/orderflow/${symbol}`, { source, depth });
  },
  async getOrderBook(symbol, depth = 20) {
    return this._get(`/orderflow/${symbol}/book`, { depth });
  },

  async getWhaleAlerts(symbols = 'BTCUSDT,ETHUSDT,SOLUSDT', threshold = 100000) {
    return this._get('/whales/alerts', { symbols, threshold });
  },
  async getSymbolWhales(symbol, limit = 20) {
    return this._get(`/whales/${symbol}`, { limit });
  },

  async getPortfolio()      { return this._get('/portfolio'); },
  async addPosition(pos)    { return this._post('/portfolio/position', pos); },
  async removePosition(sym) { return this._delete(`/portfolio/position/${sym}`); },

  async runBacktest(symbol, strategy = 'momentum', timeframe = '1h', from_ts = 0, to_ts = 0) {
    return this._post('/backtest/run', { symbol, strategy, timeframe, from_ts, to_ts });
  },

  async getCorrelationMatrix(symbols = 'BTCUSDT,ETHUSDT,SOLUSDT', interval = '1d', limit = 90) {
    return this._get('/correlation/matrix', { symbols, interval, limit });
  },
  async getPairCorrelation(symbolA, symbolB, interval = '1d') {
    return this._get('/correlation/pair', { symbol_a: symbolA, symbol_b: symbolB, interval });
  },

  async compareAssets(symbols = 'BTCUSDT,ETHUSDT,SOLUSDT', interval = '1d', limit = 30) {
    return this._get('/compare', { symbols, interval, limit });
  },

  async getWatchlist()           { return this._get('/watchlist'); },
  async addToWatchlist(sym)      { return this._post(`/watchlist/${sym}`, {}); },
  async removeFromWatchlist(sym) { return this._delete(`/watchlist/${sym}`); },

  async getNews(filter = 'hot', currencies = '') {
    return this._get('/news/feed', { filter, currencies });
  },

  async aiChat(message, history = [], symbol = null) {
    return this._post('/ai/chat', { message, history, symbol });
  },
  async aiAnalyse(symbol, context = null) {
    return this._post('/ai/analyse', { symbol, context });
  },
  async getMarketNarrative() { return this._get('/ai/market-narrative'); },

  async getJournalTrades()              { return this._get('/journal/trades'); },
  async getJournalStats()               { return this._get('/journal/stats'); },
  async addJournalTrade(trade)          { return this._post('/journal/trades', trade); },
  async updateJournalTrade(id, updates) { return this._put(`/journal/trades/${id}`, updates); },
  async deleteJournalTrade(id)          { return this._delete(`/journal/trades/${id}`); },

  async simulateOrder(order)     { return this._post('/protools/simulate', order); },
  async getRiskMetrics(symbol)   { return this._get(`/protools/risk/${symbol}`); },
  async calcPositionSize(params) { return this._post('/protools/position-size', params); },

  async getSettings()           { return this._get('/settings'); },
  async updateSettings(updates) { return this._put('/settings', updates); },
  async resetSettings()         { return this._post('/settings/reset', {}); },

  async fetchHistoricalData(symbol) {
    try {
      const data = await this.getCandles(symbol, '1h', 24);
      return data.candles.map(c => c.close);
    } catch {
      return [65000, 65400, 65200, 66100, 65900, 66400, 67432.50];
    }
  },
};
