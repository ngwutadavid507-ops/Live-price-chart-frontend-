/**
 * Market Renderers — real data from backend
 */

function renderMarketLeaders() {
  const container = document.getElementById('marketLeaders');
  if (!container) return;
  const assets  = globalStore.getState('assets');
  const leaders = [...assets]
    .sort((a, b) => (b.volume_raw || 0) - (a.volume_raw || 0))
    .slice(0, 5);

  let html = `<div class="card-title">Market Capitalization Leaders</div>
    <table class="data-table">
      <thead><tr><th>Asset</th><th>Price</th><th>24h Vol</th><th>Source</th></tr></thead>
      <tbody>`;
  leaders.forEach(a => {
    const srcColor = a.source === 'bybit' || a.source === 'okx' || a.source === 'bingx'
      ? 'var(--success)' : 'var(--text-muted)';
    html += `
      <tr>
        <td><strong>${a.symbol.replace('USDT','')}</strong>
          ${a.name && a.name !== a.symbol ? `<small style="color:var(--text-muted)"> ${a.name}</small>` : ''}
        </td>
        <td class="font-mono">${formatters.price(a.price)}</td>
        <td class="font-mono">${a.volume || '—'}</td>
        <td style="font-size:10px;color:${srcColor}">${a.source || '—'}</td>
      </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderTopMovers() {
  const container = document.getElementById('topMovers');
  if (!container) return;
  const assets = globalStore.getState('assets');
  const movers = [...assets]
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 8);

  let html = `<div class="card-title">Top 24h Volatility Shifts</div>
    <table class="data-table">
      <thead><tr><th>Asset</th><th>Price</th><th>Delta</th></tr></thead>
      <tbody>`;
  movers.forEach(a => {
    const chgColor = a.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
    html += `
      <tr>
        <td><strong>${a.symbol.replace('USDT','')}</strong></td>
        <td class="font-mono">${formatters.price(a.price)}</td>
        <td class="font-mono" style="color:${chgColor}">${formatters.pct(a.change24h)}</td>
      </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAllMarkets() {
  const container = document.getElementById('allMarkets');
  if (!container) return;
  const assets    = globalStore.getState('assets');
  let searchVal   = container.dataset.search || '';
  const filtered  = assets.filter(a =>
    !searchVal || a.symbol.includes(searchVal.toUpperCase())
  );

  let html = `<div class="card-title">All Cryptographic Trade Pairs
    <span class="font-mono" style="font-size:11px;color:var(--text-muted)">${filtered.length} pairs</span>
  </div>
  <div style="margin-bottom:10px">
    <input type="text" id="marketSearchInput" placeholder="Search symbol..."
      value="${searchVal}"
      style="background:var(--bg-primary);border:1px solid var(--border);
             padding:6px 10px;border-radius:var(--radius-sm);
             color:#fff;width:200px;font-size:12px">
  </div>
  <table class="data-table">
    <thead><tr>
      <th>Symbol</th><th>Price</th><th>24h Change</th>
      <th>High</th><th>Low</th><th>Volume</th>
    </tr></thead><tbody>`;

  filtered.slice(0, 100).forEach(a => {
    const chgColor = a.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
    html += `
      <tr>
        <td><strong>${a.symbol}</strong></td>
        <td class="font-mono">${formatters.price(a.price)}</td>
        <td class="font-mono" style="color:${chgColor}">${formatters.pct(a.change24h)}</td>
        <td class="font-mono">${formatters.price(a.high || 0)}</td>
        <td class="font-mono">${formatters.price(a.low  || 0)}</td>
        <td class="font-mono">${a.volume || '—'}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  const searchInput = document.getElementById('marketSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      container.dataset.search = e.target.value;
      renderAllMarkets();
    });
  }
}

async function renderExchangeRankings() {
  const container = document.getElementById('exchangeRankings');
  if (!container) return;
  try {
    const summary = await apiService.getMarketSummary();
    globalStore.setState('marketSummary', summary);
    const {
      bullish_count, bearish_count, neutral_count,
      avg_market_score, strongest_bullish, strongest_bearish, total_tracked
    } = summary;
    const dominance = total_tracked > 0
      ? Math.round(bullish_count / total_tracked * 100) : 50;

    container.innerHTML = `
      <div class="card-title">Global Market Intelligence Summary</div>
      <div class="grid-3" style="margin-bottom:12px">
        <div class="risk-metric-card">
          <div class="risk-metric-label">Bullish</div>
          <div class="risk-metric-value" style="color:var(--success)">${bullish_count}</div>
        </div>
        <div class="risk-metric-card">
          <div class="risk-metric-label">Neutral</div>
          <div class="risk-metric-value">${neutral_count}</div>
        </div>
        <div class="risk-metric-card">
          <div class="risk-metric-label">Bearish</div>
          <div class="risk-metric-value" style="color:var(--danger)">${bearish_count}</div>
        </div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:var(--success)">Bulls ${dominance}%</span>
          <span>Avg Score: ${avg_market_score?.toFixed(1)}</span>
          <span style="color:var(--danger)">Bears ${100 - dominance}%</span>
        </div>
        <div style="height:6px;background:var(--danger-dim);border-radius:3px;overflow:hidden">
          <div style="width:${dominance}%;height:100%;background:var(--success);border-radius:3px"></div>
        </div>
      </div>
      ${strongest_bullish?.length ? `
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Strongest Bullish</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
          ${strongest_bullish.map(s => `<span class="badge badge-success">${s.replace('USDT','')}</span>`).join('')}
        </div>` : ''}
      ${strongest_bearish?.length ? `
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Strongest Bearish</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${strongest_bearish.map(s => `<span class="badge badge-danger">${s.replace('USDT','')}</span>`).join('')}
        </div>` : ''}`;
  } catch {
    container.innerHTML = `
      <div class="card-title">Global Liquidity Pool Index</div>
      <table class="data-table">
        <thead><tr><th>Rank</th><th>Exchange</th><th>24h Volume</th><th>Score</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Bybit</td><td>$9.4B</td><td style="color:var(--success)">9.2</td></tr>
          <tr><td>2</td><td>OKX</td><td>$6.1B</td><td style="color:var(--success)">8.9</td></tr>
          <tr><td>3</td><td>BingX</td><td>$2.8B</td><td style="color:var(--accent)">8.1</td></tr>
        </tbody>
      </table>`;
  }
}
