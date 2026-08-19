<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Piano Tiles Game</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .game-container {
            text-align: center;
            position: relative;
            width: 340px;
            overflow: hidden;
        }
        #score {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .tiles {
            display: flex;
            justify-content: center;
            gap: 10px;
            position: relative;
        }
        .tile {
            width: 100px;
            height: 300px;
            background-color: #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: pointer;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
            transition: background-color 0.2s;
        }
        .tile.active {
            background-color: #bbb;
        }
        .note {
            width: 100px;
            height: 40px;
            background-color: #000;
            position: absolute;
            top: -40px;
            left: 0;
            transition: top linear;
        }
        .hit-line {
            position: absolute;
            bottom: 40px;
            width: 100%;
            height: 5px;
            background-color: red;
        }
    </style> 
</head>
<body>
    <div class="game-container">
        <div id="score">Score: 0</div>
        <div class="tiles">
            <div class="tile" id="tile-a">
                A
                <div class="hit-line"></div>
            </div>
            <div class="tile" id="tile-s">
                S
                <div class="hit-line"></div>
            </div>
            <div class="tile" id="tile-d">
                D
                <div class="hit-line"></div>
            </div>
        </div>
    </div>
    <script>
        let score = 0;
        let speed = 1000;
        let noteInterval;
        const tiles = {
            'a': document.getElementById('tile-a'),
            's': document.getElementById('tile-s'),
            'd': document.getElementById('tile-d')
        };

        function createNote() {
            const keys = ['a', 's', 'd'];
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const tile = tiles[randomKey];

            const note = document.createElement('div');
            note.classList.add('note');
            tile.appendChild(note);

            moveNoteDown(note, randomKey);
        }

        function moveNoteDown(note, key) {
            let position = -40;
            const interval = setInterval(() => {
                position += 5;
                note.style.top = `${position}px`;

                if (position >= 260) {
                    clearInterval(interval);
                    note.remove();
                    // End the game if a note reaches the bottom
                    if (!note.classList.contains('hit')) {
                        endGame();
                    }
                }
            }, speed / 50);
        }

        function handleKeyPress(event) {
            const key = event.key.toLowerCase();
            if (tiles[key]) {
                const tile = tiles[key];
                tile.classList.add('active');

                // Remove the active class after 200ms
                setTimeout(() => {
                    tile.classList.remove('active');
                }, 200);

                const notes = tile.getElementsByClassName('note');
                if (notes.length > 0) {
                    const note = notes[0];
                    const notePosition = parseInt(note.style.top);
                    // Adjust these values based on your game's layout and CSS
                    if (notePosition >= 215 && notePosition <= 275) {
                        note.remove(); // Remove the note from the tile
                        note.classList.add('hit');
                        score++;
                        document.getElementById('score').innerText = `Score: ${score}`;
                        increaseSpeed();
                    }
                }
            }
        }

        function increaseSpeed() {
            if (speed > 200) {
                speed -= 50;
                clearInterval(noteInterval);
                noteInterval = setInterval(createNote, speed);
            }
        }

        function startGame() {
            noteInterval = setInterval(createNote, speed);
        }

        function endGame() {
            alert(`Game Over! Your score: ${score}`);
            clearInterval(noteInterval); // Stop notes from falling
            document.removeEventListener('keydown', handleKeyPress); // Remove event listener
            document.location.reload(); // Reload the page
        }

        document.addEventListener('keydown', handleKeyPress);
        startGame();
    </script>
</body>
</html>
