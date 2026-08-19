<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Click Frenzy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #202022;
            height: 100vh;
            margin: 0;
            color: #fff; 
        }
        h1 {
            margin: 20px 0;
        }
        #game-board {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            gap: 10px;
        }
        .game-button {
            width: 100px;
            height: 100px;
            background-color: #fff;
            border: 2px solid #ccc;
            font-size: 24px;
            cursor: pointer;
        }
        #score, #high-score {
            margin: 10px 0;
            font-size: 18px;
        }
        #message {
            margin: 20px 0;
            font-size: 20px;
        }
        #start-button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Color Burst</h1>
    <div id="game-board">
        <button class="game-button" id="btn-0"></button>
        <button class="game-button" id="btn-1"></button>
        <button class="game-button" id="btn-2"></button>
        <button class="game-button" id="btn-3"></button>
        <button class="game-button" id="btn-4"></button>
        <button class="game-button" id="btn-5"></button>
        <button class="game-button" id="btn-6"></button>
        <button class="game-button" id="btn-7"></button>
        <button class="game-button" id="btn-8"></button>
    </div>
    <div id="score">Score: 0</div>
    <div id="high-score">High Score: 0</div>
    <div id="message"></div>
    <button id="start-button">Start Game</button>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".game-button");
    let intervalId = null;
    let score = 0;
    let highScore = localStorage.getItem("highScore") || 0;
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    const message = document.getElementById("message");
    const startButton = document.getElementById("start-button");

    const colors = ["#ff8c00", "#ff1493", "#32cd32", "#1e90ff", "#9400d3" , "#ff0f00"];
    const minInterval = 200;
    const initialInterval = 800;
    const intervalDecrease = 30;

    function startGame() {
        if (intervalId) clearInterval(intervalId);
        buttons.forEach(btn => btn.style.backgroundColor = "");
        message.textContent = "";
        score = 0;
        updateScore();
        intervalId = setInterval(changeButtonColor, initialInterval);
    }

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function changeButtonColor() {
        const uncoloredButtons = [...buttons].filter(btn => btn.style.backgroundColor === "");
        if (uncoloredButtons.length === 0) {
            gameOver("Game Over: All buttons are colored!");
            return;
        }

        const randomIndex = Math.floor(Math.random() * uncoloredButtons.length);
        const randomButton = uncoloredButtons[randomIndex];
        randomButton.style.backgroundColor = getRandomColor();
    }

    function buttonClick(event) {
        if (!intervalId) return;

        if (event.target.style.backgroundColor !== "") {
            score++;
            updateScore();
            event.target.style.backgroundColor = "";
            adjustInterval();
        } else {
            gameOver("Game Over: You clicked the wrong button!");
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Save high score to localStorage
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
    }

    function adjustInterval() {
        clearInterval(intervalId);
        const newInterval = Math.max(minInterval, initialInterval - score * intervalDecrease);
        intervalId = setInterval(changeButtonColor, newInterval);
    }

    function gameOver(text) {
        clearInterval(intervalId);
        message.textContent = text;
        buttons.forEach(btn => btn.style.backgroundColor = "");
        updateHighScore();
    }

    // Set initial high score display
    highScoreDisplay.textContent = `High Score: ${highScore}`;

    buttons.forEach(button => button.addEventListener("click", buttonClick));
    startButton.addEventListener("click", startGame);
});

    </script>
</body>
</html>
