/**
 * Phoenix Terminal — Toast Notifications
 */

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const colors = {
    success: 'var(--success)',
    danger:  'var(--danger)',
    warning: 'var(--accent)',
    info:    'var(--text-muted)',
  };

  const icons = {
    success: '✓',
    danger:  '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: var(--bg-secondary, #131722);
    border: 1px solid ${colors[type] || colors.info};
    border-left: 3px solid ${colors[type] || colors.info};
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 8px;
    min-width: 240px;
    max-width: 320px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: toastSlideIn 0.3s ease;
    font-family: -apple-system, sans-serif;
  `;

  toast.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:8px">
      <span style="color:${colors[type] || colors.info};font-weight:700;font-size:14px">
        ${icons[type] || icons.info}
      </span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:2px">
          ${title}
        </div>
        <div style="font-size:11px;color:#aaa;line-height:1.4">
          ${message}
        </div>
      </div>
    </div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Inject animation keyframes once
if (!document.getElementById('toastStyles')) {
  const style = document.createElement('style');
  style.id = 'toastStyles';
  style.textContent = `
    #toastContainer {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
    }
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes toastSlideOut {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(20px); }
    }
  `;
  document.head.appendChild(style);
}
