/**
 * Signals Page — trade recommendations and automated alert monitors
 */

async function renderSignals() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Signal Intelligence</h1>
      <p class="page-subtitle">Algorithmic trade signals — 3+ indicator confluence required</p>
    </div>

    <!-- Signal Stats -->
    <div class="grid-4" style="margin-bottom:16px">
      <div class="card">
        <div class="card-label">Min Confidence</div>
        <div class="card-value" style="color:var(--accent)">68%</div>
      </div>
      <div class="card">
        <div class="card-label">Min Agreements</div>
        <div class="card-value">3 indicators</div>
      </div>
      <div class="card">
        <div class="card-label">Active Signals</div>
        <div class="card-value" id="activeSignalCount">—</div>
      </div>
      <div class="card">
        <div class="card-label">Last Scan</div>
        <div class="card-value" id="lastScanTime" style="font-size:14px">—</div>
      </div>
    </div>

    <!-- Confidence Filter -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--text-muted)">Min Confidence:</span>
        <button class="btn btn-sm" onclick="loadSignals(60)">60%</button>
        <button class="btn btn-primary btn-sm" onclick="loadSignals(68)">68%</button>
        <button class="btn btn-sm" onclick="loadSignals(75)">75%</button>
        <button class="btn btn-sm" onclick="loadSignals(80)">80%+</button>
        <button class="btn btn-sm" style="margin-left:auto" onclick="loadSignals(68)">
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Signal Feed -->
    <div class="card" style="margin-bottom:16px" id="signalFeed">
      <div class="card-title">Live Algorithmic Signal Stream</div>
      <div style="color:var(--text-muted);font-size:12px;padding:8px">Loading signals...</div>
    </div>

    <!-- Backtest Results -->
    <div class="card" id="backtestResults">
      <div class="card-title">Rigorous Engine Backtest Verification Metrics</div>
      <div style="color:var(--text-muted);font-size:12px;padding:8px">Loading backtests...</div>
    </div>
  `;

  await loadSignals(68);
  renderBacktestResults();
}


async function loadSignals(minConfidence = 68) {
  const countEl = document.getElementById('activeSignalCount');
  const timeEl  = document.getElementById('lastScanTime');

  try {
    const data    = await apiService.scanSignals(minConfidence);
    const signals = data.signals || [];

    globalStore.setState('signalCache', signals);

    if (countEl) {
      countEl.textContent = signals.length;
      countEl.style.color = signals.length > 0 ? 'var(--success)' : 'var(--text-muted)';
    }
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();

    renderSignalFeed();

  } catch {
    if (countEl) countEl.textContent = '—';
  }
}
