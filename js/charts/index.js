/**
 * Chart Dispatcher — initializes Chart.js instances per page.
 * Individual page files (analysis.js, backtest.js) handle their
 * own chart creation; this file provides shared chart helpers.
 */

const CHART_DEFAULTS = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      display: false,
      grid:    { color: 'rgba(255,255,255,0.05)' },
    },
    y: {
      grid:  { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#888', font: { size: 10 } },
    },
  },
};

function destroyChart(instanceKey) {
  if (window[instanceKey]) {
    window[instanceKey].destroy();
    window[instanceKey] = null;
  }
}

function createLineChart(canvasId, labels, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  const ctx = canvas.getContext('2d');
  const isPositive = data.length > 1 ? data[data.length - 1] >= data[0] : true;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label:           options.label || '',
        data,
        borderColor:     isPositive ? '#00d4aa' : '#ff4d4d',
        backgroundColor: isPositive ? 'rgba(0,212,170,0.05)' : 'rgba(255,77,77,0.05)',
        borderWidth:     1.5,
        pointRadius:     0,
        fill:            true,
        tension:         0.1,
      }],
    },
    options: { ...CHART_DEFAULTS, ...options },
  });
}

function createSparklineChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  const ctx = canvas.getContext('2d');
  const isPositive = data.length > 1 ? data[data.length - 1] >= data[0] : true;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: isPositive ? '#00d4aa' : '#ff4d4d',
        borderWidth: 1.5,
        pointRadius: 0,
        fill:        false,
        tension:     0.3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: { line: { borderJoinStyle: 'round' } },
    },
  });
}
