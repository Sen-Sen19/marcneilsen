import { cellSize } from "./wall.js";

export const hawk = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  size: 16,
  speed: 3,
  path: [],
  color: "#fff1eeff"
};

export function initHawk(canvas, grid) {
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  let safeSpot = null;
  let attempts = 0;

  while (!safeSpot && attempts < 5000) {
    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);
    if (grid[row] && grid[row][col] === 0) safeSpot = { col, row };
    attempts++;
  }

  if (safeSpot) {
    hawk.x = safeSpot.col * cellSize + cellSize / 2;
    hawk.y = safeSpot.row * cellSize + cellSize / 2;
  } else {
    hawk.x = canvas.width / 2;
    hawk.y = canvas.height / 2;
  }
}
// ---- stylized circle warrior ----
let swordSwing = 0;

export function drawHawk(ctx) {
  ctx.save();

  // rotation based on velocity
  const angle = Math.atan2(hawk.vy, hawk.vx) || 0;
  ctx.translate(hawk.x, hawk.y);
  ctx.rotate(angle);

  const scale = 1.2;

  // --- Body (circle) ---
  const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, hawk.size * scale);
  bodyGrad.addColorStop(0, "#ffffff");
  bodyGrad.addColorStop(1, hawk.color);
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.arc(0, 0, hawk.size * scale, 0, Math.PI * 2);
  ctx.fill();

  // --- Sword ---
const swing = 0;

  ctx.save();
  ctx.rotate(swing);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 3;

  // handle
  ctx.beginPath();
  ctx.moveTo(hawk.size * 0.8, -2);
  ctx.lineTo(hawk.size * 1.4, -2);
  ctx.stroke();

  // blade
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hawk.size * 1.4, 0);
  ctx.lineTo(hawk.size * 2.6, 0);
  ctx.stroke();

  // glow edge
  ctx.strokeStyle = "#00eaff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hawk.size * 2.6, 0);
  ctx.lineTo(hawk.size * 2.9, 0);
  ctx.stroke();

  ctx.restore();

  // --- Aura / outline ---
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.arc(0, 0, hawk.size * scale * 1.1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // swordSwing += 0.2;
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function findPath(grid, start, end) {
  const openSet = [];
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = {};
  const fScore = {};
  const nodeKey = (p) => `${p.x},${p.y}`;

  openSet.push(start);
  gScore[nodeKey(start)] = 0;
  fScore[nodeKey(start)] = heuristic(start, end);

  const directions = [
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 1 }, { x: -1, y: -1 },
    { x: 1, y: -1 }, { x: -1, y: 1 }
  ];

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[nodeKey(a)] - fScore[nodeKey(b)]);
    let current = openSet.shift();

    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let temp = nodeKey(current);
      while (cameFrom.has(temp)) {
        path.push(current);
        current = cameFrom.get(temp);
        temp = nodeKey(current);
      }
      return path.reverse();
    }

    closedSet.add(nodeKey(current));

    for (const dir of directions) {
      const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
      const nk = nodeKey(neighbor);
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.y >= grid.length ||
        neighbor.x >= grid[0].length ||
        grid[neighbor.y][neighbor.x] === 1
      ) continue;
      if (closedSet.has(nk)) continue;

      const tentativeG = gScore[nodeKey(current)] + 1;
      if (!openSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)) {
        openSet.push(neighbor);
      } else if (tentativeG >= gScore[nk]) continue;

      cameFrom.set(nk, current);
      gScore[nk] = tentativeG;
      fScore[nk] = gScore[nk] + heuristic(neighbor, end);
    }
  }
  return [];
}

export function moveHawk() {
  if (hawk.path.length > 0) {
    const next = hawk.path[0];
    const tx = next.x * cellSize + cellSize / 2;
    const ty = next.y * cellSize + cellSize / 2;
    const dx = tx - hawk.x;
    const dy = ty - hawk.y;
    const dist = Math.hypot(dx, dy);

    if (dist < hawk.speed) {
      hawk.path.shift();
    } else {
      const desiredVx = (dx / dist) * hawk.speed;
      const desiredVy = (dy / dist) * hawk.speed;
      hawk.vx = hawk.vx * 0.8 + desiredVx * 0.2;
      hawk.vy = hawk.vy * 0.8 + desiredVy * 0.2;
      hawk.x += hawk.vx;
      hawk.y += hawk.vy;
    }
  }
}
