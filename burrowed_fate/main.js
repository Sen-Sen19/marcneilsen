import { hawk, initHawk, findPath, moveHawk } from "./hawk.js";
import { generateWalls, generateGrid, walls, cellSize } from "./wall.js";
import { rabbit, initRabbit, moveRabbit, saveBrain, exportBrain, importBrain } from "./rabbit.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

generateWalls(canvas);
const grid = generateGrid(canvas, hawk.size);
initHawk(canvas, grid);
await initRabbit(canvas, grid);

let pointer = null;
let startTime = performance.now();
let survivalTime = 0;

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const target = { x: Math.floor(x / cellSize), y: Math.floor(y / cellSize) };
  if (grid[target.y] && grid[target.y][target.x] === 0) {
    const start = { x: Math.floor(hawk.x / cellSize), y: Math.floor(hawk.y / cellSize) };
    hawk.path = findPath(grid, start, target);
    pointer = { x, y, alpha: 1 };
  }
});

document.addEventListener("keydown", async (e) => {
  if (e.key === "s") await saveBrain();
  if (e.key === "e") await exportBrain();
  if (e.key === "i") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      if (input.files[0]) await importBrain(input.files[0]);
    };
    input.click();
  }
});

function checkTag() {
  const dist = Math.hypot(hawk.x - rabbit.x, hawk.y - rabbit.y);
  if (dist < hawk.size + rabbit.size) {
    startTime = performance.now();
  }
}

function drawTimer() {
  ctx.fillStyle = "#222";
  ctx.font = "20px monospace";
  ctx.fillText(`Survival: ${survivalTime.toFixed(1)}s`, 20, 30);
  ctx.fillText(`(S) Save  (E) Export  (I) Import`, 20, 55);
}

function fadePointer() {
  if (pointer) {
    pointer.alpha -= 0.01;
    if (pointer.alpha <= 0) pointer = null;
  }
}

function drawPointer() {
  if (!pointer) return;
  ctx.save();
  ctx.globalAlpha = pointer.alpha;
  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,80,80,0.8)";
  ctx.fill();
  ctx.restore();
}

function drawWalls() {
  ctx.fillStyle = "#444";
  for (const wall of walls) {
    ctx.beginPath();
    const pts = wall.points;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fill();
  }
}

function drawHawk() {
  ctx.fillStyle = hawk.color;
  ctx.beginPath();
  ctx.arc(hawk.x, hawk.y, hawk.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawRabbit() {
  ctx.fillStyle = "#a8ffb0";
  ctx.beginPath();
  ctx.arc(rabbit.x, rabbit.y, rabbit.size, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  moveHawk();
  moveRabbit(hawk);     // <-- rabbit thinks and moves (avoids hawk)
  fadePointer();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWalls();
  drawRabbit(ctx);      // draw rabbit
  drawHawk();
  drawPointer();

  requestAnimationFrame(update);
}

update();
