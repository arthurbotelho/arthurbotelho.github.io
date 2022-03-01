import { resetGame } from './board.js'

window.addEventListener("load", () => {

    const app = document.getElementById('board-container')
    const newBoard = resetGame(4, 4)
    const newGameBtn = document.getElementById('newGameBtn')
    newGameBtn.addEventListener("click", () => resetGame(4, 4))
    app.appendChild(newBoard)
})