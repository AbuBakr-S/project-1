const elements = {
  grid: document.querySelector('.grid'),
}

const width = 10
const mines = []
let currentTileIndex
let eightTilesArray = []
let numberOfClicks = 0

const generateBoard = () => {
  for (let i = 0; i < width ** 2; i++) {

    const div = document.createElement('div')
    // Add data attribute for nearby mines counter
    div.setAttribute('data-counter', 0)

    // Add data attribute to track whether a tile has been sweeped 
    div.setAttribute('data-sweeped', false)

    // Prevent default right click behaviour on each tile
    //div.setAttribute('oncontextmenu', 'event.preventDefault();')

    elements.grid.appendChild(div)
    div.id = i

    // dynamically size the grids using the width
    div.style.width = `${100 / width}%`
    div.style.height = `${100 / width}%`
  }
}

generateBoard()

const flag = (e) => {
  //Add a flag if a tile is right clicked
  // ! The image is not currently being displayed. Only the background colour is changing
  if (e.button === 2 && divArray[currentTileIndex] && !e.target.classList.contains('sweeped')) {
    divArray[Number(e.target.id)].classList.toggle('flag')
  }
}

const divArray = Array.from(document.querySelectorAll('.grid div'))
divArray.forEach(div => {
  div.addEventListener('click', (e) => {
    flippedTile(e)
  })
  div.addEventListener('mouseup', flag)
})

const flippedTile = (e) => {
  numberOfClicks++
  currentTileIndex = Number(e.target.id)
  console.log('Current Tile Index: ', currentTileIndex)
  getSurroundingTiles(currentTileIndex)

  // ! If first click, then generate mines
  if (numberOfClicks === 1) {
    console.log('First Click!')
    generateMines(currentTileIndex, eightTilesArray)
    addMinesToBoard()
    tilesNearbyMine()
  }
  
  // ! TEST
  sweepSurroundingTiles(currentTileIndex, eightTilesArray)
  loopingSweeper(eightTilesArray)
  sweepCurrentTile(currentTileIndex)

  // Create an array of all tiles with sweeped attributes
  const sweepedTilesArray = divArray.filter(tile => tile.hasAttribute('data-sweeped'))
  checkWin(sweepedTilesArray)
  //console.log('SweepedTilesArray: ', sweepedTilesArray)
}

const getSurroundingTiles = (currentTileIndex) => {

  eightTilesArray = []

  // surrounding tiles
  const upRight = currentTileIndex - width + 1
  const right = currentTileIndex + 1
  const downRight = currentTileIndex + width + 1
  const up = currentTileIndex - width
  const down = currentTileIndex + width
  const downLeft = currentTileIndex + width - 1
  const left = currentTileIndex - 1
  const upLeft = currentTileIndex - width - 1

  const isFirstColumn = (currentTileIndex % width === 0)
  const isLastColumn = (currentTileIndex % width === width - 1)

  //grab the indexes of all the tiles surrounding the currentTileIndex
  if (divArray[up] ) {
    eightTilesArray.push(Number(divArray[up].id))
  }
  if (divArray[upRight] && !isLastColumn) {
    eightTilesArray.push(Number(divArray[upRight].id))
  }
  if (divArray[right] && !isLastColumn) {
    eightTilesArray.push(Number(divArray[right].id))
  }
  if (divArray[downRight] && !isLastColumn) {
    eightTilesArray.push(Number(divArray[downRight].id))
  }
  if (divArray[down]) {
    eightTilesArray.push(Number(divArray[down].id))
  }
  if (divArray[downLeft] && !isFirstColumn) {
    eightTilesArray.push(Number(divArray[downLeft].id))
  }
  if (divArray[left] && !isFirstColumn) {
    eightTilesArray.push(Number(divArray[left].id))
  }
  if (divArray[upLeft] && !isFirstColumn) {
    eightTilesArray.push(Number(divArray[upLeft].id))
  }

  return eightTilesArray

}

const generateMines = (currentTileIndex, eightTilesArray) => {
  while (mines.length < width) {
    const randomIndex = Math.floor(Math.random() * (width ** 2))
    if (!mines.includes(randomIndex) && randomIndex !== currentTileIndex && !eightTilesArray.includes(randomIndex)) {
      mines.push(randomIndex)
    }
  }
  return mines
}

// If a tile has a mine, add the mine class and remove the 'data-sweeped' attribute
const addMinesToBoard = () => {
  mines.forEach(mine => {
    divArray[mine].classList.add('mine')
    divArray[mine].attributes.removeNamedItem('data-sweeped')
  })
}

const tilesNearbyMine = () => {

  mines.forEach(mine => {

    // surrounding tiles
    const upRight = mine - width + 1
    const right = mine + 1
    const downRight = mine + width + 1
    const up = mine - width
    const down = mine + width
    const downLeft = mine + width - 1
    const left = mine - 1
    const upLeft = mine - width - 1

    const isFirstColumn = (mine % width === 0)
    const isLastColumn = (mine % width === width - 1)

    //grab the indexes of all the tiles surrounding the currentTileIndex
    if (divArray[up] && !divArray[up].classList.contains('mine')) {
      divArray[up].attributes['data-counter'].value++
    }
    if (divArray[upRight] && !isLastColumn && !divArray[upRight].classList.contains('mine')) {
      divArray[upRight].attributes['data-counter'].value++
    }
    if (divArray[right] && !isLastColumn && !divArray[right].classList.contains('mine')) {
      divArray[right].attributes['data-counter'].value++
    }
    if (divArray[downRight] && !isLastColumn && !divArray[downRight].classList.contains('mine')) {
      divArray[downRight].attributes['data-counter'].value++
    }
    if (divArray[down] && !divArray[down].classList.contains('mine')) {
      divArray[down].attributes['data-counter'].value++
    }
    if (divArray[downLeft] && !isFirstColumn && !divArray[downLeft].classList.contains('mine')) {
      divArray[downLeft].attributes['data-counter'].value++
    }
    if (divArray[left] && !isFirstColumn && !divArray[left].classList.contains('mine')) {
      divArray[left].attributes['data-counter'].value++
    }
    if (divArray[upLeft] && !isFirstColumn && !divArray[upLeft].classList.contains('mine')) {
      divArray[upLeft].attributes['data-counter'].value++
    }

  })
}

// * If the current tile directly clicked is a number, uncover the tile and display the surrounding mine counter
const sweepCurrentTile = (currentTileIndex) => {

  if (Number(divArray[currentTileIndex].attributes['data-counter'].value) > 0) {
    divArray[currentTileIndex].innerHTML = Number(divArray[currentTileIndex].attributes['data-counter'].value)
    divArray[currentTileIndex].classList.add('sweeped')
    divArray[currentTileIndex].attributes['data-sweeped'].value = true
  } else if (divArray[currentTileIndex].classList.contains('mine')) {
    gameOver()
  }
}

// ? Still need to figure out how many times to run this and set up boundries
const sweepSurroundingTiles = (currentTileIndex, eightTilesArray) => {

  console.log('CurrentTileIndex: ', currentTileIndex, 'EightTileArray: ', eightTilesArray)
  eightTilesArray.forEach(tile => {
    console.log('Tile: ', tile)

    // * BASE CASE: If all surrounding tiles have a 'data-sweeped' value of true, stop looping 
    // const allSurroundingTilesSweeped = eightTilesArray.every(tile => {
    //   divArray[tile].attributes['data-sweeped'].value = true
    // })

    // if (allSurroundingTilesSweeped) {
    //   console.log('All surrounding tiles have been sweeped!')
    //   return
    // }

    // * Check current tile and surrounding tiles are empty. If so, reveal
    if (
      !divArray[currentTileIndex].classList.contains('mine') && 
      !divArray[tile].classList.contains('mine') &&
      Number(divArray[currentTileIndex].attributes['data-counter'].value) === 0 &&
      Number(divArray[tile].attributes['data-counter'].value) === 0
    ) {
      divArray[currentTileIndex].classList.add('sweeped')
      divArray[currentTileIndex].attributes['data-sweeped'].value = true

      divArray[tile].classList.add('sweeped')
      divArray[tile].attributes['data-sweeped'].value = true
    }

    // * Check whether current tile is not a mine and the surrounding tile has a number. 
    // * If so, reveal it and return
    if (
      !divArray[currentTileIndex].classList.contains('mine') &&
      Number(divArray[currentTileIndex].attributes['data-counter'].value) === 0 &&
      Number(divArray[tile].attributes['data-counter'].value) > 0
    ) {
      // Display surrounding mine counter
      divArray[tile].innerHTML = Number(divArray[tile].attributes['data-counter'].value)
      divArray[tile].classList.add('sweeped')
      divArray[tile].attributes['data-sweeped'].value = true
      return
    }

    // * Check whether the surrounding tile is touching an edge. If so, return

    if (tile % width === 0 || tile % width === width - 1) {
      console.log('Tile Touching Border at ID: ', divArray[tile].id)
      return
    }

    if (tile < width && tile >= 0 || (tile > (width ** width - width - 1) && tile < width ** width)) {
      console.log('Tile Touching Border at ID: ', divArray[tile].id)
      return
    }

    // reveal number, return
    // mines, return
    // border / edge, return

  })
}

const loopingSweeper = (eightTilesArray) => {

  // * If the current tile is a number, return
  if (Number(divArray[currentTileIndex].attributes['data-counter'].value) > 0) {
    return
  }
  
  //console.log('Eight Tiles Array: ', eightTilesArray)
  eightTilesArray.forEach(tile => {
    const newIndex = Number(divArray[tile].id)
    //console.log('New Index: ', newIndex)
    sweepSurroundingTiles(newIndex, getSurroundingTiles(newIndex))
  })
  // call getSurroundingTiles with a new index to return a new eightTilesArray
  // then call sweepSurroundingTiles with this new index and new eightTilesArray
}

// If a mine is clicked, diaplay an alert, display all the tile counters and display all the mines
const gameOver = () => {
  // Display all the tiles
  divArray.forEach(tile => {
    if (Number(tile.attributes['data-counter'].value) !== 0) {
      tile.innerHTML = Number(tile.attributes['data-counter'].value)
    }
    if (tile.classList.contains('mine')) {
      tile.style.backgroundImage = 'url(./assets/bomb.svg)'
      tile.style.backgroundSize = 'cover'
    }
  })

  alert('Game Over!')
}


// If all the tiles, minus the mines, have been swept, the player wins
// ? Expecting this to return true when the player has won
const checkWin = (sweepedTilesArray) => {
  console.log(sweepedTilesArray)
  
  const isWinner = sweepedTilesArray.every(tile => {
    console.log(tile.attributes['data-sweeped'].value)
    return tile.attributes['data-sweeped'].value === 'true'
  })   
  if (isWinner) {
    alert('Winner!')
  }
}

