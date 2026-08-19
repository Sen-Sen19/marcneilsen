<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sliding Puzzle</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        #puzzle-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 40px;
            width: 80%;
            max-width: 800px;
        }

        #puzzle {
            display: grid;
            grid-template-columns: repeat(4, 100px);
            grid-template-rows: repeat(4, 100px);
            gap: 2px;
            margin-bottom: 20px;
            border: 2px solid #333;
            background-color: #fff;
        }

        .puzzle-piece {
            width: 100px;
            height: 100px;
            background-size: 400px 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background-repeat: no-repeat;
            border: 1px solid #ddd;
            transition: transform 0.3s ease;
        }

        .puzzle-piece:hover {
            transform: scale(1.05);
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #20c997;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #17a689;
        }

        #reference-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            width: 200px;
            text-align: center;
        }

        #reference-image {
            width: 200px;
            height: 200px;
            background-size: cover;
            border: 2px solid #333;
        }

        select {
            padding: 5px;
            font-size: 14px;
            width: 100%;
            max-width: 150px;
            margin-top: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        label {
            font-size: 14px;
            margin-top: 10px;
            color: #333;
        }
    </style>
</head>
<body>
    <div id="puzzle-container">
        <div id="puzzle">
            <!-- Puzzle pieces will be added dynamically here -->
        </div>
        <div id="reference-container">
            <div id="reference-image"></div>
            <button id="shuffle-btn">Shuffle</button>
            <label for="image-selector">Choose Image</label>
            <select id="image-selector">
                <option value="landscape1.jpg">Landscape 1</option>
                <option value="landscape2.jpg">Landscape 2</option>
                <option value="landscape3.jpg">Landscape 3</option>
                <option value="landscape4.jpg">Landscape 4</option>
                <option value="landscape5.jpg">Landscape 5</option>
            </select>
        </div>
    </div>

    <script>
        const puzzleContainer = document.getElementById('puzzle');
        const shuffleButton = document.getElementById('shuffle-btn');
        const referenceImage = document.getElementById('reference-image');
        const imageSelector = document.getElementById('image-selector');
        let imageUrl = 'landscape1.jpg'; // Default image
        const gridSize = 4; // 4x4 grid (16 pieces)

        // Create the initial puzzle pieces
        let puzzlePieces = [];
        let emptySlot = { row: 3, col: 3 };

        // Initialize puzzle pieces
        function initPuzzle() {
            puzzlePieces = [];
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (row === gridSize - 1 && col === gridSize - 1) {
                        puzzlePieces.push(null); // Empty space
                    } else {
                        const piece = {
                            row,
                            col,
                            index: row * gridSize + col,
                            position: { row, col },
                        };
                        puzzlePieces.push(piece);
                    }
                }
            }
            renderPuzzle();
        }

        // Render the puzzle pieces on the grid
        function renderPuzzle() {
            puzzleContainer.innerHTML = '';
            puzzlePieces.forEach((piece, index) => {
                const div = document.createElement('div');
                div.classList.add('puzzle-piece');
                if (piece) {
                    div.style.backgroundImage = `url(${imageUrl})`;
                    div.style.backgroundPosition = `-${piece.col * 100}px -${piece.row * 100}px`;
                    div.setAttribute('data-index', index);
                    div.addEventListener('click', () => movePiece(piece));
                }
                puzzleContainer.appendChild(div);
            });
        }

        // Handle the move of a piece
        function movePiece(piece) {
            const pieceIndex = puzzlePieces.indexOf(piece);
            const emptyIndex = puzzlePieces.indexOf(null);

            const pieceRow = Math.floor(pieceIndex / gridSize);
            const pieceCol = pieceIndex % gridSize;

            const emptyRow = Math.floor(emptyIndex / gridSize);
            const emptyCol = emptyIndex % gridSize;

            if (
                (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
                (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
            ) {
                puzzlePieces[emptyIndex] = piece;
                puzzlePieces[pieceIndex] = null;
                renderPuzzle();
            }
        }

        // Shuffle the puzzle
        function shufflePuzzle() {
            for (let i = 0; i < 1000; i++) {
                const randomIndex = Math.floor(Math.random() * puzzlePieces.length);
                const randomPiece = puzzlePieces[randomIndex];
                if (randomPiece) {
                    movePiece(randomPiece);
                }
            }
        }

        // Initialize and shuffle on page load
        initPuzzle();

        shuffleButton.addEventListener('click', () => {
            shufflePuzzle();
        });

        // Change the image when the user selects a different one
        imageSelector.addEventListener('change', (e) => {
            imageUrl = e.target.value;
            referenceImage.style.backgroundImage = `url(${imageUrl})`;
            initPuzzle();
        });

        // Check if the puzzle is solved
        function checkWin() {
            return puzzlePieces.every((piece, index) => {
                if (!piece) return true;
                return piece.index === index;
            });
        }
    </script>
</body>
</html>
