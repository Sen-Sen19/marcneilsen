// ════ EVENT 15 — CLONE MIRRORS (2-second delayed replay) ════
Events[15] = {
  name: 'CLONE MIRRORS', color: 0x88ffff, labelColor: '#88ffff',
  description: 'YOUR PAST SELF WILL KILL YOU',
  _layer:null, _timer:0,
  _history:[], // ring buffer of {x,y} snapshots
  _delayFrames: 120, // 2 seconds @ 60fps
  _cloneActive: false,

  start(layer) {
    this._layer = layer; this._timer = 0;
    this._history = []; this._cloneActive = false;
  },

  update(dt, W, H, gs, plats, floorY, px, py, PW, PH) {
    this._timer++;
    // Record player position every frame
    if (px !== undefined) this._history.push({ x: px, y: py });
    // Activate clone after delay
    if (this._history.length > this._delayFrames) this._cloneActive = true;

    this._layer.clear();

    if (!this._cloneActive) {
      // Show countdown to clone appearing
      return;
    }

    // Ghost position = position from delayFrames ago
    const ghost = this._history[this._history.length - 1 - this._delayFrames];
    if (!ghost) return;

    const gx = ghost.x, gy = ghost.y;
    const pw = PW || 18, ph = PH || 24;

    // Ghost body
    const pulse = 0.3 + Math.abs(Math.sin(this._timer*.05))*.2;
    this._layer.lineStyle(2, 0x88ffff, (pulse+.3)*.85);
    this._layer.drawRect(gx, gy, pw, ph);
    this._layer.beginFill(0x88ffff, 0.08);
    this._layer.drawRect(gx, gy, pw, ph);
    this._layer.endFill();
    // Visor
    this._layer.beginFill(0x88ffff, 0.4);
    this._layer.drawRect(gx+4, gy+6, pw-8, 5);
    this._layer.endFill();
    // Trail
    for (let t=2; t<=8; t+=2) {
      const prev = this._history[Math.max(0, this._history.length - 1 - this._delayFrames - t)];
      if (!prev) continue;
      this._layer.beginFill(0x88ffff, 0.06*(1-t/10));
      this._layer.drawRect(prev.x, prev.y, pw, ph);
      this._layer.endFill();
    }

    // Store clone pos for hazard check
    this._ghostX = gx; this._ghostY = gy;
  },

  getHazards(px, py, W, H) {
    if (!this._cloneActive || this._ghostX === undefined) return [];
    return [{ x: this._ghostX, y: this._ghostY, w: 18, h: 24 }];
  },
  stop() { this._history=[]; this._cloneActive=false; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 16 — LASER GRID (show yellow first, blast red) ════
Events[16] = {
  name: 'LASER GRID', color: 0x00ff44, labelColor: '#00ff44',
  description: 'YELLOW = WARNING, RED = DEAD',
  _layer:null, _timer:0, _hLines:[], _vLines:[],
  // Each line: { y/x, state:'warn'|'fire', stateTimer, vy/vx }
  WARN_FRAMES: 50, FIRE_FRAMES: 80,

  start(layer, W, H) {
    this._layer=layer; this._timer=0; this._hLines=[]; this._vLines=[];
    for(let y=80;y<H-40;y+=90)  this._hLines.push({y,vy:(Math.random()<.5?1:-1)*(0.4+Math.random()*.5),state:'warn',stateTimer:Math.floor(Math.random()*60),active:true});
    for(let x=100;x<W-60;x+=150) this._vLines.push({x,vx:(Math.random()<.5?1:-1)*(0.3+Math.random()*.4),state:'warn',stateTimer:Math.floor(Math.random()*80),active:Math.random()<.6});
  },

  update(dt, W, H) {
    this._timer++; this._layer.clear();
    const drawLine=(isH,coord,state)=>{
      if(state==='warn') {
        // Yellow warning
        this._layer.lineStyle(4,0xffff00,0.5+Math.sin(this._timer*.15)*.2);
        if(isH){this._layer.moveTo(0,coord);this._layer.lineTo(W,coord);}
        else   {this._layer.moveTo(coord,0);this._layer.lineTo(coord,H);}
        this._layer.lineStyle(1,0xffffff,0.15);
        if(isH){this._layer.moveTo(0,coord);this._layer.lineTo(W,coord);}
        else   {this._layer.moveTo(coord,0);this._layer.lineTo(coord,H);}
      } else {
        // Red blast
        this._layer.lineStyle(6,0xff2200,0.85);
        if(isH){this._layer.moveTo(0,coord);this._layer.lineTo(W,coord);}
        else   {this._layer.moveTo(coord,0);this._layer.lineTo(coord,H);}
        this._layer.lineStyle(2,0xff8800,.6);
        if(isH){this._layer.moveTo(0,coord);this._layer.lineTo(W,coord);}
        else   {this._layer.moveTo(coord,0);this._layer.lineTo(coord,H);}
        this._layer.lineStyle(1,0xffffff,.5);
        if(isH){this._layer.moveTo(0,coord);this._layer.lineTo(W,coord);}
        else   {this._layer.moveTo(coord,0);this._layer.lineTo(coord,H);}
      }
    };

    for(const l of this._hLines) {
      l.stateTimer++;
      const dur = l.state==='warn' ? this.WARN_FRAMES : this.FIRE_FRAMES;
      if(l.stateTimer>=dur) { l.state=l.state==='warn'?'fire':'warn'; l.stateTimer=0; }
      if(l.state==='fire') { l.y+=l.vy; if(l.y<20||l.y>H-20) l.vy*=-1; }
      drawLine(true, l.y, l.state);
    }
    for(const l of this._vLines) {
      if(!l.active) continue;
      l.stateTimer++;
      const dur = l.state==='warn' ? this.WARN_FRAMES : this.FIRE_FRAMES;
      if(l.stateTimer>=dur) { l.state=l.state==='warn'?'fire':'warn'; l.stateTimer=0; }
      if(l.state==='fire') { l.x+=l.vx; if(l.x<20||l.x>W-20) l.vx*=-1; }
      drawLine(false, l.x, l.state);
    }
  },

  getHazards() {
    const h=[];
    for(const l of this._hLines) { if(l.state==='fire') h.push({x:0,y:l.y-5,w:9999,h:10}); }
    for(const l of this._vLines) { if(l.active&&l.state==='fire') h.push({x:l.x-5,y:0,w:10,h:9999}); }
    return h;
  },
  stop() { this._hLines=[]; this._vLines=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 17 — DISCO DEATH (show safe squares → 3s → blast) ════
Events[17] = {
  name: 'DISCO DEATH', color: 0xff00aa, labelColor: '#ff00aa',
  description: 'REACH THE DARK SQUARE — FAST',
  _layer:null, _timer:0, _phase:0,
  _cycleTimer:0, SHOW_DUR:240, DANGER_DUR:180, // 4s show, 3s active
  _safeCol:0, _safeRow:0, _state:'show',
  TILE_W:45, TILE_H:45,

  start(layer, W, H) {
    this._layer=layer; this._timer=0; this._phase=0; this._cycleTimer=0;
    this._state='show'; this._W=W; this._H=H;
    this._pickSafe(W,H);
  },

  _pickSafe(W,H) {
    this._safeCol = Math.floor(Math.random()*(Math.ceil(W/this.TILE_W)));
    this._safeRow = Math.floor(Math.random()*(Math.ceil(H/this.TILE_H)));
  },

  update(dt,W,H) {
    this._timer++; this._cycleTimer++;
    this._layer.clear();
    const cols=Math.ceil(W/this.TILE_W), rows=Math.ceil(H/this.TILE_H);
    const colors=[0xff0066,0xff6600,0xffff00,0x00ff88,0x0088ff,0xaa00ff];

    if(this._state==='show') {
      if(this._cycleTimer>=this.SHOW_DUR){this._state='danger';this._cycleTimer=0;}
      // Show colored tiles + dark (safe) square
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
        const isSafe=(c===this._safeCol&&r===this._safeRow);
        if(isSafe) {
          // Safe = dark with border
          this._layer.lineStyle(2,0xffffff,.25); this._layer.beginFill(0x000000,.5);
          this._layer.drawRect(c*this.TILE_W,r*this.TILE_H,this.TILE_W-2,this.TILE_H-2); this._layer.endFill();
        } else {
          const col=colors[(this._phase+c+r)%colors.length];
          const flash=.15+Math.abs(Math.sin(this._timer*.06))*.12;
          this._layer.lineStyle(1,col,.4); this._layer.beginFill(col,flash);
          this._layer.drawRect(c*this.TILE_W,r*this.TILE_H,this.TILE_W-2,this.TILE_H-2); this._layer.endFill();
        }
      }
    } else {
      // DANGER — colored tiles BLAST
      if(this._cycleTimer>=this.DANGER_DUR){this._state='show';this._cycleTimer=0;this._phase++;this._pickSafe(W,H);}
      const blastAlpha=.4+Math.sin(this._timer*.15)*.25;
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
        const isSafe=(c===this._safeCol&&r===this._safeRow);
        if(!isSafe) {
          const col=colors[(this._phase+c+r)%colors.length];
          this._layer.lineStyle(1,col,.5); this._layer.beginFill(col,blastAlpha);
          this._layer.drawRect(c*this.TILE_W,r*this.TILE_H,this.TILE_W-2,this.TILE_H-2); this._layer.endFill();
        }
      }
    }
  },

  getHazards() {
    if(this._state!=='danger') return [];
    const h=[];
    const cols=Math.ceil(this._W/this.TILE_W), rows=Math.ceil(this._H/this.TILE_H);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      if(c!==this._safeCol||r!==this._safeRow)
        h.push({x:c*this.TILE_W,y:r*this.TILE_H,w:this.TILE_W,h:this.TILE_H});
    }
    return h;
  },
  stop() { if(this._layer) this._layer.clear(); }
};

// ════ EVENT 18 — VOID CRUSH (slow warning, then crushes) ════
Events[18] = {
  name: 'VOID CRUSH', color: 0x6600ff, labelColor: '#6600ff',
  description: 'THE VOID CLOSES IN',
  _layer:null, _timer:0, _margin:0,
  _warnDone: false, _WARN_FRAMES: 150,

  start(layer) { this._layer=layer; this._timer=0; this._margin=0; this._warnDone=false; },

  update(dt,W,H) {
    this._timer++;
    // First 2.5s: pulsing warning, no movement
    if(this._timer < this._WARN_FRAMES) {
      const pulse=Math.abs(Math.sin(this._timer*.08));
      this._layer.clear();
      this._layer.lineStyle(4,0x6600ff,pulse*.6);
      this._layer.drawRect(8,8,W-16,H-16);
      this._layer.lineStyle(2,0xaa44ff,pulse*.3);
      this._layer.drawRect(20,20,W-40,H-40);
      return;
    }
    // Then crush
    this._margin = Math.min(180, (this._timer - this._WARN_FRAMES) * 0.5);
    const m=this._margin;
    this._layer.clear();
    const col=0x110022;
    this._layer.beginFill(col,.97); this._layer.drawRect(0,0,W,m); this._layer.endFill();
    this._layer.beginFill(col,.97); this._layer.drawRect(0,H-m,W,m); this._layer.endFill();
    this._layer.beginFill(col,.97); this._layer.drawRect(0,0,m,H); this._layer.endFill();
    this._layer.beginFill(col,.97); this._layer.drawRect(W-m,0,m,H); this._layer.endFill();
    const ea=0.5+Math.sin(this._timer*.08)*.3;
    this._layer.lineStyle(3,0x6600ff,ea); this._layer.drawRect(m,m,W-m*2,H-m*2);
    this._layer.lineStyle(1,0xaa44ff,ea*.4); this._layer.drawRect(m+6,m+6,W-m*2-12,H-m*2-12);
  },

  getHazards(px,py,W,H) {
    if(this._timer < this._WARN_FRAMES) return [];
    const m=this._margin;
    return [{x:0,y:0,w:W,h:m},{x:0,y:H-m,w:W,h:m},{x:0,y:0,w:m,h:H},{x:W-m,y:0,w:m,h:H}];
  },
  stop() { if(this._layer) this._layer.clear(); }
};

// ════ EVENT 19 — EARTHQUAKE (debris from BELOW platforms too) ════
Events[19] = {
  name: 'EARTHQUAKE', color: 0xcc8833, labelColor: '#cc8833',
  description: 'DEBRIS FROM ABOVE AND BELOW',
  _layer:null, _timer:0, _debris:[], _underDebris:[],

  start(layer, W, H, gs, platforms) {
    this._layer=layer; this._timer=0; this._debris=[]; this._underDebris=[];
    this._platforms=platforms||[]; this._W=W; this._H=H;
  },

  update(dt,W,H,gs) {
    this._timer++;
    // Shake
    const shakeX=(Math.random()-.5)*10, shakeY=(Math.random()-.5)*8;
    if(gs){gs.shakeX=shakeX;gs.shakeY=shakeY;}

    // Spawn from-above debris
    if(Math.random()<.12) this._debris.push({x:Math.random()*W,y:-20,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,r:6+Math.random()*10});
    // Spawn from UNDER platforms (rising debris)
    if(Math.random()<.08 && this._platforms.length>0) {
      const p=this._platforms[Math.floor(Math.random()*this._platforms.length)];
      this._underDebris.push({x:p.x+Math.random()*p.pw,y:p.y+p.ph+5,vx:(Math.random()-.5)*2,vy:-(3+Math.random()*5),r:5+Math.random()*8,life:1});
    }
    // Spawn from floor cracks
    if(Math.random()<.06) this._underDebris.push({x:Math.random()*W,y:H-22,vx:(Math.random()-.5)*2,vy:-(4+Math.random()*6),r:6+Math.random()*9,life:1});

    this._layer.clear();
    // Cracks
    if(this._timer%20===0) {
      for(let c=0;c<3;c++) {
        const sx=Math.random()*W,sy=H-20;
        this._layer.lineStyle(1,0xcc8833,.5); this._layer.moveTo(sx,sy);
        let cx=sx,cy=sy;
        for(let s=0;s<8;s++){cx+=(Math.random()-.5)*30;cy-=Math.random()*40;this._layer.lineTo(cx,cy);}
      }
    }

    // From-above debris
    for(let i=this._debris.length-1;i>=0;i--) {
      const d=this._debris[i]; d.x+=d.vx; d.y+=d.vy; d.vy+=.2;
      if(d.y>H+30){this._debris.splice(i,1);continue;}
      this._layer.beginFill(0x664422,.9); this._layer.drawRect(d.x-d.r/2,d.y-d.r/2,d.r,d.r); this._layer.endFill();
      this._layer.lineStyle(1,0xcc8833,.5); this._layer.drawRect(d.x-d.r/2,d.y-d.r/2,d.r,d.r);
    }

    // Under-platform rising debris
    for(let i=this._underDebris.length-1;i>=0;i--) {
      const d=this._underDebris[i]; d.x+=d.vx; d.y+=d.vy; d.vy+=.15; d.life-=.018;
      if(d.life<=0||d.y<-30){this._underDebris.splice(i,1);continue;}
      this._layer.beginFill(0x886633,d.life*.9); this._layer.drawRect(d.x-d.r/2,d.y-d.r/2,d.r,d.r); this._layer.endFill();
    }

    this._layer.beginFill(0x221100,.04); this._layer.drawRect(0,0,W,H); this._layer.endFill();
  },

  getHazards() {
    const h=this._debris.map(d=>({x:d.x-d.r/2,y:d.y-d.r/2,w:d.r,h:d.r}));
    const u=this._underDebris.map(d=>({x:d.x-d.r/2,y:d.y-d.r/2,w:d.r,h:d.r}));
    return [...h,...u];
  },
  stop(gs) {
    this._debris=[]; this._underDebris=[];
    if(gs){gs.shakeX=0;gs.shakeY=0;}
    if(this._layer) this._layer.clear();
  }
};

// ════ EVENT 20 — ZERO HOUR ════
Events[20] = {
  name: '⚠ ZERO HOUR ⚠', color: 0xff0000, labelColor: '#ff0000',
  description: 'MAXIMUM CHAOS',
  _layer:null, _timer:0, _bullets:[], _lasers:[], _angle:0, _cx:450, _cy:280, _cvx:1.5, _cvy:1.1,

  start(layer, W, H, gs) {
    this._layer=layer; this._timer=0; this._bullets=[]; this._lasers=[]; this._angle=0;
    this._cx=W/2; this._cy=H/2; this._cvx=1.5; this._cvy=1.1;
    for(let i=0;i<3;i++) this._spawnLaser(W,H);
  },
  _spawnLaser(W,H) {
    const fl=Math.random()<.5;
    this._lasers.push({y:80+Math.random()*(H-140),x:fl?-W:W*2,vx:fl?(5+Math.random()*3):-(5+Math.random()*3),w:W,h:8,alpha:0});
  },

  update(dt,W,H,gs,plats,floorY,px,py) {
    this._timer++; this._angle+=.12;
    this._cx+=this._cvx; this._cy+=this._cvy;
    if(this._cx<80||this._cx>W-80) this._cvx*=-1;
    if(this._cy<80||this._cy>H-80) this._cvy*=-1;
    if(gs){gs.shakeX=(Math.random()-.5)*10;gs.shakeY=(Math.random()-.5)*8;}
    if(this._timer%4===0) {
      for(let a=0;a<3;a++){const ang=this._angle+(a/3)*Math.PI*2;this._bullets.push({x:this._cx,y:this._cy,vx:Math.cos(ang)*5,vy:Math.sin(ang)*5});}
    }
    if(this._timer%110===0) this._spawnLaser(W,H);
    this._layer.clear();
    this._layer.beginFill(0x000000,.3); this._layer.drawRect(0,0,W,H); this._layer.endFill();
    const pulse=Math.abs(Math.sin(this._timer*.07))*.1;
    this._layer.beginFill(0xff0000,pulse); this._layer.drawRect(0,0,W,H); this._layer.endFill();
    for(let i=this._bullets.length-1;i>=0;i--) {
      const b=this._bullets[i]; b.x+=b.vx; b.y+=b.vy;
      if(b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){this._bullets.splice(i,1);continue;}
      this._layer.beginFill(0xff2200,.9); this._layer.drawCircle(b.x,b.y,5); this._layer.endFill();
    }
    for(let i=this._lasers.length-1;i>=0;i--) {
      const l=this._lasers[i]; l.x+=l.vx; l.alpha=Math.min(l.alpha+.05,.9);
      this._layer.beginFill(0xff0000,.12*l.alpha); this._layer.drawRect(0,l.y-l.h*2,W,l.h*4); this._layer.endFill();
      this._layer.beginFill(0xff0000,l.alpha*.85); this._layer.drawRect(l.x,l.y-l.h/2,W,l.h); this._layer.endFill();
      this._layer.lineStyle(1,0xffffff,l.alpha*.7); this._layer.moveTo(l.x,l.y); this._layer.lineTo(l.x+W,l.y);
      if(l.x>W*1.5||l.x+W<-W*.5) this._lasers.splice(i,1);
    }
  },
  getHazards() {
    const bh=this._bullets.map(b=>({x:b.x-6,y:b.y-6,w:12,h:12}));
    const lh=this._lasers.map(l=>({x:0,y:l.y-l.h/2,w:9999,h:l.h}));
    return [...bh,...lh];
  },
  stop(gs) {
    this._bullets=[]; this._lasers=[];
    if(gs){gs.shakeX=0;gs.shakeY=0;}
    if(this._layer) this._layer.clear();
  }
};
