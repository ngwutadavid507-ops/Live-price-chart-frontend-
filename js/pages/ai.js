/**
 * AI Analytics Page — predictions, model performance, market intelligence
 */

async function renderAI() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">AI Intelligence</h1>
      <p class="page-subtitle">Phoenix AI — powered by Groq llama-3.3-70b-versatile</p>
    </div>

    <!-- Market Narrative -->
    <div class="card" style="margin-bottom:16px" id="marketNarrativeCard">
      <div class="card-title">Live Market Narrative</div>
      <div style="color:var(--text-muted);font-size:12px">Generating narrative...</div>
    </div>

    <!-- AI Predictions -->
    <div class="card" style="margin-bottom:16px" id="aiPredictions">
      <div class="card-title">AI Predictive Directional Engines</div>
      <div style="color:var(--text-muted);font-size:12px">Running analysis...</div>
    </div>

    <!-- Model Performance -->
    <div class="card" style="margin-bottom:16px" id="modelPerformance">
      <div class="card-title">Neural Model Training Validation Weights</div>
      <div style="color:var(--text-muted);font-size:12px">Loading metrics...</div>
    </div>

    <!-- Custom Analysis -->
    <div class="card">
      <div class="card-title">Custom Symbol Analysis</div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <input type="text" id="aiSymbolInput"
          placeholder="e.g. BTCUSDT"
          value="BTCUSDT"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);
                 color:#fff;width:130px;font-size:12px">
        <button class="btn btn-primary btn-sm" onclick="_runCustomAIAnalysis()">
          Analyse
        </button>
      </div>
      <div id="customAIResult" style="color:var(--text-muted);font-size:12px">
        Enter a symbol and click Analyse.
      </div>
    </div>
  `;

  _loadMarketNarrative();
  renderAIPredictions();
  renderModelPerformance();
}


async function _loadMarketNarrative() {
  const card = document.getElementById('marketNarrativeCard');
  if (!card) return;

  try {
    const data = await apiService.getMarketNarrative();
    card.innerHTML = `
      <div class="card-title">Live Market Narrative</div>
      <div style="font-size:13px;line-height:1.7;color:var(--text-secondary)">
        ${data.narrative || 'No narrative available.'}
      </div>`;
  } catch {
    card.innerHTML = `
      <div class="card-title">Live Market Narrative</div>
      <div style="color:var(--text-muted);font-size:12px">
        AI narrative unavailable. Ensure GROQ_API_KEY is set in Render environment.
      </div>`;
  }
}


async function _runCustomAIAnalysis() {
  const input   = document.getElementById('aiSymbolInput');
  const result  = document.getElementById('customAIResult');
  const symbol  = input?.value?.trim()?.toUpperCase() || 'BTCUSDT';
  if (!result) return;

  result.innerHTML = `<div style="color:var(--text-muted);font-size:12px">
    Analysing ${symbol}...
  </div>`;

  try {
    const data = await apiService.aiAnalyse(symbol);
    const signalColor = data.signal === 'buy'  ? 'var(--success)'
                      : data.signal === 'sell' ? 'var(--danger)'
                      : 'var(--text-muted)';
    result.innerHTML = `
      <div style="font-size:13px;line-height:1.7;color:var(--text-secondary);margin-bottom:12px">
        ${data.narrative}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="badge ${data.signal === 'buy' ? 'badge-success' : data.signal === 'sell' ? 'badge-danger' : 'badge-warning'}">
          ${data.signal?.toUpperCase()}
        </span>
        <span class="font-mono" style="font-size:11px;color:var(--text-muted)">
          ${data.confidence?.toFixed(1)}% confidence
        </span>
      </div>`;
  } catch {
    result.innerHTML = `<div style="color:var(--danger);font-size:12px">
      Analysis failed. Check symbol format (e.g. BTCUSDT).
    </div>`;
  }
}
