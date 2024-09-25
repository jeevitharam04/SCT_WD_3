// Game variables
let board = [];
let currentPlayer = 'X';
let isGameActive = true;
let gameMode = 'pvp'; // Default mode is Player vs Player
let gridSize = 3; // Default to 3x3 grid

const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const modeSelect = document.getElementById('modeSelect');
const gridSizeSelect = document.getElementById('gridSizeSelect');

let WINNING_COMBINATIONS = [];

// Function to create the game board based on grid size
function createBoard() {
    // Clear previous board
    board = Array(gridSize * gridSize).fill('');
    gameBoard.innerHTML = '';
    gameBoard.className = `board grid-${gridSize}`;

    // Generate empty cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.textContent = '';  // Prepopulate with empty values to show the grid before the game starts
        gameBoard.appendChild(cell);
    }

    // Add event listeners to cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    calculateWinningCombinations();
}

// Function to calculate winning combinations for dynamic grid size
function calculateWinningCombinations() {
    WINNING_COMBINATIONS = [];

    // Rows
    for (let row = 0; row < gridSize; row++) {
        let rowCombo = [];
        for (let col = 0; col < gridSize; col++) {
            rowCombo.push(row * gridSize + col);
        }
        WINNING_COMBINATIONS.push(rowCombo);
    }

    // Columns
    for (let col = 0; col < gridSize; col++) {
        let colCombo = [];
        for (let row = 0; row < gridSize; row++) {
            colCombo.push(row * gridSize + col);
        }
        WINNING_COMBINATIONS.push(colCombo);
    }

    // Diagonals
    let diagonal1 = [], diagonal2 = [];
    for (let i = 0; i < gridSize; i++) {
        diagonal1.push(i * gridSize + i);
        diagonal2.push(i * gridSize + (gridSize - i - 1));
    }
    WINNING_COMBINATIONS.push(diagonal1, diagonal2);
}

// Function to handle user click
function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    // If cell is already filled or game is over, return
    if (board[index] !== '' || !isGameActive) return;

    // Update the board and check the game state
    updateBoard(index);
    checkWinOrTie();

    // If it's Player vs Computer, trigger the computer's move
    if (gameMode === 'pvc' && currentPlayer === 'O' && isGameActive) {
        setTimeout(computerMove, 500); // Small delay for the computer's move
    }
}

// Function to update board and change the current player
function updateBoard(index) {
    board[index] = currentPlayer;
    document.querySelector(`.cell[data-index="${index}"]`).textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
}

// Check for a winner or tie
function checkWinOrTie() {
    let roundWon = false;

    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const winCondition = WINNING_COMBINATIONS[i];
        const values = winCondition.map(idx => board[idx]);

        if (values.every(val => val !== '' && val === values[0])) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        gameStatus.textContent = `${currentPlayer === 'X' ? 'O' : 'X'} wins!`;
        return;
    }

    if (!board.includes('')) {
        isGameActive = false;
        gameStatus.textContent = "It's a tie!";
    }
}

// Reset game
function resetGame() {
    createBoard();
    isGameActive = true;
    currentPlayer = 'X';
    gameStatus.textContent = '';
}

// Add event listeners for mode and grid size
modeSelect.addEventListener('change', (e) => gameMode = e.target.value);
gridSizeSelect.addEventListener('change', (e) => {
    gridSize = parseInt(e.target.value);
    resetGame();
});
resetButton.addEventListener('click', resetGame);

// Function for computer's move
function computerMove() {
    if (!isGameActive) return;

    let emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (randomIndex !== undefined) {
        updateBoard(randomIndex);
        checkWinOrTie();
    }
}

// Initial setup
createBoard();
