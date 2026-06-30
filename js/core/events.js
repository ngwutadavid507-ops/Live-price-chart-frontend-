/**
 * Phoenix Terminal — Events
 * Scroll progress bar, keyboard shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  _initScrollProgress();
  _initKeyboardShortcuts();
});

function _initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${scrollPct}%`;
  });
}

function _initKeyboardShortcuts() {
  const KEY_MAP = {
    'd': 'dashboard',
    'm': 'markets',
    'a': 'analysis',
    'o': 'orderflow',
    'w': 'whales',
    's': 'signals',
    'k': 'backtest',
    'p': 'portfolio',
    'i': 'ai',
    'c': 'aichat',
    'b': 'beginner',
    't': 'protools',
    'j': 'journal',
    'h': 'shortcuts',
  };

  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in an input field
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      // Allow '/' to focus chat input from anywhere
      return;
    }

    const key = e.key.toLowerCase();

    if (key === '/') {
      e.preventDefault();
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        navigateTo('aichat');
        setTimeout(() => chatInput.focus(), 100);
      }
      return;
    }

    if (KEY_MAP[key]) {
      e.preventDefault();
      navigateTo(KEY_MAP[key]);
    }
  });
}
