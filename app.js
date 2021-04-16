const elements = {
  grid: document.querySelector('.grid'),
}

// This can be changed for different sized grids
const width = 10
const emptyTiles = []
// Mines will be set to width (10 in this build)
const mines = []
let numberOfClicks = 0

for (let i = 0; i < width ** 2; i++) {
  const div = document.createElement('div')
  elements.grid.appendChild(div)
  div.id = i

  // div.innerHTML = i - Debugging

  // dynamically size the grids using the width
  div.style.width = `${100 / width}%`
  div.style.height = `${100 / width}%`

  // when a tile is clicked, run the flippedTile function
  div.addEventListener('click', (e) => {
    flippedTile(e)
  })
}

const flippedTile = (e) => {
  // check whether first click
  numberOfClicks++
  if (numberOfClicks === 1) {
    console.log('First Click')
    
    // set the current tile to 0
    e.target.innerHTML = 0
    const currentTileIndex = Number(e.target.id)   // Make sure this is not a string 
    // generate the mines and surrounding numbers
    console.log(generateMines(currentTileIndex))
    // start sweeper function
  }

  // console.log(e.target.innerHTML) - Debugging
}

const generateMines = (currentTileIndex) => {
  console.log('Current tile index is: ' + currentTileIndex)
  while (mines.length < width) {
    const randomIndex = Math.floor(Math.random() * (width ** 2))
    if (!mines.includes(randomIndex) && randomIndex !== currentTileIndex) {
      mines.push(randomIndex)
    }
  }
  return mines
}


// const sweeper = () => {

// }

// if (player's first click) {
//   get the index of the current tile
//   tile = 0
// }

/* 
MINESWEEPER

# Start and End Conditions
* Game Starts when the player clicks the first tile (any)
* Game Over when the player clears all the tiles or clicks on a mine
! First click will never end the game

# UI Components
* Number of Mines Remaining (initialise at total)
* Timer (counting up) once the game has started and will stop once the player wins / loses
* Game state (playing / win / lose)

# Features
* An empty space
* A number (representing surrounding mines)
* A mine
* A flag
* Difficulty (start with 10 X 10 grid with 10 mines and 10 flags)

*/


/*
ARCHITECTURE

# The Grid
* The grid should be a div of divs (10 X 10)
* Use a width variable to track number of tiles per row
* Use a loop to create the grid, to allow room for stretch goals (additional levels)
* Use div.innerHTML = index to help visualise the indexed grid
* Store the mines in an array
*/

/*
GAME LOGIC

* All tiles should be covered at the start
* You should not be able to add a flag at the start of the game unless a tile has been clicked
* Once a tile has been clicked, start the timer
* Every tile surrounding a mine should have a number indicating how many mines it is touching.
* The status of the tiles:
  if (tile is the first tile that is left clicked) {
    display empty tile
    
  }
  if (tile is a mine) {
    display all the bombs and game over
  }

* Sweep Tiles Function: Run every time you clear a tile
  ? uncover every empty tile in the area, including the numbered tiles, using the numbered tiles and grid edges as a boundary
  * If the tile clicked is empty, reveal nearby tiles (8)
  * If any of those nearby tiles are empty, reveal those (recursively loop through of those tiles and so on...)
  * Make sure you're not checking the same tile again
  * Compare empty tiles with Empty Tiles Array

* Number of Mines is = number of flags
* Randomly assign each mine a unique tile
* For each mine, record the current tile and also record surrounding tile positions


* Create 10 unique random numbers between 0 and 99 and push those numbers into the mines array
const mines = []
loop (mines.length < 11) {
  const randomIndex = Math.floor(Math.random * grid.length)
  if (!mines.includes(randomIndex)) {
    mines.push(randomIndex)
  }
}
* Create a class of .mine which will display a mine. 
* Looping through the mines array, assign each mine a class of .mine

*/