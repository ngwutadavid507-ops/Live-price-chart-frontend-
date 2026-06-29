/**
 * Analysis Page — chart controls and deep market research
 */

let _analysisSymbol   = 'BTCUSDT';
let _analysisInterval = '1h';

async function renderAnalysis() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Market Analysis</h1>
      <p class="page-subtitle">Technical indicators and market intelligence</p>
    </div>

    <!-- Symbol + Interval selector -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input type="text" id="analysisSymbolInput"
          value="${_analysisSymbol}"
          placeholder="e.g. BTCUSDT"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);
                 color:#fff;width:130px;font-size:12px;font-family:var(--font-mono)">
        <button class="btn btn-sm" onclick="_setAnalysisInterval('1h')">1H</button>
        <button class="btn btn-sm" onclick="_setAnalysisInterval('4h')">4H</button>
        <button class="btn btn-sm" onclick="_setAnalysisInterval('1d')">1D</button>
        <button class="btn btn-primary btn-sm" onclick="_loadAnalysis()">Analyse</button>
      </div>
    </div>

    <!-- Price Summary -->
    <div class="grid-4" style="margin-bottom:16px" id="analysisPriceCards">
      <div class="card">
        <div class="card-label">Current Price</div>
        <div class="card-value" id="analysisPrice">—</div>
      </div>
      <div class="card">
        <div class="card-label">24h Change</div>
        <div class="card-value" id="analysisChange">—</div>
      </div>
      <div class="card">
        <div class="card-label">Market Score</div>
        <div class="card-value" id="analysisScore">—</div>
      </div>
      <div class="card">
        <div class="card-label">Signal</div>
        <div class="card-value" id="analysisSignal">—</div>
      </div>
    </div>

    <!-- Candle Chart -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title" id="chartTitle">Candlestick Chart — ${_analysisSymbol}</div>
      <canvas id="candleChart" height="300"
        style="width:100%;max-height:300px"></canvas>
    </div>

    <!-- Indicators Grid -->
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card" id="trendPanel">
        <div class="card-title">Trend Analysis</div>
        <div style="color:var(--text-muted);font-size:12px">Loading...</div>
      </div>
      <div class="card" id="momentumPanel">
        <div class="card-title">Momentum</div>
        <div style="color:var(--text-muted);font-size:12px">Loading...</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card" id="volatilityPanel">
        <div class="card-title">Volatility</div>
        <div style="color:var(--text-muted);font-size:12px">Loading...</div>
      </div>
      <div class="card" id="volumePanel">
        <div class="card-title">Volume</div>
        <div style="color:var(--text-muted);font-size:12px">Loading...</div>
      </div>
    </div>

    <!-- AI Narrative -->
    <div class="card" id="aiNarrativePanel">
      <div class="card-title">AI Market Narrative</div>
      <div style="color:var(--text-muted);font-size:12px">Loading AI analysis...</div>
    </div>
  `;

  await _loadAnalysis();
}


function _setAnalysisInterval(interval) {
  _analysisInterval = interval;
  _loadAnalysis();
}


async function _loadAnalysis() {
  const inputEl = document.getElementById('analysisSymbolInput');
  if (inputEl) _analysisSymbol = inputEl.value.trim().toUpperCase() || 'BTCUSDT';

  const titleEl = document.getElementById('chartTitle');
  if (titleEl) titleEl.textContent = `Candlestick Chart — ${_analysisSymbol} (${_analysisInterval})`;

  // Load candles and analysis concurrently
  try {
    const [candleData, analysis] = await Promise.all([
      apiService.getCandles(_analysisSymbol, _analysisInterval, 100),
      apiService.getAnalysis(_analysisSymbol),
    ]);

    // Update price cards
    const assets  = globalStore.getState('assets');
    const asset   = assets.find(a => a.symbol === _analysisSymbol);
    const priceEl = document.getElementById('analysisPrice');
    const chgEl   = document.getElementById('analysisChange');
    const scoreEl = document.getElementById('analysisScore');
    const sigEl   = document.getElementById('analysisSignal');

    if (asset && priceEl) {
      priceEl.textContent = formatters.price(asset.price);
      if (chgEl) {
        chgEl.textContent  = formatters.pct(asset.change24h);
        chgEl.style.color  = asset.change24h >= 0 ? 'var(--success)' : 'var(--danger)';
      }
    }

    if (analysis) {
      if (scoreEl) {
        scoreEl.textContent = `${analysis.market_score}/100`;
        scoreEl.style.color = analysis.market_score >= 60 ? 'var(--success)'
                            : analysis.market_score >= 40 ? 'var(--accent)'
                            : 'var(--danger)';
      }
      if (sigEl) {
        const dir = analysis.signal?.direction || 'neutral';
        sigEl.textContent = dir.toUpperCase();
        sigEl.style.color = dir === 'buy' ? 'var(--success)'
                          : dir === 'sell' ? 'var(--danger)'
                          : 'var(--text-muted)';
      }

      // Render indicator panels
      _renderTrendPanel(analysis.trend);
      _renderMomentumPanel(analysis.momentum);
      _renderVolatilityPanel(analysis.volatility);
      _renderVolumePanel(analysis.volume);
    }

    // Draw candle chart
    if (candleData && candleData.candles && candleData.candles.length > 0) {
      _drawCandleChart(candleData.candles);
    }

    // Load AI narrative
    _loadAINarrative();

  } catch (e) {
    console.error('Analysis load error:', e);
  }
}


function _renderTrendPanel(trend) {
  const panel = document.getElementById('trendPanel');
  if (!panel || !trend) return;
  const dirColor = trend.direction === 'bullish' ? 'var(--success)'
                 : trend.direction === 'bearish' ? 'var(--danger)'
                 : 'var(--text-muted)';
  panel.innerHTML = `
    <div class="card-title">Trend Analysis</div>
    <div class="risk-calc-row">
      <span>Direction</span>
      <span style="color:${dirColor};font-weight:700">${trend.direction?.toUpperCase()}</span>
    </div>
    <div class="risk-calc-row">
      <span>Strength</span>
      <span class="font-mono" style="font-size:11px">${trend.strength}</span>
    </div>
    <div class="risk-calc-row">
      <span>EMA9</span>
      <span class="font-mono">${formatters.price(trend.ema9)}</span>
    </div>
    <div class="risk-calc-row">
      <span>EMA21</span>
      <span class="font-mono">${formatters.price(trend.ema21)}</span>
    </div>
    <div class="risk-calc-row">
      <span>EMA50</span>
      <span class="font-mono">${formatters.price(trend.ema50)}</span>
    </div>
    <div class="risk-calc-row">
      <span>EMA Aligned</span>
      <span style="color:${trend.ema_aligned ? 'var(--success)' : 'var(--danger)'}">
        ${trend.ema_aligned ? 'Yes ✓' : 'No ✗'}
      </span>
    </div>`;
}


function _renderMomentumPanel(momentum) {
  const panel = document.getElementById('momentumPanel');
  if (!panel || !momentum) return;
  const rsi      = momentum.rsi || 50;
  const zone     = momentum.rsi_zone || 'neutral';
  const zoneColor = zone === 'overbought' ? 'var(--danger)'
                  : zone === 'oversold'   ? 'var(--success)'
                  : 'var(--accent)';
  const rsiWidth = Math.round(rsi);
  panel.innerHTML = `
    <div class="card-title">Momentum</div>
    <div class="risk-calc-row">
      <span>RSI (14)</span>
      <span class="font-mono" style="color:${zoneColor}">${rsi.toFixed(2)}</span>
    </div>
    <div style="margin:8px 0">
      <div style="height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden">
        <div style="width:${rsiWidth}%;height:100%;
          background:${rsi > 70 ? 'var(--danger)' : rsi < 30 ? 'var(--success)' : 'var(--accent)'};
          border-radius:3px;transition:width 0.3s"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-top:2px">
        <span>Oversold 30</span><span>Neutral 50</span><span>Overbought 70</span>
      </div>
    </div>
    <div class="risk-calc-row">
      <span>Zone</span>
      <span style="color:${zoneColor}">${zone.toUpperCase()}</span>
    </div>
    <div class="risk-calc-row">
      <span>Direction</span>
      <span>${momentum.direction?.toUpperCase()}</span>
    </div>`;
}


function _renderVolatilityPanel(volatility) {
  const panel = document.getElementById('volatilityPanel');
  if (!panel || !volatility) return;
  panel.innerHTML = `
    <div class="card-title">Volatility</div>
    <div class="risk-calc-row">
      <span>ATR (14)</span>
      <span class="font-mono">${formatters.price(volatility.atr)}</span>
    </div>
    <div class="risk-calc-row">
      <span>ATR %</span>
      <span class="font-mono">${volatility.atr_pct?.toFixed(4)}%</span>
    </div>
    <div class="risk-calc-row">
      <span>BB Upper</span>
      <span class="font-mono">${formatters.price(volatility.bb_upper)}</span>
    </div>
    <div class="risk-calc-row">
      <span>BB Middle</span>
      <span class="font-mono">${formatters.price(volatility.bb_middle)}</span>
    </div>
    <div class="risk-calc-row">
      <span>BB Lower</span>
      <span class="font-mono">${formatters.price(volatility.bb_lower)}</span>
    </div>
    <div class="risk-calc-row">
      <span>BB Squeeze</span>
      <span style="color:${volatility.bb_squeeze ? 'var(--accent)' : 'var(--text-muted)'}">
        ${volatility.bb_squeeze ? '⚡ Active' : 'No'}
      </span>
    </div>`;
}


function _renderVolumePanel(volume) {
  const panel = document.getElementById('volumePanel');
  if (!panel || !volume) return;
  const trendColor = volume.volume_trend === 'rising'  ? 'var(--success)'
                   : volume.volume_trend === 'falling' ? 'var(--danger)'
                   : 'var(--text-muted)';
  panel.innerHTML = `
    <div class="card-title">Volume</div>
    <div class="risk-calc-row">
      <span>Trend</span>
      <span style="color:${trendColor}">${volume.volume_trend?.toUpperCase()}</span>
    </div>
    <div class="risk-calc-row">
      <span>Spike Detected</span>
      <span style="color:${volume.spike ? 'var(--accent)' : 'var(--text-muted)'}">
        ${volume.spike ? '⚡ Yes' : 'No'}
      </span>
    </div>
    <div class="risk-calc-row">
      <span>Spike Ratio</span>
      <span class="font-mono">${volume.spike_ratio?.toFixed(2)}x</span>
    </div>
    <div class="risk-calc-row">
      <span>Direction</span>
      <span>${volume.direction?.toUpperCase()}</span>
    </div>`;
}


function _drawCandleChart(candles) {
  const canvas = document.getElementById('candleChart');
  if (!canvas) return;

  // Simple line chart from close prices using Chart.js
  const ctx    = canvas.getContext('2d');
  const labels = candles.map(c => new Date(c.time).toLocaleTimeString());
  const closes = candles.map(c => c.close);

  if (window._candleChartInstance) {
    window._candleChartInstance.destroy();
  }

  window._candleChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label:           _analysisSymbol,
        data:            closes,
        borderColor:     '#00d4aa',
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
        x: {
          display: false,
          grid:    { color: 'rgba(255,255,255,0.05)' },
        },
        y: {
          grid:  { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#888', font: { size: 10 } },
        },
      },
    },
  });
}


async function _loadAINarrative() {
  const panel = document.getElementById('aiNarrativePanel');
  if (!panel) return;

  try {
    const data = await apiService.aiAnalyse(_analysisSymbol);
    panel.innerHTML = `
      <div class="card-title">AI Market Narrative — ${_analysisSymbol}</div>
      <div style="font-size:13px;line-height:1.6;color:var(--text-secondary);margin-bottom:12px">
        ${data.narrative || 'No narrative available.'}
      </div>
      <div style="display:flex;gap:8px">
        <span class="badge ${data.signal === 'buy' ? 'badge-success' : data.signal === 'sell' ? 'badge-danger' : 'badge-warning'}">
          ${data.signal?.toUpperCase() || 'NEUTRAL'}
        </span>
        <span class="font-mono" style="font-size:11px;color:var(--text-muted)">
          Confidence: ${data.confidence?.toFixed(1)}%
        </span>
      </div>`;
  } catch {
    panel.innerHTML = `
      <div class="card-title">AI Market Narrative</div>
      <div style="color:var(--text-muted);font-size:12px">
        AI narrative unavailable. Add GROQ_API_KEY to Render environment.
      </div>`;
  }
    }
