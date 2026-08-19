document.addEventListener('DOMContentLoaded', () => {
  const appearanceBtn = document.getElementById('appearanceBtn');
  const appearancePanel = document.getElementById('appearancePanel');

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal.querySelector('.close');
  const modalContent = modal.querySelector('.modal-content');

  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // --- Modal Close ---
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  // --- Draggable Modal ---
  modalContent.addEventListener('mousedown', e => {
    if (e.target.closest('.close')) return;

    isDragging = true;
    const rect = modalContent.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    modalContent.style.position = 'fixed';
    modalContent.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    let left = e.clientX - dragOffsetX;
    let top = e.clientY - dragOffsetY;
    left = Math.max(0, Math.min(window.innerWidth - modalContent.offsetWidth, left));
    top = Math.max(0, Math.min(window.innerHeight - modalContent.offsetHeight, top));
    modalContent.style.left = left + 'px';
    modalContent.style.top = top + 'px';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    modalContent.style.cursor = 'default';
  });



// --- Appearance Sections Template ---
const sections = {
  border: `
    <div class="modal-section">
      <h3>Border & Outline</h3>
      <div class="modal-field" style="display:flex; gap:8px;">
        <label>Border Width:</label>
        <input type="number" value="1" style="width:60px;">
        <select>
          <option value="outside">Outside</option>
          <option value="inside">Inside</option>
          <option value="center">Center</option>
        </select>
      </div>
      <div class="modal-field" style="margin-top:6px;">
        <label>Border Color:</label>
        <input type="color" value="#7dd3fc">
      </div>
    </div>
  `,
  corners: `
    <div class="modal-section">
      <h3>Corners</h3>
      <div class="modal-field">
        <label>All Corners:</label>
        <input type="number" value="6" id="all-corners">
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, 100px); gap:8px; margin-top:8px;">
        <div><label>Top-Left</label><input type="number" value="6" class="corner-input"></div>
        <div><label>Top-Right</label><input type="number" value="6" class="corner-input"></div>
        <div><label>Bottom-Left</label><input type="number" value="6" class="corner-input"></div>
        <div><label>Bottom-Right</label><input type="number" value="6" class="corner-input"></div>
      </div>
    </div>
  `,
  fill: `
<div class="modal-section">
  <h3>Fill & Background</h3>

  <div class="modal-field">
    <label>Use Gradient:</label>
    <input type="checkbox" id="use-gradient">
  </div>

  <div id="gradient-options" style="margin-top:8px; display:none; flex-direction:column; gap:6px;">
    <div class="modal-field">
      <label>Gradient Type:</label>
      <select id="gradient-type">
        <option value="linear">Linear</option>
        <option value="radial">Radial</option>
        <option value="conic">Conic</option>
      </select>
    </div>

    <div id="gradient-colors" style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
      <button type="button" id="add-gradient-color">+ Add Color</button>
    </div>
  </div>

  <div class="modal-field" style="margin-top:8px;">
    <label>Fill Color:</label>
    <input type="color" value="#2a2a2a" id="fill-color">
  </div>
</div>
  `,
  shadow: `
    <div class="modal-section"><h3>Shadow</h3>
      <div class="modal-field"><label>X:</label><input type="number" value="0"></div>
      <div class="modal-field"><label>Y:</label><input type="number" value="0"></div>
      <div class="modal-field"><label>Blur:</label><input type="number" value="5"></div>
      <div class="modal-field"><label>Color:</label><input type="color" value="#000000"></div>
    </div>
  `,
  filters: `
    <div class="modal-section"><h3>Filters</h3>
      <div class="modal-field"><label>Blur:</label><input type="number" value="0"></div>
      <div class="modal-field"><label>Brightness:</label><input type="number" value="100"></div>
      <div class="modal-field"><label>Contrast:</label><input type="number" value="100"></div>
    </div>
  `,
  transform: `
    <div class="modal-section"><h3>Transform</h3>
      <div class="modal-field"><label>Rotate:</label><input type="number" value="0"></div>
      <div class="modal-field"><label>Scale X:</label><input type="number" value="1" step="0.1"></div>
      <div class="modal-field"><label>Scale Y:</label><input type="number" value="1" step="0.1"></div>
    </div>
  `,
  blend: `
    <div class="modal-section"><h3>Blend Mode</h3>
      <div class="modal-field"><label>Mode:</label>
        <select>
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
        </select>
      </div>
    </div>
  `
};

// --- Open Appearance Modal ---
  document.querySelectorAll('#appearancePanel .section-wrapper button').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.parentElement.dataset.appearance;
      modalBody.innerHTML = sections[key] || '';

      modal.style.display = 'flex';
      modal.style.alignItems = 'flex-start';
      modal.style.justifyContent = 'flex-start';

      modalContent.style.position = 'fixed';
      const rect = modalContent.getBoundingClientRect();
      modalContent.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
      modalContent.style.top = (window.innerHeight / 2 - rect.height / 2) + 'px';

    // Extra logic for corners
    if (key === 'corners') {
      const allCorners = document.getElementById('all-corners');
      const corners = modalBody.querySelectorAll('.corner-input');
      if (allCorners) {
        allCorners.addEventListener('input', () => corners.forEach(inp => inp.value = allCorners.value));
      }
    }

    // Extra logic for fill (gradient)
  if (key === 'fill') {
  const useGradient = document.getElementById('use-gradient');
  const gradientOptions = document.getElementById('gradient-options');
  const gradientContainer = document.getElementById('gradient-colors');
  const addColorBtn = document.getElementById('add-gradient-color');
const fillColor = document.getElementById('fill-color');
if (fillColor) {
  fillColor.addEventListener('input', () => {
    if (!window.selectedElement) return;
    window.selectedElement.color = fillColor.value; // set fill color
    window.drawCanvas(); // redraw canvas
  });
}

// Add color button styling
addColorBtn.textContent = '+';         // just the plus sign
addColorBtn.style.background = '#2a2a2a'; // dark gray
addColorBtn.style.color = '#fff';      // white text
addColorBtn.style.border = 'none';
addColorBtn.style.borderRadius = '4px';
addColorBtn.style.width = '28px';
addColorBtn.style.height = '28px';
addColorBtn.style.fontSize = '18px';
addColorBtn.style.cursor = 'pointer';
addColorBtn.style.display = 'flex';
addColorBtn.style.alignItems = 'center';
addColorBtn.style.justifyContent = 'center';
addColorBtn.style.transition = '0.2s';

// Hover effect
addColorBtn.addEventListener('mouseenter', () => addColorBtn.style.background = '#3a3a3a');
addColorBtn.addEventListener('mouseleave', () => addColorBtn.style.background = '#2a2a2a');

// Create color input wrapper (same as before)
function createColorInput(color = '#ffffff') {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '4px';

  const input = document.createElement('input');
  input.type = 'color';
  input.value = color;
  input.style.width = '28px';
  input.style.height = '28px';
  input.style.border = 'none';
  input.style.padding = '0';
  input.style.cursor = 'pointer';

  const remove = document.createElement('button');
  remove.textContent = '×';
  remove.style.color = '#f87171';
  remove.style.border = 'none';
  remove.style.background = 'transparent';
  remove.style.cursor = 'pointer';
  remove.style.fontSize = '18px';
  remove.addEventListener('click', () => wrapper.remove());

  wrapper.append(input, remove);
  return wrapper;
}


  // Function to update gradient UI based on checkbox
// Function to update gradient UI based on checkbox
function updateGradientUI() {
  const enabled = useGradient.checked;
  gradientOptions.style.display = enabled ? 'flex' : 'none';
  fillColor.disabled = enabled;

  // Add first gradient color if none exists
  if (enabled && gradientContainer.querySelectorAll('input[type=color]').length === 0) {
    gradientContainer.insertBefore(createColorInput('#ffffff'), addColorBtn); // default white
  }
}

// Attach single listener
useGradient.addEventListener('change', updateGradientUI);

// Set initial state immediately
updateGradientUI();


  // Add color button logic
  addColorBtn.addEventListener('click', () => gradientContainer.insertBefore(createColorInput(), addColorBtn));
}
      }); // <-- closes btn.addEventListener('click', ...
  }); // <-- closes forEach loop
});