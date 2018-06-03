const fieldSize = 700;
const numberOfCellsInRow = 20;
const framesPerSecond = 50.1;
const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var checkCountBug = 0;
var checkBug = 0;

const getRandomGrid  = () => {
  const grid = new Array (numberOfCellsInRow);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array (numberOfCellsInRow);
    for (let j = 0; j < grid.length; j++) {
      grid[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return grid;
}

const grid = getRandomGrid();
const cellSize = fieldSize / numberOfCellsInRow;

const drawGrid = (ctx, grid) => {
  ctx.strokeStyle = '#aaa';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

const drawLife = (ctx, grid) => {
  ctx.strokeStyle = '#aaa';
  ctx.fillStyle = 'gray';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const value = grid[i][j];
      if (value) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
        ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

const getNextGeneration = (grid) => {
  const nextGrid = new Array(grid.length);
  for (let i = 0; i < grid.length; i++) {
    nextGrid[i] = new Array(grid.length);
    for (let j = 0; j < grid.length; j++) {
      const value = grid[i][j];
      const neighbors = countNeigbors(grid, i, j);
      if (!value && neighbors === 3) {
        nextGrid[i][j] = 1;
      }
      else if (value === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = 0;
      }
      else {
        nextGrid[i][j] = value;
      }
    }
  }
  return nextGrid;
}

const countNeigbors = (grid, x, y) => {
  let sum = 0;
  const numberOfRows = grid.length;
  const numberOfCols = grid[0].length;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const row = (x + i + numberOfRows) % numberOfRows;
      const col = (y + j + numberOfCols) % numberOfCols;
      sum += grid[row][col];
    }
  }
  sum-= grid [x][y];
  return sum;
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0);

function stopGame(ctx) {
    ctx.clearRect(0, 0, fieldSize, fieldSize);
    drawGrid(ctx, grid);
    cancelAnimationFrame();
}

const generation = (ctx, grid) => {
  checkCountBug++;
  let test = [];
  if (checkCountBug % 2 === 0) {
   checkBug = arrSum(grid);
  }
  const prev =  arrSum(grid);
  ctx.clearRect(0, 0, fieldSize, fieldSize);
  drawLife(ctx, grid);
  const gridOfNextGeneration = getNextGeneration(grid);
  const next = arrSum(gridOfNextGeneration);
  if ( prev === next || checkBug === next) {
    modalWindow(ctx);
  }
  setTimeout(() => {
    requestAnimationFrame(() => generation(ctx, gridOfNextGeneration))
  }, 1000 / framesPerSecond );
}

function start() {
  generation(ctx, grid);
}

function restart() {
  ctx.clearRect(0, 0, fieldSize, fieldSize);
  const more = getRandomGrid();
  drawLife(ctx, more);
  generation(ctx, more);
}

drawGrid(ctx, grid);
document.getElementById('start').onclick = start;
document.getElementById('reset').onclick = restart;

 function modalWindow(ctx) {
   modal.style.display = "block";
   cancelAnimationFrame();
}

span.onclick = function() {
  ctx.clearRect(0, 0, fieldSize, fieldSize);
  drawGrid(ctx, grid);
  modal.style.display = "none";
}
