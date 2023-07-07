const gameStatus = { STOP: 0, RUNNING: 1, PAUSED: 2 };
const game = {
  settings: {
    rows: 0,
    columns: 0,
    emptyTile: 0,
  },
  state: [],
  time: 0,
  timerId: null,
  moveCount: 0,
  status: gameStatus.STOP,
};

const boardSettings = {
  tileSize: 100,
  tileGap: 15,
};
/***
 *
 * HELPERS
 *
 * ***/

function getElement(id) {
  return document.getElementById(id);
}

function isSolvable() {
  var product = 1;
  const { rows, columns } = { ...game.settings };
  for (var i = 1; i <= rows * columns - 1; i++) {
    for (var j = i + 1; j <= rows * columns; j++) {
      product *= (game.state[i - 1] - game.state[j - 1]) / (i - j);
    }
  }
  return Math.round(product) == 1;
}

export function resetGame(rows, columns) {
  game.state = [];
  game.time = 0;
  game.moveCount = 0;
  game.time = 0;
  game.status = gameStatus.STOP;

  if (game.timer) clearInterval(game.timer);

  game.settings.rows = rows;
  game.settings.columns = columns;
  game.settings.emptyTile = rows * columns;

  for (let i = 0; i < rows * columns; i++) {
    game.state.push(i + 1);
  }

  shuffleArray(game.state);

  const isPossible = game.state.map((el, i) => el - 1 - i);

  const ret = createBoard(rows, columns);
  renderBoardFromArray();

  return ret;
}

function shuffleArray(array) {
  do {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    //console.log(isSolvable());
  } while (!isSolvable());
}
export function createBoard(rows, columns) {
  const board = document.createElement("div");
  const boardSize =
    boardSettings.tileSize * columns + boardSettings.tileGap * (columns - 1);
  board.style.width = `min(50vh, 80vw)`;
  board.style.height = `min(50vh, 80vw)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < rows * columns; i++) {
    const tileBackground = document.createElement("div");
    tileBackground.classList.add("tile");
    tileBackground.classList.add("tile-background");

    const tile = document.createElement("div");
    tile.setAttribute("id", "tile-" + i);

    const spanText = document.createElement("span");
    spanText.innerText = game.state[i] === rows * columns ? "" : game.state[i];

    tile.classList.add("tile");

    if (game.state[i] - 1 === i && game.state[i] !== rows * columns) {
      tile.classList.add("inplace");
    } else {
      tile.classList.add("outplace");
    }
    if (game.state[i] === rows * columns) {
      tile.classList.add("empty-tile");
    }
    tile.addEventListener("click", () => moveTile(i));

    tile.appendChild(spanText);
    tileBackground.appendChild(tile);
    board.appendChild(tileBackground);
  }

  board.setAttribute("id", "main-board");
  return board;
}

function renderBoardFromArray() {
  const moveCounter = getElement("move-counter");
  moveCounter.innerText = game.moveCount;

  const timer = getElement("timer");
  timer.innerText = `${game.time} s`;

  const elements = document.querySelectorAll("[id^=tile]");
  elements.forEach((tile) => {
    const index = tile.id.replace("tile-", "");
    if (game.state[index] - 1 === index) {
      tile.className = "tile inplace";
    } else {
      tile.className = "tile outplace";
    }
    tile.children[0].innerText = game.state[index];
    if (game.state[index] === game.settings.rows * game.settings.columns) {
      tile.className = "tile empty-tile";
      tile.children[0].innerText = "";
    }
  });
}

export function renderBoard(movement = null) {
  const elements = document.querySelectorAll("[id^=tile]");
  const moveCounter = getElement("move-counter");
  moveCounter.innerText = game.moveCount;
  const rows = game.settings.rows;
  const columns = game.settings.columns;

  if (movement) {
    for (let i = 0; i < rows * columns; i++) {
      const tile = elements[i];

      //check if the tile is the source tile then it must be cleaned
      if (tile.id === "tile-" + movement.tileMoved) {
        tile.className = "tile empty-tile";
        tile.children[0].innerText = "";
      }

      if (tile.id === "tile-" + movement.tileDestination) {
        tile.className = "tile";
        if (game.state[i] - 1 === i && game.state[i] !== rows * columns) {
          tile.classList.add("inplace");
        } else {
          tile.classList.add("outplace");
        }
        tile.children[0].innerText = game.state[i];
        tile.classList.add(`slide${movement.direction}`);
      }
    }
  }
}

function moveTile(currentPosition) {
  const positions = {
    up: currentPosition - game.settings.columns,
    down: currentPosition + game.settings.columns,
    left: currentPosition - 1,
    right: currentPosition + 1,
  };
  for (var [key, position] of Object.entries(positions)) {
    if (
      position >= 0 &&
      position < game.settings.columns * game.settings.rows
    ) {
      if (game.state[position] === game.settings.emptyTile) {
        if (
          (key === "left" || key === "right") &&
          Math.floor(currentPosition / game.settings.columns) !==
            Math.floor(position / game.settings.columns)
        ) {
          return;
        }
        if (game.status === gameStatus.STOP) {
          game.status = gameStatus.RUNNING;
          startTimer();
        }

        swapTiles(currentPosition, position);
        game.moveCount++;

        renderListener.modificated = {
          tileMoved: currentPosition,
          tileDestination: position,
          direction: key,
        };
      }
    }
  }
}

function startTimer() {
  game.time = 0;
  game.timer = setInterval(() => {
    game.time++;
    const timer = getElement("timer");
    timer.innerText = `${game.time} s`;
  }, 1000);
}

function swapTiles(currentPosition, targetPosition) {
  const temp = game.state[currentPosition];
  game.state[currentPosition] = game.state[targetPosition];
  game.state[targetPosition] = temp;
}

function isSorted() {
  for (let i = 0; i < game.settings.rows * game.settings.columns; i++) {
    if (game.state[i] - 1 !== i) {
      return false;
    }
  }
  return true;
}

const renderState = { position: null, direction: null };

const renderListener = new Proxy(renderState, {
  set(obj, prop, value) {
    if (prop === "modificated") {
      if (isSorted()) {
        clearInterval(game.timer);
        setTimeout(() => {
          alert("You win! Moves: " + game.moveCount);
        }, 300);
      }
      renderBoard(value);
    }
    return Reflect.set(obj, prop, false);
  },
});
