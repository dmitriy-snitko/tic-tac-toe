const game = document.getElementById('game')
const result = document.getElementById('result')
const human = document.getElementById('human')
const ai = document.getElementById('ai')
const timeout = 500

let firstMove = true
let aiPlayer = '', huPlayer = '', aiWin =''
let cellList = []
let board = [...Array(9).keys()]

const init = () => {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div')
    cell.setAttribute('data-id', i)
    game.appendChild(cell)
    cellList.push(cell)
  }
}

const reset = () => {
  game.innerHTML = ''
  cellList = []
  board = [...Array(9).keys()]
  result.innerHTML = ''
  init()
}

const humanPlay = (e) => {
  firstMove = false
  const id = e.target.getAttribute('data-id')
  board[+id] = huPlayer
  cellList[+id].removeEventListener('click', humanPlay)
  cellList[+id].classList.remove('isActive')
  cellList[+id].innerHTML = huPlayer

  if (!findEmptyCells(board).length) {
    result.innerHTML = '<h4>Draw!</h4>'
    return
  }

  if (checkWinner(board, huPlayer)) {
    result.innerHTML = '<h4>You win!</h4>'
    return
  }
  makeAiTurn()
}

const makeAiTurn = () => {
  if (firstMove) {
    result.innerHTML = '<img src="img/spiner.gif">'
    setTimeout(() => {
      id = aiRandomMove()
      board[id] = aiPlayer
      cellList[id].removeEventListener('click', humanPlay)
      cellList[id].classList.remove('isActive')
      cellList[id].innerHTML = aiPlayer
      firstMove = false
      result.innerHTML = '<h4>GO!</h4>'
    }, timeout)
    return
  }

  const bestMove = minimax(board, aiPlayer)
  board[bestMove.idx] = aiPlayer
  result.innerHTML = '<img src="img/spiner.gif">'
  setTimeout(() => {
    cellList[bestMove.idx].removeEventListener('click', humanPlay)
    cellList[bestMove.idx].classList.remove('isActive')
    cellList[bestMove.idx].innerHTML = aiPlayer
    const win = checkWinner(board, aiPlayer)
    if (win) {
      win.forEach(i => cellList[i].innerHTML = aiWin)
      findEmptyCells(board).forEach(c => {
        cellList[c].removeEventListener('click', humanPlay)
        cellList[c].classList.remove('isActive')
       })
      result.innerHTML = '<h4>AI wins!</h4>'
      return
    }

    if (!findEmptyCells(board).length) {
      result.innerHTML = '<h4>Draw!</h4>'
      return
    }

    result.innerHTML = '<h4>GO!</h4>'
  }, timeout)
}

// const checkWinner = (board, player) => {
//   if (board[0] === player && board[1] === player && board[2] === player ||
//     board[3] === player && board[4] === player && board[5] === player ||
//     board[6] === player && board[7] === player && board[8] === player ||
//     board[0] === player && board[3] === player && board[6] === player ||
//     board[1] === player && board[4] === player && board[7] === player ||
//     board[2] === player && board[5] === player && board[8] === player ||
//     board[0] === player && board[4] === player && board[8] === player ||
//     board[2] === player && board[4] === player && board[6] === player) {
//     return true
//   }
//   return false
// }

const checkWinner = (board, player) => {
  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (i = 0; i < win.length; i++) {
    if (board[win[i][0]] === player && board[win[i][1]] === player && board[win[i][2]] === player) {
      return win[i]
    }
  }
  return false
}

const minimax = (board, player) => {
  const emptyCells = findEmptyCells(board)
  if (checkWinner(board, huPlayer)) {
    return { score: -1 }
  } else if (checkWinner(board, aiPlayer)) {
    return { score: 1 }
  } else if (emptyCells.length === 0) {
    return { score: 0 }
  }

  let moves = []

  for (let i = 0; i < emptyCells.length; i++) {
    let move = []
    board[emptyCells[i]] = player
    move.idx = emptyCells[i]
    if (player === huPlayer) {
      const payload = minimax(board, aiPlayer)
      move.score = payload.score
    }
    if (player === aiPlayer) {
      const payload = minimax(board, huPlayer)
      move.score = payload.score
    }
    board[emptyCells[i]] = move.idx
    moves.push(move)
  }

  let bestMove = null

  if (player === aiPlayer) {
    let bestScore = -Infinity
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  } else {
    let bestScore = Infinity
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }

  return moves[bestMove]
}

const aiRandomMove = () => {
  return Math.floor(Math.random() * 9)
}

const findEmptyCells = (board) => {
  return board.filter(c => c !== huPlayer && c !== aiPlayer)
}

const startNewGame = () => {
  reset()
  cellList.forEach(c => {
    c.addEventListener('click', humanPlay)
    c.classList.add('isActive')
  })
}

human.addEventListener('click', () => {
  startNewGame()
  aiPlayer = '<img src="img/zero-AI.jpg" class="moveImg">'
  huPlayer = '<img src="img/cross.jpg" class="moveImg">'
  aiWin = '<img src="img/zero-AI-win.jpg" class="moveImg">'
  result.innerHTML = '<h4>GO!</h4>'
})

ai.addEventListener('click', () => {
  startNewGame()
  aiPlayer = '<img src="img/cross-AI.jpg" class="moveImg">'
  huPlayer = '<img src="img/zero.jpg" class="moveImg">'
  aiWin = '<img src="img/cross-AI-win.jpg" class="moveImg">'
  firstMove = true
  makeAiTurn()
})

init()
