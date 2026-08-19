// ===== Canvas & Grid Setup =====
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bgColorInput = document.getElementById('bgColor');
const gridCheckbox = document.getElementById('showGrid');
const gridCountInput = document.getElementById('gridCount');

// Set canvas size to fit the screen (minus header if any)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

// ===== Utility Functions =====
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function invertAndLighten(rgb, factor = 0.4) {
  return `rgba(${Math.round((255 - rgb[0]) * factor)}, ${Math.round((255 - rgb[1]) * factor)}, ${Math.round((255 - rgb[2]) * factor)}, 0.5)`;
}

// ===== Grid Drawing =====
function drawGrid() {
  if (!gridCheckbox.checked) return;

  const divisions = parseInt(gridCountInput.value) || 20;
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  const stepX = width / divisions;
  const stepY = height / divisions;

  ctx.strokeStyle = invertAndLighten(hexToRgb(bgColorInput.value));
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += stepX) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += stepY) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }
}

// ===== Event Listeners for Background & Grid =====
bgColorInput.addEventListener('input', e => {
  canvas.style.background = e.target.value;
});

gridCheckbox.addEventListener('change', () => {
  // Grid will be redrawn inside canvas.js draw loop
});

gridCountInput.addEventListener('input', () => {
  // Debounce for smoother interaction
  setTimeout(() => {}, 150);
});

// Export drawGrid so canvas.js can call it
window.drawGrid = drawGrid;
