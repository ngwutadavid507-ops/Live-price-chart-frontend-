/**
 * Whales Page — whale alerts and large trade detection
 */

async function renderWhales() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Whale Tracker</h1>
      <p class="page-subtitle">Large trade detection — minimum $100K USD per transaction</p>
    </div>

    <!-- Stats -->
    <div class="grid-3" style="margin-bottom:16px">
      <div class="card">
        <div class="card-label">Whale Threshold</div>
        <div class="card-value" style="color:var(--accent)">$100K+</div>
      </div>
      <div class="card">
        <div class="card-label">Monitored Pairs</div>
        <div class="card-value">BTC ETH SOL BNB XRP</div>
      </div>
      <div class="card">
        <div class="card-label">Detected</div>
        <div class="card-value" id="whaleCount">—</div>
      </div>
    </div>

    <!-- Threshold Filter -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--text-muted)">Min Size:</span>
        <button class="btn btn-sm" onclick="loadWhales(50000)">$50K</button>
        <button class="btn btn-primary btn-sm" onclick="loadWhales(100000)">$100K</button>
        <button class="btn btn-sm" onclick="loadWhales(500000)">$500K</button>
        <button class="btn btn-sm" onclick="loadWhales(1000000)">$1M+</button>
        <button class="btn btn-sm" style="margin-left:auto" onclick="loadWhales(100000)">
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Symbol Filter -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--text-muted)">Symbols:</span>
        <button class="btn btn-primary btn-sm"
          onclick="loadWhalesForSymbols('BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT')">
          Top 5
        </button>
        <button class="btn btn-sm"
          onclick="loadWhalesForSymbols('BTCUSDT')">BTC Only</button>
        <button class="btn btn-sm"
          onclick="loadWhalesForSymbols('ETHUSDT')">ETH Only</button>
        <button class="btn btn-sm"
          onclick="loadWhalesForSymbols('SOLUSDT')">SOL Only</button>
      </div>
    </div>

    <!-- Whale Feed -->
    <div class="card" id="whaleFeed">
      <div class="card-title">On-Chain Whale Footprint Log</div>
      <div style="color:var(--text-muted);font-size:12px;padding:8px">
        Scanning for whale activity...
      </div>
    </div>
  `;

  await loadWhales(100000);
}


async function loadWhales(threshold = 100000) {
  const symbols = 'BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT';
  await loadWhalesForSymbols(symbols, threshold);
}


async function loadWhalesForSymbols(symbols, threshold = 100000) {
  const container = document.getElementById('whaleFeed');
  const countEl   = document.getElementById('whaleCount');
  if (!container) return;

  container.innerHTML = `<div class="card-title">On-Chain Whale Footprint Log</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Scanning...</div>`;

  try {
    const data   = await apiService.getWhaleAlerts(symbols, threshold);
    const alerts = data.alerts || [];

    if (countEl) {
      countEl.textContent = alerts.length;
      countEl.style.color = alerts.length > 0 ? 'var(--accent)' : 'var(--text-muted)';
    }

    if (alerts.length === 0) {
      container.innerHTML = `<div class="card-title">On-Chain Whale Footprint Log</div>
        <div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px">
          No whale trades detected above $${(threshold/1000).toFixed(0)}K threshold.
          <br>Try lowering the minimum size filter.
        </div>`;
      return;
    }

    let html = `<div class="card-title">On-Chain Whale Footprint Log
      <span class="badge badge-warning">${alerts.length} detected</span>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Symbol</th><th>Side</th><th>Quantity</th>
        <th>Value</th><th>Price</th><th>Impact</th>
      </tr></thead><tbody>`;

    alerts.forEach(a => {
      const sideColor  = a.side === 'Buy' ? 'var(--success)' : 'var(--danger)';
      const impactIcon = a.impact === 'mega'   ? '🐋'
                       : a.impact === 'large'  ? '🐳'
                       : a.impact === 'medium' ? '🐟'
                       : '🐠';
      html += `
        <tr>
          <td><strong>${a.symbol?.replace('USDT','')}/USDT</strong></td>
          <td><span class="badge ${a.side === 'Buy' ? 'badge-success' : 'badge-danger'}">${a.side}</span></td>
          <td class="font-mono">${a.qty}</td>
          <td class="font-mono" style="color:${sideColor}">$${a.value_fmt}</td>
          <td class="font-mono">${formatters.price(a.price)}</td>
          <td>${impactIcon} ${a.impact}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">On-Chain Whale Footprint Log</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">
        Whale data unavailable — exchange REST APIs rate limited.
      </div>`;
    if (countEl) countEl.textContent = '—';
  }
}
