const elements = {
  grid: document.querySelector('.grid'),
  elapsedTime: document.querySelector('#elapsed-time'),
  remainingFlags: document.querySelector('#remaining-flags'),
  modal: document.getElementById('myModal'),
  modalSpan: document.getElementsByClassName('close')[0],
  modalBody1: document.querySelector('#modal-body-1'),
  modalBody2: document.querySelector('#modal-body-2'),
  modalButton: document.querySelector('#play-again'),
}

const width = 10
const tiles = []
const mines = []
let numberOfClicks = 0
let isGameOver
let elapsedTimeID
let flags = 0


const generateBoard = () => {
  for (let i = 0; i < width ** 2; i++) {
    const tile = document.createElement('div')
    // add data attribute for nearby mines counter
    tile.setAttribute('data-counter', 0)
    // add data attribute to track whether a tile has been sweeped 
    tile.setAttribute('data-sweeped', false)
    // set tile ids 0 - 99
    elements.grid.appendChild(tile)
    tile.id = i
    // dynamically size the grids using the width
    tile.style.width = `${100 / width}%`
    tile.style.height = `${100 / width}%`
    // when a tile is left clicked, call the click function on the current tile
    tile.addEventListener('click', (e) => {
      click(tile)
      numberOfClicks++
      // start timer on first click only
      if (numberOfClicks === 1) {
        let counter = 1
        elapsedTimeID = setInterval(() => {
          elements.elapsedTime.innerHTML = counter++
        }, 1000)
      }
    })

    // when a tile is right clicked, add a flag
    tile.oncontextmenu = (e) => {
      e.preventDefault()
      addFlag(tile)
    }
  }
}

generateBoard()


console.log(elements.grid)
console.log(tiles)


const addFlag = (tile) => {
  console.log('Test flag')
}


// const generateMines = (tile, eightTilesArray) => {
//   while (mines.length < width) {
//     const randomIndex = Math.floor(Math.random() * (width ** 2))
//     if (!mines.includes(randomIndex) && randomIndex !== tile && !eightTilesArray.includes(randomIndex)) {
//       mines.push(randomIndex)
//     }
//   }
//   return mines
// }

for (let i = 0; i < tiles.length; i++) {
  let total = 0
  const isFirstColumn = (tile % width === 0)
  const isLastColumn = (tile % width === width - 1)

  if (tiles[i].classList.contains('valid')) {
    // check west
    if (i > 0 && !isLeftEdge && tiles[i - 1].classList.contains('bomb')) total++
    // check north east 
    if (i > 9 && !isRightEdge && tiles[i + 1 - width].classList.contains('bomb')) total++
    // check north
    if (i > 10 && tiles[i - width].classList.contains('bomb')) total++
    // check north west
    if (i > 11 && !isLeftEdge && tiles[i - 1 - width].classList.contains('bomb')) total++
    // check east
    if (i < 98 && !isRightEdge && tiles[i + 1].classList.contains('bomb')) total++
    // check south west
    if (i < 90 && !isLeftEdge && tiles[i - 1 + width].classList.contains('bomb')) total++
    // check south east
    if (i < 88 && !isRightEdge && tiles[i + 1 + width].classList.contains('bomb')) total++
    // check south
    if (i < 89 && tiles[i + width].classList.contains('bomb')) total++
    // add number of surrounding bombs to tile
    tiles[i].setAttribute('data', total)
  }
}


// const checkEightTiles = (tile) => {
//   // calculate surrounding tile positions (relative)
//   // const north = tile - width
//   // const northEast = tile - width + 1
//   // const east = tile + 1
//   // const southEast = tile + width + 1
//   // const south = tile + width
//   // const southWest = tile + width - 1
//   // const west = tile - 1
//   // const northWest = tile - width - 1

//   // check whether the tile is in the first column or the last
//   const isFirstColumn = (tile % width === 0)
//   const isLastColumn = (tile % width === width - 1)

//   // grab the indexes of all the tiles surrounding the tile
//   if (tiles > width) {
//     eightTilesArray.push(Number(tiles[north].id))
//   }
//   if (tiles[northEast] && !isLastColumn) {
//     eightTilesArray.push(Number(tiles[northEast].id))
//   }
//   if (tiles[east] && !isLastColumn) {
//     eightTilesArray.push(Number(tiles[east].id))
//   }
//   if (tiles[southEast] && !isLastColumn) {
//     eightTilesArray.push(Number(tiles[southEast].id))
//   }
//   if (tiles[south]) {
//     eightTilesArray.push(Number(tiles[south].id))
//   }
//   if (tiles[southWest] && !isFirstColumn) {
//     eightTilesArray.push(Number(tiles[southWest].id))
//   }
//   if (tiles[west] && !isFirstColumn) {
//     eightTilesArray.push(Number(tiles[west].id))
//   }
//   if (tiles[northWest] && !isFirstColumn) {
//     eightTilesArray.push(Number(tiles[northWest].id))
//   }

//   return eightTilesArray
// }