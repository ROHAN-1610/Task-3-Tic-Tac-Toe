const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const toggleAIButton = document.getElementById('toggleAIButton');
const playerXWinsText = document.getElementById('playerXWins');
const playerOWinsText = document.getElementById('playerOWins');
const drawsText = document.getElementById('draws');
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerXWins = 0;
let playerOWins = 0;
let draws = 0;
let running = false;
let aiMode = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartButton.addEventListener('click', restartGame);
    toggleAIButton.addEventListener('click', toggleAI);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    if (aiMode && running && currentPlayer === "O") {
        setTimeout(() => aiPlay(), 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === "X" ? "x-cell" : "o-cell");
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        updateStats(currentPlayer);
        running = false;
        return;
    }

    if (!options.includes("")) {
        statusText.textContent = "It's a draw!";
        draws++;
        drawsText.textContent = `Draws: ${draws}`;
        running = false;
        return;
    }

    changePlayer();
}

function updateStats(winner) {
    if (winner === "X") {
        playerXWins++;
        playerXWinsText.textContent = `Player X Wins: ${playerXWins}`;
    } else {
        playerOWins++;
        playerOWinsText.textContent = `Player O Wins: ${playerOWins}`;
    }
}

function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x-cell", "o-cell");
    });
    currentPlayer = "X";
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function aiPlay() {
    const emptyIndices = options.map((option, index) => option === "" ? index : null).filter(index => index !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const cell = cells[randomIndex];

    updateCell(cell, randomIndex);
    checkWinner();
}

function toggleAI() {
    aiMode = !aiMode;
    toggleAIButton.textContent = aiMode ? "Disable AI Mode" : "Enable AI Mode";
}
