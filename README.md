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
* Use Javascript for DOM manipulation
* Deploy your game online, where the rest of the world can access it
* Use semantic markup for HTML and CSS (adhere to best practices)

### Web Technologies 
* HTML5 and CSS3
* JavaScript (ES6)
* Git & Github

## Game Logic
Below I’ve highlighted the main components of the game.

1. Generate a Board (Grid)
With future proofing in mind for various difficulty levels, I used the width to relatively calculate the grid size. 

![minesweeper board](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.47.59.png)


2. Game Start Condition
For a seamless start to a widely recognised game, I wanted the first click on any tile to start the game. 	I set a condition for number of clicks is 1 to uncover the first tile, which would also have to be a safe tile. This was also the trigger to start the timer. 

3. Populate Board with Randomly Placed Mines
* Mine doesn’t already exists
* Mine is not on the Currently Flipped Tile
* Mine is not in a Surrounding Tile of the First Flipped Tile
 
*generate mines*
![generate mines](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2019.06.28.png)

*add mines to board*
![add mines to board](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2019.05.28.png)

4. Surrounding Tiles and Boundary Logic

To check all valid surrounding tiles, I gave each tile an index and calculated the  position of each of the possible 8 locations. Relative to the current clicked tile.

I calculated the first and last column boundaries as well to inform which of the surrounding tiles should be checked. I avoided having to check the top and bottom rows by checking for truthy values in the conditions for `divArray[<positon>]` values. 

*Surrounding Tiles*
![surrounding tiles](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2019.02.42.png)

*Check for Safe Tiles*
![check for safe tiles](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.25.44.png)


5. Aggregate Total Number of Surrounding Mines and Populate Surrounding Tiles

To display the aggregated surrounding mines counter, I added a data attribute to each cell, initialised it to 0 on a new board and incremented its value by 1 if a mine was present.

![total surrounding mines](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2019.10.20.png)

6. Flag a Suspected Mine

Another feature of the game is to flag a tile that you are confident is concealing a mine by right clicking on it. The first solution I found for this was to use the `contextmenu` and repurpose it however I didn’t want to override this so I used the `MouseEvent.button` instead.  This button has 5 possible values, of which 2 is the secondary button, usually the right click. 

![right click flag](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.36.09.png)

![flag on board](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.49.52.png)


7. Recursion
Unfortunately I couldn’t get this to work…

*Sweep Safe Surrounding Tiles*
![looping sweeper](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.29.11.png)

8. Game End

*Clicked on a Mine - Game Over*
![game over](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.54.07.png)

*Cleared the Board and Swept all Mines - Win*
![winner](https://github.com/AbuBakr-S/project-1/blob/main/assets/Screenshot%202021-06-29%20at%2023.54.48.png)
