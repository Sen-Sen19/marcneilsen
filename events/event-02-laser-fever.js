// EVENT 02 — LASER FEVER (rotating from center)
Events[2] = {
  name: 'LASER FEVER', color: 0x00ff88, labelColor: '#00ff88',
  description: 'DODGE THE ROTATING BEAMS',
  _layer:null, _timer:0, _angle:0, _beams:[],

  start(layer, W, H) {
    this._layer = layer; this._timer = 0; this._angle = 0;
    this._cx = W / 2; this._cy = H / 2;
    // 3 rotating beams, 120° apart
    this._beams = [0, Math.PI * 2/3, Math.PI * 4/3].map((offset, i) => ({
      offset, speed: 0.022, thickness: 10, length: Math.max(W,H),
    }));
  },

  update(dt, W, H) {
    this._timer++;
    this._angle += 0.022;
    this._layer.clear();

    for (const b of this._beams) {
      const ang = this._angle + b.offset;
      // Warn line (yellow faint, always)
      this._layer.lineStyle(b.thickness + 6, 0xffff00, 0.08);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang) * b.length, this._cy + Math.sin(ang) * b.length);
      // Opposite direction
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang + Math.PI) * b.length, this._cy + Math.sin(ang + Math.PI) * b.length);

      // Glow
      this._layer.lineStyle(b.thickness + 4, 0x00ff88, 0.12);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang) * b.length, this._cy + Math.sin(ang) * b.length);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang + Math.PI) * b.length, this._cy + Math.sin(ang + Math.PI) * b.length);

      // Main beam
      this._layer.lineStyle(b.thickness, 0x00ff88, 0.85);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang) * b.length, this._cy + Math.sin(ang) * b.length);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang + Math.PI) * b.length, this._cy + Math.sin(ang + Math.PI) * b.length);

      // Core white
      this._layer.lineStyle(2, 0xffffff, 0.6);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang) * b.length, this._cy + Math.sin(ang) * b.length);
      this._layer.moveTo(this._cx, this._cy);
      this._layer.lineTo(this._cx + Math.cos(ang + Math.PI) * b.length, this._cy + Math.sin(ang + Math.PI) * b.length);
    }
    // Center hub
    this._layer.beginFill(0x00ff88, 0.9); this._layer.drawCircle(this._cx, this._cy, 8); this._layer.endFill();
  },

  getHazards(px, py, W, H) {
    const h = [];
    for (const b of this._beams) {
      const ang = this._angle + b.offset;
      const len = Math.max(W, H);
      // Sample 30 points along the beam for collision rects
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        const bx = this._cx + Math.cos(ang) * len * t;
        const by = this._cy + Math.sin(ang) * len * t;
        h.push({ x: bx - b.thickness/2, y: by - b.thickness/2, w: b.thickness, h: b.thickness });
        const bx2 = this._cx + Math.cos(ang + Math.PI) * len * t;
        const by2 = this._cy + Math.sin(ang + Math.PI) * len * t;
        h.push({ x: bx2 - b.thickness/2, y: by2 - b.thickness/2, w: b.thickness, h: b.thickness });
      }
    }
    return h;
  },
  stop() { this._beams=[]; if(this._layer) this._layer.clear(); }
};
