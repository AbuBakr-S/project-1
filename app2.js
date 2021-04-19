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

    elements.grid.appendChild(div)
    div.id = i

    // ! Remove after testing
    //div.innerHTML = i

    // dynamically size the grids using the width
    div.style.width = `${100 / width}%`
    div.style.height = `${100 / width}%`
  }
}

generateBoard()

const divArray = Array.from(document.querySelectorAll('.grid div'))
divArray.forEach(div => {
  div.addEventListener('click', (e) => {
    flippedTile(e)
  })
})

const flippedTile = (e) => {
  numberOfClicks++
  currentTileIndex = Number(e.target.id)
  console.log(currentTileIndex)
  getSurroundingTiles(currentTileIndex)

  // ! If first click, then generate mines
  if (numberOfClicks === 1) {
    console.log('First Click!')
    generateMines(currentTileIndex, eightTilesArray)
    addMinesToBoard()
    tilesNearbyMine()
  }
  
  sweepSurroundingTiles(currentTileIndex, eightTilesArray)
  addSurroundingMinesCounter()
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
  if (divArray[up]) {
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

const addMinesToBoard = () => {
  mines.forEach(mine => {
    divArray[mine].classList.add('mine')
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

const addSurroundingMinesCounter = () => {
  divArray.forEach(div => {
    if (Number(div.attributes['data-counter'].value) !== 0) {
      div.innerHTML = Number(div.attributes['data-counter'].value)
    }
  })
}

const sweepSurroundingTiles = (currentTileIndex, eightTilesArray) => {
  console.log('Call to sweepSurroundingTiles Function')
  console.log('Tiles Surrounding Current Tile Clicked: ', eightTilesArray)
  console.log('Mine Indexes: ', mines)
}