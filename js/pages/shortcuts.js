/**
 * Shortcuts Page — keybinding layout registrations
 */

function renderShortcuts() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Keyboard Shortcuts</h1>
      <p class="page-subtitle">Navigate Phoenix Terminal faster</p>
    </div>

    <div class="card">
      <div class="card-title">Page Navigation</div>
      <div id="shortcutsHelp" style="display:flex;flex-direction:column;gap:6px">
        Loading...
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-title">Tips</div>
      <ul style="font-size:13px;color:var(--text-secondary);line-height:1.8;padding-left:20px">
        <li>Shortcuts only work when not typing in an input field</li>
        <li>Press <strong>/</strong> from anywhere to jump straight to AI Chat</li>
        <li>Signal scanning runs automatically every 30 seconds</li>
        <li>Top 10 tokens are auto-analyzed and refreshed every 60 seconds</li>
      </ul>
    </div>
  `;

  renderShortcutsHelp();
}
