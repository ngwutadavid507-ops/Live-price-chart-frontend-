/**
 * Pro Tools Renderers — real order sim wired to /protools/simulate
 */

function renderOrderSimulator() {
  const container = document.getElementById('orderSimulator');
  if (!container) return;

  const defaultSym = globalStore.getState('settings').default_symbol || 'BTCUSDT';

  container.innerHTML = `
    <div style="display:flex;gap:4px;margin-bottom:12px">
      <button class="order-type-btn active" id="orderSideLong"  onclick="setOrderSide('long')">Long</button>
      <button class="order-type-btn"        id="orderSideShort" onclick="setOrderSide('short')">Short</button>
    </div>
    <div class="order-sim-row">
      <span class="order-sim-label">Symbol</span>
      <input type="text" id="simSymbol" class="order-sim-input" value="${defaultSym}">
    </div>
    <div class="order-sim-row">
      <span class="order-sim-label">Size (USD)</span>
      <input type="number" id="simSize" class="order-sim-input" value="100">
    </div>
    <div class="order-sim-row">
      <span class="order-sim-label">Leverage</span>
      <input type="number" id="simLeverage" class="order-sim-input" value="1">
    </div>
    <div class="order-sim-row">
      <span class="order-sim-label">SL %</span>
      <input type="number" id="simSL" class="order-sim-input" value="2">
    </div>
    <div class="order-sim-row">
      <span class="order-sim-label">TP %</span>
      <input type="number" id="simTP" class="order-sim-input" value="4">
    </div>
    <button class="btn btn-primary w-full" onclick="runOrderSimulation()">
      Calculate Order
    </button>
    <div id="orderSimResult" class="order-preview" style="display:none"></div>
  `;
}

window._orderSide = 'long';

function setOrderSide(side) {
  window._orderSide  = side;
  const longBtn  = document.getElementById('orderSideLong');
  const shortBtn = document.getElementById('orderSideShort');
  if (longBtn && shortBtn) {
    longBtn.className  = `order-type-btn ${side === 'long'  ? 'active' : ''}`;
    shortBtn.className = `order-type-btn ${side === 'short' ? 'active' : ''}`;
  }
}

async function runOrderSimulation() {
  const symbol   = document.getElementById('simSymbol')?.value?.trim()?.toUpperCase() || 'BTCUSDT';
  const size_usd = parseFloat(document.getElementById('simSize')?.value)     || 100;
  const leverage = parseFloat(document.getElementById('simLeverage')?.value) || 1;
  const sl_pct   = parseFloat(document.getElementById('simSL')?.value)       || 2;
  const tp_pct   = parseFloat(document.getElementById('simTP')?.value)       || 4;
  const side     = window._orderSide || 'long';

  const resultEl = document.getElementById('orderSimResult');
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = '<div style="color:var(--text-muted);font-size:12px">Calculating...</div>';
  }

  try {
    const result = await apiService.simulateOrder({ symbol, size_usd, leverage, sl_pct, tp_pct, side });
    if (resultEl) {
      const rrColor = result.risk_reward >= 2 ? 'var(--success)'
                    : result.risk_reward >= 1 ? 'var(--accent)'
                    : 'var(--danger)';
      resultEl.innerHTML = `
        <div class="order-preview-row"><span>Entry</span><span class="font-mono">${formatters.price(result.entry_price)}</span></div>
        <div class="order-preview-row"><span>Qty</span><span class="font-mono">${result.qty} ${symbol.replace('USDT','')}</span></div>
        <div class="order-preview-row"><span>Position</span><span class="font-mono">${formatters.price(result.position_usd)}</span></div>
        <div class="order-preview-row"><span>Stop Loss</span><span class="font-mono" style="color:var(--danger)">${formatters.price(result.sl_price)}</span></div>
        <div class="order-preview-row"><span>Take Profit</span><span class="font-mono" style="color:var(--success)">${formatters.price(result.tp_price)}</span></div>
        <div class="order-preview-row"><span>Max Loss</span><span class="font-mono" style="color:var(--danger)">-${formatters.price(result.max_loss)}</span></div>
        <div class="order-preview-row"><span>Max Profit</span><span class="font-mono" style="color:var(--success)">+${formatters.price(result.max_profit)}</span></div>
        <div class="order-preview-row total"><span>Risk:Reward</span><span class="font-mono" style="color:${rrColor}">1:${result.risk_reward}</span></div>
      `;
    }
    showToast('Order Simulator', `${side.toUpperCase()} order calculated. R:R = 1:${result.risk_reward}`, 'success');
  } catch {
    if (resultEl) {
      resultEl.innerHTML = '<div style="color:var(--danger);font-size:12px">Simulation failed — check symbol.</div>';
    }
  }
}

function renderQuickTrade() {
  const container = document.getElementById('quickTrade');
  if (!container) return;
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <button class="btn btn-primary" style="padding:16px"
        onclick="setOrderSide('long'); runOrderSimulation()">
        INSTANT LONG
      </button>
      <button class="btn btn-danger" style="padding:16px"
        onclick="setOrderSide('short'); runOrderSimulation()">
        INSTANT SHORT
      </button>
    </div>
    <div style="font-size:11px;color:var(--text-muted);text-align:center;margin-top:6px">
      Uses current Order Simulator settings
    </div>`;
}

function renderCustomIndicators() {
  const container  = document.getElementById('customIndicators');
  if (!container) return;
  const indicators = globalStore.getState('customIndicators') || [];
  let html = `<div style="display:flex;flex-direction:column;gap:4px;margin-bottom:8px">`;
  indicators.forEach(ind => {
    html += `
      <div class="risk-calc-row">
        <span>${ind.name}</span>
        <span class="badge badge-info">P: ${ind.period}</span>
      </div>`;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderAdvancedAlerts() {
  const container = document.getElementById('advancedAlerts');
  if (!container) return;
  const signals = globalStore.getState('signalCache') || [];
  if (signals.length === 0) {
    container.innerHTML = `
      <div class="alert-rule">
        <div class="alert-rule-status inactive"></div>
        <div><strong>No Active Alert Triggers</strong><br>
          <small>Signal scan runs every 30s</small>
        </div>
      </div>`;
    return;
  }
  let html = '';
  signals.slice(0, 3).forEach(s => {
    html += `
      <div class="alert-rule">
        <div class="alert-rule-status"></div>
        <div>
          <strong>${s.symbol} ${s.direction.toUpperCase()}</strong><br>
          <small>${s.confidence}% confidence | ${s.agreements} indicators agreed</small>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function renderExportReports() {
  const container = document.getElementById('exportReports');
  if (!container) return;
  container.innerHTML = `
    <div class="export-card">
      <div class="export-icon">📊</div>
      <div class="export-info">
        <div class="export-title">Journal Performance Ledger</div>
        <div class="export-desc">Export all trade records as CSV</div>
      </div>
      <button class="export-btn" onclick="exportJournalCSV()">CSV</button>
    </div>
    <div class="export-card">
      <div class="export-icon">📈</div>
      <div class="export-info">
        <div class="export-title">Signal History</div>
        <div class="export-desc">Export cached signal scan results</div>
      </div>
      <button class="export-btn" onclick="exportSignalsCSV()">CSV</button>
    </div>`;
}

function exportJournalCSV() {
  const journal = globalStore.getState('journal') || [];
  if (journal.length === 0) {
    showToast('Export', 'No journal entries to export.', 'danger');
    return;
  }
  const headers = ['Date','Pair','Side','Entry','Exit','PnL','Status','Tags','Note'];
  const rows    = journal.map(j =>
    [j.date, j.pair, j.side, j.entry, j.exit||'—', j.pnl, j.status,
     (j.tags||[]).join(';'), j.note||'']
      .map(v => `"${v}"`).join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'phoenix_journal.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export', 'Journal exported successfully.', 'success');
}

function exportSignalsCSV() {
  const signals = globalStore.getState('signalCache') || [];
  if (signals.length === 0) {
    showToast('Export', 'No signal data to export.', 'danger');
    return;
  }
  const headers = ['Symbol','Direction','Confidence','Agreements','Entry','SL','TP','MarketScore'];
  const rows    = signals.map(s =>
    [s.symbol, s.direction, s.confidence, s.agreements,
     s.entry||'', s.stop_loss||'', s.take_profit||'', s.market_score||'']
      .map(v => `"${v}"`).join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'phoenix_signals.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Export', 'Signals exported successfully.', 'success');
      }
