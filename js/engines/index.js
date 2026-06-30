/**
 * Quant Engine — lightweight client-side processing.
 * Receives live ticks from WebSocket, can run additional
 * client-side calculations if needed (most heavy lifting
 * is done server-side via /analysis endpoints).
 */

class QuantEngine {
  constructor() {
    this.priceHistory = {}; // symbol -> array of recent prices
    this.maxHistory    = 100;
  }

  processTick(symbol, price) {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = [];
    }
    this.priceHistory[symbol].push(price);
    if (this.priceHistory[symbol].length > this.maxHistory) {
      this.priceHistory[symbol].shift();
    }
  }

  getHistory(symbol) {
    return this.priceHistory[symbol] || [];
  }

  // Simple client-side SMA for quick UI feedback
  // (Server provides full EMA/RSI/MACD via /analysis)
  sma(symbol, period = 20) {
    const prices = this.getHistory(symbol);
    if (prices.length < period) return null;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  // Simple momentum indicator (price change over N ticks)
  momentum(symbol, period = 10) {
    const prices = this.getHistory(symbol);
    if (prices.length < period) return 0;
    const recent = prices[prices.length - 1];
    const past    = prices[prices.length - period];
    return ((recent - past) / past) * 100;
  }
}

const quantEngine = new QuantEngine();
