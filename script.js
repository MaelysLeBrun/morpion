const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const themeToggle = document.getElementById('themeToggle');
const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playerSymbolSelect = document.getElementById('playerSymbolSelect');
const aiSymbolSelect = document.getElementById('aiSymbolSelect');

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let playerScore = 0;
let aiScore = 0;
let playerSymbol = "X";
let aiSymbol = "O";

// Conditions de victoire
const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

startGame();

function startGame() {
  cells.forEach(cell => {
    cell.textContent = "";
    cell.addEventListener('click', handleClick);
  });
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "À toi de jouer !";
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") return;

  makeMove(index, playerSymbol);
  if (checkWin(playerSymbol)) {
    statusText.textContent = "Tu as gagné ! 🎉";
    playerScore++;
    playerScoreEl.textContent = playerScore;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "Match nul 😐";
    gameActive = false;
    return;
  }

  setTimeout(() => {
    const aiIndex = getBestAIMove();
    makeMove(aiIndex, aiSymbol);
    if (checkWin(aiSymbol)) {
      statusText.textContent = "L'IA a gagné ! 🤖";
      aiScore++;
      aiScoreEl.textContent = aiScore;
      gameActive = false;
    } else if (isDraw()) {
      statusText.textContent = "Match nul 😐";
      gameActive = false;
    }
  }, 500);
}

function makeMove(index, symbol) {
  board[index] = symbol;
  cells[index].textContent = symbol;
}

function getBestAIMove() {
  // Gagner si possible
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiSymbol;
      if (checkWin(aiSymbol)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Bloquer joueur
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = playerSymbol;
      if (checkWin(playerSymbol)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Sinon, aléatoire
  const available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function checkWin(symbol) {
  return winConditions.some(comb => 
    comb.every(index => board[index] === symbol)
  );
}

function isDraw() {
  return board.every(cell => cell !== "");
}

restartBtn.addEventListener('click', () => {
  startGame();
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

playerNameInput.addEventListener('input', () => {
  playerNameDisplay.textContent = playerNameInput.value || "Joueur";
});

playerSymbolSelect.addEventListener('change', () => {
  playerSymbol = playerSymbolSelect.value;
  aiSymbol = aiSymbolSelect.value;
  startGame();
});

aiSymbolSelect.addEventListener('change', () => {
  aiSymbol = aiSymbolSelect.value;
  playerSymbol = playerSymbolSelect.value;
  startGame();
});

