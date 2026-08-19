// ===== Elements Panel =====
const elementsBtn = document.getElementById('elementsBtn');
const elementsPanel = document.getElementById('elementsPanel');
const appearanceBtn = document.getElementById('appearanceBtn');
const appearancePanel = document.getElementById('appearancePanel');

// ===== Use globals from canva.js =====
let activeHandle = null;
let isResizing = false;
const handleSize = 10;
let transformMode = false;

const elementsOnCanvas = window.elementsOnCanvas || [];
let selectedElement = window.selectedElement || null;

// Use canva.js defaultSize if available, else fallback
const defaultSize = window.defaultSize || { width: 50, height: 50 };

// ===== Panel Toggle =====
function togglePanel(button, panel) {
  const isOpen = panel.style.display === 'flex';
  elementsPanel.style.display = 'none';
  appearancePanel.style.display = 'none';
  if (!isOpen) {
    const rect = button.getBoundingClientRect();
    panel.style.top = rect.bottom + 5 + 'px';
    panel.style.left = rect.left + 'px';
    if (panel.getBoundingClientRect().right > window.innerWidth) {
      panel.style.left = (window.innerWidth - panel.offsetWidth - 10) + 'px';
    }
    panel.style.display = 'flex';
  }
}

elementsBtn.addEventListener('click', e => { e.stopPropagation(); togglePanel(elementsBtn, elementsPanel); });
appearanceBtn.addEventListener('click', e => { e.stopPropagation(); togglePanel(appearanceBtn, appearancePanel); });
document.addEventListener('click', () => {
  elementsPanel.style.display = 'none';
  appearancePanel.style.display = 'none';
});

// ===== Layer Management =====
let isRenamingIndex = null;

function updateLayersPanel() {
  const layersList = document.getElementById('layerList');
  if (!layersList) return;

  layersList.innerHTML = '';

  elementsOnCanvas.forEach((el, i) => {
    const item = document.createElement('li');
    item.className = 'layer-item';
    item.dataset.index = i;

    const btn = document.createElement('button');
    btn.style.cssText = `
      display: flex;
      align-items: center;
      width: 100%;
      border: none;
      padding: 6px 10px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      background: ${selectedElement === el ? '#7dd3fc' : '#2d2d2d'};
      color: ${selectedElement === el ? '#000' : '#fff'};
    `;

    if (isRenamingIndex === i) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = el.name || (el.type + (el.text ? `: ${el.text}` : ''));
      input.style.cssText = `
        width: 85%;
        font-size: 14px;
        padding: 4px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #1e1e1e;
        color: #fff;
      `;
      btn.textContent = '';
      btn.appendChild(input);
      input.focus();

      const finishRename = (apply) => {
        if (apply) el.name = input.value.trim() || el.type;
        isRenamingIndex = null;
        updateLayersPanel();
        window.drawCanvas();
      };

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') finishRename(true);
        else if (e.key === 'Escape') finishRename(false);
      });

      document.addEventListener('click', e => {
        if (!input.contains(e.target)) finishRename(true);
      }, { once: true });
    } else {
      btn.textContent = el.name || (el.type + (el.text ? `: ${el.text}` : ''));

      btn.addEventListener('click', () => {
        if (isRenamingIndex !== null && isRenamingIndex !== i) isRenamingIndex = null;
        selectedElement = el;
        window.selectedElement = el;
        window.highlightElement(el, 1000);
        updateLayersPanel();
      });

      btn.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        isRenamingIndex = i;
        updateLayersPanel();
      });
    }

    item.appendChild(btn);
    layersList.appendChild(item);
  });
}

// ===== Key Press: Toggle Transform Mode =====
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 't' && selectedElement) {
    transformMode = !transformMode;
    window.drawCanvas();
  }
});

elementsPanel.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const type = btn.dataset.element;
    if (!type) return;

const exists = elementsOnCanvas.some(el => el.type === type);
if (exists) {
  selectedElement = elementsOnCanvas.find(el => el.type === type);
  window.selectedElement = selectedElement;
  window.drawCanvas();
  updateLayersPanel();
  
  elementsPanel.style.display = 'none'; // << auto-close
  return;
}

    const newEl = {
      type,
      x: window.canvas.width / 2,
      y: window.canvas.height / 2,
      width: defaultSize.width,
      height: defaultSize.height,
      rotation: 0,
      color: '#e70202ff',
      text: type === 'textbox' ? 'Text' : '',
      name: type === 'label' ? 'Label' : ''
    };

elementsOnCanvas.push(newEl);
selectedElement = newEl;
window.selectedElement = newEl;
window.drawCanvas();
updateLayersPanel();

elementsPanel.style.display = 'none'; // << auto-close
  });
});


// ===== Initial Layer Panel =====
updateLayersPanel();
