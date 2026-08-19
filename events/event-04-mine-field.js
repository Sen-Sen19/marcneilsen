// ════════════════════════════════════════════
//  EVENT 04 — MINE FIELD
//  Mines slowly drift across the screen,
//  exploding into shrapnel if triggered
// ════════════════════════════════════════════
Events[4] = {
  name: 'MINE FIELD',
  color: 0xffaa00,
  labelColor: '#ffaa00',
  description: 'WATCH YOUR STEP',

  _mines: [],
  _shrapnel: [],
  _layer: null,
  _timer: 0,

  start(layer, W, H) {
    this._layer = layer;
    this._timer = 0;
    this._mines = [];
    this._shrapnel = [];
    // Spawn initial mines
    for (let i = 0; i < 8; i++) this._spawnMine(W, H);
  },

  _spawnMine(W, H) {
    this._mines.push({
      x: Math.random() * W,
      y: 40 + Math.random() * (H - 100),
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 0.8,
      r: 12,
      pulse: Math.random() * Math.PI * 2,
      exploding: false,
      explodeTimer: 0,
    });
  },

  _explode(mine, W, H) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      this._shrapnel.push({
        x: mine.x, y: mine.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0, r: 4,
      });
    }
  },

  update(dt, W, H) {
    this._timer++;
    if (this._timer % 120 === 0) this._spawnMine(W, H);

    this._layer.clear();

    // Update mines
    for (let i = this._mines.length - 1; i >= 0; i--) {
      const m = this._mines[i];
      m.pulse += 0.07;
      m.x += m.vx; m.y += m.vy;

      // Bounce off walls
      if (m.x < m.r || m.x > W - m.r) m.vx *= -1;
      if (m.y < m.r || m.y > H - m.r) m.vy *= -1;

      const pulseR = m.r + Math.sin(m.pulse) * 2;

      // Glow
      this._layer.beginFill(0xffaa00, 0.1);
      this._layer.drawCircle(m.x, m.y, pulseR * 2.5);
      this._layer.endFill();

      // Body
      this._layer.beginFill(0x332200, 1);
      this._layer.drawCircle(m.x, m.y, pulseR);
      this._layer.endFill();
      this._layer.lineStyle(2, 0xffaa00, 0.9);
      this._layer.drawCircle(m.x, m.y, pulseR);

      // Cross spikes
      this._layer.lineStyle(2, 0xffaa00, 0.7);
      for (let a = 0; a < 4; a++) {
        const angle = (a / 4) * Math.PI * 2 + m.pulse * 0.3;
        this._layer.moveTo(m.x + Math.cos(angle) * pulseR, m.y + Math.sin(angle) * pulseR);
        this._layer.lineTo(m.x + Math.cos(angle) * (pulseR + 6), m.y + Math.sin(angle) * (pulseR + 6));
      }
    }

    // Update shrapnel
    for (let i = this._shrapnel.length - 1; i >= 0; i--) {
      const s = this._shrapnel[i];
      s.x += s.vx; s.y += s.vy;
      s.vy += 0.15;
      s.life -= 0.04;
      if (s.life <= 0) { this._shrapnel.splice(i, 1); continue; }
      this._layer.beginFill(0xff6600, s.life);
      this._layer.drawRect(s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
      this._layer.endFill();
    }
  },

  getHazards() {
    const h = this._mines.map(m => ({ x: m.x - m.r, y: m.y - m.r, w: m.r * 2, h: m.r * 2 }));
    const s = this._shrapnel.map(p => ({ x: p.x - p.r, y: p.y - p.r, w: p.r * 2, h: p.r * 2 }));
    return [...h, ...s];
  },

  stop() {
    this._mines = []; this._shrapnel = [];
    if (this._layer) this._layer.clear();
  }
};
