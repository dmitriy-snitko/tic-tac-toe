const game = document.getElementById('game')
const result = document.getElementById('result')
const human = document.getElementById('human')
const ai = document.getElementById('ai')

const aiPlayer = 'X', huPlayer = 'O'
let cellList = []
let board = [...Array(9).keys()]

const init = () => {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div')
    cell.setAttribute('data-id', i)
    // cell.addEventListener('click', humanPlay)
    game.appendChild(cell)
    cellList.push(cell)
  }
}

const humanPlay = (e) => {
  const id = e.target.getAttribute('data-id')
  board[+id] = huPlayer
  cellList[+id].removeEventListener('click', humanPlay)
  cellList[+id].classList.remove('isActive')
  cellList[+id].innerHTML = `<span>${huPlayer}</span>`

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

const reset = () => {
  game.innerHTML = ''
  cellList = []
  board = [...Array(9).keys()]
  result.innerHTML = ''
  init()
}

const makeAiTurn = () => {
  const bestMove = minimax(board, aiPlayer)
  board[bestMove.idx] = aiPlayer
  result.innerHTML = '<img src="img/spiner.gif">'
  setTimeout(() => {
    cellList[bestMove.idx].removeEventListener('click', humanPlay)
    cellList[bestMove.idx].classList.remove('isActive')
    cellList[bestMove.idx].innerHTML = `<span>${aiPlayer}</span>`
    if (!findEmptyCells(board).length) {
      result.innerHTML = '<h4>Draw!</h4>'
      return
    }

    if (checkWinner(board, aiPlayer)) {
      findEmptyCells(board).forEach(c => cellList[c].removeEventListener('click', humanPlay))
      result.innerHTML = '<h4>Ai wins!</h4>'
      return
    }

    result.innerHTML = '<h4>GO!</h4>'
  }, 500)
}

const checkWinner = (board, player) => {
  if (board[0] === player && board[1] === player && board[2] === player ||
    board[3] === player && board[4] === player && board[5] === player ||
    board[6] === player && board[7] === player && board[8] === player ||
    board[0] === player && board[3] === player && board[6] === player ||
    board[1] === player && board[4] === player && board[7] === player ||
    board[2] === player && board[5] === player && board[8] === player ||
    board[0] === player && board[4] === player && board[8] === player ||
    board[2] === player && board[4] === player && board[6] === player) {
    return true
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

const findEmptyCells = (board) => {
  return board.filter(c => c !== huPlayer && c !== aiPlayer)
}

human.addEventListener('click', () => {
  reset()
  cellList.forEach(c => {
    c.addEventListener('click', humanPlay)
    c.classList.add('isActive')
  })
  result.innerHTML = '<h4>GO!</h4>'
})

ai.addEventListener('click', () => {
  reset()
  cellList.forEach(c => {
    c.addEventListener('click', humanPlay)
    c.classList.add('isActive')
  })
  makeAiTurn()
})
init()
