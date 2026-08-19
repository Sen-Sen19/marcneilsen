<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Snake Game</title>
<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f0f0f0;
    }
    canvas {
        border: 1px solid #333;
    }
</style>
</head>
<body>
<canvas id="gameCanvas" width="400" height="400"></canvas>

<script>
    // Initialize canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Constants
    const tileSize = 20;
    const canvasSize = 400;
    const snakeColor = '#4caf50';
    const foodColor = '#f44336';

    // Snake and food positions
    let snake = [{ x: 200, y: 200 }];
    let food = { x: 0, y: 0 };

    // Initial direction
    let dx = tileSize;
    let dy = 0;

    // Score
    let score = 0;

    // Generate random food position
    function generateFood() {
        food.x = Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize;
        food.y = Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize;
    }

    // Game loop
    function gameLoop() {
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        // Check if snake hits wall or itself
        if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || checkCollision(head)) {
            gameOver();
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw food
        ctx.fillStyle = foodColor;
        ctx.fillRect(food.x, food.y, tileSize, tileSize);

        // Draw snake
        ctx.fillStyle = snakeColor;
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
        });

        // Display score
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 25);

        // Repeat game loop
        setTimeout(gameLoop, 100);
    }

    // Check if snake hits itself
    function checkCollision(head) {
        return snake.slice(1).some(segment => {
            return segment.x === head.x && segment.y === head.y;
        });
    }

    // Game over
    function gameOver() {
        alert(`Game Over! Your score is ${score}`);
        snake = [{ x: 200, y: 200 }];
        dx = tileSize;
        dy = 0;
        score = 0;
        generateFood();
    }

    // Handle keyboard input
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'w':
                if (dy === 0) {
                    dx = 0;
                    dy = -tileSize;
                }
                break;
            case 'a':
                if (dx === 0) {
                    dx = -tileSize;
                    dy = 0;
                }
                break;
            case 's':
                if (dy === 0) {
                    dx = 0;
                    dy = tileSize;
                }
                break;
            case 'd':
                if (dx === 0) {
                    dx = tileSize;
                    dy = 0;
                }
                break;
        }
    });

    // Initialize game
    generateFood();
    gameLoop();
</script>
</body>
</html>
