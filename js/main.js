/**
 * Phoenix Terminal — Boot Sequence
 * Auto-loads top tokens, auto-analyzes, no manual input required.
 * Shows errors directly on screen for debugging.
 */

window.addEventListener('error', (e) => {
  _showBootError(`JS Error: ${e.message} (${e.filename}:${e.lineno})`);
});

function _showBootError(msg) {
  const el = document.getElementById('bootErrorDisplay') || (() => {
    const d = document.createElement('div');
    d.id = 'bootErrorDisplay';
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff4444;color:#fff;padding:10px;font-size:11px;font-family:monospace;z-index:99999;max-height:200px;overflow-y:auto;white-space:pre-wrap';
    document.body.appendChild(d);
    return d;
  })();
  el.textContent += msg + '\n\n';
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    showToast('Phoenix Engine', 'Initializing data architecture...', 'info');
  } catch (e) { _showBootError('showToast missing: ' + e.message); }

  try {
    const health = await apiService.health();
    if (health.backend !== 'healthy') throw new Error('Backend not healthy');
  } catch (e) {
    _showBootError('Health check failed: ' + e.message);
    _bootWithFallback();
    return;
  }

  try {
    const marketData = await apiService.getMarketPairs(200);
    if (marketData.assets && marketData.assets.length > 0) {
      globalStore.setState('assets', marketData.assets);
      globalStore.setState('parentTrackAssets', marketData.assets);
    }
  } catch (e) {
    _showBootError('Market load failed: ' + e.message);
    _seedFallbackAssets();
  }

  try {
    const wl = await apiService.getWatchlist();
    globalStore.setState('watchlist', wl.symbols || []);
  } catch (e) {
    globalStore.setState('watchlist', ['BTCUSDT','ETHUSDT','SOLUSDT']);
  }

  try {
    const journal = await apiService.getJournalTrades();
    globalStore.setState('journal', journal.trades || []);
  } catch (e) { }

  try {
    const portfolio = await apiService.getPortfolio();
    globalStore.setState('paperPortfolio', portfolio);
  } catch (e) { }

  try {
    const settings = await apiService.getSettings();
    globalStore.setState('settings', settings);
  } catch (e) { }

  try {
    const summary = await apiService.getMarketSummary();
    globalStore.setState('marketSummary', summary);
  } catch (e) { }

  globalStore.setState('backendReady', true);

  try {
    if (typeof navigateTo === 'function') {
      navigateTo('dashboard');
    } else {
      _showBootError('navigateTo() function not found — check router.js');
    }
  } catch (e) {
    _showBootError('navigateTo failed: ' + e.message);
  }

  try {
    showToast('Phoenix Engine', 'System fully initialized.', 'success');
  } catch (e) { }

  try {
    if (typeof wsService !== 'undefined') wsService.connect();
  } catch (e) {
    _showBootError('WebSocket connect failed: ' + e.message);
  }

  _startSignalPolling();
  _autoAnalyzeTopTokens();

  try {
    if (typeof renderTicker === 'function') renderTicker();
  } catch (e) {
    _showBootError('renderTicker failed: ' + e.message);
  }
});


function _startSignalPolling() {
  const poll = async () => {
    try {
      const data = await apiService.scanSignals(
        globalStore.getState('settings').min_signal_confidence || 68
      );
      if (data.signals) {
        globalStore.setState('signalCache', data.signals);
        if (globalStore.getState('currentPage') === 'signals' &&
            typeof renderSignalFeed === 'function') {
          renderSignalFeed();
        }
      }
    } catch (e) { }
  };
  poll();
  setInterval(poll, 30000);
}


const TOP_TOKENS = [
  'BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT',
  'ADAUSDT','DOGEUSDT','AVAXUSDT','DOTUSDT','LINKUSDT',
];

async function _autoAnalyzeTopTokens() {
  for (const sym of TOP_TOKENS) {
    try {
      const result = await apiService.getAnalysis(sym);
      if (result && !result.error) {
        globalStore.setAnalysis(sym, result);
      }
    } catch (e) { }
    await new Promise(r => setTimeout(r, 300));
  }
  setTimeout(_autoAnalyzeTopTokens, 60000);
}


function _bootWithFallback() {
  _seedFallbackAssets();
  globalStore.setState('watchlist', ['BTCUSDT','ETHUSDT','SOLUSDT']);
  try {
    if (typeof navigateTo === 'function') navigateTo('dashboard');
  } catch (e) { _showBootError('Fallback navigateTo failed: ' + e.message); }
  try {
    if (typeof wsService !== 'undefined') wsService.connect();
  } catch (e) { }
  try {
    if (typeof renderTicker === 'function') renderTicker();
  } catch (e) { }
}

function _seedFallbackAssets() {
  const seeds = [
    { symbol:'BTCUSDT', name:'Bitcoin',  price:60210, change24h:-0.09, volume:'10.8K',  volume_raw:10800,     high:60919, low:59727, sparkline:[], source:'seed', confidence:'low' },
    { symbol:'ETHUSDT', name:'Ethereum', price:1583,  change24h:-0.07, volume:'138.7M', volume_raw:138700000, high:1611,  low:1562,  sparkline:[], source:'seed', confidence:'low' },
    { symbol:'SOLUSDT', name:'Solana',   price:71.95, change24h:-0.09, volume:'44.5M',  volume_raw:44500000,  high:73.19, low:70.15, sparkline:[], source:'seed', confidence:'low' },
  ];
  globalStore.setState('assets', seeds);
  globalStore.setState('parentTrackAssets', seeds);
  }
