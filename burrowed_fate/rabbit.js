// rabbit.js
import { cellSize } from "./wall.js";

/**
 * Smart Rabbit with 3 skills:
 * - Zigzag Juke (short sideways burst)
 * - Dash (fast forward burst)
 * - Decoy Clone (spawns a fake rabbit that runs away)
 *
 * The rabbit "thinks" before using a skill: checks distance, hawk facing,
 * cooldowns, and whether a skill would be useful (e.g. dash when open space ahead).
 */

export const rabbit = {
  x: 0, y: 0,
  vx: 0, vy: 0,
  size: 10,
  baseSpeed: 2,
  speed: 2,
  color: "#9b9beeff",
  fearRadius: 220,
  wanderTimer: 0,

  // skill state + cooldowns (frames)
  juking: false, jukeTimer: 0, jukeCooldown: 0, jukeDir: 1,
  dashing: false, dashTimer: 0, dashCooldown: 0,
  cloning: false, cloneTimer: 0, cloneCooldown: 0,
  

  // other
  lastSafeDir: { x: 1, y: 0 },
  panicTimer: 0,
  currentColor: "#9b9beeff",
};

// small decoy pool (decoys are local to this module)
export const decoys = []; // each decoy: {x,y,vx,vy,life,alpha}

export function initRabbit(canvas, grid) {
  let placed = false;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  // Try to place on open cell
  for (let tries = 0; tries < 5000 && !placed; tries++) {
    const rx = Math.floor(Math.random() * canvas.width);
    const ry = Math.floor(Math.random() * canvas.height);
    const gx = Math.floor(rx / cellSize);
    const gy = Math.floor(ry / cellSize);
    if (grid[gy] && grid[gy][gx] === 0) {
      rabbit.x = rx; rabbit.y = ry;
      placed = true;
    }
  }
  if (!placed) { rabbit.x = canvas.width * 0.2; rabbit.y = canvas.height * 0.5; }
  rabbit.vx = rabbit.vy = 0;
  rabbit.wanderTimer = 0;
  rabbit.currentColor = rabbit.color;
}

/** helper: test grid cell open */
function isCellOpen(grid, px, py) {
  const gx = Math.floor(px / cellSize);
  const gy = Math.floor(py / cellSize);
  return grid[gy] && grid[gy][gx] === 0;
}
/** spawn a decoy that runs directly away from the hawk */
function spawnDecoy(hawk, grid) {
  const dx = rabbit.x - hawk.x;
  const dy = rabbit.y - hawk.y;
  const dist = Math.hypot(dx, dy) || 1;
  const fleeX = dx / dist;
  const fleeY = dy / dist;
  const speed = 3.2; // fast at first, then slows

  const decoy = {
    x: rabbit.x,
    y: rabbit.y,
    vx: fleeX * speed,
    vy: fleeY * speed,
    life: 70, // visible for ~1s
    alpha: 1,
  };
  decoys.push(decoy);
}

/** call each frame to update decoys (visual only) */
function updateDecoys(grid, canvas) {
  for (let i = decoys.length - 1; i >= 0; i--) {
    const d = decoys[i];
    // simple collision with walls: if next cell blocked, reflect a bit
    let nx = d.x + d.vx;
    let ny = d.y + d.vy;
    if (isCellOpen(grid, nx, d.y)) d.x = nx; else d.vx *= -0.4;
    if (isCellOpen(grid, d.x, ny)) d.y = ny; else d.vy *= -0.4;

    d.vx *= 0.98; d.vy *= 0.98;
    d.life--;
    d.alpha = Math.max(0, d.life / 120);
    if (d.life <= 0) decoys.splice(i, 1);
  }
}

/** public draw for decoys (call from your main draw loop or inside drawRabbit) */
function drawDecoys(ctx) {
  for (const d of decoys) {
    ctx.save();
    ctx.globalAlpha = 0.6 * d.alpha;
    ctx.beginPath();
    ctx.fillStyle = "#ffcc99";
    ctx.arc(d.x, d.y, rabbit.size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function moveRabbit(hawk, grid, canvas) {
  // update decoys
  updateDecoys(grid, canvas);

  // cooldown timers
  if (rabbit.jukeCooldown > 0) rabbit.jukeCooldown--;
  if (rabbit.dashCooldown > 0) rabbit.dashCooldown--;
  if (rabbit.cloneCooldown > 0) rabbit.cloneCooldown--;
  if (rabbit.jukeTimer > 0 && rabbit.juking === false) rabbit.jukeTimer = 0;

  const dx = rabbit.x - hawk.x;
  const dy = rabbit.y - hawk.y;
  const dist = Math.hypot(dx, dy) || 0.0001;

  // hawk facing detection
  const hawkMoving = Math.hypot(hawk.vx, hawk.vy) > 0.1;
  let hawkFacingRabbit = false;
  if (hawkMoving) {
    const hawkDir = Math.atan2(hawk.vy, hawk.vx);
    const toRabbitAngle = Math.atan2(dy, dx);
    let angleDiff = Math.abs(hawkDir - toRabbitAngle);
    if (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
    hawkFacingRabbit = angleDiff < Math.PI / 3; // ~60° cone
  }

  let fleeing = false;

  // threat levels
  const closeThreat = dist < rabbit.fearRadius * 0.5;
  const mediumThreat = dist < rabbit.fearRadius * 0.9 && hawkFacingRabbit;

  if (dist < rabbit.fearRadius) {
    fleeing = true;
    rabbit.panicTimer = 40;

    // Clone decoy
    if (!rabbit.cloning && !rabbit.juking && !rabbit.dashing && rabbit.cloneCooldown <= 0 && closeThreat && hawkFacingRabbit && Math.random() < 0.45) {
      rabbit.cloning = true;
      rabbit.cloneTimer = 80;
      rabbit.cloneCooldown = 300 + Math.floor(Math.random() * 120);
      spawnDecoy(hawk, grid);
      rabbit.invisible = true;

      const baseAngle = Math.atan2(dy, dx);
      const offset = (Math.random() < 0.5 ? -1 : 1) * (Math.PI / 3);
      const escapeAngle = baseAngle + offset;
      const fleeX = Math.cos(escapeAngle);
      const fleeY = Math.sin(escapeAngle);
      rabbit.vx += fleeX * rabbit.baseSpeed * 3.5;
      rabbit.vy += fleeY * rabbit.baseSpeed * 3.5;
      rabbit.currentColor = "#9fffff";
    }

    // Invisibility handling
    if (rabbit.invisible) {
      rabbit.cloneTimer--;
      rabbit.vx *= 0.97;
      rabbit.vy *= 0.97;
      if (rabbit.cloneTimer <= 0) {
        rabbit.invisible = false;
        rabbit.cloning = false;
      }
    }

    // Dash skill
    else if (!rabbit.dashing && !rabbit.juking && rabbit.dashCooldown <= 0 && mediumThreat && Math.random() < 0.4) {
      const fdx = dx / dist, fdy = dy / dist;
      const checkX = rabbit.x + fdx * rabbit.size * 3;
      const checkY = rabbit.y + fdy * rabbit.size * 3;
      if (isCellOpen(grid, checkX, checkY)) {
        rabbit.dashing = true;
        rabbit.dashTimer = 22 + Math.floor(Math.random() * 14);
        rabbit.dashCooldown = 180 + Math.floor(Math.random() * 120);
        rabbit.vx += fdx * rabbit.baseSpeed * 4.0;
        rabbit.vy += fdy * rabbit.baseSpeed * 4.0;
      }
    }

    // Juke skill
    else if (!rabbit.juking && rabbit.jukeCooldown <= 0 && closeThreat && Math.random() < 0.6) {
      rabbit.juking = true;
      rabbit.jukeTimer = 18 + Math.floor(Math.random() * 12);
      rabbit.jukeCooldown = 120 + Math.floor(Math.random() * 120);
      rabbit.jukeDir = Math.random() < 0.5 ? -1 : 1;
      const fleeX = dx / dist, fleeY = dy / dist;
      const perpX = -fleeY * rabbit.jukeDir, perpY = fleeX * rabbit.jukeDir;
      rabbit.vx += perpX * rabbit.baseSpeed * 2.8;
      rabbit.vy += perpY * rabbit.baseSpeed * 2.8;
    }
  }

  // Skill timers
  if (rabbit.cloning) { rabbit.cloneTimer--; if (rabbit.cloneTimer <= 0) rabbit.cloning = false; }
  if (rabbit.juking) { rabbit.jukeTimer--; if (rabbit.jukeTimer <= 0) rabbit.juking = false; }
  if (rabbit.dashing) {
    rabbit.dashTimer--;
    if (rabbit.dashTimer > 0) {
      const fleeDirX = dx / dist, fleeDirY = dy / dist;
      rabbit.vx += fleeDirX * rabbit.baseSpeed * 0.35;
      rabbit.vy += fleeDirY * rabbit.baseSpeed * 0.35;
    } else rabbit.dashing = false;
  }

  // Panic movement & fleeing
  if (fleeing) {
    let fleeX = dx / dist, fleeY = dy / dist;
    const panicFactor = Math.min(1, (rabbit.fearRadius - dist) / rabbit.fearRadius);
    const panicSpeed = rabbit.baseSpeed * (1.2 + panicFactor * 1.4);

    // Smart corner/edge avoidance
    const lookAhead = rabbit.size * 2.5;
    let testX = rabbit.x + fleeX * lookAhead;
    let testY = rabbit.y + fleeY * lookAhead;
    if (!isCellOpen(grid, testX, testY) || testX < rabbit.size || testX > canvas.width - rabbit.size || testY < rabbit.size || testY > canvas.height - rabbit.size) {
      for (let i = 0; i < 5; i++) {
        const offset = (i - 2) * (Math.PI / 8);
        const altAngle = Math.atan2(fleeY, fleeX) + offset;
        const altX = Math.cos(altAngle), altY = Math.sin(altAngle);
        const altTestX = rabbit.x + altX * lookAhead;
        const altTestY = rabbit.y + altY * lookAhead;
        if (isCellOpen(grid, altTestX, altTestY)) {
          fleeX = altX;
          fleeY = altY;
          break;
        }
      }
    }

    rabbit.vx += fleeX * panicSpeed * 0.18;
    rabbit.vy += fleeY * panicSpeed * 0.18;

    // Trembling/random jitter
    if (Math.random() < 0.12) {
      rabbit.vx += (Math.random() - 0.5) * 1.2;
      rabbit.vy += (Math.random() - 0.5) * 1.2;
    }

    rabbit.lastSafeDir.x = fleeX;
    rabbit.lastSafeDir.y = fleeY;
  } 
  // Wandering
  else {
    rabbit.wanderTimer--;
    if (rabbit.wanderTimer <= 0) {
      rabbit.wanderTimer = 60 + Math.floor(Math.random() * 120);
      const bias = Math.atan2(rabbit.lastSafeDir.y, rabbit.lastSafeDir.x);
      const angle = bias + (Math.random() - 0.5) * Math.PI / 2;
      rabbit.vx = Math.cos(angle) * rabbit.baseSpeed * 0.45;
      rabbit.vy = Math.sin(angle) * rabbit.baseSpeed * 0.45;
    }
  }

  // Clamp speed
  const maxSpeed = rabbit.baseSpeed * (rabbit.dashing ? 2.4 : (rabbit.juking ? 1.8 : 1.0));
  const curSpd = Math.hypot(rabbit.vx, rabbit.vy);
  if (curSpd > maxSpeed) {
    rabbit.vx = (rabbit.vx / curSpd) * maxSpeed;
    rabbit.vy = (rabbit.vy / curSpd) * maxSpeed;
  }

  // Collision & sliding
  let nextX = rabbit.x + rabbit.vx;
  let nextY = rabbit.y + rabbit.vy;
  const gx = Math.floor(nextX / cellSize);
  const gy = Math.floor(nextY / cellSize);

  const canMoveX = grid[gy] && grid[gy][gx] === 0;
  const canMoveY = grid[Math.floor(nextY / cellSize)] && grid[Math.floor(nextY / cellSize)][gx] === 0;

  if (canMoveX) rabbit.x = nextX; else rabbit.vx *= -0.25;
  if (canMoveY) rabbit.y = nextY; else rabbit.vy *= -0.25;

  // Keep inside canvas
  if (rabbit.x < rabbit.size) { rabbit.x = rabbit.size; rabbit.vx = Math.abs(rabbit.vx) * 0.5; }
  if (rabbit.y < rabbit.size) { rabbit.y = rabbit.size; rabbit.vy = Math.abs(rabbit.vy) * 0.5; }
  if (rabbit.x > canvas.width - rabbit.size) { rabbit.x = canvas.width - rabbit.size; rabbit.vx = -Math.abs(rabbit.vx) * 0.5; }
  if (rabbit.y > canvas.height - rabbit.size) { rabbit.y = canvas.height - rabbit.size; rabbit.vy = -Math.abs(rabbit.vy) * 0.5; }

  // Visual panic color
  const panicIntensity = Math.min(1, (rabbit.fearRadius - dist) / rabbit.fearRadius);
  const rr = Math.floor(255 * panicIntensity);
  const gg = Math.floor(155 * (1 - panicIntensity));
  const bb = Math.floor(155 * (1 - panicIntensity));
  rabbit.currentColor = rabbit.cloning ? "#9fffff" : `rgb(${rr},${gg},${bb})`;

  // Friction
  rabbit.vx *= 0.96;
  rabbit.vy *= 0.96;
}

/** Draw rabbit + decoys (call drawRabbit(ctx) from your main draw) */
export function drawRabbit(ctx) {
  drawDecoys(ctx);

ctx.save();
const alpha = rabbit.invisible ? 0.05 + Math.random() * 0.05 : 1.0;
ctx.globalAlpha = alpha;
ctx.translate(rabbit.x, rabbit.y);


  // rotate lightly to reflect motion direction (visual only)
  const angle = Math.atan2(rabbit.vy, rabbit.vx);
  ctx.rotate(angle);

  // glow when cloning/dashing
  if (rabbit.dashing) {
    ctx.shadowColor = "rgba(255,220,160,0.5)";
    ctx.shadowBlur = 14;
  } else if (rabbit.cloning) {
    ctx.shadowColor = "rgba(160,255,255,0.5)";
    ctx.shadowBlur = 12;
  } else {
    ctx.shadowBlur = 0;
  }

  // body circle
  ctx.beginPath();
  ctx.fillStyle = rabbit.currentColor;
  ctx.arc(0, 0, rabbit.size, 0, Math.PI * 2);
  ctx.fill();

  // face indicator (direction dot)
  ctx.beginPath();
  const faceDist = rabbit.size * 0.6;
  ctx.arc(Math.cos(0) * faceDist, Math.sin(0) * faceDist, 2, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // small skill indicators (tiny icons)
  if (rabbit.juking) {
    ctx.save();
    ctx.translate(-rabbit.size * 0.6, -rabbit.size * 0.9);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(-4, -2, 8, 4);
    ctx.restore();
  }
  if (rabbit.dashing) {
    ctx.save();
    ctx.translate(rabbit.size * 0.8, -rabbit.size * 0.9);
    ctx.fillStyle = "rgba(255,200,120,0.9)";
    ctx.fillRect(-6, -2, 12, 4);
    ctx.restore();
  }
  if (rabbit.cloning) {
    ctx.save();
    ctx.translate(0, -rabbit.size * 1.3);
    ctx.fillStyle = "rgba(160,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

ctx.restore();
ctx.globalAlpha = 1.0; // reset alpha for other objects

}
