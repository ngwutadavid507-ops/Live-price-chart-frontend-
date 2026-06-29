/**
 * Portfolio Page — asset distributions, history, metrics
 */

async function renderPortfolio() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Portfolio</h1>
      <p class="page-subtitle">Paper trading positions and performance tracking</p>
    </div>

    <!-- Portfolio Summary -->
    <div class="grid-4" style="margin-bottom:16px">
      <div class="card">
        <div class="card-label">Balance</div>
        <div class="card-value" id="portBalance">—</div>
      </div>
      <div class="card">
        <div class="card-label">Total Value</div>
        <div class="card-value" id="portTotal">—</div>
      </div>
      <div class="card">
        <div class="card-label">Open Positions</div>
        <div class="card-value" id="portPositions">—</div>
      </div>
      <div class="card">
        <div class="card-label">Total PnL</div>
        <div class="card-value" id="portPnl">—</div>
      </div>
    </div>

    <!-- Open Positions -->
    <div class="card" style="margin-bottom:16px" id="openPositions">
      <div class="card-title">Loading positions...</div>
    </div>

    <!-- Watchlist -->
    <div class="card" style="margin-bottom:16px" id="watchlist">
      <div class="card-title">Loading watchlist...</div>
    </div>

    <!-- Risk Dashboard -->
    <div class="card" id="riskDashboard">
      <div class="card-title">Loading risk metrics...</div>
    </div>

    <!-- Add Position Form -->
    <div class="card" style="margin-top:16px">
      <div class="card-title">Add Paper Position</div>
      <div style="display:flex;flex-direction:column;gap:8px;max-width:300px">
        <input type="text" id="newPosSym" placeholder="Symbol e.g. BTC"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
        <input type="number" id="newPosAmt" placeholder="Amount e.g. 0.1"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
        <input type="number" id="newPosEntry" placeholder="Entry price"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="_addPortPosition('long')">Add Long</button>
          <button class="btn btn-danger btn-sm"  onclick="_addPortPosition('short')">Add Short</button>
        </div>
      </div>
    </div>
  `;

  await _loadPortfolio();
}


async function _loadPortfolio() {
  try {
    const portfolio = await apiService.getPortfolio();
    globalStore.setState('paperPortfolio', portfolio);

    const balEl  = document.getElementById('portBalance');
    const totEl  = document.getElementById('portTotal');
    const posEl  = document.getElementById('portPositions');
    const pnlEl  = document.getElementById('portPnl');

    if (balEl) balEl.textContent = formatters.price(portfolio.balance || 0);
    if (totEl) totEl.textContent = formatters.price(portfolio.total_value || 0);
    if (posEl) posEl.textContent = (portfolio.positions || []).length;

    const totalPnl = (portfolio.positions || [])
      .reduce((acc, p) => acc + (p.pnl || 0), 0);
    if (pnlEl) {
      pnlEl.textContent = `${totalPnl >= 0 ? '+' : ''}${formatters.price(totalPnl)}`;
      pnlEl.style.color = totalPnl >= 0 ? 'var(--success)' : 'var(--danger)';
    }
  } catch { }

  renderOpenPositions();
  renderWatchlist();
  renderRiskDashboard();
}


async function _addPortPosition(side) {
  const sym   = document.getElementById('newPosSym')?.value?.trim()?.toUpperCase();
  const amt   = parseFloat(document.getElementById('newPosAmt')?.value);
  const entry = parseFloat(document.getElementById('newPosEntry')?.value);

  if (!sym || !amt || !entry) {
    showToast('Portfolio', 'Please fill in all fields.', 'danger');
    return;
  }

  try {
    await apiService.addPosition({
      symbol:        sym,
      amount:        amt,
      entry_price:   entry,
      current_price: entry,
      pnl:           0,
      pnl_pct:       0,
      side,
    });
    showToast('Portfolio', `${side.toUpperCase()} position added for ${sym}.`, 'success');
    await _loadPortfolio();
  } catch {
    showToast('Portfolio', 'Failed to add position.', 'danger');
  }
}
