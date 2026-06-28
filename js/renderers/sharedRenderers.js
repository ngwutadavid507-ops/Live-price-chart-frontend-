/**
 * Shared Renderers
 * sendChatMessage → real Groq via /ai/chat
 * renderJournalDetail → reads backend journal data
 */

// ── Ticker Strip ──────────────────────────────────────────────────────
function renderTicker() {
  const container = document.getElementById('tickerFeed');
  if (!container) return;
  const assets = globalStore.getState('parentTrackAssets');
  if (!assets || assets.length === 0) return;
  let html = '';
  assets.slice(0, 30).forEach(a => {
    const chg = typeof a.change24h === 'number' ? a.change24h : 0;
    html += `
      <span style="font-size:12px;font-weight:700;font-family:var(--font-mono)">
        ${a.symbol.replace('USDT','')}:
        ${formatters.price(a.price)}
        <span style="color:var(--${chg >= 0 ? 'success' : 'danger'})">
          ${formatters.pct(chg)}
        </span>
      </span>`;
  });
  container.innerHTML = html + html;
}

// ── Journal Table ─────────────────────────────────────────────────────
function renderJournalDetail() {
  const container = document.getElementById('journalDetail');
  if (!container) return;
  const journal = globalStore.getState('journal');
  if (!journal || journal.length === 0) {
    container.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">
      No trades recorded yet. Add your first trade to start tracking performance.
    </div>`;
    return;
  }
  let html = `<table class="data-table">
    <thead><tr>
      <th>Date</th><th>Pair</th><th>Side</th>
      <th>Entry</th><th>Exit</th><th>PnL</th><th>Tags</th>
    </tr></thead><tbody>`;
  journal.forEach(j => {
    const pnlColor = j.pnl >= 0 ? 'var(--success)' : 'var(--danger)';
    const pnlSign  = j.pnl >= 0 ? '+' : '';
    const tagsHtml = (j.tags || []).map(t =>
      `<span class="journal-tag">${t}</span>`
    ).join('');
    html += `
      <tr>
        <td class="font-mono" style="font-size:11px">${j.date}</td>
        <td><strong>${j.pair}</strong></td>
        <td><span class="badge ${j.side === 'Long' ? 'badge-success' : 'badge-danger'}">${j.side}</span></td>
        <td class="font-mono">${j.entry}</td>
        <td class="font-mono">${j.exit || '—'}</td>
        <td class="font-mono" style="color:${pnlColor}">${pnlSign}$${j.pnl}</td>
        <td><div class="journal-tags">${tagsHtml}</div></td>
      </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderTagAnalytics() {
  const container = document.getElementById('tagAnalytics');
  if (!container) return;
  const journal   = globalStore.getState('journal');
  const tagTotals = {};
  journal.forEach(j => {
    (j.tags || []).forEach(tag => {
      if (!tagTotals[tag]) tagTotals[tag] = { wins: 0, total: 0 };
      tagTotals[tag].total++;
      if (j.pnl > 0) tagTotals[tag].wins++;
    });
  });
  if (Object.keys(tagTotals).length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted);font-size:12px">No tag data yet.</div>`;
    return;
  }
  let html = '';
  Object.entries(tagTotals).forEach(([tag, data]) => {
    const rate = data.total > 0 ? Math.round(data.wins / data.total * 100) : 0;
    html += `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${tag}</span><strong>${rate}%</strong>
        </div>
        <div style="height:4px;background:var(--bg-tertiary);border-radius:2px">
          <div style="width:${rate}%;height:100%;background:var(--success);border-radius:2px"></div>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function renderTradeNotes() {
  const container = document.getElementById('tradeNotes');
  if (!container) return;
  const journal   = globalStore.getState('journal');
  const withNotes = journal.filter(j => j.note && j.note.trim());
  if (withNotes.length === 0) {
    container.innerHTML = `<div style="background:var(--bg-primary);border:1px solid var(--border);padding:10px;border-radius:var(--radius-sm);font-size:12px;font-style:italic;color:var(--text-muted)">No trade notes recorded yet.</div>`;
    return;
  }
  let html = '';
  withNotes.slice(0, 5).forEach(j => {
    html += `
      <div class="journal-entry" style="margin-bottom:8px">
        <div class="journal-header">
          <span>${j.pair} — ${j.side}</span>
          <span class="journal-pnl" style="color:${j.pnl >= 0 ? 'var(--success)' : 'var(--danger)'}">
            ${j.pnl >= 0 ? '+' : ''}$${j.pnl}
          </span>
        </div>
        <div class="journal-note">"${j.note}"</div>
      </div>`;
  });
  container.innerHTML = html;
}

function renderShortcutsHelp() {
  const container = document.getElementById('shortcutsHelp');
  if (!container) return;
  const shortcuts = [
    ['D','Dashboard'], ['M','Markets'],   ['A','Analysis'],
    ['O','Order Flow'],['S','Signals'],   ['P','Portfolio'],
    ['I','AI Analytics'],['C','AI Chat'],['B','Beginner Hub'],
    ['T','Pro Suite'], ['J','Journal'],   ['H','Shortcuts'],
    ['/','Focus Chat Input'],
  ];
  container.innerHTML = shortcuts.map(([key, label]) =>
    `<div class="shortcut-row">
       <span class="badge badge-warning">${key}</span>
       <span>${label}</span>
     </div>`
  ).join('');
}

// ── Chat Messages ─────────────────────────────────────────────────────
function renderChatContainerMessages() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  let html = '';
  globalStore.getState('chatHistory').forEach(msg => {
    html += `
      <div class="chat-message ${msg.sender}">
        <div class="chat-avatar ${msg.sender}">${msg.sender === 'ai' ? '🤖' : 'PT'}</div>
        <div class="chat-bubble">${msg.text}</div>
      </div>`;
  });
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

// ── Send Chat (real Groq via /ai/chat) ───────────────────────────────
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;
  const userText = input.value.trim();
  input.value   = '';
  const history = globalStore.getState('chatHistory');
  history.push({ text: userText, sender: 'user' });
  globalStore.setState('chatHistory', history);
  renderChatContainerMessages();

  const messagesEl = document.getElementById('chatMessages');
  const typingEl   = document.createElement('div');
  typingEl.className = 'chat-message ai';
  typingEl.innerHTML = `
    <div class="chat-avatar ai">🤖</div>
    <div class="chat-bubble">
      <div class="chat-typing">
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
      </div>
    </div>`;
  if (messagesEl) messagesEl.appendChild(typingEl);
  if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

  try {
    const apiHistory = history.slice(-10).map(m => ({
      role:    m.sender === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));
    const currentSymbol = globalStore.getState('settings').default_symbol || null;
    const response = await apiService.aiChat(userText, apiHistory, currentSymbol);
    typingEl.remove();
    history.push({ text: response.reply, sender: 'ai' });
    globalStore.setState('chatHistory', history);
    renderChatContainerMessages();
  } catch {
    typingEl.remove();
    history.push({
      text:   'Phoenix AI is temporarily unavailable. Please try again in a moment.',
      sender: 'ai',
    });
    globalStore.setState('chatHistory', history);
    renderChatContainerMessages();
  }
  }
