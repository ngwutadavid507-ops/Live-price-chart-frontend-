/**
 * Phoenix Terminal — Boot Sequence
 * Loads real data from backend before first render.
 */

document.addEventListener('DOMContentLoaded', async () => {

  showToast('Phoenix Engine', 'Initializing data architecture...', 'info');

  // Step 1: Health check
  try {
    const health = await apiService.health();
    if (health.backend !== 'healthy') throw new Error('Backend not healthy');
  } catch (e) {
    showToast('Phoenix Warning', 'Backend offline — running on cached data.', 'danger');
    _bootWithFallback();
    return;
  }

  // Step 2: Load market assets
  try {
    const marketData = await apiService.getMarketPairs(200);
    if (marketData.assets && marketData.assets.length > 0) {
      globalStore.setState('assets', marketData.assets);
      globalStore.setState('parentTrackAssets', marketData.assets);
    }
  } catch {
    showToast('Markets', 'Using seeded asset data.', 'info');
    _seedFallbackAssets();
  }

  // Step 3: Load watchlist
  try {
    const wl = await apiService.getWatchlist();
    globalStore.setState('watchlist', wl.symbols || []);
  } catch {
    globalStore.setState('watchlist', ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);
  }

  // Step 4: Load journal
  try {
    const journal = await apiService.getJournalTrades();
    globalStore.setState('journal', journal.trades || []);
  } catch { }

  // Step 5: Load portfolio
  try {
    const portfolio = await apiService.getPortfolio();
    globalStore.setState('paperPortfolio', portfolio);
  } catch { }

  // Step 6: Load settings
  try {
    const settings = await apiService.getSettings();
    globalStore.setState('settings', settings);
  } catch { }

  // Step 7: Load market summary
  try {
    const summary = await apiService.getMarketSummary();
    globalStore.setState('marketSummary', summary);
  } catch { }

  // Step 8: Mark backend ready
  globalStore.setState('backendReady', true);

  // Step 9: Navigate to dashboard
  navigateTo('dashboard');
  showToast('Phoenix Engine', 'System architecture fully initialized.', 'success');

  // Step 10: Connect WebSocket
  wsService.connect();

  // Step 11: Signal polling every 30s
  _startSignalPolling();

  // Step 12: Render ticker
  renderTicker();
});


function _startSignalPolling() {
  const poll = async () => {
    try {
      const data = await apiService.scanSignals(
        globalStore.getState('settings').min_signal_confidence || 68
      );
      if (data.signals) {
        globalStore.setState('signalCache', data.signals);
        if (globalStore.getState('currentPage') === 'signals') {
          renderSignalFeed();
        }
        const latest = data.signals[0];
        if (latest && latest.fired) {
          showToast(
            `Signal: ${latest.symbol}`,
            `${latest.direction.toUpperCase()} — ${latest.confidence}% confidence`,
            latest.direction === 'buy' ? 'success' : 'danger'
          );
        }
      }
    } catch { }
  };
  poll();
  setInterval(poll, 30_000);
}


function _bootWithFallback() {
  _seedFallbackAssets();
  globalStore.setState('watchlist', ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']);
  navigateTo('dashboard');
  wsService.connect();
  renderTicker();
}

function _seedFallbackAssets() {
  const seeds = [
    { symbol: 'BTCUSDT',  name: 'Bitcoin',  price: 60210, change24h:  -0.09, volume: '10.8K',  volume_raw: 10800,      high: 60919, low: 59727, sparkline: [], source: 'seed', confidence: 'low' },
    { symbol: 'ETHUSDT',  name: 'Ethereum', price: 1583,  change24h:  -0.07, volume: '138.7M', volume_raw: 138700000,  high: 1611,  low: 1562,  sparkline: [], source: 'seed', confidence: 'low' },
    { symbol: 'SOLUSDT',  name: 'Solana',   price: 71.95, change24h:  -0.09, volume: '44.5M',  volume_raw: 44500000,   high: 73.19, low: 70.15, sparkline: [], source: 'seed', confidence: 'low' },
    { symbol: 'BNBUSDT',  name: 'BNB',      price: 557.6, change24h:  -1.37, volume: '3.1M',   volume_raw: 3100000,    high: 567.1, low: 554.1, sparkline: [], source: 'seed', confidence: 'low' },
    { symbol: 'XRPUSDT',  name: 'XRP',      price: 1.055, change24h:  -0.15, volume: '23.0M',  volume_raw: 23000000,   high: 1.077, low: 1.041, sparkline: [], source: 'seed', confidence: 'low' },
  ];
  globalStore.setState('assets', seeds);
  globalStore.setState('parentTrackAssets', seeds);
     }
