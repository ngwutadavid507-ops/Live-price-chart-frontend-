/**
 * Journal Page — personal trade notes and performance tracking
 */

async function renderJournal() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Trade Journal</h1>
      <p class="page-subtitle">Personal trade log and performance analytics</p>
    </div>

    <!-- Journal Stats -->
    <div class="grid-4" style="margin-bottom:16px" id="journalStats">
      <div class="card">
        <div class="card-label">Total Trades</div>
        <div class="card-value" id="journalTotal">—</div>
      </div>
      <div class="card">
        <div class="card-label">Win Rate</div>
        <div class="card-value" id="journalWinRate">—</div>
      </div>
      <div class="card">
        <div class="card-label">Total PnL</div>
        <div class="card-value" id="journalPnl">—</div>
      </div>
      <div class="card">
        <div class="card-label">Avg PnL</div>
        <div class="card-value" id="journalAvgPnl">—</div>
      </div>
    </div>

    <!-- Add Trade Form -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-title">Log New Trade</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <input type="text" id="newJournalPair" placeholder="Pair e.g. BTCUSDT"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
        <select id="newJournalSide"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </select>
        <input type="text" id="newJournalEntry" placeholder="Entry price"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
        <input type="number" id="newJournalPnl" placeholder="PnL e.g. 45.50"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);color:#fff;font-size:12px">
      </div>
      <input type="text" id="newJournalNote" placeholder="Trade note (optional)"
        style="width:100%;background:var(--bg-primary);border:1px solid var(--border);
               padding:6px 10px;border-radius:var(--radius-sm);color:#fff;
               font-size:12px;margin-bottom:8px;box-sizing:border-box">
      <input type="text" id="newJournalTags" placeholder="Tags e.g. breakout,momentum"
        style="width:100%;background:var(--bg-primary);border:1px solid var(--border);
               padding:6px 10px;border-radius:var(--radius-sm);color:#fff;
               font-size:12px;margin-bottom:8px;box-sizing:border-box">
      <button class="btn btn-primary" onclick="_addJournalTrade()">Log Trade</button>
    </div>

    <!-- Trade History -->
    <div class="card" style="margin-bottom:16px" id="journalDetail">
      <div class="card-title">Loading trades...</div>
    </div>

    <!-- Tag Analytics -->
    <div class="grid-2">
      <div class="card" id="tagAnalytics">
        <div class="card-title">Tag Win Rates</div>
        <div style="color:var(--text-muted);font-size:12px">No tags yet.</div>
      </div>
      <div class="card" id="tradeNotes">
        <div class="card-title">Recent Notes</div>
        <div style="color:var(--text-muted);font-size:12px">No notes yet.</div>
      </div>
    </div>
  `;

  await _loadJournalData();
}


async function _loadJournalData() {
  try {
    const [trades, stats] = await Promise.all([
      apiService.getJournalTrades(),
      apiService.getJournalStats(),
    ]);

    globalStore.setState('journal', trades.trades || []);

    const totalEl   = document.getElementById('journalTotal');
    const winEl     = document.getElementById('journalWinRate');
    const pnlEl     = document.getElementById('journalPnl');
    const avgPnlEl  = document.getElementById('journalAvgPnl');

    if (totalEl)  totalEl.textContent  = stats.total || 0;
    if (winEl) {
      winEl.textContent  = `${stats.win_rate || 0}%`;
      winEl.style.color  = (stats.win_rate || 0) >= 50 ? 'var(--success)' : 'var(--danger)';
    }
    if (pnlEl) {
      const pnl = stats.total_pnl || 0;
      pnlEl.textContent = `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`;
      pnlEl.style.color = pnl >= 0 ? 'var(--success)' : 'var(--danger)';
    }
    if (avgPnlEl) {
      const avg = stats.avg_pnl || 0;
      avgPnlEl.textContent = `${avg >= 0 ? '+' : ''}$${avg.toFixed(2)}`;
      avgPnlEl.style.color = avg >= 0 ? 'var(--success)' : 'var(--danger)';
    }

  } catch { }

  renderJournalDetail();
  renderTagAnalytics();
  renderTradeNotes();
}


async function _addJournalTrade() {
  const pair  = document.getElementById('newJournalPair')?.value?.trim()?.toUpperCase();
  const side  = document.getElementById('newJournalSide')?.value;
  const entry = document.getElementById('newJournalEntry')?.value?.trim();
  const pnl   = parseFloat(document.getElementById('newJournalPnl')?.value);
  const note  = document.getElementById('newJournalNote')?.value?.trim() || '';
  const tagsRaw = document.getElementById('newJournalTags')?.value?.trim() || '';
  const tags  = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!pair || !side || !entry || isNaN(pnl)) {
    showToast('Journal', 'Please fill in pair, side, entry and PnL.', 'danger');
    return;
  }

  try {
    await apiService.addJournalTrade({ pair, side, entry, pnl, note, tags });
    showToast('Journal', `Trade logged: ${pair} ${side} PnL $${pnl}`, 'success');

    // Clear form
    ['newJournalPair','newJournalEntry','newJournalPnl',
     'newJournalNote','newJournalTags'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    await _loadJournalData();
  } catch {
    showToast('Journal', 'Failed to log trade.', 'danger');
  }
}


async function deleteJournalTrade(id) {
  try {
    await apiService.deleteJournalTrade(id);
    showToast('Journal', 'Trade deleted.', 'success');
    await _loadJournalData();
  } catch {
    showToast('Journal', 'Failed to delete trade.', 'danger');
  }
}
