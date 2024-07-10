// Elements and initial state
let gridSizeInput = document.getElementById('grid-size');
let createGridButton = document.getElementById('create-grid');
let gameBoard = document.querySelector('.game-board');
let playerTurn = document.querySelector('.player-turn');
let resetButton = document.querySelector('.reset-button');
let currentPlayer = 'X';
let gameState = [];
let gameActive = true;
let gridSize = 3;

// Create grid function
function createGrid() {
  gridSize = parseInt(gridSizeInput.value);
  if (isNaN(gridSize) || gridSize < 3 || gridSize > 10) {
    alert('Invalid grid size. Please enter a value between 3 and 10.');
    return;
  }

  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

  gameBoard.innerHTML = '';
  gameState = Array(gridSize * gridSize).fill('');

  for (let i = 0; i < gridSize * gridSize; i++) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener(
      'click',
      (function (i) {
        return function () {
          cellClicked(i);
        };
      })(i)
    );
    gameBoard.appendChild(cell);
  }

  resetGame();
}

// Cell click handler
function cellClicked(index) {
  if (gameState[index] !== '' || !gameActive) {
    return;
  }

  gameState[index] = currentPlayer;
  gameBoard.children[index].textContent = currentPlayer;

  if (checkWin()) {
    playerTurn.textContent = currentPlayer + ' wins!';
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    playerTurn.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  playerTurn.textContent = currentPlayer + "'s turn";
}

// Check win function
function checkWin() {
  let winningConditions = [];

  // Rows
  for (let i = 0; i < gridSize; i++) {
    let start = i * gridSize;
    let end = start + gridSize;
    winningConditions.push(
      Array.from({ length: gridSize }, function (_, j) {
        return start + j;
      })
    );
  }

  // Columns
  for (let i = 0; i < gridSize; i++) {
    winningConditions.push(
      Array.from({ length: gridSize }, function (_, j) {
        return i + j * gridSize;
      })
    );
  }

  // Diagonals
  winningConditions.push(
    Array.from({ length: gridSize }, function (_, i) {
      return i * (gridSize + 1);
    })
  );
  winningConditions.push(
    Array.from({ length: gridSize }, function (_, i) {
      return (i + 1) * (gridSize - 1);
    })
  );

  for (let condition of winningConditions) {
    let a = condition[0];
    let b = condition[1];
    let rest = condition.slice(2);
    if (
      gameState[a] !== '' &&
      gameState[a] === gameState[b] &&
      rest.every(function (index) {
        return gameState[index] === gameState[a];
      })
    ) {
      return true;
    }
  }

  return false;
}

// Check draw function
function checkDraw() {
  return gameState.every(function (cell) {
    return cell !== '';
  });
}

// Reset game function
function resetGame() {
  gameState = Array(gridSize * gridSize).fill('');
  gameBoard.querySelectorAll('.cell').forEach(function (cell) {
    cell.textContent = '';
  });
  currentPlayer = 'X';
  gameActive = true;
  playerTurn.textContent = currentPlayer + "'s turn";
}

// Event listeners
createGridButton.addEventListener('click', createGrid);
resetButton.addEventListener('click', resetGame);
