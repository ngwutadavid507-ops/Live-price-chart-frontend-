/**
 * Pro Tools Page — order sim, journal, risk metrics, alerts, export
 */

async function renderProtools() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Pro Suite</h1>
      <p class="page-subtitle">Professional trading tools and risk management</p>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <!-- Order Simulator -->
      <div class="card" id="orderSimulator">
        <div class="card-title">Order Simulator</div>
        <div style="color:var(--text-muted);font-size:12px">Loading...</div>
      </div>

      <!-- Quick Trade -->
      <div class="card">
        <div class="card-title">Quick Execute</div>
        <div id="quickTrade">Loading...</div>
        <div class="card-title" style="margin-top:16px">Active Alerts</div>
        <div id="advancedAlerts">Loading...</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <!-- Position Sizing -->
      <div class="card">
        <div class="card-title">Position Size Calculator</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="order-sim-row">
            <span class="order-sim-label">Account Size ($)</span>
            <input type="number" id="psAccount" class="order-sim-input" value="1000">
          </div>
          <div class="order-sim-row">
            <span class="order-sim-label">Risk %</span>
            <input type="number" id="psRisk" class="order-sim-input" value="1">
          </div>
          <div class="order-sim-row">
            <span class="order-sim-label">Entry Price</span>
            <input type="number" id="psEntry" class="order-sim-input" value="60000">
          </div>
          <div class="order-sim-row">
            <span class="order-sim-label">Stop Loss</span>
            <input type="number" id="psSL" class="order-sim-input" value="59000">
          </div>
          <button class="btn btn-primary w-full" onclick="_calcPositionSize()">
            Calculate
          </button>
          <div id="psResult" style="display:none"></div>
        </div>
      </div>

      <!-- Risk Metrics -->
      <div class="card">
        <div class="card-title">Live Risk Metrics</div>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input type="text" id="riskSymbolInput" placeholder="Symbol"
            value="BTCUSDT"
            style="background:var(--bg-primary);border:1px solid var(--border);
                   padding:6px 10px;border-radius:var(--radius-sm);
                   color:#fff;font-size:12px;flex:1">
          <button class="btn btn-primary btn-sm" onclick="_loadRiskMetrics()">Load</button>
        </div>
        <div id="riskMetricsResult">
          <div style="color:var(--text-muted);font-size:12px">Enter symbol and click Load.</div>
        </div>
      </div>
    </div>

    <!-- Custom Indicators -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">Custom Indicators</div>
      <div id="customIndicators">Loading...</div>
    </div>

    <!-- Export Reports -->
    <div class="card">
      <div class="card-title">Export Reports</div>
      <div id="exportReports">Loading...</div>
    </div>
  `;

  renderOrderSimulator();
  renderQuickTrade();
  renderAdvancedAlerts();
  renderCustomIndicators();
  renderExportReports();
}


async function _calcPositionSize() {
  const account   = parseFloat(document.getElementById('psAccount')?.value) || 1000;
  const risk_pct  = parseFloat(document.getElementById('psRisk')?.value)    || 1;
  const entry     = parseFloat(document.getElementById('psEntry')?.value)    || 0;
  const stop_loss = parseFloat(document.getElementById('psSL')?.value)       || 0;

  const resultEl = document.getElementById('psResult');
  if (!resultEl) return;

  resultEl.style.display = 'block';
  resultEl.innerHTML = '<div style="color:var(--text-muted);font-size:12px">Calculating...</div>';

  try {
    const result = await apiService.calcPositionSize({
      account_size: account,
      risk_pct,
      entry,
      stop_loss,
    });
    resultEl.innerHTML = `
      <div class="order-preview-row">
        <span>Risk Amount</span>
        <span class="font-mono" style="color:var(--danger)">$${result.risk_usd}</span>
      </div>
      <div class="order-preview-row">
        <span>Position Size</span>
        <span class="font-mono">$${result.position_usd}</span>
      </div>
      <div class="order-preview-row">
        <span>Quantity</span>
        <span class="font-mono">${result.qty}</span>
      </div>
      <div class="order-preview-row">
        <span>SL Distance</span>
        <span class="font-mono">${result.sl_pct?.toFixed(2)}%</span>
      </div>`;
  } catch {
    resultEl.innerHTML = '<div style="color:var(--danger);font-size:12px">Calculation failed.</div>';
  }
}


async function _loadRiskMetrics() {
  const input  = document.getElementById('riskSymbolInput');
  const symbol = input?.value?.trim()?.toUpperCase() || 'BTCUSDT';
  const result = document.getElementById('riskMetricsResult');
  if (!result) return;

  result.innerHTML = '<div style="color:var(--text-muted);font-size:12px">Loading...</div>';

  try {
    const m = await apiService.getRiskMetrics(symbol);
    const volColor = m.volatility_label === 'high'   ? 'var(--danger)'
                   : m.volatility_label === 'medium' ? 'var(--accent)'
                   : 'var(--success)';
    result.innerHTML = `
      <div class="risk-calc-row">
        <span>Price</span>
        <span class="font-mono">${formatters.price(m.price)}</span>
      </div>
      <div class="risk-calc-row">
        <span>ATR (14)</span>
        <span class="font-mono">${formatters.price(m.atr)}</span>
      </div>
      <div class="risk-calc-row">
        <span>ATR %</span>
        <span class="font-mono">${m.atr_pct?.toFixed(4)}%</span>
      </div>
      <div class="risk-calc-row">
        <span>Volatility</span>
        <span style="color:${volColor};font-weight:700">${m.volatility_label?.toUpperCase()}</span>
      </div>
      <div class="risk-calc-row">
        <span>Suggested SL</span>
        <span class="font-mono" style="color:var(--danger)">${formatters.price(m.suggested_sl)}</span>
      </div>
      <div class="risk-calc-row">
        <span>Suggested TP</span>
        <span class="font-mono" style="color:var(--success)">${formatters.price(m.suggested_tp)}</span>
      </div>
      <div class="risk-calc-row">
        <span>BB Squeeze</span>
        <span style="color:${m.bb_squeeze ? 'var(--accent)' : 'var(--text-muted)'}">
          ${m.bb_squeeze ? '⚡ Active' : 'No'}
        </span>
      </div>`;
  } catch {
    result.innerHTML = '<div style="color:var(--danger);font-size:12px">Risk data unavailable.</div>';
  }
}
