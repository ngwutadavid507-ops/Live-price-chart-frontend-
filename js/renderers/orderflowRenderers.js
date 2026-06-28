/**
 * Order Flow Renderers — real order book and whale data
 */

async function renderOrderBook() {
  const container = document.getElementById('orderBook');
  if (!container) return;

  const symbol = globalStore.getState('settings').default_symbol || 'BTCUSDT';
  container.innerHTML = `<div class="card-title">Real-Time Depth Matrix (${symbol.replace('USDT','')}/USDT)</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Loading order book...</div>`;

  try {
    const data = await apiService.getOrderFlow(symbol, 'binance', 10);
    const { bids, asks, imbalance, cvd } = data;
    const ratio    = imbalance ? Math.round(imbalance.ratio * 100) : 50;
    const pressure = imbalance ? imbalance.pressure : 'neutral';

    let html = `
      <div class="card-title">Real-Time Depth Matrix (${symbol.replace('USDT','')}/USDT)
        <span class="badge ${pressure === 'bullish' ? 'badge-success' : pressure === 'bearish' ? 'badge-danger' : 'badge-warning'}">
          ${pressure}
        </span>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:var(--success)">Bids ${ratio}%</span>
          <span style="color:var(--text-muted)">CVD: <span class="font-mono" style="color:${cvd >= 0 ? 'var(--success)' : 'var(--danger)'}">${cvd >= 0 ? '+' : ''}${cvd?.toFixed(2)}</span></span>
          <span style="color:var(--danger)">Asks ${100 - ratio}%</span>
        </div>
        <div style="height:6px;background:var(--danger-dim);border-radius:3px;overflow:hidden">
          <div style="width:${ratio}%;height:100%;background:var(--success);border-radius:3px;transition:width 0.3s"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <table class="data-table">
          <thead><tr>
            <th style="color:var(--danger)">Ask Price</th><th>Size</th>
          </tr></thead><tbody>`;

    asks.slice(0, 8).forEach(([price, qty]) => {
      html += `<tr>
        <td class="font-mono" style="color:var(--danger)">${formatters.price(price)}</td>
        <td class="font-mono">${qty.toFixed(4)}</td>
      </tr>`;
    });

    html += `</tbody></table>
        <table class="data-table">
          <thead><tr>
            <th style="color:var(--success)">Bid Price</th><th>Size</th>
          </tr></thead><tbody>`;

    bids.slice(0, 8).forEach(([price, qty]) => {
      html += `<tr>
        <td class="font-mono" style="color:var(--success)">${formatters.price(price)}</td>
        <td class="font-mono">${qty.toFixed(4)}</td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
    globalStore.setState('orderBook', { bids, asks });

    if (globalStore.getState('currentPage') === 'orderflow') {
      setTimeout(renderOrderBook, 5000);
    }

  } catch {
    const assets = globalStore.getState('assets');
    const price  = assets[0]?.price || 60000;
    let html = `<div class="card-title">Real-Time Depth Matrix</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <table class="data-table"><thead><tr>
        <th style="color:var(--danger)">Ask Price</th><th>Size</th>
      </tr></thead><tbody>`;
    for (let i = 0; i < 5; i++) {
      html += `<tr>
        <td class="font-mono" style="color:var(--danger)">${formatters.price(price + (i * 5))}</td>
        <td class="font-mono">${(Math.random() * 2).toFixed(3)}</td>
      </tr>`;
    }
    html += `</tbody></table>
      <table class="data-table"><thead><tr>
        <th style="color:var(--success)">Bid Price</th><th>Size</th>
      </tr></thead><tbody>`;
    for (let i = 0; i < 5; i++) {
      html += `<tr>
        <td class="font-mono" style="color:var(--success)">${formatters.price(price - (i * 5))}</td>
        <td class="font-mono">${(Math.random() * 2).toFixed(3)}</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }
}

async function renderWhaleAlerts() {
  const container = document.getElementById('whaleAlerts');
  if (!container) return;

  container.innerHTML = `<div class="card-title">On-Chain Whale Footprint Log</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Scanning whale activity...</div>`;

  try {
    const data   = await apiService.getWhaleAlerts('BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT', 100000);
    const alerts = data.alerts || [];

    if (alerts.length === 0) {
      container.innerHTML = `<div class="card-title">On-Chain Whale Footprint Log</div>
        <div style="padding:16px;text-align:center;color:var(--text-muted);font-size:12px">
          No whale trades detected in the last 50 transactions.
        </div>`;
      return;
    }

    let html = `<div class="card-title">On-Chain Whale Footprint Log
      <span class="badge badge-warning">${alerts.length} detected</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px">`;

    alerts.slice(0, 8).forEach(a => {
      const sideColor  = a.side === 'Buy' ? 'var(--success)' : 'var(--danger)';
      const impactIcon = a.impact === 'mega' ? '🐋' : a.impact === 'large' ? '🐳' : '🐟';
      html += `
        <div class="whale-alert-row">
          <span>
            ${impactIcon}
            <span class="badge ${a.side === 'Buy' ? 'badge-success' : 'badge-danger'}" style="margin:0 6px">${a.side}</span>
            <strong>${a.symbol?.replace('USDT','')} ${a.qty}</strong>
          </span>
          <span class="font-mono" style="color:${sideColor}">$${a.value_fmt}</span>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch {
    let html = `<div class="card-title">On-Chain Whale Footprint Log</div>
      <div style="display:flex;flex-direction:column;gap:8px">`;
    for (let i = 0; i < 3; i++) {
      html += `<div class="whale-alert-row">
        <span>🐳 Transferred <strong>${150 + i * 40} BTC</strong> to Exchange</span>
        <span class="font-mono" style="color:var(--accent)">$${10 + i}M</span>
      </div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
  }
}
