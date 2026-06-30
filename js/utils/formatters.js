/**
 * Phoenix Terminal — Formatters
 * Currency, number, and crypto token display tools.
 */

const formatters = {
  price(value) {
    if (value === null || value === undefined || isNaN(value)) return '$0.00';
    const num = parseFloat(value);
    if (num >= 1000) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 1) {
      return '$' + num.toFixed(2);
    }
    if (num >= 0.0001) {
      return '$' + num.toFixed(6);
    }
    return '$' + num.toFixed(8);
  },

  pct(value) {
    if (value === null || value === undefined || isNaN(value)) return '0.00%';
    const num  = parseFloat(value);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  },

  compact(value) {
    if (value === null || value === undefined || isNaN(value)) return '0';
    const num = parseFloat(value);
    if (Math.abs(num) >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (Math.abs(num) >= 1_000_000)     return (num / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1_000)         return (num / 1_000).toFixed(1) + 'K';
    return num.toFixed(2);
  },

  time(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleTimeString('en-US', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  dateStr(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'short',
      day:   'numeric',
    });
  },

  sparkline(points, width = 60, height = 20) {
    if (!points || points.length < 2) return '';
    const min   = Math.min(...points);
    const max   = Math.max(...points);
    const range = max - min || 1;
    const step  = width / (points.length - 1);

    const coords = points.map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return coords.join(' ');
  },
};
