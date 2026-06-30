/**
 * Phoenix Terminal — Modal
 */

function showModal(title, contentHtml, options = {}) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.id = 'phoenixModalOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: var(--bg-secondary, #131722);
    border: 1px solid var(--border, #2a2e39);
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
  `;

  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="margin:0;color:#fff;font-size:16px">${title}</h3>
      <button onclick="closeModal()"
        style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;padding:0 4px">
        ×
      </button>
    </div>
    <div>${contentHtml}</div>`;

  overlay.appendChild(modal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
}

function closeModal() {
  const existing = document.getElementById('phoenixModalOverlay');
  if (existing) existing.remove();
}
