// ════════════════════════════════════════════════════════
//  EVENT MANAGER v3 — Diamond objective system
//  Win condition: collect the diamond (not just survive)
//  Fixed: state fully resets between rounds, no stuck movement
// ════════════════════════════════════════════════════════

const EventManager = (() => {
  const MAX_ROUND_TIME = 720; // 12s hard cap per round
  const READY_DURATION = 180; // 3s ready screen
  const SHUFFLE_CHANCE = 0.28;

  let _state = 'idle'; // idle | ready | running | dead | complete
  let _timer = 0;
  let _eventIndex = 0;
  let _order = [];
  let _layer = null;
  let _W = 900, _H = 560;

  let _onDeath = null, _onComplete = null;
  let _getPlayer = null, _getPlatforms = null;
  let _gameState = null, _floorY = 540;

  let _score = 0, _survived = 0;
  const _eventCount = 20;
  let _currentEvent = null;
  let _invincible = false;

  // ── Diamond system ─────────────────────────────────────
  let _diamond = null; // { x, y, collected, layer }
  let _diamondLayer = null;
  let _diamondPulse = 0;
  let _onDiamondCollected = null; // callback → advance round

  function _spawnDiamond(W, H, platforms, floorY) {
    // Pick a random platform top or floor
    const spots = [
      { x: W * 0.5, y: floorY - 20 }, // floor center-ish
    ];
    if (platforms) {
      for (const p of platforms) {
        spots.push({ x: p.x + p.pw / 2, y: p.y - 18 });
      }
    }
    const spot = spots[Math.floor(Math.random() * spots.length)];
    _diamond = { x: spot.x, y: spot.y, collected: false, r: 10 };
  }

  function _updateDiamond(playerX, playerY, PW, PH) {
    if (!_diamond || _diamond.collected) return;
    _diamondPulse += 0.07;
    const d = _diamond;
    const pulse = Math.abs(Math.sin(_diamondPulse)) * 4;

    // Draw
    _diamondLayer.clear();
    // Outer glow
    _diamondLayer.beginFill(0xffd700, 0.12 + Math.abs(Math.sin(_diamondPulse)) * 0.1);
    _diamondLayer.drawCircle(d.x, d.y, 22 + pulse);
    _diamondLayer.endFill();
    // Diamond shape (rotated square)
    const r = 10 + pulse * 0.3;
    _diamondLayer.beginFill(0xffd700, 0.9);
    _diamondLayer.moveTo(d.x,       d.y - r);
    _diamondLayer.lineTo(d.x + r,   d.y);
    _diamondLayer.lineTo(d.x,       d.y + r);
    _diamondLayer.lineTo(d.x - r,   d.y);
    _diamondLayer.closePath();
    _diamondLayer.endFill();
    // Inner shine
    _diamondLayer.beginFill(0xffffff, 0.35);
    _diamondLayer.moveTo(d.x,         d.y - r * 0.55);
    _diamondLayer.lineTo(d.x + r * 0.55, d.y);
    _diamondLayer.lineTo(d.x,         d.y + r * 0.15);
    _diamondLayer.lineTo(d.x - r * 0.15, d.y);
    _diamondLayer.closePath();
    _diamondLayer.endFill();
    // Outline
    _diamondLayer.lineStyle(1.5, 0xffee44, 0.8);
    _diamondLayer.moveTo(d.x, d.y - r);
    _diamondLayer.lineTo(d.x + r, d.y);
    _diamondLayer.lineTo(d.x, d.y + r);
    _diamondLayer.lineTo(d.x - r, d.y);
    _diamondLayer.closePath();

    // Collect check
    const px = playerX + (PW || 18) / 2;
    const py = playerY + (PH || 24) / 2;
    const dist = Math.hypot(px - d.x, py - d.y);
    if (dist < 22) {
      d.collected = true;
      _diamondLayer.clear();
      _onDiamondCollected?.();
    }
  }

  function _clearDiamond() {
    _diamond = null;
    if (_diamondLayer) _diamondLayer.clear();
  }

  // ── DOM (created once) ─────────────────────────────────
  let _dom = null;

  function _createDOM(gameWrap) {
    if (_dom) return _dom;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:'absolute', top:'0', left:'0', right:'0', bottom:'0',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      pointerEvents:'none', zIndex:'20',
      fontFamily:"'Orbitron','Courier New',monospace",
      opacity:'0', transition:'opacity 0.25s',
    });

    const badge    = document.createElement('div');
    const title    = document.createElement('div');
    title.id       = 'em-title';
    const subtitle = document.createElement('div');
    const countdown= document.createElement('div');

    Object.assign(badge.style,    { fontSize:'10px', letterSpacing:'5px', color:'#ffffff44', marginBottom:'6px' });
    Object.assign(title.style,    { fontSize:'38px', fontWeight:'900', letterSpacing:'6px', color:'#fff', textShadow:'0 0 20px currentColor', marginBottom:'8px', textAlign:'center' });
    Object.assign(subtitle.style, { fontSize:'12px', letterSpacing:'4px', color:'#ffffff77', textAlign:'center', marginBottom:'12px' });
    Object.assign(countdown.style,{ fontSize:'80px', fontWeight:'900', color:'#ffd700', textShadow:'0 0 30px #ffd700', lineHeight:'1' });

    // Death extras
    const deathExtras = document.createElement('div');
    Object.assign(deathExtras.style, { display:'none', flexDirection:'column', alignItems:'center', gap:'12px', marginTop:'20px' });

    const deathBarWrap = document.createElement('div');
    Object.assign(deathBarWrap.style, { width:'320px', height:'6px', background:'#ffffff14', borderRadius:'3px', overflow:'hidden' });
    const deathFill = document.createElement('div');
    Object.assign(deathFill.style, { height:'100%', width:'0%', background:'linear-gradient(90deg,#ff4444,#ff8800)', transition:'width 1.8s cubic-bezier(0.22,1,0.36,1)' });
    deathBarWrap.appendChild(deathFill);

    const deathTip   = document.createElement('div');
    Object.assign(deathTip.style, { fontSize:'9px', letterSpacing:'2px', color:'#ffffff28', textAlign:'center', maxWidth:'400px', lineHeight:'2' });

    const deathRetry = document.createElement('div');
    deathRetry.id    = 'em-death-retry';
    Object.assign(deathRetry.style, { fontSize:'10px', letterSpacing:'4px', color:'#ff444488' });

    deathExtras.appendChild(deathBarWrap);
    deathExtras.appendChild(deathTip);
    deathExtras.appendChild(deathRetry);

    overlay.appendChild(badge); overlay.appendChild(title); overlay.appendChild(subtitle);
    overlay.appendChild(countdown); overlay.appendChild(deathExtras);
    gameWrap.appendChild(overlay);

    // HUD
    const hud = document.createElement('div');
    Object.assign(hud.style, { position:'absolute', bottom:'8px', left:'0', right:'0', padding:'0 16px', display:'flex', flexDirection:'column', gap:'4px', pointerEvents:'none', zIndex:'15', fontFamily:"'Orbitron','Courier New',monospace" });

    const hudTop = document.createElement('div');
    Object.assign(hudTop.style, { display:'flex', justifyContent:'space-between', alignItems:'baseline' });

    const scoreEl   = document.createElement('div');
    Object.assign(scoreEl.style, { fontSize:'10px', letterSpacing:'3px', color:'#ffffff44' });

    const shuffleEl = document.createElement('div');
    shuffleEl.id    = 'em-shuffle';
    Object.assign(shuffleEl.style, { fontSize:'9px', letterSpacing:'2px', color:'#ff4444', opacity:'0', transition:'opacity 0.3s', textShadow:'0 0 8px #ff4444' });

    const barWrap = document.createElement('div');
    Object.assign(barWrap.style, { height:'3px', background:'#ffffff18', borderRadius:'2px', overflow:'hidden' });
    const barFill = document.createElement('div');
    Object.assign(barFill.style, { height:'100%', width:'100%', background:'linear-gradient(90deg,#ffd700,#00e5ff)', transition:'width 0.1s linear' });
    barWrap.appendChild(barFill);
    hudTop.appendChild(scoreEl); hudTop.appendChild(shuffleEl);
    hud.appendChild(hudTop); hud.appendChild(barWrap);
    gameWrap.appendChild(hud);

    // CSS
    if (!document.getElementById('em-style')) {
      const style = document.createElement('style');
      style.id = 'em-style';
      style.textContent = `
        @keyframes em-blink { 50% { opacity:0; } }
        @keyframes em-shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-8px);} 40%{transform:translateX(8px);} 60%{transform:translateX(-5px);} 80%{transform:translateX(3px);} }
        #em-title.em-shake { animation:em-shake 0.5s ease; }
        #em-death-retry { animation:em-blink 1s step-end infinite; }
      `;
      document.head.appendChild(style);
    }

    _dom = { overlay, badge, title, subtitle, countdown, deathExtras, deathFill, deathTip, deathRetry, scoreEl, shuffleEl, barFill };
    KeyShuffle.init(shuffleEl);
    return _dom;
  }

  function _showOverlay(badge, title, subtitle, countdown, color) {
    _dom.badge.textContent     = badge || '';
    _dom.title.textContent     = title || '';
    _dom.title.style.color     = color || '#fff';
    _dom.title.style.textShadow= `0 0 20px ${color || '#fff'}`;
    _dom.subtitle.textContent  = subtitle || '';
    _dom.countdown.textContent = countdown || '';
    _dom.deathExtras.style.display = 'none';
    _dom.overlay.style.opacity = '1';
  }

  function _hideOverlay() {
    _dom.overlay.style.opacity  = '0';
    _dom.countdown.textContent  = '';
  }

  const TIPS = [
    'THE DIAMOND DOESN\'T COME TO YOU', 'GET THE DIAMOND. SIMPLE.',
    'YOU WERE SO CLOSE TO THE DIAMOND', 'NEXT TIME MAYBE GRAB THE SHINY THING',
    'DODGE FIRST. COLLECT SECOND.', 'SKILL ISSUE. TERMINAL.',
    'THE DIAMOND WAS RIGHT THERE', 'ZERO SHIFT REMEMBERS.',
  ];

  function _showDeathScreen() {
    _dom.badge.textContent = `DIED ON EVENT ${_eventIndex + 1} / ${_order.length}`;
    _dom.title.textContent = 'ELIMINATED';
    _dom.title.style.color = '#ff3333';
    _dom.title.style.textShadow = '0 0 30px #ff3333, 0 0 80px #ff000055';
    _dom.subtitle.textContent = `${_survived} DIAMONDS COLLECTED  ·  ${_score} PTS`;
    _dom.countdown.textContent = '';
    _dom.deathTip.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
    _dom.deathFill.style.transition = 'none';
    _dom.deathFill.style.width = '0%';
    _dom.deathExtras.style.display = 'flex';
    _dom.overlay.style.opacity = '1';

    _dom.title.classList.remove('em-shake');
    void _dom.title.offsetWidth;
    _dom.title.classList.add('em-shake');

    setTimeout(() => {
      _dom.deathFill.style.transition = 'width 1.8s cubic-bezier(0.22,1,0.36,1)';
      _dom.deathFill.style.width = ((_survived / _order.length) * 100) + '%';
    }, 80);

    let secs = 3;
    _dom.deathRetry.textContent = `▶ RETRYING IN ${secs}`;
    const iv = setInterval(() => {
      secs--;
      if (secs <= 0) { _dom.deathRetry.textContent = '▶ LOADING...'; clearInterval(iv); }
      else _dom.deathRetry.textContent = `▶ RETRYING IN ${secs}`;
    }, 1000);
  }

  function _updateHUD() {
    if (!_currentEvent) return;
    const progress = _state === 'running' ? Math.max(0, 1 - _timer / MAX_ROUND_TIME) : 1;
    _dom.barFill.style.width = (progress * 100) + '%';
    _dom.barFill.style.background = progress < 0.25
      ? 'linear-gradient(90deg,#ff4444,#ff8800)'
      : 'linear-gradient(90deg,#ffd700,#00e5ff)';
    _dom.scoreEl.innerHTML =
      `<span style="color:${_currentEvent.labelColor||'#fff'}">◆ ${_currentEvent.name}</span>` +
      `&nbsp;&nbsp; ${_eventIndex + 1} / ${_order.length}` +
      `&nbsp;&nbsp; <span style="color:#ffd700">${_score} PTS</span>`;
  }

  function _startEvent(idx) {
    _eventIndex   = idx;
    const id      = _order[idx];
    _currentEvent = Events[id];
    if (!_currentEvent) { _complete(); return; }

    KeyShuffle.maybeActivate(SHUFFLE_CHANCE);
    _dom.shuffleEl.style.opacity = KeyShuffle.isActive() ? '1' : '0';

    _state = 'ready'; _timer = 0; _invincible = true;
    _clearDiamond();

    _showOverlay(
      `EVENT ${idx + 1} / ${_order.length}`,
      _currentEvent.name,
      `◆ ${_currentEvent.description || 'GRAB THE DIAMOND'}`,
      '3', _currentEvent.labelColor
    );
  }

  function _beginRunning() {
    _state = 'running'; _timer = 0; _invincible = false;
    _hideOverlay();
    _currentEvent.start(_layer, _W, _H, _gameState, _getPlatforms?.(), _floorY);
    _spawnDiamond(_W, _H, _getPlatforms?.(), _floorY);
    _updateHUD();
  }

  function _advanceOrComplete() {
    _survived++;
    _score += 150 + (_eventIndex + 1) * 20;
    _currentEvent?.stop?.(_gameState);
    _layer.clear();
    _clearDiamond();
    if (_eventIndex + 1 >= _order.length) _complete();
    else _startEvent(_eventIndex + 1);
  }

  function _complete() {
    _state = 'complete';
    _currentEvent?.stop?.(_gameState);
    KeyShuffle.deactivate();
    _dom.shuffleEl.style.opacity = '0';
    _dom.badge.textContent = 'ALL ' + _order.length + ' DIAMONDS COLLECTED';
    _dom.title.textContent = '⬡ CLEARED';
    _dom.title.style.color = '#ffd700';
    _dom.title.style.textShadow = '0 0 30px #ffd700, 0 0 80px #ffd70055';
    _dom.subtitle.textContent = `PERFECT RUN  ·  FINAL SCORE  ${_score}`;
    _dom.countdown.textContent = '◆';
    _dom.deathExtras.style.display = 'none';
    _dom.overlay.style.opacity = '1';
    _onComplete?.(_score);
  }

  // ── Public API ─────────────────────────────────────────
  function init({ layer, diamondLayer, W, H, getPlayer, getPlatforms, gameState, floorY, gameWrap, onDeath, onComplete, customOrder }) {
    _layer        = layer;
    _diamondLayer = diamondLayer;
    _W = W; _H = H;
    _getPlayer    = getPlayer;
    _getPlatforms = getPlatforms;
    _gameState    = gameState;
    _floorY       = floorY;
    _onDeath      = onDeath;
    _onComplete   = onComplete;
    _order        = (customOrder && customOrder.length > 0) ? customOrder : _buildOrder();
    _score        = 0; _survived = 0;
    _state        = 'idle'; _currentEvent = null; _invincible = false;
    _diamond      = null; _diamondPulse = 0;

    _onDiamondCollected = () => { _advanceOrComplete(); };

    _createDOM(gameWrap);
    _dom.overlay.style.opacity = '0';
  }

  function _buildOrder() {
    const ids = Array.from({ length: _eventCount }, (_, i) => i + 1);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  }

  function start() { _startEvent(0); }

  function kill() {
    if (_state !== 'running' || _invincible) return;
    _state = 'dead';
    _currentEvent?.stop?.(_gameState);
    KeyShuffle.deactivate();
    _dom.shuffleEl.style.opacity = '0';
    _layer.clear(); _clearDiamond();
    _showDeathScreen();
    setTimeout(() => { _onDeath?.(_score); }, 3300);
  }

  function isInvincible()    { return _invincible; }
  function getState()        { return _state; }
  function getCurrentEvent() { return _currentEvent; }

  function update() {
    if (_state === 'idle' || _state === 'dead' || _state === 'complete') return;
    _timer++;

    if (_state === 'ready') {
      const secsLeft = Math.ceil((READY_DURATION - _timer) / 60);
      _dom.countdown.textContent = secsLeft > 0 ? String(secsLeft) : 'GO!';
      if (_timer >= READY_DURATION) _beginRunning();
      return;
    }

    if (_state === 'running') {
      const p = _getPlayer?.();
      _currentEvent?.update?.(1, _W, _H, _gameState, _getPlatforms?.(), _floorY, p?.x, p?.y, p?.PW, p?.PH);

      // Diamond update
      if (p) _updateDiamond(p.x, p.y, p.PW, p.PH);

      // Hazard collision
      if (!_invincible && p) {
        const hazards = _currentEvent?.getHazards?.(p.x, p.y, _W, _H) || [];
        for (const h of hazards) {
          if (p.x + (p.PW||18) > h.x && p.x < h.x + h.w &&
              p.y + (p.PH||24) > h.y && p.y < h.y + h.h) {
            kill(); return;
          }
        }
      }

      _updateHUD();

      // Hard time limit (failsafe, not the win condition)
      if (_timer >= MAX_ROUND_TIME) { kill(); }
    }
  }

  return { init, start, update, kill, isInvincible, getState, getCurrentEvent };
})();
