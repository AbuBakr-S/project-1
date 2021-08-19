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
const mines = []
let currentTileIndex
let eightTilesArray = []
let numberOfClicks = 0
let isPlaying
let elapsedTimeID
let flags = 0

const generateBoard = () => {
  for (let i = 0; i < width ** 2; i++) {

    const tile = document.createElement('div')
    // Add data attribute for nearby mines counter
    tile.setAttribute('data-counter', 0)

    // Add data attribute to track whether a tile has been sweeped 
    tile.setAttribute('data-sweeped', false)

    elements.grid.appendChild(tile)
    tile.id = i

    // Dynamically size the grids using the width
    tile.style.width = `${100 / width}%`
    tile.style.height = `${100 / width}%`

    // when a tile is left clicked, call the click function on the current tile
    tile.addEventListener('click', () => {
      click(tile)
      numberOfClicks++
      if (numberOfClicks === 1) {
        generateMines(currentTileIndex, eightTilesArray)
        addMinesToBoard()
        tilesNearbyMine()
        let counter = 1
        elapsedTimeID = setInterval(() => {
          elements.elapsedTime.innerHTML = counter++
        }, 1000)
      }
    })

    // when a tile is right clicked, add a flag
    // when a tile is right clicked, add a flag
    tile.oncontextmenu = (e) => {
      e.preventDefault()
      addFlag(tile)
    }
  }
}

generateBoard()

const flag = (e) => {
  //Add a flag if a tile is right clicked

  if (e.button === 2 && divArray[currentTileIndex] && !e.target.classList.contains('sweeped')) {
    divArray[Number(e.target.id)].classList.toggle('flag')
  }
}

// add flag
const addFlag = (tile) => {
  if (!isPlaying) return
  if (!tile.classList.contains('checked') && (flags < mines.length)) {
    if (!tile.classList.contains('flag')) {
      tile.classList.add('flag')
      flags++
      elements.remainingFlags.innerHTML = mines.length - flags
      checkWin()
    } else {
      tile.classList.remove('flag')
      flags--
      elements.remainingFlags.innerHTML = mines.length - flags // *?
    }
  }
}



const divArray = Array.from(document.querySelectorAll('.grid div'))
// divArray.forEach(div => {
//   div.addEventListener('click', (e) => {
//     flippedTile(e)
//   })
//   div.addEventListener('mouseup', flag)
// })
  
  // sweepSurroundingdivArray(currentTileIndex, eightTilesArray)
  // loopingSweeper(eightTilesArray)
  // sweepCurrentTile(currentTileIndex)

  // Create an array of all divArray with sweeped attributes (tile has been checked / uncovered)
  // const sweepedDivArray = divArray.filter(tile => tile.hasAttribute('data-sweeped'))
  // checkWin(sweepedDivArray)

const getSurroundingTiles = (currentTileIndex) => {
  eightTilesArray = []
  // Calculate surrounding tile positions (relative)
  const upRight = currentTileIndex - width + 1
  const right = currentTileIndex + 1
  const downRight = currentTileIndex + width + 1
  const up = currentTileIndex - width
  const down = currentTileIndex + width
  const downLeft = currentTileIndex + width - 1
  const left = currentTileIndex - 1
  const upLeft = currentTileIndex - width - 1

  // Check whether the tile is in the first column or the last
  const isFirstColumn = (currentTileIndex % width === 0)
  const isLastColumn = (currentTileIndex % width === width - 1)

  // Grab the indexes of all the divArray surrounding the currentTileIndex
  // Add these indexes to the eightTilesArray
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
  console.log(elements.grid)
}

const tilesNearbyMine = () => {
  mines.forEach(mine => {
    // Calculate nearby mines positions (relative)
    const upRight = mine - width + 1
    const right = mine + 1
    const downRight = mine + width + 1
    const up = mine - width
    const down = mine + width
    const downLeft = mine + width - 1
    const left = mine - 1
    const upLeft = mine - width - 1

    // Check whether a mine is in the first column or the last
    const isFirstColumn = (mine % width === 0)
    const isLastColumn = (mine % width === width - 1)

    //grab the indexes of all the divArray surrounding the currentTileIndex
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


// ! Move click functionality here
const click = (currentTileIndex) => {
  console.log('clicked')
  sweepCurrentTile(currentTileIndex)
  getSurroundingTiles(currentTileIndex)
  if (!isPlaying) return
  if (currentTileIndex.hasAttribute('data-sweeped') || currentTileIndex.classList.contains('flag')) return
  if (currentTileIndex.classList.contains('mine')) {
    gameOver()
  }

  // recursive sweep
  checkTile(currentTileIndex)
}


// ! Recursion
const checkTile = (currentTileIndex) => {
  const isFirstColumn = (currentTileIndex % width === 0)
  const isLastColumn = (currentTileIndex % width === width - 1)

  setTimeout(() => {
    // check east
    if (currentTileIndex > 0 && !isFirstColumn) {
      const newId = divArray[parseInt(currentTileIndex) - 1].id
      //const newId = parseInt(currentTileIndex) - 1   ....refactor
      const newTile = document.getElementById(newId)
      // pass the new tile to the click function to be checked again
      // if it passes, this will repeat until it stops
      click(newTile)
    }
    if (currentTileIndex > 9 && !isLastColumn) {
      const newId = divArray[parseInt(currentTileIndex) + 1 - width].id
      //const newId = parseInt(currentTileIndex) +1 -width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex > 10) {
      const newId = divArray[parseInt(currentTileIndex - width)].id
      //const newId = parseInt(currentTileIndex) -width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex > 11 && !isFirstColumn) {
      const newId = divArray[parseInt(currentTileIndex) - 1 - width].id
      //const newId = parseInt(currentTileIndex) -1 -width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex < 98 && !isLastColumn) {
      const newId = divArray[parseInt(currentTileIndex) + 1].id
      //const newId = parseInt(currentTileIndex) +1   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex < 90 && !isFirstColumn) {
      const newId = divArray[parseInt(currentTileIndex) - 1 + width].id
      //const newId = parseInt(currentTileIndex) -1 +width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex < 88 && !isLastColumn) {
      const newId = divArray[parseInt(currentTileIndex) + 1 + width].id
      //const newId = parseInt(currentTileIndex) +1 +width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
    if (currentTileIndex < 89) {
      const newId = divArray[parseInt(currentTileIndex) + width].id
      //const newId = parseInt(currentTileIndex) +width   ....refactor
      const newTile = document.getElementById(newId)
      click(newTile)
    }
  }, 10)

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
const sweepSurroundingdivArray = (currentTileIndex, eightTilesArray) => {
  eightTilesArray.forEach(tile => {
    // * BASE CASE: If all surrounding divArray have a 'data-sweeped' value of true, stop looping 
    // const allSurroundingdivArraySweeped = eightTilesArray.every(tile => {
    //   divArray[tile].attributes['data-sweeped'].value = true
    // })

    // if (allSurroundingdivArraySweeped) {
    //   console.log('All surrounding divArray have been sweeped!')
    //   return
    // }

    /*
      1. If a tile has a number, reveal and then return
      2. If a tile has a mine, return
      3. If the tile is on the edge, reveal and then return
    */

    // * Check current tile and surrounding divArray are empty. If so, reveal
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
      return
    }
    if (tile < width && tile >= 0 || (tile > (width ** width - width - 1) && tile < width ** width)) {
      return
    }
  })
}

// const loopingSweeper = (eightTilesArray) => {
//   // * If the current tile is a number, return
//   if (Number(divArray[currentTileIndex].attributes['data-counter'].value) > 0) {
//     return
//   }
  
//   // Call getSurroundingTiles with a new index to return a new eightTilesArray
//   // Then call sweepSurroundingdivArray with this new index and new eightTilesArray
//   eightTilesArray.forEach(tile => {
//     const newIndex = Number(divArray[tile].id)
//     sweepSurroundingdivArray(newIndex, getSurroundingTiles(newIndex))
//   })
// }

// If a mine is clicked, display the modal, all the tile counters and all the mines
const gameOver = () => {
  // Display all the divArray
  divArray.forEach(tile => {
    if (Number(tile.attributes['data-counter'].value) !== 0) {
      tile.innerHTML = Number(tile.attributes['data-counter'].value)
    }
    if (tile.classList.contains('mine')) {
      tile.style.backgroundImage = 'url(./assets/bomb.svg)'
      tile.style.backgroundSize = 'cover'
    }
  })

  isPlaying = false
  clearInterval(elapsedTimeID)
  elements.elapsedTime.innerHTML = 0

  // Display modal
  elements.modalBody1.innerHTML = 'GAME OVER!'
  elements.modalBody2.innerHTML = 'Woah, looks like you hit a mine'
  elements.modal.style.display = 'block'
}


// If all the divArray, minus the mines, have been swept, the player wins
// ? Expecting this to return true when the player has won
const checkWin = (sweepedDivArray) => {
  const isWinner = sweepedDivArray.every(tile => {
    return tile.attributes['data-sweeped'].value === 'true'
  })   
  if (isWinner) {
    isPlaying = false
    clearInterval(elapsedTimeID)
    elements.elapsedTime.innerHTML = 0
    // Display modal
    elements.modalBody1.innerHTML = 'YOU WIN!'
    elements.modalBody2.innerHTML = 'Well done, you\'ve cleared all mines'
    elements.modal.style.display = 'block'
  }
}

// Hide the modal when the 'X' is clicked
elements.modalSpan.addEventListener('click', () => {
  elements.modal.style.display = 'none'
})

// Hide the modal by default
window.addEventListener('click', (e) => {
  if (e.target === elements.modal) {
    elements.modal.style.display = 'none'
  }
})

// Refresh when 'Play Again' is clicked to reset the game
elements.modalButton.addEventListener('click', () => {
  location.reload()
})
