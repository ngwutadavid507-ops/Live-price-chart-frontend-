/**
 * Beginner Renderers — hints, lessons, glossary, paper trade
 */

function renderBeginnerLessons() {
  const container = document.getElementById('beginnerLessons');
  if (!container) return;

  const lessons = [
    { icon: '📈', title: 'What is Technical Analysis?', desc: 'Learn how to read price charts and identify trends using indicators like RSI, MACD and moving averages.', time: '5 min' },
    { icon: '🕯️', title: 'Candlestick Patterns', desc: 'Understand how to read candlestick charts — the foundation of price action trading.', time: '8 min' },
    { icon: '📊', title: 'Support & Resistance', desc: 'Identify key price levels where buyers and sellers historically react.', time: '6 min' },
    { icon: '⚡', title: 'RSI — Relative Strength Index', desc: 'Learn how to use RSI to identify overbought and oversold conditions.', time: '5 min' },
    { icon: '🌊', title: 'Volume Analysis', desc: 'Understand why volume confirms or contradicts price movements.', time: '4 min' },
    { icon: '🎯', title: 'Risk Management', desc: 'The most important skill in trading — how to protect your capital.', time: '10 min' },
  ];

  let html = '';
  lessons.forEach(l => {
    html += `
      <div class="lesson-card">
        <div class="lesson-card-header">
          <div class="lesson-icon">${l.icon}</div>
          <div>
            <div class="lesson-title">${l.title}</div>
            <div class="lesson-meta">
              <span>⏱ ${l.time} read</span>
            </div>
          </div>
        </div>
        <div class="lesson-desc">${l.desc}</div>
      </div>`;
  });

  container.innerHTML = html;
}


function renderRiskCalculator() {
  const container = document.getElementById('riskCalculator');
  if (!container) return;

  container.innerHTML = `
    <div class="risk-calculator">
      <div class="risk-calc-title">Risk Calculator</div>
      <div class="risk-calc-field">
        <label>Account Size ($)</label>
        <input type="number" id="rcAccount" value="1000"
          oninput="_calcRisk()">
      </div>
      <div class="risk-calc-field">
        <label>Risk Per Trade (%)</label>
        <input type="number" id="rcRisk" value="1" step="0.5"
          oninput="_calcRisk()">
      </div>
      <div class="risk-calc-field">
        <label>Entry Price ($)</label>
        <input type="number" id="rcEntry" value="60000"
          oninput="_calcRisk()">
      </div>
      <div class="risk-calc-field">
        <label>Stop Loss Price ($)</label>
        <input type="number" id="rcStop" value="59000"
          oninput="_calcRisk()">
      </div>
      <div id="rcResult" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
        <div class="risk-calc-row">
          <span>Max Loss</span>
          <span class="font-mono" style="color:var(--danger)">$10.00</span>
        </div>
        <div class="risk-calc-row">
          <span>Position Size</span>
          <span class="font-mono">$600.00</span>
        </div>
        <div class="risk-calc-row">
          <span>Quantity</span>
          <span class="font-mono">0.01 BTC</span>
        </div>
      </div>
    </div>`;

  _calcRisk();
}


function _calcRisk() {
  const account = parseFloat(document.getElementById('rcAccount')?.value) || 0;
  const risk    = parseFloat(document.getElementById('rcRisk')?.value)    || 0;
  const entry   = parseFloat(document.getElementById('rcEntry')?.value)   || 0;
  const stop    = parseFloat(document.getElementById('rcStop')?.value)    || 0;

  const result = document.getElementById('rcResult');
  if (!result) return;

  if (!account || !risk || !entry || !stop || entry === stop) {
    result.innerHTML = `<div style="color:var(--text-muted);font-size:12px">Enter all values to calculate.</div>`;
    return;
  }

  const maxLoss    = (account * risk / 100);
  const slDist     = Math.abs(entry - stop);
  const slPct      = (slDist / entry * 100).toFixed(2);
  const qty        = maxLoss / slDist;
  const posSize    = qty * entry;

  result.innerHTML = `
    <div class="risk-calc-row">
      <span>Max Loss</span>
      <span class="font-mono" style="color:var(--danger)">$${maxLoss.toFixed(2)}</span>
    </div>
    <div class="risk-calc-row">
      <span>SL Distance</span>
      <span class="font-mono">${slPct}%</span>
    </div>
    <div class="risk-calc-row">
      <span>Position Size</span>
      <span class="font-mono">$${posSize.toFixed(2)}</span>
    </div>
    <div class="risk-calc-row">
      <span>Quantity</span>
      <span class="font-mono">${qty.toFixed(6)}</span>
    </div>`;
}


function renderGlossary() {
  const container = document.getElementById('glossary');
  if (!container) return;

  const terms = [
    { term: 'RSI',        def: 'Relative Strength Index — measures momentum on a 0-100 scale. Above 70 = overbought, below 30 = oversold.' },
    { term: 'EMA',        def: 'Exponential Moving Average — a trend-following indicator that gives more weight to recent prices.' },
    { term: 'MACD',       def: 'Moving Average Convergence Divergence — shows the relationship between two moving averages.' },
    { term: 'ATR',        def: 'Average True Range — measures market volatility over a given period.' },
    { term: 'Support',    def: 'A price level where buying pressure historically prevents further decline.' },
    { term: 'Resistance', def: 'A price level where selling pressure historically prevents further rise.' },
    { term: 'CVD',        def: 'Cumulative Volume Delta — tracks the net difference between buying and selling volume.' },
    { term: 'Liquidity',  def: 'The ease with which an asset can be bought or sold without affecting its price.' },
    { term: 'Long',       def: 'Buying an asset expecting the price to rise.' },
    { term: 'Short',      def: 'Selling an asset expecting the price to fall.' },
    { term: 'PnL',        def: 'Profit and Loss — the financial result of a trade.' },
    { term: 'Confluence', def: 'When multiple indicators or analysis methods agree on the same signal.' },
  ];

  let html = '';
  terms.forEach(t => {
    html += `
      <div class="glossary-item">
        <div class="glossary-term">${t.term}</div>
        <div class="glossary-def">${t.def}</div>
      </div>`;
  });

  container.innerHTML = html;
}


function renderPaperTrade() {
  const container = document.getElementById('paperTrade');
  if (!container) return;

  container.innerHTML = `
    <div class="paper-trade-form">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:var(--success)">
        Practice Trade Simulator
      </div>
      <div class="paper-trade-field">
        <label>Asset</label>
        <select id="ptAsset">
          <option>BTCUSDT</option>
          <option>ETHUSDT</option>
          <option>SOLUSDT</option>
        </select>
      </div>
      <div class="paper-trade-field">
        <label>Direction</label>
        <select id="ptDir">
          <option value="long">Long (Buy)</option>
          <option value="short">Short (Sell)</option>
        </select>
      </div>
      <div class="paper-trade-field">
        <label>Amount ($)</label>
        <input type="number" id="ptAmount" value="100">
      </div>
      <button class="btn btn-primary w-full" style="margin-top:8px"
        onclick="_submitPaperTrade()">
        Open Paper Trade
      </button>
      <div id="ptResult" style="margin-top:10px"></div>
    </div>`;
}


function _submitPaperTrade() {
  const asset  = document.getElementById('ptAsset')?.value;
  const dir    = document.getElementById('ptDir')?.value;
  const amount = parseFloat(document.getElementById('ptAmount')?.value) || 0;
  const result = document.getElementById('ptResult');
  if (!result) return;

  const assets = globalStore.getState('assets');
  const asset_data = assets.find(a => a.symbol === asset);
  const price  = asset_data?.price || 0;

  if (!price) {
    result.innerHTML = `<div style="color:var(--danger);font-size:12px">Asset price not available.</div>`;
    return;
  }

  const qty = amount / price;
  result.innerHTML = `
    <div style="background:var(--success-dim);border:1px solid var(--success);
                border-radius:var(--radius-sm);padding:10px;font-size:12px">
      <strong style="color:var(--success)">Paper Trade Opened!</strong><br>
      ${dir.toUpperCase()} ${qty.toFixed(6)} ${asset.replace('USDT','')}
      at $${formatters.price(price)}<br>
      <span style="color:var(--text-muted)">This is a simulated trade — no real money involved.</span>
    </div>`;
}
