<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Racing Game</title>
  <style>
body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #333;
}

.game-container {
    position: relative;
    width: 300px;
    height: 500px;
    background-color: #eee;
    overflow: hidden;
}

.car, .obstacle {
    position: absolute;
    width: 50px;
    height: 100px;
    background-color: red;
}

.car {
    bottom: 10px;
    left: 125px;
}

.obstacle {
    top: -100px;
    left: 125px;
    background-color: black;
}

.score {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: #000;
}

  </style>
</head>
<body>
    <div class="game-container">
        <div id="car" class="car"></div>
        <div id="obstacle" class="obstacle"></div>
        <div id="score" class="score">Score: 0</div>
    </div>
   <script>
const car = document.getElementById('car');
const obstacle = document.getElementById('obstacle');
const scoreElement = document.getElementById('score');
const lanes = [50, 125, 200];
let carPosition = 125;
let obstaclePosition = -100;
let gameSpeed = 2;
let score = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && carPosition > 50) {
        carPosition -= 75;
        car.style.left = carPosition + 'px';
    } else if (e.key === 'ArrowRight' && carPosition < 200) {
        carPosition += 75;
        car.style.left = carPosition + 'px';
    }
});

function moveObstacle() {
    obstaclePosition += gameSpeed;
    if (obstaclePosition > 500) {
        obstaclePosition = -100;
        obstacle.style.left = lanes[Math.floor(Math.random() * 3)] + 'px';
        score++;
        scoreElement.textContent = `Score: ${score}`;
        gameSpeed += 0.5;
    }
    obstacle.style.top = obstaclePosition + 'px';

    if (obstaclePosition > 400 && obstaclePosition < 500 && car.style.left === obstacle.style.left) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }

    requestAnimationFrame(moveObstacle);
}

function resetGame() {
    obstaclePosition = -100;
    carPosition = 125;
    car.style.left = carPosition + 'px';
    gameSpeed = 2;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
}

moveObstacle();

   </script>
</body>
</html>
