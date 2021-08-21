const elements = {
  // grid: document.querySelector('.grid'),
  elapsedTime: document.querySelector('#elapsed-time'),
  modal: document.getElementById('myModal'),
  modalSpan: document.getElementsByClassName('close')[0],
  modalBody1: document.querySelector('#modal-body-1'),
  modalBody2: document.querySelector('#modal-body-2'),
  modalButton: document.querySelector('#play-again'),
}

const grid = document.querySelector('.grid')
const width = 15
const mines = width
const tiles = []
const remainingFlags = document.querySelector('#remaining-flags')
let flags = 0
let isGameOver = false
let elapsedTimeID
let numberOfClicks = 0

const generateBoard = () => {

  remainingFlags.innerHTML = mines

  //* get a shuffled game array with random mines
  // create a game array of 'mine' and 'valid' strings
  const minesArray = Array(mines).fill('mine')
  const emptyArray = Array(width * width - mines).fill('valid')
  const gameArray = emptyArray.concat(minesArray)
  // pass in a compare function - randomly return: < 0, 0 or > 0 for every pair that gets compared
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

  //* create the grid tiles and add to grid
  for (let i = 0; i < width * width; i++) {
    const tile = document.createElement('div')
    // dynamically size the grids using the width
    tile.style.width = `${100 / width}%`
    tile.style.height = `${100 / width}%`

    tile.setAttribute('id', i)
    // add 'mine' or 'valid' as class names to each tile
    tile.classList.add(shuffledArray[i])
    grid.appendChild(tile)
    tiles.push(tile)

    // when a tile is left clicked, call the click function on the current tile
    tile.addEventListener('click', () => {
      click(tile)
      numberOfClicks++
      if (numberOfClicks === 1) {
        let counter = 1
        elapsedTimeID = setInterval(() => {
          document.querySelector('#elapsed-time').innerHTML = counter++
        }, 1000)
      }
    })

    // when a tile is right clicked, add a flag
    tile.oncontextmenu = (e) => {
      e.preventDefault()
      addFlag(tile)
    }
  }

  // add numbers
  for (let i = 0; i < tiles.length; i++) {
    let total = 0
    const isFirstColumn = (i % width === 0)
    const isRightColumn = (i % width === width - 1)


    // check all surrounding 8 tiles and total nearby
    if (tiles[i].classList.contains('valid')) {
      // check north
      if (i > width && tiles[i - width].classList.contains('mine')) total++
      // check north east 
      if (i > width - 1 && !isRightColumn && tiles[i + 1 - width].classList.contains('mine')) total++
      // check east
      if (i < width * width - 1 && !isRightColumn && tiles[i + 1].classList.contains('mine')) total++
      // check south east
      if (i < width * width - width - 2 && !isRightColumn && tiles[i + 1 + width].classList.contains('mine')) total++
      // check south
      if (i < width * width - width - 1 && tiles[i + width].classList.contains('mine')) total++
      // check south west
      if (i < width * width - width && !isFirstColumn && tiles[i - 1 + width].classList.contains('mine')) total++
      // check west
      if (i > 0 && !isFirstColumn && tiles[i - 1].classList.contains('mine')) total++
      // check north west
      if (i > width + 1 && !isFirstColumn && tiles[i - 1 - width].classList.contains('mine')) total++
      // add number of surrounding mines to tile
      tiles[i].setAttribute('data-counter', total)
    }
  }
}


generateBoard()


// add flag
const addFlag = (tile) => {
  if (isGameOver) return
  if (!tile.classList.contains('checked') && (flags < mines)) {
    if (!tile.classList.contains('flag')) {
      tile.classList.add('flag')
      tile.style.backgroundImage = 'url(./assets/flag.svg)'
      tile.style.backgroundSize = 'cover'
      flags++
      remainingFlags.innerHTML = mines - flags
      checkForWin()
    } else {
      tile.classList.remove('flag')
      tile.style.backgroundImage = ''
      flags--
      remainingFlags.innerHTML = mines - flags
    }
  }
}


// click on tile actions
const click = (tile) => {
  const currentId = tile.id
  // handle single scenarios (don't repeat recursively)
  if (isGameOver) return
  if (tile.classList.contains('checked') || tile.classList.contains('flag')) return
  if (tile.classList.contains('mine')) {
    gameOver(tile)
  } else {
    // display the total surrounding mines on tile
    //! total is a string
    const total = tile.getAttribute('data-counter')
    if (total != 0) {
      tile.classList.add('checked')
      tile.innerHTML = total
      // style individual mine indicators
      if (total == 1) tile.classList.add('one')
      if (total == 2) tile.classList.add('two')
      if (total == 3) tile.classList.add('three')
      if (total == 4) tile.classList.add('four')
      return
    }

    // recursive sweep
    checkSquare(tile, currentId)
  }
  // check if tile does not contain a mine and the check after it does not equal 0
  tile.classList.add('checked')
}


// check surrounding tiles once tile is clicked
const checkSquare = (tile, currentId) => {
  const isFirstColumn = (currentId % width === 0)
  const isRightColumn = (currentId % width === width - 1)
  setTimeout(() => {
    // check north
    if (currentId > width) {
      const newId = tiles[parseInt(currentId - width)].id
      //const newId = parseInt(currentId) -width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check north east
    if (currentId > width - 1 && !isRightColumn) {
      const newId = tiles[parseInt(currentId) + 1 - width].id
      //const newId = parseInt(currentId) +1 -width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check east
    if (currentId < width * width - 1 && !isRightColumn) {
      const newId = tiles[parseInt(currentId) + 1].id
      //const newId = parseInt(currentId) +1   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check south east
    if (currentId < width * width - width - 2 && !isRightColumn) {
      const newId = tiles[parseInt(currentId) + 1 + width].id
      //const newId = parseInt(currentId) +1 +width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check south
    if (currentId < width * width - width - 1) {
      const newId = tiles[parseInt(currentId) + width].id
      //const newId = parseInt(currentId) +width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check south west
    if (currentId < width * width - width && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1 + width].id
      //const newId = parseInt(currentId) -1 +width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // check west
    if (currentId > 0 && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1].id
      //const newId = parseInt(currentId) - 1   ....refactor
      const newSquare = document.getElementById(newId)
      // pass the new tile to the click function to be checked again
      // if it passes, this will repeat until it stops
      click(newSquare)
    }
    // check north west
    if (currentId > width + 1 && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1 - width].id
      //const newId = parseInt(currentId) -1 -width   ....refactor
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
  }, 10)
}


// game over
const gameOver = (tile) => {
  isGameOver = true
  clearInterval(elapsedTimeID)
  elements.elapsedTime.innerHTML = 0
  // display ALL the mines
  tiles.forEach(tile => {
    if (tile.classList.contains('mine')) {
      tile.style.backgroundImage = 'url(./assets/bomb.svg)'
      tile.style.backgroundSize = 'cover'
    }
    if (!tile.classList.contains('checked')) {
      tile.classList.add('checked')
    }
  })
  // display modal
  elements.modalBody1.innerHTML = 'GAME OVER!'
  elements.modalBody2.innerHTML = 'Woah, looks like you hit a mine'
  elements.modal.style.display = 'block'
}


// check for win
const checkForWin = () => {
  let matches = 0
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].classList.contains('flag') && tiles[i].classList.contains('mine')) {
      matches++
    }
    if (matches === mines) {
      isGameOver = true
      clearInterval(elapsedTimeID)
      document.querySelector('#elapsed-time').innerHTML = 0
      // display modal
      elements.modalBody1.innerHTML = 'YOU WIN!'
      elements.modalBody2.innerHTML = 'Well done, you\'ve cleared all mines'
      elements.modal.style.display = 'block'
    }
  }
}


// hide the modal when the 'X' is clicked
elements.modalSpan.addEventListener('click', () => {
  elements.modal.style.display = 'none'
})

// hide the modal by default
window.addEventListener('click', (e) => {
  if (e.target === elements.modal) {
    elements.modal.style.display = 'none'
  }
})

// refresh when 'Play Again' is clicked to reset the game
elements.modalButton.addEventListener('click', () => {
  location.reload()
})