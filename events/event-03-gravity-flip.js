// EVENT 03 — GRAVITY FLIP
// Player must NOT touch floor or ceiling. Spawns on platform.
// Obstacles appear on platforms.
Events[3] = {
  name: 'GRAVITY FLIP', color: 0xaa44ff, labelColor: '#aa44ff',
  description: 'DON\'T TOUCH FLOOR OR CEILING',
  _layer:null, _timer:0, _gravDir:1, _flipInterval:140,
  _obstacles:[], _spawnDone:false,

  start(layer, W, H, gs, platforms, floorY) {
    this._layer=layer; this._timer=0; this._gravDir=1;
    this._obstacles=[]; this._spawnDone=false;
    if(gs) gs.gravityDir=1;

    // Spawn player on a platform immediately
    if(gs && platforms && platforms.length>0) {
      const p=platforms[Math.floor(Math.random()*platforms.length)];
      gs.spawnOverride={ x: p.x+p.pw/2-9, y: p.y-26 };
    }

    // Place obstacles on platform surfaces
    if(platforms) {
      for(const p of platforms) {
        const n=1+Math.floor(Math.random()*3);
        for(let i=0;i<n;i++) {
          const ox=p.x+8+Math.random()*(p.pw-20);
          this._obstacles.push({x:ox,y:p.y-18,w:14,h:18,color:0xaa44ff});
        }
      }
    }
  },

  update(dt,W,H,gs) {
    this._timer++;
    const nextFlip=this._flipInterval-(this._timer%this._flipInterval);
    let flashAlpha=0;
    if(nextFlip<40) flashAlpha=(1-nextFlip/40)*.3;
    if(this._timer%this._flipInterval===0) {
      this._gravDir*=-1;
      if(gs) gs.gravityDir=this._gravDir;
      flashAlpha=.5;
    }

    this._layer.clear();
    if(flashAlpha>0) {
      this._layer.beginFill(0xaa44ff,flashAlpha); this._layer.drawRect(0,0,W,H); this._layer.endFill();
    }

    // Danger zone indicators (floor & ceiling)
    const dangerAlpha=.25+Math.abs(Math.sin(this._timer*.05))*.15;
    this._layer.beginFill(0xaa44ff,dangerAlpha*.5);
    this._layer.drawRect(0,0,W,16); // ceiling danger
    this._layer.endFill();
    this._layer.beginFill(0xaa44ff,dangerAlpha*.5);
    this._layer.drawRect(0,H-36,W,16); // floor danger
    this._layer.endFill();

    // Gravity arrows
    const arrowDir=this._gravDir>0?1:-1;
    const arrowY=this._gravDir>0?H-50:50;
    for(let ax=60;ax<W;ax+=90) {
      this._layer.beginFill(0xaa44ff,.4+Math.abs(Math.sin(this._timer*.1))*.3);
      this._layer.moveTo(ax,arrowY);
      this._layer.lineTo(ax-8,arrowY-14*arrowDir);
      this._layer.lineTo(ax+8,arrowY-14*arrowDir);
      this._layer.closePath(); this._layer.endFill();
    }

    // Draw obstacles
    for(const o of this._obstacles) {
      this._layer.beginFill(0x220033,.9); this._layer.drawRect(o.x,o.y,o.w,o.h); this._layer.endFill();
      this._layer.lineStyle(2,0xaa44ff,.8); this._layer.drawRect(o.x,o.y,o.w,o.h);
      this._layer.lineStyle(1,0xcc88ff,.4);
      this._layer.moveTo(o.x+o.w/2,o.y); this._layer.lineTo(o.x+o.w/2,o.y+o.h);
    }
  },

  getHazards(px,py,W,H) {
    const h=[];
    // Floor and ceiling are deadly
    h.push({x:0,y:H-32,w:W,h:32}); // floor kill zone
    h.push({x:0,y:0,w:W,h:20});    // ceiling kill zone
    // Obstacles
    for(const o of this._obstacles) h.push({x:o.x,y:o.y,w:o.w,h:o.h});
    return h;
  },
  stop(gs) {
    this._obstacles=[];
    if(gs){ gs.gravityDir=1; delete gs.spawnOverride; }
    if(this._layer) this._layer.clear();
  }
};
