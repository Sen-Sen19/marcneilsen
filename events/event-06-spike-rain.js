// ════════════════════════════════════════════
//  EVENT 06 — SPIKE RAIN
//  Spikes fall and stick to platforms/floor,
//  accumulating danger zones
// ════════════════════════════════════════════
Events[6] = {
  name: 'SPIKE RAIN',
  color: 0xff6600,
  labelColor: '#ff6600',
  description: 'SPIKES STICK!',

  _falling: [],
  _stuck: [],
  _layer: null,
  _timer: 0,

  start(layer, W, H) {
    this._layer = layer;
    this._falling = [];
    this._stuck = [];
    this._timer = 0;
  },

  _spawnSpike(W) {
    this._falling.push({
      x: 10 + Math.random() * (W - 20),
      y: -20,
      vy: 4 + Math.random() * 4,
      size: 10 + Math.random() * 8,
    });
  },

  update(dt, W, H, gameState, platformList, floorY) {
    this._timer++;
    if (this._timer % 18 === 0) this._spawnSpike(W);

    this._layer.clear();

    const floor = floorY || H - 20;

    // Falling spikes
    for (let i = this._falling.length - 1; i >= 0; i--) {
      const s = this._falling[i];
      s.y += s.vy;

      let landed = false;
      // Check floor
      if (s.y + s.size >= floor) {
        s.y = floor - s.size;
        landed = true;
      }
      // Check platforms
      if (platformList) {
        for (const p of platformList) {
          if (s.x > p.x && s.x < p.x + p.pw && s.y + s.size >= p.y && s.y + s.size <= p.y + p.ph + 10) {
            s.y = p.y - s.size;
            landed = true;
            break;
          }
        }
      }

      if (landed) {
        this._stuck.push({ x: s.x, y: s.y, size: s.size });
        this._falling.splice(i, 1);
        continue;
      }

      // Draw falling spike (triangle pointing down)
      this._layer.beginFill(0xff6600, 0.9);
      this._layer.moveTo(s.x, s.y + s.size);
      this._layer.lineTo(s.x - s.size / 2, s.y);
      this._layer.lineTo(s.x + s.size / 2, s.y);
      this._layer.closePath();
      this._layer.endFill();
    }

    // Draw stuck spikes
    for (const s of this._stuck) {
      this._layer.beginFill(0xcc3300, 0.95);
      this._layer.moveTo(s.x, s.y + s.size);
      this._layer.lineTo(s.x - s.size / 2, s.y);
      this._layer.lineTo(s.x + s.size / 2, s.y);
      this._layer.closePath();
      this._layer.endFill();
      this._layer.lineStyle(1, 0xff6600, 0.6);
      this._layer.moveTo(s.x, s.y + s.size);
      this._layer.lineTo(s.x - s.size / 2, s.y);
      this._layer.lineTo(s.x + s.size / 2, s.y);
      this._layer.closePath();
    }
  },

  getHazards() {
    const all = [...this._falling, ...this._stuck];
    return all.map(s => ({ x: s.x - s.size / 2, y: s.y, w: s.size, h: s.size }));
  },

  stop() {
    this._falling = []; this._stuck = [];
    if (this._layer) this._layer.clear();
  }
};
