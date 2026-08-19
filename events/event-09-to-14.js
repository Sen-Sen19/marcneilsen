// ════ EVENT 09 — SPIN BLADES ════
Events[9] = {
  name: 'SPIN BLADES', color: 0xffdd00, labelColor: '#ffdd00',
  description: 'MIND THE BLADES',
  _blades:[], _layer:null, _timer:0,

  start(layer, W, H, gs, platforms) {
    this._layer = layer; this._timer = 0; this._blades = [];
    const spots = [ {x:120,y:H-60},{x:350,y:H-60},{x:620,y:H-60},{x:840,y:H-60} ];
    if (platforms) for (const p of platforms) spots.push({ x: p.x + p.pw/2, y: p.y - 28 });
    for (const s of spots.slice(0,8)) {
      this._blades.push({ cx:s.x, cy:s.y, r:22, angle:Math.random()*Math.PI*2,
        speed:(Math.random()<.5?1:-1)*(0.06+Math.random()*.05), blades:5 });
    }
  },

  update(dt, W, H) {
    this._timer++; this._layer.clear();
    for (const b of this._blades) {
      b.angle += b.speed;
      this._layer.beginFill(0xffdd00, 0.07); this._layer.drawCircle(b.cx, b.cy, b.r*1.8); this._layer.endFill();
      for (let i=0;i<b.blades;i++) {
        const a = b.angle + (i/b.blades)*Math.PI*2;
        const tip={x:b.cx+Math.cos(a)*b.r,y:b.cy+Math.sin(a)*b.r};
        const l={x:b.cx+Math.cos(a+.35)*b.r*.4,y:b.cy+Math.sin(a+.35)*b.r*.4};
        const r={x:b.cx+Math.cos(a-.35)*b.r*.4,y:b.cy+Math.sin(a-.35)*b.r*.4};
        this._layer.beginFill(0xffdd00,.9); this._layer.moveTo(tip.x,tip.y); this._layer.lineTo(l.x,l.y); this._layer.lineTo(r.x,r.y); this._layer.closePath(); this._layer.endFill();
      }
      this._layer.beginFill(0x333300,1); this._layer.drawCircle(b.cx,b.cy,5); this._layer.endFill();
      this._layer.lineStyle(1,0xffdd00,.8); this._layer.drawCircle(b.cx,b.cy,5);
    }
  },
  getHazards() { return this._blades.map(b=>({x:b.cx-b.r,y:b.cy-b.r,w:b.r*2,h:b.r*2})); },
  stop() { this._blades=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 10 — FLOOR IS LAVA (magma bubbles, not filling up) ════
Events[10] = {
  name: 'FLOOR IS LAVA', color: 0xff4400, labelColor: '#ff6600',
  description: 'DODGE THE MAGMA BURSTS',
  _layer:null, _timer:0, _bubbles:[], _bursts:[],

  start(layer, W, H, gs, platforms, floorY) {
    this._layer = layer; this._timer = 0; this._bubbles = []; this._bursts = [];
    this._floorY = floorY || H-20; this._W = W;
  },

  _spawnBurst() {
    const x = 20 + Math.random() * (this._W - 40);
    this._bursts.push({ x, y: this._floorY, vy: -(5 + Math.random()*7), vx:(Math.random()-.5)*2, r: 12+Math.random()*14, life:1, warned:false, warnTimer: 30 });
  },

  update(dt, W, H) {
    this._timer++;
    if (this._timer % 22 === 0) this._spawnBurst();
    this._layer.clear();

    // Lava floor strip
    const t = this._timer;
    this._layer.beginFill(0x220500, 0.95);
    this._layer.drawRect(0, this._floorY, W, H - this._floorY);
    this._layer.endFill();
    this._layer.beginFill(0xff3300, 0.88);
    this._layer.moveTo(0, this._floorY);
    for (let i=0;i<=24;i++) {
      const wx=(i/24)*W;
      const wy=this._floorY + Math.sin(i*.7+t*.08)*8 + Math.sin(i*1.4+t*.05)*4;
      this._layer.lineTo(wx, wy);
    }
    this._layer.lineTo(W,H); this._layer.lineTo(0,H); this._layer.closePath(); this._layer.endFill();
    this._layer.beginFill(0xff6600,0.14); this._layer.drawRect(0,this._floorY-40,W,50); this._layer.endFill();

    // Bursts
    for (let i=this._bursts.length-1;i>=0;i--) {
      const b=this._bursts[i];
      if (b.warnTimer > 0) {
        b.warnTimer--;
        // Warning circle on floor
        this._layer.lineStyle(2, 0xffaa00, 0.5 + Math.sin(t*.3)*.3);
        this._layer.drawCircle(b.x, this._floorY - 4, b.r*.6);
        continue;
      }
      b.x += b.vx; b.y += b.vy; b.vy += 0.25; b.life -= 0.025;
      if (b.life <= 0 || b.y > this._floorY + 20) { this._bursts.splice(i,1); continue; }
      this._layer.beginFill(0xff5500, b.life*.9); this._layer.drawCircle(b.x,b.y,b.r*b.life); this._layer.endFill();
      this._layer.beginFill(0xff9900, b.life*.5); this._layer.drawCircle(b.x,b.y,b.r*b.life*.5); this._layer.endFill();
    }
  },

  getHazards() {
    const h = [{ x:0, y:this._floorY, w:9999, h:80 }]; // lava strip
    for (const b of this._bursts) {
      if (b.warnTimer <= 0) h.push({ x:b.x-b.r, y:b.y-b.r, w:b.r*2, h:b.r*2 });
    }
    return h;
  },
  stop() { this._bubbles=[]; this._bursts=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 11 — SHOCKWAVE ════
Events[11] = {
  name: 'SHOCKWAVE', color: 0x00ffcc, labelColor: '#00ffcc',
  description: 'DODGE THE RINGS',
  _waves:[], _layer:null, _timer:0,
  start(layer) { this._layer=layer; this._timer=0; this._waves=[]; },
  _spawn(W,H) { this._waves.push({x:Math.random()*W,y:Math.random()*H,r:0,maxR:300+Math.random()*200,speed:3+Math.random()*2,w:14}); },
  update(dt,W,H) {
    this._timer++;
    if(this._timer%80===0) this._spawn(W,H);
    if(this._timer===1) this._spawn(W,H);
    this._layer.clear();
    for(let i=this._waves.length-1;i>=0;i--) {
      const w=this._waves[i]; w.r+=w.speed;
      if(w.r>w.maxR){this._waves.splice(i,1);continue;}
      const alpha=(1-w.r/w.maxR)*.7;
      this._layer.lineStyle(w.w*(1-w.r/w.maxR)+2,0x00ffcc,alpha);
      this._layer.drawCircle(w.x,w.y,w.r);
    }
  },
  getHazards() {
    const h=[];
    for(const w of this._waves){const t=w.w*(1-w.r/w.maxR)+4;for(let a=0;a<16;a++){const angle=(a/16)*Math.PI*2;h.push({x:w.x+Math.cos(angle)*w.r-t/2,y:w.y+Math.sin(angle)*w.r-t/2,w:t,h:t});}}
    return h;
  },
  stop() { this._waves=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 12 — METEOR STRIKE (more, faster) ════
Events[12] = {
  name: 'METEOR STRIKE', color: 0xff8833, labelColor: '#ff8833',
  description: 'READ THE SHADOWS',
  _meteors:[], _layer:null, _timer:0,
  start(layer) { this._layer=layer; this._timer=0; this._meteors=[]; for(let i=0;i<3;i++) this._spawn(900); },
  _spawn(W) { this._meteors.push({x:40+Math.random()*(W-80),y:-60,vy:4+Math.random()*5,r:14+Math.random()*16,warned:true}); },
  update(dt,W,H) {
    this._timer++;
    if(this._timer%55===0) this._spawn(W);
    if(this._timer%80===0) this._spawn(W); // double spawn rate
    this._layer.clear();
    for(let i=this._meteors.length-1;i>=0;i--) {
      const m=this._meteors[i]; m.y+=m.vy;
      // Shadow
      const sa=Math.min(.5,(m.y+60)/H*.7);
      this._layer.beginFill(0xff4400,sa*.4); this._layer.drawEllipse(m.x,H-22,m.r*.8,6); this._layer.endFill();
      if(m.y<H*.5) {
        this._layer.lineStyle(2,0xff4400,.5);
        this._layer.moveTo(m.x-12,H-40); this._layer.lineTo(m.x+12,H-16);
        this._layer.moveTo(m.x+12,H-40); this._layer.lineTo(m.x-12,H-16);
      }
      this._layer.beginFill(0x441100,.95); this._layer.drawCircle(m.x,m.y,m.r); this._layer.endFill();
      this._layer.lineStyle(2,0xff8833,.9); this._layer.drawCircle(m.x,m.y,m.r);
      this._layer.beginFill(0xff4400,.4); this._layer.drawCircle(m.x-2,m.y-m.r*1.5,m.r*.5); this._layer.endFill();
      if(m.y-m.r>H) this._meteors.splice(i,1);
    }
  },
  getHazards() { return this._meteors.map(m=>({x:m.x-m.r,y:m.y-m.r,w:m.r*2,h:m.r*2})); },
  stop() { this._meteors=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 13 — LIGHTNING STORM (warning spot before strike) ════
Events[13] = {
  name: 'LIGHTNING STORM', color: 0xeeff00, labelColor: '#eeff00',
  description: 'DODGE THE MARKED SPOTS',
  _strikes:[], _layer:null, _timer:0,
  start(layer) { this._layer=layer; this._timer=0; this._strikes=[]; },
  _strike(W,H) {
    const x=20+Math.random()*(W-40);
    const segs=[]; let cy=0;
    while(cy<H){ segs.push({x:x+(Math.random()-.5)*30,y:cy}); cy+=20+Math.random()*30; }
    // warnDuration: show warning for 50 frames before striking
    this._strikes.push({x,segs,life:1,width:2+Math.random()*3,warnTimer:60});
  },
  update(dt,W,H) {
    this._timer++;
    if(Math.random()<.035) this._strike(W,H);
    this._layer.clear();
    for(let i=this._strikes.length-1;i>=0;i--) {
      const s=this._strikes[i];
      if(s.warnTimer>0) {
        s.warnTimer--;
        // Big warning: red X + circle on the floor at strike x
        const pulse = Math.sin(this._timer*.25)*.5+.5;
        this._layer.lineStyle(3,0xff4400,0.4+pulse*.4);
        this._layer.moveTo(s.x-16,H-50); this._layer.lineTo(s.x+16,H-18);
        this._layer.moveTo(s.x+16,H-50); this._layer.lineTo(s.x-16,H-18);
        this._layer.lineStyle(2,0xeeff00,0.3+pulse*.3);
        this._layer.drawCircle(s.x,H-34,18+pulse*4);
        // Dashed warning column
        this._layer.lineStyle(1,0xeeff00,.15+pulse*.15);
        this._layer.moveTo(s.x,0); this._layer.lineTo(s.x,H);
        continue;
      }
      s.life-=.07;
      if(s.life<=0){this._strikes.splice(i,1);continue;}
      this._layer.lineStyle(s.width+3,0xffffff,s.life*.3);
      this._layer.moveTo(s.segs[0].x,s.segs[0].y);
      for(const seg of s.segs) this._layer.lineTo(seg.x,seg.y);
      this._layer.lineStyle(s.width,0xeeff00,s.life*.9);
      this._layer.moveTo(s.segs[0].x,s.segs[0].y);
      for(const seg of s.segs) this._layer.lineTo(seg.x,seg.y);
    }
  },
  getHazards() {
    return this._strikes.filter(s=>s.warnTimer<=0&&s.life>.3).map(s=>({x:s.x-14,y:0,w:28,h:9999}));
  },
  stop() { this._strikes=[]; if(this._layer) this._layer.clear(); }
};

// ════ EVENT 14 — SPIRAL ATTACK (roaming center) ════
Events[14] = {
  name: 'SPIRAL ATTACK', color: 0xff44cc, labelColor: '#ff44cc',
  description: 'SPIRAL OF DOOM',
  _bullets:[], _layer:null, _timer:0, _angle:0, _cx:450, _cy:280, _cvx:1.2, _cvy:0.9,

  start(layer, W, H) {
    this._layer=layer; this._timer=0; this._bullets=[]; this._angle=0;
    this._cx=W/2; this._cy=H/2; this._cvx=1.2+Math.random(); this._cvy=0.9+Math.random();
    this._W=W; this._H=H;
  },

  update(dt,W,H) {
    this._timer++; this._angle+=0.09;
    // Roam center
    this._cx += this._cvx; this._cy += this._cvy;
    if(this._cx<80||this._cx>W-80) this._cvx*=-1;
    if(this._cy<80||this._cy>H-80) this._cvy*=-1;

    if(this._timer%4===0) {
      const arms=4;
      for(let a=0;a<arms;a++) {
        const ang=this._angle+(a/arms)*Math.PI*2;
        this._bullets.push({x:this._cx,y:this._cy,vx:Math.cos(ang)*4,vy:Math.sin(ang)*4,life:1});
      }
    }
    this._layer.clear();
    // Roaming center
    this._layer.beginFill(0xff44cc,.3); this._layer.drawCircle(this._cx,this._cy,14); this._layer.endFill();
    this._layer.lineStyle(2,0xff44cc,.7); this._layer.drawCircle(this._cx,this._cy,14);
    for(let i=this._bullets.length-1;i>=0;i--) {
      const b=this._bullets[i];
      b.x+=b.vx; b.y+=b.vy; b.life-=0.007;
      if(b.life<=0||b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){this._bullets.splice(i,1);continue;}
      this._layer.beginFill(0xff44cc,b.life*.9); this._layer.drawCircle(b.x,b.y,5); this._layer.endFill();
    }
  },
  getHazards() { return this._bullets.map(b=>({x:b.x-5,y:b.y-5,w:10,h:10})); },
  stop() { this._bullets=[]; if(this._layer) this._layer.clear(); }
};
