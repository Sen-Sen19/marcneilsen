// ════════════════════════════════════════════
//  EVENT 08 — HOMING MISSILES
//  Missiles slowly home in on player position
// ════════════════════════════════════════════
Events[8] = {
  name: 'HOMING MISSILES',
  color: 0xff0066,
  labelColor: '#ff0066',
  description: 'OUTRUN THE LOCK',

  _missiles: [],
  _layer: null,
  _timer: 0,
  _spawnInterval: 100,

  start(layer, W, H) {
    this._layer = layer;
    this._missiles = [];
    this._timer = 0;
  },

  _spawnMissile(W, H) {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * W; y = -20; }
    else if (edge === 1) { x = Math.random() * W; y = H + 20; }
    else if (edge === 2) { x = -20; y = Math.random() * H; }
    else { x = W + 20; y = Math.random() * H; }

    this._missiles.push({ x, y, vx: 0, vy: 0, angle: 0, trail: [] });
  },

  update(dt, W, H, gameState, platforms, floorY, playerX, playerY) {
    this._timer++;
    if (this._timer % this._spawnInterval === 0) this._spawnMissile(W, H);

    this._layer.clear();

    const px = playerX ?? W / 2;
    const py = playerY ?? H / 2;

    for (let i = this._missiles.length - 1; i >= 0; i--) {
      const m = this._missiles[i];

      // Home toward player
      const dx = px - m.x, dy = py - m.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetAngle = Math.atan2(dy, dx);
      // Lerp angle
      let da = targetAngle - m.angle;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      m.angle += da * 0.06;
      const speed = 3.5;
      m.vx = Math.cos(m.angle) * speed;
      m.vy = Math.sin(m.angle) * speed;
      m.x += m.vx; m.y += m.vy;

      // Trail
      m.trail.push({ x: m.x, y: m.y });
      if (m.trail.length > 18) m.trail.shift();

      // Draw trail
      for (let t = 0; t < m.trail.length; t++) {
        const alpha = (t / m.trail.length) * 0.5;
        this._layer.beginFill(0xff0066, alpha);
        this._layer.drawCircle(m.trail[t].x, m.trail[t].y, 3 * (t / m.trail.length));
        this._layer.endFill();
      }

      // Draw missile body
      this._layer.beginFill(0xff4488, 0.95);
      const bx = m.x + Math.cos(m.angle) * 10;
      const by = m.y + Math.sin(m.angle) * 10;
      const lx = m.x - Math.cos(m.angle) * 8;
      const ly = m.y - Math.sin(m.angle) * 8;
      const ox = Math.cos(m.angle + Math.PI / 2) * 4;
      const oy = Math.sin(m.angle + Math.PI / 2) * 4;
      this._layer.moveTo(bx, by);
      this._layer.lineTo(lx + ox, ly + oy);
      this._layer.lineTo(lx - ox, ly - oy);
      this._layer.closePath();
      this._layer.endFill();

      // Lock-on ring when close
      if (dist < 120) {
        const ringAlpha = 0.4 * (1 - dist / 120);
        this._layer.lineStyle(1, 0xff0066, ringAlpha);
        this._layer.drawCircle(m.x, m.y, 20 + Math.sin(this._timer * 0.2) * 5);
      }

      // Remove if out of bounds
      if (m.x < -60 || m.x > W + 60 || m.y < -60 || m.y > H + 60) {
        this._missiles.splice(i, 1);
      }
    }
  },

  getHazards() {
    return this._missiles.map(m => ({ x: m.x - 8, y: m.y - 8, w: 16, h: 16 }));
  },

  stop() {
    this._missiles = [];
    if (this._layer) this._layer.clear();
  }
};
