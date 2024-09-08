document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById("game-board");
    const scoreDisplay = document.getElementById("score");
    const restartButton = document.getElementById("restart-btn");

    const highScoreDisplay = document.createElement("p");
    const highScoreTable = document.createElement("div");
    highScoreTable.setAttribute("id", "high-score-table");

    highScoreDisplay.textContent = "High Score: 0";
    scoreDisplay.parentNode.insertBefore(highScoreDisplay, scoreDisplay.nextSibling); // Display high score under current score

    document.body.appendChild(highScoreTable); // Add high score table to the body

    let tiles = [];
    let score = 0;
    let highScore = 0;
    let scoresHistory = []; // To keep track of the score history

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear the board before creating new tiles
        tiles = []; // Reset the tiles array

        for (let i = 0; i < 16; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.textContent = ""; // Ensure each tile starts as an empty string
            gameBoard.appendChild(tile);
            tiles.push(tile);
        }
        generateNewTile();
        generateNewTile();
    }

    function generateNewTile() {
        const emptyTiles = tiles.filter(tile => tile.textContent.trim() === ""); // Handle trimmed empty strings
        if (emptyTiles.length === 0) return;

        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        randomTile.textContent = Math.random() < 0.1 ? "2" : "4"; // Assign "2" or "4" as strings to avoid NaN
        checkGameOver();
    }

    function moveTile(direction) {
        switch (direction) {
            case "left":
                for (let i = 0; i < 4; i++) combineRow(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3);
                break;
            case "right":
                for (let i = 0; i < 4; i++) combineRow(i * 4 + 3, i * 4 + 2, i * 4 + 1, i * 4);
                break;
            case "up":
                for (let i = 0; i < 4; i++) combineRow(i, i + 4, i + 8, i + 12);
                break;
            case "down":
                for (let i = 0; i < 4; i++) combineRow(i + 12, i + 8, i + 4, i);
                break;
        }
        generateNewTile();
    }

    function combineRow(a, b, c, d) {
        const tileArray = [tiles[a], tiles[b], tiles[c], tiles[d]];
        const values = tileArray.map(tile => Number(tile.textContent.trim()) || 0); // Use Number() to handle any non-numeric value
        const filteredValues = values.filter(value => value !== 0);

        for (let i = 0; i < filteredValues.length - 1; i++) {
            if (filteredValues[i] === filteredValues[i + 1]) {
                filteredValues[i] *= 2;
                filteredValues[i + 1] = 0;
                score += filteredValues[i];
                scoreDisplay.textContent = score; // Update the score correctly

                if (score > highScore) { // Update high score
                    highScore = score;
                    highScoreDisplay.textContent = `High Score: ${highScore}`;
                }

            }
        }

        const newRow = filteredValues.filter(value => value !== 0);
        while (newRow.length < 4) newRow.push(0);

        tileArray.forEach((tile, index) => {
            tile.textContent = newRow[index] === 0 ? "" : newRow[index]; // Ensure tiles are set to numbers or empty strings
        });
    }

    function checkGameOver() {
        if (tiles.every(tile => tile.textContent.trim() !== "")) {
            alert("Game Over! Your score is: " + score);
            scoresHistory.push(score); // Add the score to the history
            updateHighScoreTable(); // Update the high score table
            resetGame(); // Restart the game automatically
        }
    }


    function updateHighScoreTable() {
        highScoreTable.innerHTML = "<h3>High Scores</h3>";
        const sortedScores = [...scoresHistory].sort((a, b) => b - a); // Sort scores in descending order
        sortedScores.forEach((score, index) => {
            const scoreEntry = document.createElement("p");
            scoreEntry.textContent = `#${index + 1}: ${score}`;
            highScoreTable.appendChild(scoreEntry);
        });
    }

    function resetGame() {
        tiles.forEach(tile => (tile.textContent = "")); // Reset all tiles to be empty
        score = 0;
        scoreDisplay.textContent = score; // Reset score display
        createBoard(); // Recreate the board instead of just generating new tiles
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                moveTile("left");
                break;
            case "ArrowRight":
                moveTile("right");
                break;
            case "ArrowUp":
                moveTile("up");
                break;
            case "ArrowDown":
                moveTile("down");
                break;
        }
    });

    restartButton.addEventListener("click", () => {
        resetGame();
    });

    createBoard();
});
