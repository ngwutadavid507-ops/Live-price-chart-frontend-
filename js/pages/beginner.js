/**
 * Beginner Hub Page — simplified interface for new traders
 */

function renderBeginner() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Beginner Hub</h1>
      <p class="page-subtitle">Learn trading fundamentals and practice with paper trades</p>
    </div>

    <div class="beginner-hero">
      <h2>Welcome to Phoenix Academy</h2>
      <p>Master the markets step by step — from reading charts to managing risk like a pro.</p>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-title">Trading Lessons</div>
        <div id="beginnerLessons"></div>
      </div>
      <div class="card">
        <div id="riskCalculator"></div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-title">Paper Trade Simulator</div>
        <div id="paperTrade"></div>
      </div>
      <div class="card">
        <div class="card-title">Quick Signals</div>
        <div id="simpleSignals">
          <div style="color:var(--text-muted);font-size:12px;padding:8px">
            Loading signals...
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Trading Glossary</div>
      <div id="glossary"></div>
    </div>
  `;

  renderBeginnerLessons();
  renderRiskCalculator();
  renderPaperTrade();
  renderGlossary();
  _loadSimpleSignals();
}


async function _loadSimpleSignals() {
  const container = document.getElementById('simpleSignals');
  if (!container) return;

  try {
    const data    = await apiService.scanSignals(60);
    const signals = data.signals || [];

    if (signals.length === 0) {
      container.innerHTML = `
        <div style="color:var(--text-muted);font-size:12px;padding:8px">
          No active signals right now. Market is consolidating.
        </div>`;
      return;
    }

    let html = '';
    signals.slice(0, 4).forEach(s => {
      const isBuy  = s.direction === 'buy';
      const color  = isBuy ? 'var(--success)' : 'var(--danger)';
      const label  = isBuy ? 'BUY Signal' : 'SELL Signal';
      const emoji  = isBuy ? '📈' : '📉';

      html += `
        <div style="padding:10px;background:var(--bg-tertiary);
                    border-radius:var(--radius-sm);margin-bottom:8px;
                    border-left:3px solid ${color}">
          <div style="font-size:13px;font-weight:700">
            ${emoji} ${s.symbol.replace('USDT','')}/USDT
          </div>
          <div style="font-size:11px;color:${color};margin-top:2px">
            ${label} — ${s.confidence?.toFixed(0)}% confidence
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
            ${s.agreements} indicators agreed
          </div>
        </div>`;
    });

    container.innerHTML = html;

  } catch {
    container.innerHTML = `
      <div style="color:var(--text-muted);font-size:12px;padding:8px">
        Signal data unavailable.
      </div>`;
  }
}
