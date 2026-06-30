/**
 * Indicator Configs — frontend display metadata.
 * Actual calculation happens server-side via /analysis endpoints.
 * This file maps indicator names to display configs for the UI.
 */

const INDICATOR_CONFIGS = {
  rsi: {
    name:    'RSI',
    fullName: 'Relative Strength Index',
    period:  14,
    overbought: 70,
    oversold:   30,
    color:   '#f0b90b',
  },
  macd: {
    name:    'MACD',
    fullName: 'Moving Average Convergence Divergence',
    fast:    12,
    slow:    26,
    signal:  9,
    color:   '#00d4aa',
  },
  ema: {
    name:    'EMA',
    fullName: 'Exponential Moving Average',
    periods: [9, 21, 50],
    colors:  ['#00d4aa', '#f0b90b', '#ff4d4d'],
  },
  bollinger: {
    name:    'Bollinger Bands',
    fullName: 'Bollinger Bands',
    period:  20,
    multiplier: 2,
    color:   '#7c3aed',
  },
  atr: {
    name:    'ATR',
    fullName: 'Average True Range',
    period:  14,
    color:   '#888888',
  },
  ichimoku: {
    name:    'Ichimoku',
    fullName: 'Ichimoku Cloud',
    color:   '#00b8d4',
  },
};

function getIndicatorConfig(key) {
  return INDICATOR_CONFIGS[key] || null;
}

function rsiZoneLabel(value) {
  if (value >= 70) return 'Overbought';
  if (value <= 30) return 'Oversold';
  return 'Neutral';
}

function rsiZoneColor(value) {
  if (value >= 70) return 'var(--danger)';
  if (value <= 30) return 'var(--success)';
  return 'var(--text-muted)';
}
