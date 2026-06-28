/**
 * Signal Renderers — real signal feed from /signals/scan
 */

async function renderRecentSignals() {
  const container = document.getElementById('recentSignals');
  if (!container) return;

  container.innerHTML = `<div class="card-title">Active Quant Terminal Directives</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Scanning signals...</div>`;

  try {
    let signals = globalStore.getState('signalCache');
    if (!signals || signals.length === 0) {
      const data = await apiService.scanSignals(68);
      signals    = data.signals || [];
      globalStore.setState('signalCache', signals);
    }

    if (signals.length === 0) {
      container.innerHTML = `<div class="card-title">Active Quant Terminal Directives</div>
        <div style="color:var(--text-muted);font-size:12px;padding:12px">
          No signals fired above 68% confidence right now.
        </div>`;
      return;
    }

    let html = `<div class="card-title">Active Quant Terminal Directives</div>
      <div style="display:flex;flex-direction:column;gap:8px">`;

    signals.slice(0, 5).forEach(s => {
      const isBuy   = s.direction === 'buy';
      const badgeCls = isBuy ? 'badge-success' : 'badge-danger';
      const label   = isBuy ? 'Buy Directive' : 'Sell Directive';
      const entryFmt = s.entry ? `@ ${formatters.price(s.entry)}` : '';
      const tpFmt    = s.take_profit ? `Target: ${formatters.price(s.take_profit)}` : '';

      html += `
        <div class="signal-item">
          <span>
            <strong>${s.symbol.replace('USDT','')}/USDT</strong>
            <span class="badge ${badgeCls}" style="margin-left:6px">${label}</span>
            <span class="font-mono" style="font-size:11px;color:var(--text-muted);margin-left:6px">${entryFmt}</span>
          </span>
          <span class="font-mono" style="font-size:12px">${tpFmt}</span>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">Active Quant Terminal Directives</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">Signal data unavailable.</div>`;
  }
}

async function renderSignalFeed() {
  const container = document.getElementById('signalFeed');
  if (!container) return;

  container.innerHTML = `<div class="card-title">Live Algorithmic Signal Stream</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Loading signals...</div>`;

  try {
    const minConf = globalStore.getState('settings').min_signal_confidence || 68;
    const data    = await apiService.scanSignals(minConf);
    const signals = data.signals || [];
    globalStore.setState('signalCache', signals);

    if (signals.length === 0) {
      container.innerHTML = `<div class="card-title">Live Algorithmic Signal Stream</div>
        <div style="padding:20px;text-align:center;color:var(--text-muted)">
          No active signals right now. Market is consolidating.
        </div>`;
      return;
    }

    let html = `<div class="card-title">Live Algorithmic Signal Stream
      <span class="badge badge-info">${signals.length} active</span>
    </div><div class="grid-1">`;

    signals.forEach(s => {
      const isBuy    = s.direction === 'buy';
      const confBar  = Math.round(s.confidence);
      const confColor = confBar >= 80 ? 'var(--success)' : confBar >= 68 ? 'var(--accent)' : 'var(--danger)';

      html += `
        <div class="signal-item">
          <div style="flex:1">
            <strong>${s.symbol.replace('USDT','')}/USDT</strong>
            <span style="font-size:11px;color:var(--text-muted);margin-left:6px">${s.trend || ''}</span>
            <br>
            <small style="color:var(--text-muted)">
              Indicators agreed: ${s.agreements} | Score: ${s.market_score || '—'}
            </small>
            ${s.entry ? `<br><small class="font-mono" style="color:var(--text-muted)">
              Entry: ${formatters.price(s.entry)} |
              SL: ${formatters.price(s.stop_loss)} |
              TP: ${formatters.price(s.take_profit)}
            </small>` : ''}
          </div>
          <div style="text-align:right">
            <span class="badge ${isBuy ? 'badge-success' : 'badge-danger'}">
              ${isBuy ? 'Execute Long' : 'Execute Short'}
            </span>
            <div style="font-size:11px;font-family:var(--font-mono);margin-top:4px;color:${confColor}">
              ${confBar}% conf
            </div>
          </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">Live Algorithmic Signal Stream</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">Signal feed unavailable.</div>`;
  }
}

async function renderBacktestResults() {
  const container = document.getElementById('backtestResults');
  if (!container) return;

  container.innerHTML = `<div class="card-title">Rigorous Engine Backtest Verification Metrics</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Running backtests...</div>`;

  try {
    const strategies = [
      { symbol: 'BTCUSDT', strategy: 'mean_reversion', timeframe: '1h', label: 'Alpha Mean Reversion v4' },
      { symbol: 'ETHUSDT', strategy: 'breakout',       timeframe: '1h', label: 'High-Frequency Breakout Radar' },
      { symbol: 'SOLUSDT', strategy: 'momentum',       timeframe: '1h', label: 'SOL Momentum Burst' },
    ];

    const results = await Promise.all(
      strategies.map(s => apiService.runBacktest(s.symbol, s.strategy, s.timeframe).catch(() => null))
    );

    let html = `<div class="card-title">Rigorous Engine Backtest Verification Metrics</div>
      <table class="data-table">
        <thead><tr>
          <th>Strategy</th><th>Symbol</th><th>Win Rate</th>
          <th>Net Return</th><th>Profit Factor</th><th>Trades</th>
        </tr></thead><tbody>`;

    results.forEach((r, i) => {
      if (!r) return;
      const retColor = r.net_return_pct >= 0 ? 'var(--success)' : 'var(--danger)';
      html += `
        <tr>
          <td>${strategies[i].label}</td>
          <td class="font-mono">${r.symbol}</td>
          <td class="font-mono">${r.win_rate}%</td>
          <td class="font-mono" style="color:${retColor}">${r.net_return_pct >= 0 ? '+' : ''}${r.net_return_pct}%</td>
          <td class="font-mono">${r.profit_factor}x</td>
          <td class="font-mono">${r.total_trades}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">Backtest Metrics</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">Backtest engine unavailable.</div>`;
  }
}
