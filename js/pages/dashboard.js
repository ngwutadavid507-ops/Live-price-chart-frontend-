/**
 * Dashboard Page — main workspace
 * Loads real market data, signals, news preview
 */

async function renderDashboard() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Phoenix Terminal</h1>
      <p class="page-subtitle">Real-time crypto intelligence dashboard</p>
    </div>

    <div class="grid-4" style="margin-bottom:16px">
      <div class="card" id="dashBTC">
        <div class="card-label">BTC/USDT</div>
        <div class="card-value" id="dashBTCPrice">Loading...</div>
        <div class="card-change" id="dashBTCChange">—</div>
      </div>
      <div class="card" id="dashETH">
        <div class="card-label">ETH/USDT</div>
        <div class="card-value" id="dashETHPrice">Loading...</div>
        <div class="card-change" id="dashETHChange">—</div>
      </div>
      <div class="card" id="dashSOL">
        <div class="card-label">SOL/USDT</div>
        <div class="card-value" id="dashSOLPrice">Loading...</div>
        <div class="card-change" id="dashSOLChange">—</div>
      </div>
      <div class="card" id="dashBNB">
        <div class="card-label">BNB/USDT</div>
        <div class="card-value" id="dashBNBPrice">Loading...</div>
        <div class="card-change" id="dashBNBChange">—</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card" id="marketLeaders">
        <div class="card-title">Loading market leaders...</div>
      </div>
      <div class="card" id="topMovers">
        <div class="card-title">Loading top movers...</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card" id="recentSignals">
        <div class="card-title">Loading signals...</div>
      </div>
      <div class="card" id="exchangeRankings">
        <div class="card-title">Loading market summary...</div>
      </div>
    </div>

    <div class="card" id="dashNews">
      <div class="card-title">Latest Crypto News</div>
      <div style="color:var(--text-muted);font-size:12px">Loading news...</div>
    </div>
  `;

  // Load price cards
  _loadDashPriceCards();

  // Load renderers
  renderMarketLeaders();
  renderTopMovers();
  renderRecentSignals();
  renderExchangeRankings();
  _loadDashNews();
}


function _loadDashPriceCards() {
  const pairs = [
    { id: 'BTC', symbol: 'BTCUSDT' },
    { id: 'ETH', symbol: 'ETHUSDT' },
    { id: 'SOL', symbol: 'SOLUSDT' },
    { id: 'BNB', symbol: 'BNBUSDT' },
  ];

  const assets = globalStore.getState('assets');
  pairs.forEach(({ id, symbol }) => {
    const asset    = assets.find(a => a.symbol === symbol);
    const priceEl  = document.getElementById(`dash${id}Price`);
    const changeEl = document.getElementById(`dash${id}Change`);
    if (!priceEl || !changeEl) return;
    if (asset) {
      priceEl.textContent  = formatters.price(asset.price);
      const chg = asset.change24h || 0;
      changeEl.textContent = formatters.pct(chg);
      changeEl.style.color = chg >= 0 ? 'var(--success)' : 'var(--danger)';
    }
  });

  // Subscribe to state changes for live updates
  globalStore.subscribe('assets', (assets) => {
    pairs.forEach(({ id, symbol }) => {
      const asset    = assets.find(a => a.symbol === symbol);
      const priceEl  = document.getElementById(`dash${id}Price`);
      const changeEl = document.getElementById(`dash${id}Change`);
      if (!asset || !priceEl || !changeEl) return;
      priceEl.textContent  = formatters.price(asset.price);
      const chg = asset.change24h || 0;
      changeEl.textContent = formatters.pct(chg);
      changeEl.style.color = chg >= 0 ? 'var(--success)' : 'var(--danger)';
    });
  });
}


async function _loadDashNews() {
  const container = document.getElementById('dashNews');
  if (!container) return;

  try {
    const data     = await apiService.getNews('hot');
    const articles = data.articles || [];

    if (articles.length === 0) {
      container.innerHTML = `<div class="card-title">Latest Crypto News</div>
        <div style="color:var(--text-muted);font-size:12px">No news available.</div>`;
      return;
    }

    let html = `<div class="card-title">Latest Crypto News</div>
      <div style="display:flex;flex-direction:column;gap:8px">`;

    articles.slice(0, 5).forEach(a => {
      const sentColor = a.sentiment === 'bullish' ? 'var(--success)'
                      : a.sentiment === 'bearish' ? 'var(--danger)'
                      : 'var(--text-muted)';
      html += `
        <div style="padding:8px 0;border-bottom:1px solid var(--border)">
          <div style="font-size:13px;font-weight:600;margin-bottom:3px">
            <a href="${a.url}" target="_blank"
               style="color:var(--text-primary);text-decoration:none">
              ${a.title}
            </a>
          </div>
          <div style="display:flex;gap:8px;font-size:11px;color:var(--text-muted)">
            <span>${a.source}</span>
            <span style="color:${sentColor}">${a.sentiment}</span>
          </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch {
    container.innerHTML = `<div class="card-title">Latest Crypto News</div>
      <div style="color:var(--text-muted);font-size:12px">News feed unavailable.</div>`;
  }
                  }
