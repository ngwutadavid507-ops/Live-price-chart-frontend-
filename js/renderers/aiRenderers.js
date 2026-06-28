/**
 * AI Renderers — real AI predictions from backend
 */

async function renderAIPredictions() {
  const container = document.getElementById('aiPredictions');
  if (!container) return;

  container.innerHTML = `<div class="card-title">AI Predictive Directional Engines</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Running AI analysis...</div>`;

  try {
    const symbols  = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    const analyses = await Promise.all(
      symbols.map(sym => apiService.aiAnalyse(sym).catch(() => null))
    );

    let html = `<div class="card-title">AI Predictive Directional Engines</div>
      <table class="data-table">
        <thead><tr>
          <th>Pair</th><th>Narrative</th><th>Signal</th><th>Confidence</th>
        </tr></thead><tbody>`;

    analyses.forEach((a, i) => {
      if (!a) return;
      const sym   = symbols[i].replace('USDT', '');
      const isBuy = a.signal === 'buy';
      const color = isBuy ? 'var(--success)' : a.signal === 'sell' ? 'var(--danger)' : 'var(--text-muted)';
      const label = isBuy ? 'Buy Directive' : a.signal === 'sell' ? 'Bearish Pivot' : 'Neutral';
      const brief = a.narrative?.length > 70
        ? a.narrative.substring(0, 70) + '…'
        : (a.narrative || '—');

      html += `
        <tr>
          <td><strong>${sym}/USDT</strong></td>
          <td style="font-size:11px;color:var(--text-secondary);max-width:200px">${brief}</td>
          <td style="color:${color}">${label}</td>
          <td class="font-mono">${a.confidence?.toFixed(1)}%</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">AI Predictive Directional Engines</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">AI engine unavailable.</div>`;
  }
}

async function renderModelPerformance() {
  const container = document.getElementById('modelPerformance');
  if (!container) return;

  container.innerHTML = `<div class="card-title">Neural Model Training Validation Weights</div>
    <div style="color:var(--text-muted);font-size:12px;padding:8px">Loading model metrics...</div>`;

  try {
    const [analysis, signals] = await Promise.all([
      apiService.getAnalysis('BTCUSDT').catch(() => null),
      apiService.scanSignals(60).catch(() => ({ signals: [] })),
    ]);

    const totalSignals = signals.signals?.length || 0;
    const highConf     = signals.signals?.filter(s => s.confidence >= 80).length || 0;
    const accuracy     = totalSignals > 0
      ? ((highConf / totalSignals) * 100).toFixed(1) : '—';
    const score = analysis?.market_score ?? 50;
    const rsi   = analysis?.momentum?.rsi ?? '—';
    const trend = analysis?.trend?.strength ?? '—';

    container.innerHTML = `
      <div class="card-title">Neural Model Training Validation Weights</div>
      <div class="risk-calc-row">
        <span>BTC Market Quality Score</span>
        <span class="font-mono" style="color:var(--accent)">${score}/100</span>
      </div>
      <div class="risk-calc-row">
        <span>BTC RSI</span>
        <span class="font-mono">${typeof rsi === 'number' ? rsi.toFixed(1) : rsi}</span>
      </div>
      <div class="risk-calc-row">
        <span>BTC Trend</span>
        <span class="font-mono" style="font-size:11px">${trend}</span>
      </div>
      <div class="risk-calc-row">
        <span>Active Signals Scanned</span>
        <span class="font-mono">${totalSignals}</span>
      </div>
      <div class="risk-calc-row">
        <span>High Confidence (>80%)</span>
        <span class="font-mono" style="color:var(--success)">${highConf}</span>
      </div>
      <div class="risk-calc-row">
        <span>Signal Precision Rate</span>
        <span class="font-mono">${accuracy}%</span>
      </div>`;

  } catch {
    container.innerHTML = `<div class="card-title">Neural Model Training Validation Weights</div>
      <div style="color:var(--text-muted);font-size:12px;padding:12px">Model metrics unavailable.</div>`;
  }
            }
