import { resetGame, tryPassword, validateInput } from "./game.js";

window.addEventListener("load", () => {
  resetGame();
  const newGameBtn = document.getElementById("newGameBtn");
  newGameBtn.addEventListener("click", () => resetGame());

  const guessInput = document.getElementById("guess");
  guessInput.addEventListener("keydown", (e) => tryPassword(e));
  guessInput.addEventListener("input", (e) => validateInput(e));

  guessInput.focus();
});
