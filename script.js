const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playerSymbolSelect = document.getElementById('playerSymbolSelect');
const aiSymbolSelect = document.getElementById('aiSymbolSelect');

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let playerScore = 0;
let aiScore = 0;
let playerSymbol = playerSymbolSelect.value || "X";
let aiSymbol = aiSymbolSelect.value || "O";

// Conditions de victoire
const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

startGame();

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "À toi de jouer !";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('winning-cell');
    cell.addEventListener('click', handleClick);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  makeMove(index, playerSymbol);

  if (checkWin(playerSymbol)) {
    statusText.textContent = "Tu as gagné ! 🎉";
    playerScore++;
    playerScoreEl.textContent = playerScore;
    highlightWin(playerSymbol);
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
      highlightWin(aiSymbol);
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

function highlightWin(symbol) {
  const winningCombo = winConditions.find(comb => comb.every(i => board[i] === symbol));
  if (winningCombo) {
    winningCombo.forEach(i => {
      cells[i].classList.add('winning-cell');
    });
  }
}

// Événements

restartBtn.addEventListener('click', () => {
  startGame();
});

playerNameInput.addEventListener('input', () => {
  playerNameDisplay.textContent = playerNameInput.value.trim() || "Joueur";
});

playerSymbolSelect.addEventListener('change', () => {
  if(playerSymbolSelect.value === aiSymbolSelect.value) {
    alert("Le joueur et l'IA ne peuvent pas avoir le même symbole !");
    playerSymbolSelect.value = playerSymbol; // Revenir au symbole précédent
    return;
  }
  playerSymbol = playerSymbolSelect.value;
  startGame();
});

aiSymbolSelect.addEventListener('change', () => {
  if(aiSymbolSelect.value === playerSymbolSelect.value) {
    alert("Le joueur et l'IA ne peuvent pas avoir le même symbole !");
    aiSymbolSelect.value = aiSymbol; // Revenir au symbole précédent
    return;
  }
  aiSymbol = aiSymbolSelect.value;
  startGame();
});
