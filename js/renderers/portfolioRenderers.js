/**
 * Portfolio Renderers — real portfolio and watchlist from backend
 */

function renderOpenPositions() {
  const container = document.getElementById('openPositions');
  if (!container) return;

  const portfolio = globalStore.getState('paperPortfolio');
  const positions = portfolio.positions || [];

  let html = `<div class="card-title">Active High-Leverage Positions Matrix
    <span class="font-mono" style="color:var(--accent);font-size:12px">
      Balance: ${formatters.price(portfolio.balance || 0)}
    </span>
  </div>`;

  if (positions.length === 0) {
    html += `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px">
      No open positions. Add a position to start tracking.
    </div>`;
    container.innerHTML = html;
    return;
  }

  html += `<table class="data-table">
    <thead><tr>
      <th>Contract</th><th>Amount</th><th>Entry</th>
      <th>Current</th><th>PnL</th><th>PnL %</th>
    </tr></thead><tbody>`;

  positions.forEach(p => {
    const pnlColor = (p.pnl || 0) >= 0 ? 'var(--success)' : 'var(--danger)';
    const pnlPct   = p.pnl_pct ?? 0;
    html += `
      <tr>
        <td><strong>${p.symbol}/USDT</strong></td>
        <td class="font-mono">${p.amount}</td>
        <td class="font-mono">${formatters.price(p.entry_price || 0)}</td>
        <td class="font-mono">${formatters.price(p.current_price || 0)}</td>
        <td class="font-mono" style="color:${pnlColor}">
          ${(p.pnl || 0) >= 0 ? '+' : ''}${formatters.price(p.pnl || 0)}
        </td>
        <td class="font-mono" style="color:${pnlColor}">
          ${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  const totalPnl = positions.reduce((acc, p) => acc + (p.pnl || 0), 0);
  const pnlColor = totalPnl >= 0 ? 'var(--success)' : 'var(--danger)';
  html += `
    <div style="display:flex;justify-content:flex-end;padding-top:8px;font-size:12px;color:var(--text-muted)">
      Total PnL:
      <span class="font-mono" style="color:${pnlColor};margin-left:8px">
        ${totalPnl >= 0 ? '+' : ''}${formatters.price(totalPnl)}
      </span>
    </div>`;

  container.innerHTML = html;
}

function renderWatchlist() {
  const container = document.getElementById('watchlist');
  if (!container) return;

  const watchlist = globalStore.getState('watchlist');
  const assets    = globalStore.getState('assets');

  let html = `<div class="card-title">Monitored Watchlist Tracks</div>`;
  const watched = assets.filter(a => watchlist.includes(a.symbol));

  if (watched.length === 0) {
    html += `<div style="color:var(--text-muted);font-size:12px;padding:12px">
      No assets in watchlist. Add symbols to track them here.
    </div>`;
    container.innerHTML = html;
    return;
  }

  html += `<table class="data-table">
    <thead><tr><th>Token</th><th>Price</th><th>24h</th><th>Volume</th></tr></thead>
    <tbody>`;

  watched.forEach(a => {
    const chgColor = a.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
    html += `
      <tr>
        <td><strong>${a.symbol.replace('USDT','')}</strong></td>
        <td class="font-mono" style="color:var(--accent)">${formatters.price(a.price)}</td>
        <td class="font-mono" style="color:${chgColor}">${formatters.pct(a.change24h)}</td>
        <td class="font-mono">${a.volume || '—'}</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

async function renderRiskDashboard() {
  const container = document.getElementById('riskDashboard');
  if (!container) return;

  container.innerHTML = `<div class="card-title">Portfolio Risk Intelligence Matrix</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Calculating risk metrics...</div>`;

  try {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const metrics = await Promise.all(
      symbols.map(s => apiService.getRiskMetrics(s).catch(() => null))
    );

    let html = `<div class="card-title">Portfolio Risk Intelligence Matrix</div>
      <div class="grid-3">`;

    metrics.forEach((m, i) => {
      if (!m) return;
      const sym      = symbols[i].replace('USDT', '');
      const volLabel = m.volatility_label || '—';
      const volColor = volLabel === 'high' ? 'var(--danger)'
                     : volLabel === 'medium' ? 'var(--accent)'
                     : 'var(--success)';
      html += `
        <div class="risk-metric-card">
          <div class="risk-metric-label">${sym}/USDT</div>
          <div class="risk-metric-value">${formatters.price(m.price || 0)}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
            ATR: <span class="font-mono">${m.atr_pct?.toFixed(2)}%</span>
          </div>
          <div style="font-size:11px;margin-top:2px">
            Volatility: <span style="color:${volColor};font-weight:700">${volLabel.toUpperCase()}</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
            SL: <span class="font-mono">${formatters.price(m.suggested_sl || 0)}</span><br>
            TP: <span class="font-mono">${formatters.price(m.suggested_tp || 0)}</span>
          </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">Portfolio Risk Intelligence Matrix</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">Risk data unavailable.</div>`;
  }
}
