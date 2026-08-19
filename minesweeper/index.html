<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minesweeper</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #121212; /* Dark background */
            color: #ffffff; /* Light text color */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh; /* Full viewport height */
            margin: 0; /* Remove default margin */
        }

        #gameBoard {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); /* Responsive grid */
            gap: 1px;
            margin: 20px auto;
            border: 2px solid #333;
            width: 90vw; /* 90% of the viewport width */
            max-width: 400px; /* Maximum width for larger screens */
        }

        .cell {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #1e1e1e; /* Darker cell background */
            color: #ffffff; /* Light text color for numbers */
            cursor: pointer;
            font-size: 20px;
            transition: background-color 0.3s;
        }

        .cell.revealed {
            background-color: #282828; /* Slightly lighter for revealed cells */
            cursor: default;
        }

        .cell.mine {
            background-color: #ff4c4c; /* Red for mines */
        }

        .cell.flag {
            background-color: #ffea00; /* Yellow for flagged cells */
        }

        .cell:hover {
            background-color: #3a3a3a; /* Hover effect for cells */
        }

        #resetBtn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #333;
            color: #ffffff;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #resetBtn:hover {
            background-color: #555; /* Darker button on hover */
        }
    </style>
</head>
<body>
    <h1>Minesweeper</h1>
    <div id="gameBoard"></div>
    <button id="resetBtn">Reset Game</button>
    <script>
        const boardSize = 10; // 10x10 board
        const mineCount = 10; // Number of mines
        let board = [];
        let isGameOver = false;

        const gameBoard = document.getElementById('gameBoard');
        const resetBtn = document.getElementById('resetBtn');

        function createBoard() {
            board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

            // Place mines
            let placedMines = 0;
            while (placedMines < mineCount) {
                const row = Math.floor(Math.random() * boardSize);
                const col = Math.floor(Math.random() * boardSize);
                if (board[row][col] !== 'X') {
                    board[row][col] = 'X';
                    placedMines++;
                    updateSurroundingCells(row, col);
                }
            }

            // Create the grid
            gameBoard.innerHTML = '';
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', () => handleCellClick(row, col));
                    gameBoard.appendChild(cell);
                }
            }
        }

        function updateSurroundingCells(row, col) {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] !== 'X') {
                        board[r][c]++;
                    }
                }
            }
        }

        function handleCellClick(row, col) {
            if (isGameOver || board[row][col] === 'revealed') return;

            const cell = gameBoard.children[row * boardSize + col];
            if (board[row][col] === 'X') {
                cell.classList.add('mine');
                alert('Game Over! You clicked on a mine.');
                isGameOver = true;
                revealMines();
            } else {
                revealCell(row, col);
            }
        }

        function revealCell(row, col) {
            const cell = gameBoard.children[row * boardSize + col];
            cell.classList.add('revealed');
            cell.textContent = board[row][col] > 0 ? board[row][col] : '';

            if (board[row][col] === 0) {
                for (let r = row - 1; r <= row + 1; r++) {
                    for (let c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
                            handleCellClick(r, c);
                        }
                    }
                }
            }
        }

        function revealMines() {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    if (board[row][col] === 'X') {
                        const cell = gameBoard.children[row * boardSize + col];
                        cell.classList.add('mine');
                    }
                }
            }
        }

        resetBtn.addEventListener('click', () => {
            isGameOver = false;
            createBoard();
        });

        createBoard();
    </script>
</body>
</html>
