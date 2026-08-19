<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2048 Game</title>
    <style>
        /* CSS styles for the game */
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        
        .game-container {
            background-color: #bbada0;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
            width: 240px; /* Adjust width as needed */
            height: 240px; /* Set the height equal to the width */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .game-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-width: 240px;
            margin: 0 auto;
        }
        
        .tile {
            background-color: #cdc1b4;
            color: #776e65;
            font-size: 24px;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            width: 70px;
            height: 70px;
        }
        
        .game-info {
            margin-top: 20px;
        }
        
        .game-info p {
            margin: 5px 0;
            font-size: 18px;
        }
        
        #game-over {
            color: #776e65;
            font-size: 28px;
            font-weight: bold;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    
    <div class="game-container">
    <p> </p>
        <div class="game-board" id="gameBoard">
        </div>
        
        <div class="game-info">
            <p>Score: <span id="score">0</span></p>
            <p id="game-over" style="display: none;">Game Over!</p>
        </div>
    </div>

    <script>
        let board = [];
        let score = 0;
        const size = 3;

        function initializeBoard() {
            for (let i = 0; i < size; i++) {
                board[i] = [];
                for (let j = 0; j < size; j++) {
                    board[i][j] = 0;
                }
            }
            addNewTile();
            addNewTile();
            updateBoard();
        }

        function addNewTile() {
            let options = [];
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) {
                        options.push({ x: i, y: j });
                    }
                }
            }
            if (options.length > 0) {
                let spot = options[Math.floor(Math.random() * options.length)];
                board[spot.x][spot.y] = Math.random() < 0.9 ? 2 : 4;
            }
        }

      
        function updateBoard() {
            let gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';

            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let tileValue = board[i][j];
                    let tile = document.createElement('div');
                    tile.classList.add('tile');
                    if (tileValue !== 0) {
                        tile.textContent = tileValue;
                        tile.style.backgroundColor = getTileColor(tileValue);
                    }
                    gameBoard.appendChild(tile);
                }
            }
            document.getElementById('score').textContent = score;
            checkGameOver();
        }

        // Function to get tile color based on its value
        function getTileColor(value) {
            // Define colors for different tile values (adjust as needed)
            switch (value) {
                case 2: return '#eee4da';
                case 4: return '#ede0c8';
                case 8: return '#f2b179';
                case 16: return '#f59563';
                case 32: return '#f67c5f';
                case 64: return '#f65e3b';
                case 128: return '#edcf72';
                case 256: return '#edcc61';
                case 512: return '#9c0';
                case 1024: return '#33b5e5';
                case 2048: return '#09c';
                default: return '#ccc0b3';
            }
        }

        // Function to handle key presses (ASWD controls)
        document.addEventListener('keydown', function(event) {
            let moved = false;
            switch (event.key) {
                case 'a':
                    moved = moveLeft();
                    break;
                case 's':
                    moved = moveDown();
                    break;
                case 'w':
                    moved = moveUp();
                    break;
                case 'd':
                    moved = moveRight();
                    break;
            }
            if (moved) {
                addNewTile();
                updateBoard();
            }
        });


        function moveLeft() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                for (let j = 1; j < size; j++) {
                    if (board[i][j] !== 0) {
                        let k = j;
                        while (k > 0 && board[i][k - 1] === 0) {
                            k--;
                        }
                        if (k > 0 && board[i][k - 1] === board[i][j]) {
                            board[i][k - 1] *= 2;
                            score += board[i][k - 1];
                            board[i][j] = 0;
                            moved = true;
                        } else if (k !== j) {
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
            return moved;
        }

    
        function moveRight() {
            let moved = false;
            for (let i = 0; i < size; i++) {
                for (let j = size - 2; j >= 0; j--) {
                    if (board[i][j] !== 0) {
                        let k = j;
                        while (k < size - 1 && board[i][k + 1] === 0) {
                            k++;
                        }
                        if (k < size - 1 && board[i][k + 1] === board[i][j]) {
                            board[i][k + 1] *= 2;
                            score += board[i][k + 1];
                            board[i][j] = 0;
                            moved = true;
                        } else if (k !== j) {
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
            return moved;
        }

        function moveUp() {
            let moved = false;
            for (let j = 0; j < size; j++) {
                for (let i = 1; i < size; i++) {
                    if (board[i][j] !== 0) {
                        let k = i;
                        while (k > 0 && board[k - 1][j] === 0) {
                            k--;
                        }
                        if (k > 0 && board[k - 1][j] === board[i][j]) {
                            board[k - 1][j] *= 2;
                           
                            score += board[k - 1][j];
                            board[i][j] = 0;
                            moved = true;
                        } else if (k !== i) {
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
            return moved;
        }

        // Function to move tiles down
        function moveDown() {
            let moved = false;
            for (let j = 0; j < size; j++) {
                for (let i = size - 2; i >= 0; i--) {
                    if (board[i][j] !== 0) {
                        let k = i;
                        while (k < size - 1 && board[k + 1][j] === 0) {
                            k++;
                        }
                        if (k < size - 1 && board[k + 1][j] === board[i][j]) {
                            board[k + 1][j] *= 2;
                            score += board[k + 1][j];
                            board[i][j] = 0;
                            moved = true;
                        } else if (k !== i) {
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
            return moved;
        }

     
        function checkGameOver() {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) {
                        return false;
                    }
                    if (i > 0 && board[i][j] === board[i - 1][j]) {
                        return false;
                    }
                    if (j > 0 && board[i][j] === board[i][j - 1]) {
                        return false;
                    }
                }
            }
            document.getElementById('game-over').style.display = 'block';
            return true;
        }

        // Function to restart the game
        function restartGame() {
            board = [];
            score = 0;
            document.getElementById('game-over').style.display = 'none';
            initializeBoard();
        }

        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeBoard();
        });
    </script>
</body>
</html>
