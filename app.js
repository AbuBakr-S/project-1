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
const width = 10
const tiles = []  // array of every board tile
const mines = []
const remainingFlags = document.querySelector('#remaining-flags')
let isPlaying = true
let numberOfClicks = 0
let elapsedTimeID
let flags = 0

const generateBoard = () => {
  remainingFlags.innerHTML = width
  for (let i = 0; i < width ** 2; i++) {
    const tile = document.createElement('div')
    tile.setAttribute('id', i)
    // add data attribute for nearby mines counter
    tile.setAttribute('data-counter', 0)
    // add data attribute to track whether a tile has been sweeped 
    tile.setAttribute('data-sweeped', false)
    grid.appendChild(tile)
    // dynamically size the grids using the width
    tile.style.width = `${100 / width}%`
    tile.style.height = `${100 / width}%`

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
  //* randomly generate an array of mine indexes
  while (mines.length < width) {
    const randomIndex = Math.floor(Math.random() * (width ** 2))
    if (!mines.includes(randomIndex)) {
      mines.push(randomIndex)
    }
  }
  //* if a tile has a mine, add the 'mine' class and remove the 'data-sweeped' attribute
  mines.forEach(mine => {
    tiles[mine].classList.add('mine')
    tiles[mine].attributes.removeNamedItem('data-sweeped')
    // calculate nearby mines positions (relative)
    const up = mine - width
    const upRight = mine - width + 1
    const right = mine + 1
    const downRight = mine + width + 1
    const down = mine + width
    const downLeft = mine + width - 1
    const left = mine - 1
    const upLeft = mine - width - 1
    // check whether a mine is in the first column or the last
    const isFirstColumn = (mine % width === 0)
    const isLastColumn = (mine % width === width - 1)
    //* aggregate mine indicators
    if (tiles[up] && !tiles[up].classList.contains('mine')) {
      tiles[up].attributes['data-counter'].value++
    }
    if (tiles[upRight] && !isLastColumn && !tiles[upRight].classList.contains('mine')) {
      tiles[upRight].attributes['data-counter'].value++
    }
    if (tiles[right] && !isLastColumn && !tiles[right].classList.contains('mine')) {
      tiles[right].attributes['data-counter'].value++
    }
    if (tiles[downRight] && !isLastColumn && !tiles[downRight].classList.contains('mine')) {
      tiles[downRight].attributes['data-counter'].value++
    }
    if (tiles[down] && !tiles[down].classList.contains('mine')) {
      tiles[down].attributes['data-counter'].value++
    }
    if (tiles[downLeft] && !isFirstColumn && !tiles[downLeft].classList.contains('mine')) {
      tiles[downLeft].attributes['data-counter'].value++
    }
    if (tiles[left] && !isFirstColumn && !tiles[left].classList.contains('mine')) {
      tiles[left].attributes['data-counter'].value++
    }
    if (tiles[upLeft] && !isFirstColumn && !tiles[upLeft].classList.contains('mine')) {
      tiles[upLeft].attributes['data-counter'].value++
    }
  })
}

generateBoard()


// add flag
const addFlag = (tile) => {
  if (!isPlaying) return
  if (tile.classList.contains('checked')) return
  // if the tile is an uncovered numbered tile, don't add a flag
  if (!tile.classList.contains('mine') && tile.attributes['data-sweeped'].value === 'true') return 
  // only add a flag once a tile has been uncovered
  if (numberOfClicks === 0) return

  if (tile.classList.contains('mine') || tile.attributes['data-sweeped'].value === 'false') {
    if (!tile.classList.contains('sweeped') && (flags < width)) {
      if (!tile.classList.contains('flag')) {
        tile.classList.add('flag')
        tile.style.backgroundImage = 'url(./assets/flag.svg)'
        tile.style.backgroundSize = 'cover'
        flags++
        remainingFlags.innerHTML = width - flags
        checkForWin()
      } else {
        tile.classList.remove('flag')
        tile.style.backgroundImage = ''
        flags--
        remainingFlags.innerHTML = width - flags
      }
    }
  }
}


// click on tile actions
const click = (tile) => {
  const currentId = tile.id
  // handle single scenarios (don't repeat recursively)
  if (!isPlaying) return
  if (tile.classList.contains('checked') || tile.classList.contains('flag')) return
  if (!tile.classList.contains('mine') && tile.attributes['data-sweeped'].value === 'true') return
  if (tile.classList.contains('mine')) {
    gameOver()
  } else {
    // display the total surrounding mines on tile
    //! total is a string
    const total = tile.getAttribute('data-counter')
    if (total != 0) {
      tile.setAttribute('data-sweeped', true)
      tile.innerHTML = total
      // style individual mine indicators
      if (total == 1) tile.classList.add('one')
      if (total == 2) tile.classList.add('two')
      if (total == 3) tile.classList.add('three')
      if (total == 4) tile.classList.add('four')
      return
    }

    // recursive sweep
    checkTile(tile, currentId)
    // check if tile does not contain a mine and the check after it does not equal 0
    // tile.setAttribute('data-sweeped', true)
    tile.classList.add('checked')
    checkForWin()
  }
}


// check surrounding tiles once tile is clicked
const checkTile = (tile, currentId) => {
  const isFirstColumn = (currentId % width === 0)
  const isLastColumn = (currentId % width === width - 1)
  setTimeout(() => {
    // check north
    if (currentId > width) {
      const newId = tiles[parseInt(currentId - width)].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check north east
    if (currentId > width - 1 && !isLastColumn) {
      const newId = tiles[parseInt(currentId) + 1 - width].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check east
    if (currentId < width * width - 1 && !isLastColumn) {
      const newId = tiles[parseInt(currentId) + 1].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check south east
    if (currentId < width * width - width - 2 && !isLastColumn) {
      const newId = tiles[parseInt(currentId) + 1 + width].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check south
    if (currentId < width * width - width - 1) {
      const newId = tiles[parseInt(currentId) + width].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check south west
    if (currentId < width * width - width && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1 + width].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    // check west
    if (currentId > 0 && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1].id
      const newTile = document.getElementById(newId)
      // pass the new tile to the click function to be checked again
      // if it passes, this will repeat until it stops
      click(newTile)
    }
    // check north west
    if (currentId > width + 1 && !isFirstColumn) {
      const newId = tiles[parseInt(currentId) - 1 - width].id
      const newTile = document.getElementById(newId)
      click(newTile)
    }
  }, 10)
}


// game over
const gameOver = () => {
  isPlaying = false
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
  let correctFlagCounter = 0
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].classList.contains('flag') && tiles[i].classList.contains('mine')) {
      correctFlagCounter++
    }  
    if (correctFlagCounter === mines.length) {
      isPlaying = false
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