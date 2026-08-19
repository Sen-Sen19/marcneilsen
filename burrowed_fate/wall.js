// wall.js
export const cellSize = 15;
export const walls = [];

/**
 * Generate naturally shaped walls made of clustered circular blobs
 * with more breathable spacing
 */
export function generateWalls(canvas) {
  walls.length = 0;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = canvas.width;
  ctx.canvas.height = canvas.height;

  // fewer blobs, more space
  const blobCount = 5 + Math.floor(Math.random() * 4); // used to be 10–18

  for (let i = 0; i < blobCount; i++) {
    // spread blobs apart from edges and each other
    const centerX = 100 + Math.random() * (canvas.width - 200);
    const centerY = 100 + Math.random() * (canvas.height - 200);
    const radius = 40 + Math.random() * 60; // smaller radius
    const segments = 5 + Math.floor(Math.random() * 5);
    const blobPoints = [];

    for (let j = 0; j < segments; j++) {
      const angle = (Math.PI * 2 * j) / segments;
      const offset = radius * (0.8 + Math.random() * 0.4);
      const x = centerX + Math.cos(angle) * offset;
      const y = centerY + Math.sin(angle) * offset;
      blobPoints.push({ x, y });
    }

    walls.push({ type: "blob", points: blobPoints });
  }
}

/**
 * Create a grid marking blocked cells near wall blobs
 */
export function generateGrid(canvas, hawkRadius) {
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (const wall of walls) {
    if (wall.type === "blob") {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellX = c * cellSize + cellSize / 2;
          const cellY = r * cellSize + cellSize / 2;
          if (pointInPolygon(cellX, cellY, wall.points)) {
            grid[r][c] = 1;
          }
        }
      }
    }
  }

  return grid;
}

/**
 * Point-in-polygon test for blob collision
 */
function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
