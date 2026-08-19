document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // ===== Global references =====
  window.canvas = canvas;
  window.ctx = ctx;
  window.elementsOnCanvas = window.elementsOnCanvas || [];
  window.selectedElement = window.selectedElement || null;
  window.currentTool = window.currentTool || null;
  window.defaultSize = window.defaultSize || { width: 50, height: 50 }; // smaller default

  const handleSize = 10;
  let isDragging = false;
  let isResizing = false;
  let isRotating = false;
  let activeHandle = null;
  let aspectRatio = 1;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const defaultColor = '#535353ff';

  // ===== Draw a single element =====
window.drawElement = function(el) {
  ctx.save();
  ctx.translate(el.x, el.y);
  ctx.rotate(el.rotation || 0);
  ctx.fillStyle = el.color || defaultColor;
  ctx.strokeStyle = el.color || defaultColor;

  switch(el.type) {
    case 'circle':
      ctx.beginPath();
      ctx.ellipse(0, 0, el.width/2, el.height/2, 0, 0, Math.PI*2);
      ctx.fill();
      break;

    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -el.height/2);
      ctx.lineTo(-el.width/2, el.height/2);
      ctx.lineTo(el.width/2, el.height/2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'line':
      ctx.beginPath();
      ctx.moveTo(-el.width/2, 0);
      ctx.lineTo(el.width/2, 0);
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 'star':
      // Simple 5-point star
      const spikes = 5;
      const outerRadius = el.width/2;
      const innerRadius = el.width/4;
      let rot = Math.PI / 2 * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(0, -outerRadius);
      for(let i = 0; i < spikes; i++){
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
      break;

    case 'textbox':
    case 'label':
      ctx.font = `${Math.max(el.height/2, 12)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.text || el.name || el.type, 0, 0);
      break;

    default:
      ctx.fillRect(-el.width/2, -el.height/2, el.width, el.height);
  }

  ctx.restore();
};

  // ===== Highlight =====
  window.highlightElement = function(el, duration = 100) {
    window.highlightTarget = el;
    window.highlightEndTime = Date.now() + duration;
  };

  // ===== Draw transform handles =====
window.drawHandles = function(el) {
  if (!el || !window.ctx) return;
  const ctx = window.ctx;
  const w2 = el.width / 2;
  const h2 = el.height / 2;

  const positions = {
    n:  { x: 0,   y: -h2 },
    s:  { x: 0,   y:  h2 },
    w:  { x: -w2, y: 0 },
    e:  { x:  w2, y: 0 },
    nw: { x: -w2, y: -h2 },
    ne: { x:  w2, y: -h2 },
    sw: { x: -w2, y:  h2 },
    se: { x:  w2, y:  h2 }
  };

  ctx.save();

  // Draw connecting lines (red)
  ctx.strokeStyle = '#ffffffff'; // 6-digit hex works
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(positions.nw.x, positions.nw.y);
  ctx.lineTo(positions.ne.x, positions.ne.y);
  ctx.lineTo(positions.se.x, positions.se.y);
  ctx.lineTo(positions.sw.x, positions.sw.y);
  ctx.closePath();
  ctx.stroke();

  // Draw handles (white)
  ctx.fillStyle = '#ffffff'; // 6-digit hex for white
  for (let key in positions) {
    const pos = positions[key];
    ctx.fillRect(pos.x - handleSize/2, pos.y - handleSize/2, handleSize, handleSize);
  }

  ctx.restore();
};

  // ===== Coordinate Conversion =====
  window.toLocalCoords = function(px, py, el) {
    const dx = px - el.x;
    const dy = py - el.y;
    const cos = Math.cos(-el.rotation);
    const sin = Math.sin(-el.rotation);
    return { x: dx*cos - dy*sin, y: dx*sin + dy*cos };
  };

  // ===== Main draw loop =====
  window.drawCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof drawGrid === 'function') drawGrid();

    for (const el of window.elementsOnCanvas) {
      window.drawElement(el);

      if (window.highlightTarget === el && Date.now() < window.highlightEndTime) {
        const pulse = Math.sin(Date.now()/150)*1+2;
        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.rotation);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = pulse;
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 10;
        ctx.strokeRect(-el.width/2, -el.height/2, el.width, el.height);
        ctx.restore();
      }
    }

    if (window.selectedElement) {
      const el = window.selectedElement;
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate(el.rotation);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(-el.width/2, -el.height/2, el.width, el.height);
      window.drawHandles(el);
      ctx.restore();
    }

    if (window.highlightTarget && Date.now() >= window.highlightEndTime) window.highlightTarget = null;

    requestAnimationFrame(window.drawCanvas);
  };

  // ===== Mouse events =====
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  activeHandle = null;
  isResizing = false;
  isDragging = false;

  let clickedOnElement = false;

  // Check elements from topmost to bottom
  for (let i = window.elementsOnCanvas.length - 1; i >= 0; i--) {
    const el = window.elementsOnCanvas[i];
    const w2 = el.width / 2, h2 = el.height / 2;

    // Check if clicked on a handle first
    const handlePositions = {
      n:  { x: el.x,     y: el.y - h2 },
      s:  { x: el.x,     y: el.y + h2 },
      w:  { x: el.x - w2,y: el.y     },
      e:  { x: el.x + w2,y: el.y     },
      nw: { x: el.x - w2,y: el.y - h2 },
      ne: { x: el.x + w2,y: el.y - h2 },
      sw: { x: el.x - w2,y: el.y + h2 },
      se: { x: el.x + w2,y: el.y + h2 }
    };

    let clickedHandle = false;
    for (let key in handlePositions) {
      const pos = handlePositions[key];
      if (mx > pos.x - handleSize && mx < pos.x + handleSize &&
          my > pos.y - handleSize && my < pos.y + handleSize) {
        window.selectedElement = el;
        activeHandle = key;
        isResizing = true;
        clickedOnElement = true;
        clickedHandle = true;
        break;
      }
    }
    if (clickedHandle) break;

    // Check if clicked inside element body
    const local = window.toLocalCoords(mx, my, el);
    if (local.x > -w2 && local.x < w2 && local.y > -h2 && local.y < h2) {
      window.selectedElement = el;
      isDragging = true;
      dragOffsetX = local.x;
      dragOffsetY = local.y;
      clickedOnElement = true;
      break;
    }
  }

  // If clicked on background, deselect
  if (!clickedOnElement) {
    window.selectedElement = null;
  }
});

canvas.addEventListener('mousemove', e => {
  if (!window.selectedElement) return;
  const el = window.selectedElement;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (isDragging) {
    const cos = Math.cos(el.rotation);
    const sin = Math.sin(el.rotation);
    el.x = mx - (dragOffsetX*cos - dragOffsetY*sin);
    el.y = my - (dragOffsetX*sin + dragOffsetY*cos);
  }

  if (isResizing && activeHandle) {
    const local = window.toLocalCoords(mx, my, el);
    const w2 = el.width/2;
    const h2 = el.height/2;
    let newW = el.width;
    let newH = el.height;
    let offsetX = 0;
    let offsetY = 0;
    const free = e.shiftKey; // free resize

    switch(activeHandle){
      case 'e':
        newW = Math.max(10, local.x + w2);
        if(!free) newH = newW * el.height / el.width;
        break;
      case 'w':
        newW = Math.max(10, w2 - local.x);
        if(!free) newH = newW * el.height / el.width;
        offsetX = (el.width - newW)/2;
        break;
      case 's':
        newH = Math.max(10, local.y + h2);
        if(!free) newW = newH * el.width / el.height;
        break;
      case 'n':
        newH = Math.max(10, h2 - local.y);
        if(!free) newW = newH * el.width / el.height;
        offsetY = (el.height - newH)/2;
        break;
      case 'nw':
        newW = Math.max(10, w2 - local.x);
        newH = Math.max(10, h2 - local.y);
        if(!free){
          const scale = Math.max(newW/el.width, newH/el.height);
          newW = el.width * scale;
          newH = el.height * scale;
        }
        offsetX = (el.width - newW)/2;
        offsetY = (el.height - newH)/2;
        break;
      case 'ne':
        newW = Math.max(10, local.x + w2);
        newH = Math.max(10, h2 - local.y);
        if(!free){
          const scale = Math.max(newW/el.width, newH/el.height);
          newW = el.width * scale;
          newH = el.height * scale;
        }
        offsetY = (el.height - newH)/2;
        break;
      case 'sw':
        newW = Math.max(10, w2 - local.x);
        newH = Math.max(10, local.y + h2);
        if(!free){
          const scale = Math.max(newW/el.width, newH/el.height);
          newW = el.width * scale;
          newH = el.height * scale;
        }
        offsetX = (el.width - newW)/2;
        break;
      case 'se':
        newW = Math.max(10, local.x + w2);
        newH = Math.max(10, local.y + h2);
        if(!free){
          const scale = Math.max(newW/el.width, newH/el.height);
          newW = el.width * scale;
          newH = el.height * scale;
        }
        break;
    }

    el.width = newW;
    el.height = newH;
    el.x += offsetX;
    el.y += offsetY;
  }
});


canvas.addEventListener('mouseup', () => {
  isDragging = isResizing = false;
  activeHandle = null;
});


  canvas.addEventListener('mousemove', e => {
    if (!window.selectedElement) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const el = window.selectedElement;

    if (isDragging) {
      const cos = Math.cos(el.rotation);
      const sin = Math.sin(el.rotation);
      el.x = mx - (dragOffsetX*cos - dragOffsetY*sin);
      el.y = my - (dragOffsetX*sin + dragOffsetY*cos);
    }
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = isResizing = isRotating = false;
    activeHandle = null;
  });

  // ===== Add elements from panel =====
  document.querySelectorAll('#elementsPanel button').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.element;
      if (!type) return;

      const exists = window.elementsOnCanvas.find(el => el.type === type);
      if (exists) {
        window.selectedElement = exists;
        return;
      }

    const el = {
  type,
  name: type,
  x: canvas.width/2,
  y: canvas.height/2,
  width: window.defaultSize.width,
  height: window.defaultSize.height,
  color: defaultColor,
  rotation: 0,
  text: type === 'label' ? 'Label' : (type === 'textbox' ? 'Text' : '')
};

      window.elementsOnCanvas.push(el);
      window.selectedElement = el;
    });
  });

  // ===== Start draw loop =====
  window.drawCanvas();
});
canvas.addEventListener('dblclick', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (!window.selectedElement) return;
  const el = window.selectedElement;

  // Only editable types
  if (el.type !== 'label' && el.type !== 'textbox') return;

  // Convert to local coords
  const local = window.toLocalCoords(mx, my, el);
  if (local.x < -el.width/2 || local.x > el.width/2 || local.y < -el.height/2 || local.y > el.height/2) return;

  // Create HTML input
  const input = document.createElement('input');
  input.type = 'text';
  input.value = el.text;
  input.style.position = 'absolute';
  input.style.left = (el.x - el.width/2 + rect.left) + 'px';
  input.style.top = (el.y - el.height/2 + rect.top) + 'px';
  input.style.width = el.width + 'px';
  input.style.height = el.height + 'px';
  input.style.fontSize = Math.max(el.height/2, 12) + 'px';
  input.style.textAlign = 'center';
  input.style.color = el.color || '#000';
  input.style.background = 'rgba(255,255,255,0.1)';
  input.style.border = '1px solid #888';
  input.style.outline = 'none';
  input.style.zIndex = 1000;

  document.body.appendChild(input);
  input.focus();

  const finishEdit = (apply) => {
    if (apply) el.text = input.value;
    document.body.removeChild(input);
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finishEdit(true);
    else if (e.key === 'Escape') finishEdit(false);
  });

  input.addEventListener('blur', () => finishEdit(true));
});
