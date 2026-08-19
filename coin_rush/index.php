<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Finger Frenzy: Grab!</title>
<style>
  body { margin:0; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#111; color:white;}
  #gameArea { position:relative; width:500px; height:500px; background:#222; border-radius:10px; overflow:hidden;}
  
  .player, .bot { 
      position:absolute; width:50px; height:50px; display:flex; align-items:center; justify-content:center;
      font-weight:bold; border-radius:8px; background:white; color:black; transition: transform 0.2s ease;
  }
  #playerHand { background:#2c2c2b; left:50px; bottom:50px; }
  #botRed { background:#2c2c2b; left:10px; top:10px; }
  #botGreen { background:#2c2c2b; right:10px; top:10px; }
  #botOrange { background:#2c2c2b; right:10px; bottom:10px; }

  #coin, #bomb { 
      position:absolute; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; top:50%; left:50%; transform:translate(-50%, -50%);
  }
  #coin { background:gold; }
  #bomb { background:purple; }

  #scores { font-size:18px; margin-top:10px; }

  @keyframes explode {
      0% { transform: scale(1); opacity:1; }
      50% { transform: scale(2); opacity:0.7; }
      100% { transform: scale(0); opacity:0; }
  }
  .explosion {
      position:absolute; width:60px; height:60px; background:orange; border-radius:50%;
      top:50%; left:50%; transform:translate(-50%, -50%);
      animation: explode 0.5s ease forwards;
      pointer-events:none;
  }
</style>
</head>
<body>

<div id="gameArea">
    <div id="playerHand" class="player">👋</div>
    <div id="botRed" class="bot">🤖</div>
    <div id="botGreen" class="bot">🤖</div>
    <div id="botOrange" class="bot">🤖</div>
    <div id="coin">💰</div>
</div>

<div id="scores"></div>

<script>
const playerHand = document.getElementById('playerHand');
const bots = [
    {el: document.getElementById('botRed'), score:0},
    {el: document.getElementById('botGreen'), score:0},
    {el: document.getElementById('botOrange'), score:0}
];
const gameArea = document.getElementById('gameArea');
const scoresDiv = document.getElementById('scores');

let playerScore = 0;
let coinActive = true;
let currentItem = 'coin'; // 'coin' or 'bomb'

// grab animation
function grabAnimation(character){
    const item = document.getElementById(currentItem);
    if(!item) return;
    const itemRect = item.getBoundingClientRect();
    const charRect = character.getBoundingClientRect();
    const dx = itemRect.left + itemRect.width/2 - (charRect.left + charRect.width/2);
    const dy = itemRect.top + itemRect.height/2 - (charRect.top + charRect.height/2);
    character.style.transform = `translate(${dx}px, ${dy}px) scale(1.5,0.8)`;
    setTimeout(()=> character.style.transform = 'translate(0,0) scale(1,1)', 300);
}

// spawn coin or bomb
function spawnItem(){
    const oldCoin = document.getElementById('coin');
    const oldBomb = document.getElementById('bomb');
    if(oldCoin) oldCoin.remove();
    if(oldBomb) oldBomb.remove();

    const isCoin = Math.random()<0.7;
    currentItem = isCoin?'coin':'bomb';

    const div = document.createElement('div');
    div.id = currentItem;
    div.textContent = isCoin?'💰':'💣';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%,-50%)';
    div.style.width='40px';
    div.style.height='40px';
    div.style.display='flex';
    div.style.alignItems='center';
    div.style.justifyContent='center';
    div.style.borderRadius='50%';
    div.style.fontSize='24px';
    div.style.position='absolute';
    div.style.background = isCoin?'gold':'purple';
    gameArea.appendChild(div);
    coinActive = true;
}

// player grab
function playerGrab(){
    if(!coinActive) return;
    coinActive=false;

    grabAnimation(playerHand);

    const grabbed = document.getElementById(currentItem);
    if(grabbed) grabbed.remove();

    if(currentItem==='coin') playerScore++;
    else { playerScore -=2; showExplosion(); }

    updateScores();
    checkWinner();
    setTimeout(spawnItem, 800);
}

// bot grab
function botGrab(bot){
    if(!coinActive) return;
    coinActive=false;

    grabAnimation(bot.el);

    const grabbed = document.getElementById(currentItem);
    if(grabbed) grabbed.remove();

    if(currentItem==='coin') bot.score++;
    else { bot.score -=2; showExplosion(); }

    updateScores();
    checkWinner();
    setTimeout(spawnItem, 800);
}

// continuous bot attempts
function botLoop(){
    if(coinActive){
        const aliveBots = bots.filter(b=>b.score<5);
        if(aliveBots.length>0){
            const bot = aliveBots[Math.floor(Math.random()*aliveBots.length)];
            botGrab(bot);
        }
    }
    setTimeout(botLoop, 500 + Math.random()*500);
}

// explosion animation
function showExplosion(){
    const exp = document.createElement('div');
    exp.className='explosion';
    gameArea.appendChild(exp);
    setTimeout(()=> exp.remove(), 500);
}

// update scores
function updateScores(){
    scoresDiv.innerHTML = `You: ${playerScore} | Red: ${bots[0].score} | Green: ${bots[1].score} | Orange: ${bots[2].score}`;
}

// check winner
function checkWinner(){
    if(playerScore>=5){ alert('You win!'); resetGame(); }
    const botWinner = bots.find(b=>b.score>=5);
    if(botWinner){ alert(`${botWinner.el.id.replace('bot','')} bot wins!`); resetGame(); }
}

// reset game
function resetGame(){
    playerScore=0;
    bots.forEach(b=>b.score=0);
    updateScores();
    spawnItem();
}

// init
updateScores();
spawnItem();
botLoop();

// input controls
document.addEventListener('keydown', (e)=>{
    if(e.code==='Space') playerGrab();
});
document.addEventListener('touchstart', ()=>{
    playerGrab();
});
</script>

</body>
</html>
