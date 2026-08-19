// --- Table Modal ---
const tableModal = document.getElementById('tableModal');
const closeTableModal = document.getElementById('closeTableModal');
const insertTableBtn = document.getElementById('insertTableBtn');
const insertTableConfirm = document.getElementById('insertTableConfirm');
const tableRowsInput = document.getElementById('tableRows');
const tableColsInput = document.getElementById('tableCols');
const tablePreview = document.getElementById('tablePreview');
insertTableBtn.addEventListener('click', () => { tableModal.style.display = 'flex'; updateTablePreview(); });
closeTableModal.addEventListener('click', () => tableModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === tableModal) tableModal.style.display = 'none'; });
[tableRowsInput, tableColsInput].forEach(i => i.addEventListener('input', updateTablePreview));
function updateTablePreview() {
  const rows = Math.max(1, parseInt(tableRowsInput.value) || 1);
  const cols = Math.max(1, parseInt(tableColsInput.value) || 1);
  tablePreview.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
  tablePreview.innerHTML = '';
  for (let i = 0; i < rows * cols; i++) tablePreview.appendChild(document.createElement('div'));
}
insertTableConfirm.addEventListener('click', () => {
  const rows = parseInt(tableRowsInput.value) || 1;
  const cols = parseInt(tableColsInput.value) || 1;
  const tableWidth = 400, tableHeight = 200;
  const cellW = tableWidth / cols, cellH = tableHeight / rows;
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
  for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(50, 50 + r * cellH); ctx.lineTo(50 + tableWidth, 50 + r * cellH); ctx.stroke(); }
  for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(50 + c * cellW, 50); ctx.lineTo(50 + c * cellW, 50 + tableHeight); ctx.stroke(); }
  tableModal.style.display = 'none';
});



