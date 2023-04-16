import * as modal from "./modal.js";
// GAME CONSTANTS
const PASSWORD_LENGTH = 4;
const MAX_GUESSES = 9;

// GAME VARIABLES
let PASSWORD;
let BOARD;
let GUESSES_COUNT = MAX_GUESSES;

// GAME DEFINITIONS
const COLORS = {
  vazio: "",
  errado: "var(--wrong)",
  fazParte: "var(--inSolution)",
  certo: "var(--right)",
};

const GAME_STATE = {
  STOP: "STOP",
  RUNNING: "RUNNING",
};

const game = {
  time: 0,
  timer: null,
  status: GAME_STATE.STOP,
};

// GAME LOGIC
export function tryPassword(e) {
  const keyCode = e.keyCode;
  const value = e.target.value;

  //enter keyCode is 13
  if (
    keyCode === 13 &&
    value.length === PASSWORD_LENGTH &&
    game.status === GAME_STATE.RUNNING
  ) {
    if (!game.timer) startTimer();
    makeNewGuess(value);
    e.target.value = "";
  }
}

export function validateInput(e) {
  const key = e.data;
  const value = e.target.value;
  let currentVal = value.split("").splice(0, value.length - 1);
  if (currentVal.includes("" + key)) {
    e.target.value = value.slice(0, value.length - 1);
  }
}

function resetTimer() {
  game.time = 0;
  if (game.timer) clearInterval(game.timer);
  game.timer = null;
}

export function resetGame() {
  BOARD = document.getElementById("main-board");
  if (BOARD) BOARD.innerHTML = "";

  resetTimer();
  renderTime();

  PASSWORD = generatePassword();
  GUESSES_COUNT = MAX_GUESSES;
  updateGuessesCount(GUESSES_COUNT);
  game.status = GAME_STATE.RUNNING;
}

function updateGuessesCount(newCount) {
  const guessesCount = document.getElementById("guess-counter");
  guessesCount.innerHTML = newCount;
}

function generatePassword() {
  const password = [];
  let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    let pos = getRandomDigit(0, digits.length);
    password.push(`${digits.splice(pos, 1)[0]}`);
  }
  return password;
}

function getRandomDigit(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeNewGuess(value) {
  const guess = value.split("");
  GUESSES_COUNT--;
  updateGuessesCount(GUESSES_COUNT);
  renderNewGuess(guess);

  // check win or lose
  if (countWellPlaced(guess) === PASSWORD_LENGTH) {
    winGame();
    return;
  }

  if (GUESSES_COUNT === 0) {
    loseGame();
    return;
  }
}

function startTimer() {
  game.time = 0;
  game.timer = setInterval(() => {
    game.time++;
    renderTime();
  }, 1000);
}

function secondsToMinNotation(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  const minString = minutes.toString().padStart(2, "0");
  const secondsString = secondsLeft.toString().padStart(2, "0");
  return `${minString}:${secondsString}`;
}

function countWellPlaced(guess) {
  let wellPlaced = 0;
  guess.forEach((digit, index) => {
    if (digit === PASSWORD[index]) {
      wellPlaced++;
    }
  });
  return wellPlaced;
}

function countRights(guess) {
  let rights = 0;
  const passwordCopy = [...PASSWORD];
  guess.forEach((digit) => {
    if (passwordCopy.indexOf(digit) > -1) {
      passwordCopy.splice(passwordCopy.indexOf(digit), 1);
      rights++;
    }
  });
  return rights;
}

/********************
 *
 * DOM MANIPULATION
 *
 *******************/

function createTile(number) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  //change the color of the tile by clicking
  tile.addEventListener("click", () => {
    const color = tile.style.backgroundColor;

    if (color === COLORS.vazio) tile.style.backgroundColor = COLORS.errado;
    if (color === COLORS.errado) tile.style.backgroundColor = COLORS.fazParte;
    if (color === COLORS.fazParte) tile.style.backgroundColor = COLORS.certo;
    if (color === COLORS.certo) tile.style.backgroundColor = COLORS.vazio;
  });

  tile.innerHTML = number;
  return tile;
}

function renderTime() {
  const timer = document.getElementById("timer");
  timer.innerText = `${secondsToMinNotation(game.time)}`;
}

function renderPasswordTiles(guess, newRow) {
  guess.forEach((digit) => {
    const newTile = createTile(digit);
    newRow.appendChild(newTile);
  });
}

function renderInfoRigths(count, newRow) {
  const infoRight = document.createElement("div");
  infoRight.classList.add("tile");
  infoRight.classList.add("info-tile-rights");
  infoRight.innerHTML = count;

  newRow.appendChild(infoRight);
}

function renderInfoWellPlaced(count, newRow) {
  const infoWellPlaced = document.createElement("div");
  infoWellPlaced.classList.add("tile");
  infoWellPlaced.classList.add("info-tile-well-placed");
  infoWellPlaced.innerHTML = count;

  newRow.appendChild(infoWellPlaced);
}

function renderNewGuess(guess) {
  const newRow = document.createElement("div");
  newRow.setAttribute("class", "guess-row");

  renderPasswordTiles(guess, newRow);

  renderInfoRigths(countRights(guess), newRow);

  renderInfoWellPlaced(countWellPlaced(guess), newRow);

  BOARD.appendChild(newRow);
}

function winGame() {
  clearInterval(game.timer);
  document.querySelectorAll("#modal-win #senha-correta").forEach((el) => {
    el.innerHTML = PASSWORD.join("");
  });
  game.status = GAME_STATE.STOP;
  modal.showModalWindow("modal-win");
}

function loseGame() {
  clearInterval(game.timer);
  document.querySelectorAll("#modal-lose #senha-correta").forEach((el) => {
    el.innerHTML = PASSWORD.join("");
  });
  game.status = GAME_STATE.STOP;
  modal.showModalWindow("modal-lose");
}
