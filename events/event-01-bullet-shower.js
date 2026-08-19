// ════════════════════════════════════════════
//  EVENT 01 — BULLET SHOWER
//  Hundreds of bullets rain from above at angles
// ════════════════════════════════════════════
Events[1] = {
  name: 'BULLET SHOWER',
  color: 0xff4444,
  labelColor: '#ff4444',
  description: 'DODGE THE RAIN',

  _bullets: [],
  _layer: null,
  _timer: 0,
  _spawnRate: 2,

  start(layer) {
    this._bullets = [];
    this._layer = layer;
    this._timer = 0;
  },

  update(dt, W, H) {
    this._timer++;
    // Spawn bursts
    if (this._timer % this._spawnRate === 0) {
      const count = 4 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 3.5 + Math.random() * 4;
        this._bullets.push({
          x: Math.random() * W,
          y: -10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed * -1,  // downward
          r: 4,
          hue: Math.random() < 0.2 ? 0xffaa00 : 0xff3333,
        });
      }
    }

    // Update & draw
    this._layer.clear();
    for (let i = this._bullets.length - 1; i >= 0; i--) {
      const b = this._bullets[i];
      b.x += b.vx;
      b.y += Math.abs(b.vy) * 1.1; // always go down
      if (b.y > H + 20 || b.x < -20 || b.x > W + 20) {
        this._bullets.splice(i, 1); continue;
      }
      this._layer.beginFill(b.hue, 0.9);
      this._layer.drawCircle(b.x, b.y, b.r);
      this._layer.endFill();
      // Trail
      this._layer.beginFill(b.hue, 0.25);
      this._layer.drawCircle(b.x - b.vx * 2, b.y - Math.abs(b.vy) * 2, b.r * 0.6);
      this._layer.endFill();
    }
  },

  getHazards() {
    return this._bullets.map(b => ({ x: b.x - b.r, y: b.y - b.r, w: b.r * 2, h: b.r * 2 }));
  },

  stop() {
    this._bullets = [];
    if (this._layer) this._layer.clear();
  }
};
