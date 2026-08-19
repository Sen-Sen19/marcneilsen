<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Typing Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            width: 400px;
            text-align: center;
        }

        h1 {
            margin-bottom: 20px;
        }

        #timer {
            font-size: 18px;
            margin-bottom: 10px;
        }

        #test-word {
            font-size: 24px;
            margin: 20px 0;
        }

        textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 20px;
            font-size: 16px;
            padding: 10px;
            background-color: #2a2a2a;
            color: white;
            border: none;
            border-radius: 4px;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
        }

        button:disabled {
            background-color: #555;
        }

        .hidden {
            display: none;
        }

        #results {
            margin-top: 20px;
        }

        #highscore {
            margin-top: 10px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
    
        <div id="highscore">High Score: <span id="highscore-name">N/A</span> - <span id="highscore-score">0</span> WPM</div>
        <div id="timer">Time: <span id="time">60</span> seconds</div>
        <p id="test-word">Press "Start" to begin!</p>
       
        <textarea id="input-text" placeholder="Type the word above..." autofocus disabled></textarea>
        <button id="start-btn">Start Test</button>
        <div id="results" class="hidden">
            <p>Your speed: <span id="speed"></span> WPM</p>
            <input type="text" id="name-input" placeholder="Enter your name" class="hidden">
            <button id="submit-btn" class="hidden">Submit</button>
            <button id="restart-btn" class="hidden">Restart Test</button>
            <button id="reset-highscore-btn">Reset High Score</button>
        </div>
    </div>
    <script> 
    const words = [
        "abacus", "aberration", "abominable", "abundance", "accommodate",
        "acquaintance", "adversary", "aesthetic", "allegiance", "amphibious",
        "anomaly", "apocalypse", "arbitrary", "artificial", "astrophysics",
        "benevolent", "biochemistry", "camaraderie", "caterpillar", "circumference",
        "cognition", "conundrum", "counterfeit", "debilitate", "dichotomy",
        "discrepancy", "disseminate", "eloquence", "emancipation", "enigma",
        "ephemeral", "exacerbate", "facetious", "gargantuan", "harbinger",
        "hypothesis", "indispensable", "inevitable", "juxtaposition", "kaleidoscope",
        "metamorphosis", "nebulous", "obsidian", "paradox", "quintessential",
        "rendezvous", "serendipity", "sophisticated", "subterfuge", "synergy",
        "transcend", "ubiquitous", "vicarious", "vortex", "zephyr",
        "capricious", "deteriorate", "effervescent", "gregarious", "inquisitive",
        "juxtaposition", "melancholy", "nihilism", "obfuscate", "perfunctory",
        "quixotic", "resilient", "sagacious", "temerity", "unprecedented",
        "verisimilitude", "winsome", "xenophobia", "yearn", "zealot",
        "altruism", "benign", "cogent", "daunting", "epitome",
        "fervent", "germane", "histrionic", "incandescent", "juxtapose",
        "lackadaisical", "magnanimous", "nonchalant", "opulent", "parsimony",
        "quintessence", "rhetoric", "salient", "taciturn", "ubiquity",
        "abridged", "cacophony", "dichotomy", "efficacious", "futuristic",
        "garrulous", "hypothetical", "idiosyncratic", "juxtaposition", "kryptonite",
        "languid", "meticulous", "nefarious", "obfuscation", "perceptive",
        "quizzical", "retrospective", "supercilious", "tranquil", "utilitarian",
        "vicissitude", "whimsical", "xenophobic", "yoke", "zephyr",
        "archetype", "belligerent", "cogitation", "dilapidated", "egregious",
        "flabbergasted", "germination", "hyperbole", "inscrutable", "jubilant",
        "kaleidoscopic", "litigious", "metamorphic", "neologism", "oblivion",
        "paradigm", "quagmire", "reciprocate", "schadenfreude", "turbulent",
        "ubiquitously", "venerable", "wistful", "xylophone", "zenith"
    ];

    let timer;
    let timeLeft = 60;
    let wordIndex = 0;
    let correctWordsCount = 0;
    let totalWordsTyped = 0; // Track total words typed
    let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
    let highScoreName = localStorage.getItem("highScoreName") || "";
    const inputText = document.getElementById("input-text");
    const startButton = document.getElementById("start-btn");
    const restartButton = document.getElementById("restart-btn");
    const testWord = document.getElementById("test-word");
    const timerDisplay = document.getElementById("time");
    const resultsDiv = document.getElementById("results");
    const speedDisplay = document.getElementById("speed");
    const nameInput = document.getElementById("name-input");
    const submitButton = document.getElementById("submit-btn");
    const highscoreScoreDisplay = document.getElementById("highscore-score");
    const highscoreNameDisplay = document.getElementById("highscore-name");

    // Initialize high score display
    highscoreScoreDisplay.innerText = highScore;
    highscoreNameDisplay.innerText = highScoreName;

    startButton.addEventListener("click", startTest);
    restartButton.addEventListener("click", restartTest);
    submitButton.addEventListener("click", submitHighScore);

    function startTest() {
        inputText.value = '';
        inputText.disabled = false;
        inputText.focus();
        resultsDiv.classList.add("hidden");
        startButton.disabled = true;
        restartButton.classList.add("hidden"); // Hide restart button at the start
        correctWordsCount = 0;
        totalWordsTyped = 0; // Reset total words typed
        wordIndex = 0;
        timeLeft = 60;
        timerDisplay.innerText = timeLeft;
        
        shuffleWords(words); // Shuffle the words before starting
        nextWord();
        startTimer();
        
        inputText.addEventListener("input", checkInput);
    }

    function shuffleWords(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function nextWord() {
        if (wordIndex < words.length) {
            testWord.innerText = words[wordIndex];
        } else {
            testWord.innerText = "No more words!";
        }
    }

    function checkInput() {
        const input = inputText.value;
        totalWordsTyped++; // Increment total words typed
        
        if (input === testWord.innerText) {
            correctWordsCount++;
            wordIndex++;
            inputText.value = '';
            nextWord();
        }
        
        // Update the WPM and speed only when the timer runs out
        if (timeLeft === 0) {
            endTest();
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.innerText = timeLeft;
            } else {
                endTest();
            }
        }, 1000);
    }

    function endTest() {
    clearInterval(timer);
    inputText.disabled = true;
    startButton.disabled = false;
    resultsDiv.classList.remove("hidden");
    inputText.removeEventListener("input", checkInput);
    restartButton.classList.remove("hidden"); // Show restart button after finishing the test

    // Calculate WPM based on correct words typed and time used
    const usedTime = 60 - timeLeft; // Calculate how much time was actually used
    const wpm = usedTime > 0 ? Math.floor((correctWordsCount / usedTime) * 60) : 0; // Prevent division by zero
    speedDisplay.innerText = wpm;

    // Check for high score
    if (wpm > highScore) {
        highScore = wpm;
        highScoreName = nameInput.value || "Anonymous"; // Get the name or use "Anonymous"
        localStorage.setItem("highScore", highScore);
        localStorage.setItem("highScoreName", highScoreName);
        highscoreScoreDisplay.innerText = highScore;
        highscoreNameDisplay.innerText = highScoreName; // Display high scorer's name
        nameInput.classList.remove("hidden");
        submitButton.classList.remove("hidden");
    }
}


    function restartTest() {
        resultsDiv.classList.add("hidden");
        nameInput.classList.add("hidden");
        submitButton.classList.add("hidden");
        startButton.disabled = false;
        highscoreScoreDisplay.innerText = highScore;
        highscoreNameDisplay.innerText = highScoreName; // Refresh high score display
    }

    function submitHighScore() {
        const name = nameInput.value;
        if (name) {
            localStorage.setItem("highScoreName", name);
            highscoreNameDisplay.innerText = name;
        }
    }

    const resetHighScoreButton = document.getElementById("reset-highscore-btn");

    resetHighScoreButton.addEventListener("click", resetHighScore);

    function resetHighScore() {
        localStorage.removeItem("highScore");
        localStorage.removeItem("highScoreName");
        highScore = 0; // Reset the high score variable
        highScoreName = ""; // Reset the high score name variable
        highscoreScoreDisplay.innerText = highScore; // Update the display
        highscoreNameDisplay.innerText = "N/A"; // Update the display
    }
</script>

</body>
</html>
