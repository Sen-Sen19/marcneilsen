// EVENT 07 — BLACKOUT: dark + light radius around player + spikes on platforms
Events[7] = {
  name: 'BLACKOUT', color: 0x4444ff, labelColor: '#4488ff',
  description: 'FIND THE DIAMOND IN THE DARK',
  _layer:null, _timer:0, _spikes:[],

  start(layer, W, H, gs, platforms, floorY) {
    this._layer = layer; this._timer = 0; this._spikes = [];
    // Place spikes on platform tops
    if (platforms) {
      for (const p of platforms) {
        const count = Math.floor(p.pw / 22);
        for (let i = 0; i < count; i++) {
          const sx = p.x + 10 + i * 22 + Math.random() * 6;
          this._spikes.push({ x: sx, y: p.y, size: 9 + Math.random() * 5 });
        }
      }
    }
    // Floor spikes
    const fc = Math.floor(W / 28);
    for (let i = 0; i < fc; i++) {
      this._spikes.push({ x: 14 + i * 28 + Math.random()*10, y: floorY || H-20, size: 10 });
    }
  },

  update(dt, W, H, gs, plats, floorY, px, py) {
    this._timer++;
    this._layer.clear();

    // Full dark overlay
    this._layer.beginFill(0x000005, 0.94);
    this._layer.drawRect(0, 0, W, H);
    this._layer.endFill();

    // Spikes (drawn through darkness — they're part of dark world)
    for (const s of this._spikes) {
      this._layer.beginFill(0xcc2200, 0.9);
      this._layer.moveTo(s.x,            s.y);
      this._layer.lineTo(s.x - s.size/2, s.y + s.size);
      this._layer.lineTo(s.x + s.size/2, s.y + s.size);
      this._layer.closePath(); this._layer.endFill();
    }

    // Light radius around player — punch a "hole" by overdrawing bright area
    if (px !== undefined) {
      const cx = px + 9, cy = py + 12;
      const lightR = 75;
      // Gradient rings from bright center to dark
      for (let r = lightR; r > 0; r -= 5) {
        const a = (1 - r / lightR) * 0.22;
        this._layer.beginFill(0xffffff, a);
        this._layer.drawCircle(cx, cy, r);
        this._layer.endFill();
      }
    }
  },

  getHazards() {
    return this._spikes.map(s => ({
      x: s.x - s.size/2, y: s.y - s.size, w: s.size, h: s.size
    }));
  },
  stop() { this._spikes = []; if (this._layer) this._layer.clear(); }
};
