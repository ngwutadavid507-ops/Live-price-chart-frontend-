/**
 * Order Flow Page — depth analytics, time-and-sales tracker
 */

async function renderOrderflow() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  const defaultSym = globalStore.getState('settings').default_symbol || 'BTCUSDT';

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Order Flow</h1>
      <p class="page-subtitle">Real-time depth matrix and market microstructure</p>
    </div>

    <!-- Symbol Selector -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="orderflowSymbolInput"
          value="${defaultSym}"
          placeholder="e.g. BTCUSDT"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);
                 color:#fff;width:130px;font-size:12px;font-family:var(--font-mono)">
        <button class="btn btn-primary btn-sm" onclick="_loadOrderflow()">Load</button>
        <button class="btn btn-sm" onclick="_loadOrderflow()">🔄 Refresh</button>
      </div>
    </div>

    <!-- Order Book -->
    <div class="card" style="margin-bottom:16px" id="orderBook">
      <div class="card-title">Loading order book...</div>
    </div>

    <!-- Whale Alerts -->
    <div class="card" style="margin-bottom:16px" id="whaleAlerts">
      <div class="card-title">Loading whale activity...</div>
    </div>

    <!-- CVD Chart placeholder -->
    <div class="card">
      <div class="card-title">Cumulative Volume Delta</div>
      <canvas id="cvdChart" height="200"
        style="width:100%;max-height:200px"></canvas>
    </div>
  `;

  await _loadOrderflow();
}


async function _loadOrderflow() {
  const inputEl = document.getElementById('orderflowSymbolInput');
  const symbol  = inputEl ? inputEl.value.trim().toUpperCase() : 'BTCUSDT';

  // Update settings default symbol
  const settings = globalStore.getState('settings');
  settings.default_symbol = symbol;
  globalStore.setState('settings', settings);

  renderOrderBook();
  renderWhaleAlerts();
}
