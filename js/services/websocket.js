/**
 * Phoenix Terminal — WebSocket Service
 * Connects to Phoenix backend WS for live prices.
 * Falls back to Bybit public WSS if backend WS unavailable.
 */

const PHOENIX_WS = 'wss://live-price-chart-backend.onrender.com/markets/ws/ticker';

class TradingWebSocket {
  constructor() {
    this.ws             = null;
    this.retryCount     = 0;
    this.maxRetries     = 3;
    this._heartbeatTimer = null;
  }

  connect() {
    this._connectPhoenix();
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    clearInterval(this._heartbeatTimer);
  }

  _connectPhoenix() {
    this._setStatus('connecting');
    try {
      this.ws = new WebSocket(PHOENIX_WS);
    } catch {
      this._fallbackToBybit();
      return;
    }

    this.ws.onopen = () => {
      this.retryCount = 0;
      this._setStatus('online');
      showToast('Phoenix Network', 'Connected to Phoenix live data grid.', 'success');
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'price_update')  this._handlePrices(msg.symbols);
        if (msg.type === 'signal_fire')   this._handleSignalFire(msg.signal);
        if (msg.type === 'heartbeat')     this._handleHeartbeat();
      } catch { }
    };

    this.ws.onerror = () => {
      this.retryCount++;
      if (this.retryCount >= this.maxRetries) {
        this._fallbackToBybit();
      }
    };

    this.ws.onclose = () => {
      this._setStatus('offline');
      setTimeout(() => this._connectPhoenix(), 5000);
    };
  }

  _handlePrices(symbols) {
    if (!symbols || !symbols.length) return;
    const assets = [...globalStore.getState('assets')];
    symbols.forEach(tick => {
      const match = assets.find(a => a.symbol === tick.symbol);
      if (match) {
        match.price     = tick.price;
        match.change24h = tick.change24h;
      }
    });
    globalStore.setState('assets', assets);
    globalStore.setState('parentTrackAssets', assets);
    if (typeof quantEngine !== 'undefined') {
      symbols.forEach(tick => quantEngine.processTick(tick.symbol, tick.price));
    }
    this._updateTimestamp();
  }

  _handleSignalFire(signal) {
    if (!signal || !signal.fired) return;
    showToast(
      `Signal: ${signal.symbol}`,
      `${signal.direction.toUpperCase()} — ${signal.confidence}% confidence`,
      signal.direction === 'buy' ? 'success' : 'danger'
    );
  }

  _handleHeartbeat() {
    const latNode = document.getElementById('networkLatency');
    if (latNode && latNode.textContent === '--ms') {
      latNode.textContent = '<10ms';
    }
  }

  _fallbackToBybit() {
    showToast('Phoenix Network', 'Switching to Bybit direct stream.', 'info');
    this._connectBybit();
  }

  _connectBybit() {
    this._setStatus('connecting');
    const BYBIT_WS = 'wss://stream.bybit.com/v5/public/linear';
    try {
      this.ws = new WebSocket(BYBIT_WS);
    } catch {
      this._setStatus('offline');
      return;
    }

    this.ws.onopen = () => {
      this._setStatus('online');
      const symbols = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT',
                       'ADAUSDT','DOGEUSDT','AVAXUSDT','DOTUSDT','LINKUSDT'];
      const sub = {
        op:   'subscribe',
        args: symbols.map(s => `tickers.${s}`),
      };
      this.ws.send(JSON.stringify(sub));
      showToast('Bybit Stream', 'Connected to Bybit live stream.', 'info');
    };

    this.ws.onmessage = (event) => {
      try {
        const data   = JSON.parse(event.data);
        const topic  = data.topic || '';
        if (!topic.startsWith('tickers.')) return;
        const ticker = data.data || {};
        const symbol = ticker.symbol;
        const price  = parseFloat(ticker.lastPrice);
        if (!symbol || !price) return;

        const assets = [...globalStore.getState('assets')];
        const match  = assets.find(a => a.symbol === symbol);
        if (match) {
          match.price     = price;
          let pct = parseFloat(ticker.price24hPcnt || 0);
          if (Math.abs(pct) < 1) pct = pct * 100;
          match.change24h = parseFloat(pct.toFixed(4));
          globalStore.setState('assets', assets);
          globalStore.setState('parentTrackAssets', assets);
        }
        this._updateTimestamp();
      } catch { }
    };

    this.ws.onerror = () => this._handleDisconnect();
    this.ws.onclose = () => this._handleDisconnect();
  }

  _handleDisconnect() {
    this._setStatus('offline');
    setTimeout(() => this.connect(), 5000);
  }

  _setStatus(state) {
    const node = document.getElementById('wsStatus');
    if (!node) return;
    if (state === 'online') {
      globalStore.setState('wsConnected', true);
      node.textContent = 'Live';
      node.className   = 'status-online';
    } else if (state === 'offline') {
      globalStore.setState('wsConnected', false);
      node.textContent = 'Offline';
      node.className   = 'status-offline';
    } else {
      node.textContent = 'Connecting...';
      node.className   = '';
    }
  }

  _updateTimestamp() {
    const label = document.getElementById('lastUpdateLabel');
    if (label) label.textContent = new Date().toLocaleTimeString();
  }
}

const wsService = new TradingWebSocket();
