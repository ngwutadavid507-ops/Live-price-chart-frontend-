/**
 * Backtest Page — strategy builder, equity curve, trade logs
 */

async function renderBacktest() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Backtest Lab</h1>
      <p class="page-subtitle">Strategy validation against historical data</p>
    </div>

    <!-- Strategy Builder -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">Run Backtest</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;color:var(--text-muted)">Symbol</label>
          <input type="text" id="btSymbol" value="BTCUSDT"
            style="width:100%;background:var(--bg-primary);border:1px solid var(--border);
                   padding:6px 10px;border-radius:var(--radius-sm);
                   color:#fff;font-size:12px;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted)">Strategy</label>
          <select id="btStrategy"
            style="width:100%;background:var(--bg-primary);border:1px solid var(--border);
                   padding:6px 10px;border-radius:var(--radius-sm);
                   color:#fff;font-size:12px;box-sizing:border-box">
            <option value="momentum">Momentum (RSI)</option>
            <option value="mean_reversion">Mean Reversion (EMA)</option>
            <option value="breakout">Breakout (20-period high)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;color:var(--text-muted)">Timeframe</label>
          <select id="btTimeframe"
            style="width:100%;background:var(--bg-primary);border:1px solid var(--border);
                   padding:6px 10px;border-radius:var(--radius-sm);
                   color:#fff;font-size:12px;box-sizing:border-box">
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hour</option>
            <option value="1d">1 Day</option>
          </select>
        </div>
        <div style="display:flex;align-items:flex-end">
          <button class="btn btn-primary w-full" onclick="_runSingleBacktest()">
            Run Backtest
          </button>
        </div>
      </div>
      <div id="singleBacktestResult"></div>
    </div>

    <!-- Equity Curve -->
    <div class="card" style="margin-bottom:16px" id="equityCurveCard" style="display:none">
      <div class="card-title">Equity Curve</div>
      <canvas id="equityChart" height="200" style="width:100%;max-height:200px"></canvas>
    </div>

    <!-- Strategy Comparison -->
    <div class="card" id="backtestResults">
      <div class="card-title">Rigorous Engine Backtest Verification Metrics</div>
      <div style="color:var(--text-muted);font-size:12px">Loading...</div>
    </div>
  `;

  renderBacktestResults();
}


async function _runSingleBacktest() {
  const symbol    = document.getElementById('btSymbol')?.value?.trim()?.toUpperCase() || 'BTCUSDT';
  const strategy  = document.getElementById('btStrategy')?.value || 'momentum';
  const timeframe = document.getElementById('btTimeframe')?.value || '1h';
  const resultEl  = document.getElementById('singleBacktestResult');

  if (!resultEl) return;
  resultEl.innerHTML = `<div style="color:var(--text-muted);font-size:12px;padding:8px">
    Running backtest...
  </div>`;

  try {
    const r = await apiService.runBacktest(symbol, strategy, timeframe);
    const retColor = r.net_return_pct >= 0 ? 'var(--success)' : 'var(--danger)';

    resultEl.innerHTML = `
      <div class="grid-4" style="margin-top:12px">
        <div class="risk-metric-card">
          <div class="risk-metric-label">Win Rate</div>
          <div class="risk-metric-value">${r.win_rate}%</div>
        </div>
        <div class="risk-metric-card">
          <div class="risk-metric-label">Net Return</div>
          <div class="risk-metric-value" style="color:${retColor}">
            ${r.net_return_pct >= 0 ? '+' : ''}${r.net_return_pct}%
          </div>
        </div>
        <div class="risk-metric-card">
          <div class="risk-metric-label">Profit Factor</div>
          <div class="risk-metric-value">${r.profit_factor}x</div>
        </div>
        <div class="risk-metric-card">
          <div class="risk-metric-label">Total Trades</div>
          <div class="risk-metric-value">${r.total_trades}</div>
        </div>
      </div>`;

    if (r.equity_curve && r.equity_curve.length > 1) {
      _drawEquityChart(r.equity_curve);
    }

  } catch {
    resultEl.innerHTML = `<div style="color:var(--danger);font-size:12px;padding:8px">
      Backtest failed. Check symbol format.
    </div>`;
  }
}


function _drawEquityChart(equity) {
  const canvas = document.getElementById('equityChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (window._equityChartInstance) {
    window._equityChartInstance.destroy();
  }

  window._equityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: equity.map((_, i) => i),
      datasets: [{
        label:           'Equity',
        data:            equity,
        borderColor:     equity[equity.length-1] >= equity[0] ? '#00d4aa' : '#ff4d4d',
        backgroundColor: 'rgba(0,212,170,0.05)',
        borderWidth:     1.5,
        pointRadius:     0,
        fill:            true,
        tension:         0.1,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { ticks: { color: '#888', font: { size: 10 } } },
      },
    },
  });
}
