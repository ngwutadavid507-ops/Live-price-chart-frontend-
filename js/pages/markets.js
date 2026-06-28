/**
 * Markets Page — 12,000+ asset browser
 * Spot, futures, perpetual markets
 */

async function renderMarkets() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Markets</h1>
      <p class="page-subtitle">Live prices across all tracked assets</p>
    </div>

    <div class="grid-3" style="margin-bottom:16px">
      <div class="card">
        <div class="card-label">Total Tracked</div>
        <div class="card-value" id="totalTracked">—</div>
      </div>
      <div class="card">
        <div class="card-label">Exchange Sources</div>
        <div class="card-value" style="color:var(--success)">
          Bybit + OKX + BingX
        </div>
      </div>
      <div class="card">
        <div class="card-label">Data Quality</div>
        <div class="card-value" style="color:var(--accent)">
          Live WebSocket
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="filterMarkets('all')">All</button>
        <button class="btn btn-sm" onclick="filterMarkets('gainers')">Top Gainers</button>
        <button class="btn btn-sm" onclick="filterMarkets('losers')">Top Losers</button>
        <button class="btn btn-sm" onclick="filterMarkets('volume')">By Volume</button>
      </div>
      <div id="allMarkets">
        <div style="color:var(--text-muted);font-size:12px">Loading markets...</div>
      </div>
    </div>
  `;

  // Update total tracked count
  const assets    = globalStore.getState('assets');
  const totalEl   = document.getElementById('totalTracked');
  if (totalEl) totalEl.textContent = assets.length + ' pairs';

  // Load markets table
  renderAllMarkets();
}


function filterMarkets(mode) {
  const container = document.getElementById('allMarkets');
  if (!container) return;

  const assets = globalStore.getState('assets');
  let filtered = [...assets];

  if (mode === 'gainers') {
    filtered = filtered
      .filter(a => a.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h);
  } else if (mode === 'losers') {
    filtered = filtered
      .filter(a => a.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h);
  } else if (mode === 'volume') {
    filtered = filtered.sort((a, b) => (b.volume_raw || 0) - (a.volume_raw || 0));
  } else {
    filtered = filtered.sort((a, b) => (b.volume_raw || 0) - (a.volume_raw || 0));
  }

  let html = `<table class="data-table">
    <thead><tr>
      <th>Symbol</th><th>Price</th><th>24h Change</th>
      <th>High</th><th>Low</th><th>Volume</th><th>Source</th>
    </tr></thead><tbody>`;

  filtered.slice(0, 100).forEach(a => {
    const chgColor = a.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
    const srcColor = ['bybit','okx','bingx'].includes(a.source)
      ? 'var(--success)' : 'var(--text-muted)';
    html += `
      <tr style="cursor:pointer" onclick="navigateTo('analysis')">
        <td><strong>${a.symbol}</strong>
          ${a.name ? `<small style="color:var(--text-muted);display:block">${a.name}</small>` : ''}
        </td>
        <td class="font-mono">${formatters.price(a.price)}</td>
        <td class="font-mono" style="color:${chgColor}">${formatters.pct(a.change24h)}</td>
        <td class="font-mono">${formatters.price(a.high || 0)}</td>
        <td class="font-mono">${formatters.price(a.low  || 0)}</td>
        <td class="font-mono">${a.volume || '—'}</td>
        <td style="font-size:10px;color:${srcColor}">${a.source || '—'}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}
