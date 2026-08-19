// ===========================
// Generate HTML/CSS
// ===========================
const generateBtn = document.getElementById('generateBtn');
const generateModal = document.getElementById('generateModal');
const closeGenerateModal = document.getElementById('closeGenerateModal');
const generatedHtml = document.getElementById('generatedHtml');
const generatedCss = document.getElementById('generatedCss');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const exportCodeBtn = document.getElementById('exportCodeBtn');
// ===========================
// Generate HTML/CSS
// ===========================
function generateFromCanvas() {
  let htmlCode = `<div class="canvas-container"></div>\n`;
  let cssCode = `html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
}

.canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${bgColorInput.value};
}\n\n`;

  elementsOnCanvas.forEach((el, index) => {
    const isFullWidth = el.width >= canvas.width - 1;
    const isFullHeight = el.height >= canvas.height - 1;

    htmlCode += `<div class="el-${index}"></div>\n`;

   
    let left = el.x;
    let top = el.y;
    let transform = 'translate(-50%, -50%)';

    if (isFullWidth) left = 0;
    if (isFullHeight) top = 0;
    if (isFullWidth && isFullHeight) transform = ''; 
    else if (isFullWidth) transform = 'translateY(-50%)';
    else if (isFullHeight) transform = 'translateX(-50%)';

    cssCode += `.el-${index} {
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  width: ${el.width}px;
  height: ${el.height}px;
  background: ${el.color};
  border-radius: ${el.type === 'circle' ? '50%' : (el.radius || 0) + 'px'};
  ${transform ? `transform: ${transform};` : ''}
}\n\n`;
  });

  return { htmlCode, cssCode };
}




function getCombinedCode() {
  const { htmlCode, cssCode } = generateFromCanvas();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${cssCode}
</style>
</head>
<body>
${htmlCode}
</body>
</html>`;
}

// ===========================
// Modal & Buttons
// ===========================
generateBtn.addEventListener('click', () => {
  const { htmlCode, cssCode } = generateFromCanvas();
  generatedHtml.textContent = htmlCode;
  generatedCss.textContent = cssCode;
  Prism.highlightAll();
  generateModal.style.display = 'flex';
});

closeGenerateModal.addEventListener('click', () => {
  generateModal.style.display = 'none';
});

copyCodeBtn.addEventListener('click', () => {
  const combinedCode = getCombinedCode();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(combinedCode)
      .then(() => alert('Code copied to clipboard!'))
      .catch(() => fallbackCopy(combinedCode));
  } else fallbackCopy(combinedCode);
});

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand('copy'); alert('Code copied to clipboard!'); }
  catch (err) { alert('Failed to copy code: ' + err); }
  document.body.removeChild(textarea);
}

exportCodeBtn.addEventListener('click', () => {
  const combinedCode = getCombinedCode();
  const blob = new Blob([combinedCode], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported_code.html';
  a.click();
  URL.revokeObjectURL(url);
});
