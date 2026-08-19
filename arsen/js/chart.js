


// --- Charts Modal ---
const chartsModal = document.getElementById('chartsModal');
const chartsBtn = document.getElementById('chartsBtn');
const insertChartBtn = document.getElementById('insertChartBtn');
const chartPreview = document.getElementById('chartPreview');
let selectedChart = null;

// Apply Highcharts Dark Theme
Highcharts.setOptions({
  chart: {
    backgroundColor: '#1e1e1e',
    style: { color: '#fff' }
  },
  title: { style: { color: '#fff' } },
  xAxis: {
    labels: { style: { color: '#fff' } },
    lineColor: '#555'
  },
  yAxis: {
    labels: { style: { color: '#fff' } },
    gridLineColor: '#333',
    title: { style: { color: '#fff' } }
  },
  legend: { itemStyle: { color: '#fff' } }
});

// Open modal
chartsBtn.addEventListener('click', () => {
  chartsModal.style.display = 'flex';
});

// Close modal on outside click
chartsModal.addEventListener('click', e => {
  if (e.target === chartsModal) chartsModal.style.display = 'none';
});

// Handle chart type selection
document.querySelectorAll('.chart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedChart = btn.dataset.chart;
    renderChartPreview(selectedChart);

    // Remove active class from all buttons and add to selected
    document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Render Highcharts preview
function renderChartPreview(type) {
  const options = {
    title: { text: `${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} Chart` },
    xAxis: { categories: ['A', 'B', 'C', 'D', 'E'] },
    series: [{ data: [1, 3, 2, 4, 5] }]
  };

if (type === 'bar') {
  options.chart = { type: 'column' }; // Vertical bar chart
}

  if (type === 'horizontal-bar') {
    options.chart = { type: 'bar', inverted: true }; // Horizontal orientation
  }
  if (type === 'stacked-bar') {
    options.chart = { type: 'column' };
    options.plotOptions = {
      series: { stacking: 'normal' }
    };
    options.series = [
      { name: 'Series A', data: [1, 3, 4, 2, 5] },
      { name: 'Series B', data: [2, 2, 3, 3, 4] }
    ];
  }
  if (type === 'line') options.chart = { type: 'line' };
  if (type === 'area') options.chart = { type: 'area' };
  if (type === 'pie') {
    options.chart = { type: 'pie' };
    options.series = [{ data: [{ name: 'A', y: 30 }, { name: 'B', y: 70 }] }];
    delete options.xAxis;
  }
  if (type === 'scatter') {
    options.chart = { type: 'scatter' };
    options.series = [{ data: [[1, 1], [2, 3], [3, 2], [4, 4]] }];
    delete options.xAxis;
  }

  Highcharts.chart('chartPreview', options);
}

// Insert chart action
insertChartBtn.addEventListener('click', () => {
  if (!selectedChart) {
    alert('Please select a chart type first!');
    return;
  }
  alert(`Inserting a ${selectedChart} chart into canvas (coming soon!)`);
  chartsModal.style.display = 'none';
});

