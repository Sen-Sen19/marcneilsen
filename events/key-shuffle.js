// ════════════════════════════════════════════════════
//  KEY SHUFFLE  —  randomly remaps controls for a round
//  ~30% chance to activate each event transition
// ════════════════════════════════════════════════════

const KeyShuffle = (() => {
  // Default: accept BOTH wasd and arrow keys always
  const DEFAULTS = {
    left:  ['a', 'arrowleft'],
    right: ['d', 'arrowright'],
    jump:  ['w', 'arrowup', ' '],
  };
  let currentMap = null; // null = use DEFAULTS
  let active = false;
  let shuffleNotice = null;

  // Weird alternate sets used when shuffled
  const SHUFFLE_SETS = [
    { left: 'j', right: 'l', jump: 'i' },
    { left: 'z', right: 'x', jump: 'c' },
    { left: 'h', right: 'k', jump: 'u' },
    { left: 'q', right: 'e', jump: 'r' },
    { left: 'f', right: 'g', jump: 't' },
  ];

  function activate() {
    const chosen = SHUFFLE_SETS[Math.floor(Math.random() * SHUFFLE_SETS.length)];
    currentMap = chosen;
    active = true;
    if (shuffleNotice) {
      shuffleNotice.innerHTML =
        `⚠ KEYS SCRAMBLED &nbsp;|&nbsp; ` +
        `<span style="color:#ffd700">${chosen.left.toUpperCase()}</span> LEFT &nbsp;` +
        `<span style="color:#ffd700">${chosen.right.toUpperCase()}</span> RIGHT &nbsp;` +
        `<span style="color:#ffd700">${chosen.jump.toUpperCase()}</span> JUMP`;
      shuffleNotice.style.opacity = '1';
    }
  }

  function deactivate() {
    currentMap = null;
    active = false;
    if (shuffleNotice) shuffleNotice.style.opacity = '0';
  }

  function maybeActivate(probability = 0.3) {
    if (Math.random() < probability) activate();
    else deactivate();
  }

  // Check if a raw key string matches a logical action
  function isAction(action, key) {
    if (active && currentMap) {
      return key === currentMap[action];
    }
    return DEFAULTS[action].includes(key);
  }

  function isActive() { return active; }
  function init(noticeEl) { shuffleNotice = noticeEl; }

  return { init, maybeActivate, deactivate, isAction, isActive };
})();
