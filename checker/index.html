<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dama (Turkish Checkers)</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }

        #gameBoard {
            display: grid;
            grid-template-columns: repeat(8, 50px);
            grid-template-rows: repeat(8, 50px);
            gap: 2px;
            background-color: #000;
        }

        .cell {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .cell.black {
            background-color: #000;
        }

        .cell.white {
            background-color: #fff;
        }

        .piece {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
        }

        .piece.red {
            background-color: #ffe6bb;
        }

        .piece.blue {
            background-color: #ac6e00;
        }

        .selected {
            border: 2px solid yellow;
        }

        .valid-move {
            background-color: yellow;
        }

        .dama {
            border: 2px solid gold;
        }
    </style>
</head>
<body>
    <div id="gameBoard"></div>
    <script>
        const gameBoard = document.getElementById('gameBoard');

        const board = [
            [' ', 'R', ' ', 'R', ' ', 'R', ' ', 'R'],
            ['R', ' ', 'R', ' ', 'R', ' ', 'R', ' '],
            [' ', 'R', ' ', 'R', ' ', 'R', ' ', 'R'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            ['B', ' ', 'B', ' ', 'B', ' ', 'B', ' '],
            [' ', 'B', ' ', 'B', ' ', 'B', ' ', 'B'],
            ['B', ' ', 'B', ' ', 'B', ' ', 'B', ' ']
        ];

        let selectedPiece = null;
        let currentPlayer = 'R';

        function drawBoard() {
            gameBoard.innerHTML = '';
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    if ((row + col) % 2 === 0) {
                        cell.classList.add('white');
                    } else {
                        cell.classList.add('black');
                        if (board[row][col] !== ' ') {
                            const piece = document.createElement('div');
                            piece.classList.add('piece');
                            piece.classList.add(board[row][col].startsWith('R') ? 'red' : 'blue');
                            if (board[row][col].includes('+')) {
                                piece.classList.add('dama');
                            }
                            piece.dataset.row = row;
                            piece.dataset.col = col;
                            piece.addEventListener('click', selectPiece);
                            cell.appendChild(piece);
                        }
                    }
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', movePiece);
                    gameBoard.appendChild(cell);
                }
            }
        }

        function selectPiece(event) {
            if (selectedPiece) {
                selectedPiece.classList.remove('selected');
                clearValidMoves();
            }

            const piece = event.target;
            const pieceRow = parseInt(piece.dataset.row);
            const pieceCol = parseInt(piece.dataset.col);

            if (board[pieceRow][pieceCol].charAt(0) !== currentPlayer) {
                return;
            }

            selectedPiece = piece;
            selectedPiece.classList.add('selected');
            showValidMoves(pieceRow, pieceCol);
        }

        function showValidMoves(row, col) {
            const piece = board[row][col];
            const directions = (piece === 'R' || piece === 'B') ? [[1, -1], [1, 1], [-1, -1], [-1, 1]] : [[1, -1], [1, 1], [-1, -1], [-1, 1]];
            const isDama = piece.includes('+');

            directions.forEach(direction => {
                let [dRow, dCol] = direction;
                let newRow = row + dRow;
                let newCol = col + dCol;

                while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    if (board[newRow][newCol] === ' ') {
                        const cell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
                        cell.classList.add('valid-move');
                        if (!isDama) break;
                    } else {
                        if (board[newRow][newCol].charAt(0) !== currentPlayer) {
                            const jumpRow = newRow + dRow;
                            const jumpCol = newCol + dCol;
                            if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && board[jumpRow][jumpCol] === ' ') {
                                const cell = document.querySelector(`.cell[data-row='${jumpRow}'][data-col='${jumpCol}']`);
                                cell.classList.add('valid-move');
                            }
                        }
                        break;
                    }
                    newRow += dRow;
                    newCol += dCol;
                }
            });
        }

        function clearValidMoves() {
            document.querySelectorAll('.valid-move').forEach(cell => cell.classList.remove('valid-move'));
        }

        function movePiece(event) {
            if (!selectedPiece) return;

            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            const selectedRow = parseInt(selectedPiece.dataset.row);
            const selectedCol = parseInt(selectedPiece.dataset.col);

            if (!event.target.classList.contains('valid-move')) return;

            const piece = board[selectedRow][selectedCol];
            board[selectedRow][selectedCol] = ' ';
            board[row][col] = piece;

            if (Math.abs(row - selectedRow) === 2 && Math.abs(col - selectedCol) === 2) {
                const capturedRow = (row + selectedRow) / 2;
                const capturedCol = (col + selectedCol) / 2;
                board[capturedRow][capturedCol] = ' ';
            }

            if ((currentPlayer === 'R' && row === 7) || (currentPlayer === 'B' && row === 0)) {
                board[row][col] = piece.charAt(0) + '+';
            }

            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            clearValidMoves();

            currentPlayer = currentPlayer === 'R' ? 'B' : 'R';
            drawBoard();
        }

        drawBoard();
    </script>
</body>
</html>
