// EVENT 05 — ICE AGE (replaces Wall Crushers)
// Icy slippery floor + spikes everywhere, ice platforms
Events[5] = {
  name: 'ICE AGE', color: 0x88ddff, labelColor: '#88ddff',
  description: 'SLIPPERY. SPIKES EVERYWHERE.',
  _layer:null, _timer:0, _spikes:[], _iceParticles:[],
  _isIceActive: true, // tells main loop to use ice friction

  start(layer, W, H, gs, platforms, floorY) {
    this._layer = layer; this._timer = 0;
    this._spikes = []; this._iceParticles = [];
    if (gs) gs.iceMode = true;

    // Spike clusters on platforms
    if (platforms) {
      for (const p of platforms) {
        const n = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) {
          const sx = p.x + Math.random() * p.pw;
          this._spikes.push({ x: sx, y: p.y, size: 10 + Math.random()*8, onPlatform: true });
        }
      }
    }
    // Floor spikes (dense)
    for (let x = 15; x < W - 15; x += 35 + Math.random()*30) {
      this._spikes.push({ x, y: floorY || H-20, size: 12 + Math.random()*10, onPlatform: false });
    }
    // Hanging spikes from above
    for (let x = 20; x < W - 20; x += 60 + Math.random()*40) {
      this._spikes.push({ x, y: 30, size: 10 + Math.random()*8, flip: true });
    }
  },

  update(dt, W, H) {
    this._timer++;
    this._layer.clear();

    // Ice tint overlay
    this._layer.beginFill(0x88ddff, 0.06 + Math.abs(Math.sin(this._timer * 0.02)) * 0.04);
    this._layer.drawRect(0, 0, W, H);
    this._layer.endFill();

    // Snowflake particles
    if (Math.random() < 0.3) {
      this._iceParticles.push({ x: Math.random()*W, y: -10, vy: 1+Math.random()*2, vx:(Math.random()-.5)*0.8, life:1, r:2+Math.random()*3 });
    }
    for (let i = this._iceParticles.length-1; i>=0; i--) {
      const p = this._iceParticles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      if (p.life <= 0 || p.y > H+10) { this._iceParticles.splice(i,1); continue; }
      this._layer.beginFill(0xaaeeff, p.life * 0.6);
      this._layer.drawCircle(p.x, p.y, p.r * p.life);
      this._layer.endFill();
    }

    // Draw spikes
    for (const s of this._spikes) {
      const flip = s.flip;
      this._layer.beginFill(0xbbeeff, 0.92);
      if (flip) {
        // Hanging from top
        this._layer.moveTo(s.x, s.y);
        this._layer.lineTo(s.x - s.size/2, s.y - s.size);
        this._layer.lineTo(s.x + s.size/2, s.y - s.size);
      } else {
        // Pointing up
        this._layer.moveTo(s.x, s.y - s.size);
        this._layer.lineTo(s.x - s.size/2, s.y);
        this._layer.lineTo(s.x + s.size/2, s.y);
      }
      this._layer.closePath(); this._layer.endFill();
      this._layer.lineStyle(1, 0xffffff, 0.5);
      if (flip) {
        this._layer.moveTo(s.x, s.y);
        this._layer.lineTo(s.x - s.size/2, s.y - s.size);
        this._layer.lineTo(s.x + s.size/2, s.y - s.size);
      } else {
        this._layer.moveTo(s.x, s.y - s.size);
        this._layer.lineTo(s.x - s.size/2, s.y);
        this._layer.lineTo(s.x + s.size/2, s.y);
      }
      this._layer.closePath();
    }
  },

  getHazards() {
    return this._spikes.map(s => {
      if (s.flip) return { x: s.x - s.size/2, y: s.y - s.size, w: s.size, h: s.size };
      return { x: s.x - s.size/2, y: s.y - s.size, w: s.size, h: s.size };
    });
  },
  stop(gs) {
    this._spikes = []; this._iceParticles = [];
    if (gs) gs.iceMode = false;
    if (this._layer) this._layer.clear();
  }
};
