# Project 1: Minesweeper

## Overview
For the first project, we were tasked with building a grid based game to demonstrate interaction with the DOM, array based logic and relative board size rendering for scalability. From the options, I decided to go for Minesweeper as it’s a game I grew up knowing about but never understood how to play until recently and it looked like a good challenge.

### What is Minesweeper?
For those that might not have heard of it, Minesweeper is a classic Windows PC game where you are tasked with clearing a board of tiles by using indicators of nearby mines to inform your decision of whether or not to flip a tile. Here’s some steps to get you started:

### Instructions
* The game starts with 10 randomly placed mines hidden on the board with numbers indicating how many mines are surrounding a given tile (also hidden).  
* The first click is always a safe tile so click on any tile to get started.
* Like most grid based games, each tile has 8 surrounding tiles. On each click, you will see nearby tiles will be uncovered, revealing a number for any nearby mines.
* Right click on any tile that you think may be concealing a mine. 
* Click on a mine and the game is over.

### Project Brief
* Render a game in the browser
* Design logic for winning & visually display which player won
* Include separate HTML / CSS / JavaScript files
* Stick with KISS (Keep It Simple Stupid) and DRY (Don’t Repeat Yourself) principles
* Use JavaScript for DOM manipulation
* Deploy your game online, where the rest of the world can access it
* Use semantic markup for HTML and CSS (adhere to best practices)

### Web Technologies 
* HTML5 and CSS3
* JavaScript (ES6)
* Git & Github

### Deployed Project
You can find this deployed [here](https://abubakr-s.github.io/project-1/).

### Planning
My approach to planning this project was to find an online version of the game, analyse it as I played it through till the end and break down the order of events. I also went through the rules to make sure I didn't miss anything out. I then took note of these and started to group key areas together, which I later used to pseudocode. When it came to the sweeping functionality, whiteboaring helped me with the visualisation.

#### Start and End Conditions
* Game Starts when the player clicks the first tile (any)
* Game Over when the player clears all the tiles or clicks on a mine 
* First click will never end the game

#### UI Components
* Number of Mines Remaining (initialise at total)
* Timer (counting up) once the game has started and will stop once the player wins / loses
* Game state (playing / win / lose)

#### Features
* An empty space
* A number (representing surrounding mines)
* A mine
* A flag
* Difficulty (start with 10 X 10 grid with 10 mines and 10 flags)

#### The Grid
* The grid should be a div of divs (10 X 10)
* Use a width variable to track number of tiles per row
* Use a loop to create the grid, to allow room for stretch goals (additional levels)
* Use `div.innerHTML = index` to help visualise the indexed grid
* Store the mines in an array

#### Planning Game Logic

* All tiles should be covered at the start
* You should not be able to add a flag at the start of the game unless a tile has been clicked
* Once a tile has been clicked, start the timer
* Every tile surrounding a mine should have a number indicating how many mines it is touching.
* The status of the tiles:
```
  if (tile is the first tile that is left clicked) {
    display empty tile
  }
  if (tile is a mine) {
    display all the bombs and game over
  }
```
##### Sweep Tiles Function: Run every time you clear a tile

*White-boaring Sweeping Logic*

<img src="assets/plan-sweep-logic.png" alt="Whiteboarding Sweeping Functionality" width="60%" height="auto">

*Google's Minesweeper Boundaries*

<img src="assets/google-minesweeper.png" alt="Google's Minesweeper Game" width="40%" height="auto">  

  * Uncover every empty tile in the area, including the numbered tiles, using the numbered tiles and grid edges as a boundary
  * If the tile clicked is empty, reveal nearby tiles (8)
  * If any of those nearby tiles are empty, reveal those (recursively loop through of those tiles and so on…)
  * Make sure you’re not checking the same tile again
  * Compare empty tiles with Empty Tiles Array
* Number of Mines is = number of flags
* Randomly assign each mine a unique tile
* For each mine, record the current tile and also record surrounding tile positions
* Create 10 unique random numbers between 0 and 99 and push those numbers into the mines array
```
const mines = []
loop (mines.length < 11) {
  const randomIndex = Math.floor(Math.random * grid.length)
  if (!mines.includes(randomIndex)) {
    mines.push(randomIndex)
  }
}
```
* Create a class of `.mine` which will display a mine. 
* Looping through the mines array, assign each mine a class of `.mine`

## Developing Game Logic
Below I’ve highlighted the main components of the game.

1. **Generate a board (grid)**

With future proofing in mind for various difficulty levels, I used the width to relatively calculate the grid size. 

*Generate board*

<img src="assets/grid.png" alt="Minesweeper Grid" width="60%" height="auto">


2. **Game start condition**

For a seamless start to a widely recognised game, I wanted the first click on any tile to start the game. I set a condition for number of clicks is 1 to uncover the first tile, which would also have to be a safe tile. This was also the trigger to start the timer. 

3. **Populate board with randomly placed mines**

I started by generating random grid position numbers which I later used as indexes for the placed mines. This required the following conditions:
* Ensure that a mine does not already exist at the given random index to avoid duplication
* Ensure that the first flipped tile of the game is a safe tile by avoiding the `currentTileIndex` to avoid an immidiate *Game Over* condition
* Ensure that a mine is not placed on a tile surrounding the first flipped tile to keep the area clear
 
*Generate mines*
```
const generateMines = (currentTileIndex, eightTilesArray) => {
  while (mines.length < width) {
    const randomIndex = Math.floor(Math.random() * (width ** 2))
    if (!mines.includes(randomIndex) && randomIndex !== currentTileIndex && !eightTilesArray.includes(randomIndex)) {
      mines.push(randomIndex)
    }
  }
  return mines
}
```

*Add mines to board*
```
// If a tile has a mine, add the mine class and remove the 'data-sweeped' attribute
const addMinesToBoard = () => {
  mines.forEach(mine => {
    divArray[mine].classList.add('mine')
    divArray[mine].attributes.removeNamedItem('data-sweeped')
  })
}
```

4. **Aggregate total number of surrounding mines and populate surrounding tiles**

To display the aggregated surrounding mines counter, I used the `data-counter` attributes and initialised it to 0 on a new board. To check all valid tiles surrounding a mine, I gave each tile an index and calculated the position of each of the possible 8 locations, relative to the currently clicked tile. I then incremented the `data-counter` attribute on each of these tiles by 1.

I calculated the first and last column boundaries as well to inform which of the surrounding tiles should be checked. I avoided having to check the top and bottom rows by checking for truthy values in the conditions for `divArray[<positon>]` values. 

*Increment `data-counter`*
```
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
```

5. **Sweep surrounding tiles**

In this section, I used the `data-sweeped` attribute to keep track of uncovered tiles. I used conditional flow to uncover a tile on the screen if a clicked tile has a `data-counter` value of 0 (it's safe). If the surrounding tiles are all empty, blank tiles shall be revealed. If the surrounding tiles are safe, although they're touching a mine, a numbered tile shall be revealed, displaying the aggregated value. These steps will be skipped for literal edge cases. 

```
const sweepSurroundingTiles = (currentTileIndex, eightTilesArray) => {
  eightTilesArray.forEach(tile => {

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
      return
    }
    if (tile < width && tile >= 0 || (tile > (width ** width - width - 1) && tile < width ** width)) {
      return
    }
  })
}
```

6. **Flag a suspected mine**

Another feature of the game is to flag a tile that you are confident is concealing a mine by right clicking on it. The first solution I found for this was to use the `contextmenu` and repurpose it however I didn’t want to override this so I used the `MouseEvent.button` instead.  This button has 5 possible values, of which 2 is the secondary button, usually the right click. 

*Right click to set flag*
```
const flag = (e) => {
  //Add a flag if a tile is right clicked

  if (e.button === 2 && divArray[currentTileIndex] && !e.target.classList.contains('sweeped')) {
    divArray[Number(e.target.id)].classList.toggle('flag')
  }
}
```

*Set flag*

<img src="assets/showcase.png" alt="Display Flag" width="60%" height="auto">


7. **Game end**

*Clicked on a mine - Game over*
```
// If a mine is clicked, display the modal, all the tile counters and all the mines
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

  isPlaying = false
  clearInterval(elapsedTimeID)
  elements.elapsedTime.innerHTML = 0

  // Display modal
  elements.modalBody1.innerHTML = 'GAME OVER!'
  elements.modalBody2.innerHTML = 'Woah, looks like you hit a mine'
  elements.modal.style.display = 'block'
}
```

*Cleared the board and swept all mines - Win*
```
// If all the tiles, minus the mines, have been swept, the player wins
// ? Expecting this to return true when the player has won
const checkWin = (sweepedTilesArray) => {
  const isWinner = sweepedTilesArray.every(tile => {
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
```

### Wins
* Building one of the first PC games I've ever played
* Successfully scaling a grid based game using relative dimentional values
* Successfully developing conditional user journeys for win and loss logic


### Challenges

#### Recursion
I had a lot of problems with trying to implement the recursive sweeping functionality. I identified my **base case** as: 

* If all surrounding tiles have a `data-sweeped` value of true, stop looping 


However I couldn't get this to work. The plan was to call the `sweepSurroundingTiles` function as many times as necessary. In an effort to make the game workable I decided to use a workaround which had a limitation of only looping twice - once around the flipped tile and then again around each of the 8 surrounding tiles, sweeping up to 25 tiles at a time. This is the current implementation of the game.

*Sweep safe surrounding tiles*
```
const loopingSweeper = (eightTilesArray) => {
  // * If the current tile is a number, return
  if (Number(divArray[currentTileIndex].attributes['data-counter'].value) > 0) {
    return
  }
  
  // Call getSurroundingTiles with a new index to return a new eightTilesArray
  // Then call sweepSurroundingTiles with this new index and new eightTilesArray
  eightTilesArray.forEach(tile => {
    const newIndex = Number(divArray[tile].id)
    sweepSurroundingTiles(newIndex, getSurroundingTiles(newIndex))
  })
}
```

### Key Learnings / Reflection
* Being better able to recognise event sequences in applications
* Learning how to design and develop different event sequences for my own projects in future 
* Becoming more comfortable with grid logic and relative positioning


### Future Features
* A highscore board using local storage
* Animations on an exploding mine
* Consider mobile compatibility - particularly the right click for a flag