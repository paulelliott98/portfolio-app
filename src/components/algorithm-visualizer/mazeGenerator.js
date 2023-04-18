const utils = require("../../utils");
const blocks = require("./blocks");

// X X X X X
// X X X X X
// X X X X X
// X X X X X
// X   X X X

const dirChange = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

const dirCodes = { up: 0, right: 1, down: 2, left: 3 };

// get reverse direction of a given direction
const reverseDir = new Map();
reverseDir.set(dirCodes.up, dirCodes.down);
reverseDir.set(dirCodes.down, dirCodes.up);
reverseDir.set(dirCodes.left, dirCodes.right);
reverseDir.set(dirCodes.right, dirCodes.left);

function generateMaze(nRows, nCols) {
  let grid = utils.createArray(nRows, nCols, blocks.wall);

  let startDir = utils.randInt(0, 3);
  const start = initStartPos(startDir, nRows, nCols); // start coordinate

  const [startR, startC] = [
    start.r + dirChange[startDir][0],
    start.c + dirChange[startDir][1],
  ];

  let end;
  end = makeAllCorridors({ r: startR, c: startC }, startDir, grid);
  grid[start.r][start.c] = blocks.source;
  grid[end.r][end.c] = blocks.sink;

  return { grid: grid, startPos: start, endPos: end };
}

// return random start position on grid border based on defined direction
function initStartPos(startDir, nRows, nCols) {
  if (startDir === dirCodes.up) {
    return { r: nRows - 1, c: utils.randOdd(1, nCols - 2) };
  } else if (startDir === dirCodes.down) {
    return { r: 0, c: utils.randOdd(1, nCols - 2) };
  } else if (startDir === dirCodes.left) {
    return { r: utils.randOdd(1, nRows - 2), c: nCols - 1 };
  } else if (startDir === dirCodes.right) {
    return { r: utils.randOdd(1, nRows - 2), c: 0 };
  }
}

// return arr of length two containing block types of two side blocks at coord
function getSideBlocks(coord, forwardDir, grid) {
  if (forwardDir === dirCodes.up || forwardDir === dirCodes.down) {
    return [grid[coord.r][coord.c - 1], grid[coord.r][coord.c + 1]];
  }
  return [grid[coord.r - 1][coord.c], grid[coord.r + 1][coord.c]];
}

// return true if block at coord is a wall block; wall blocks cannot be excavated
// walls are wall blocks with thickness 1
// a wall is either a border block, or is adjacent to an empty block in the forward/side directions
function isWall(coord, forwardDir, grid) {
  if (
    coord.r <= 0 ||
    coord.r >= grid.length - 1 ||
    coord.c <= 0 ||
    coord.c >= grid[0].length - 1
  )
    return true;

  // check 1 block down forwardDir and the two side blocks of that block

  // if r, c out of bounds or grid[r][c] is empty block -> return true
  let [nr, nc] = [
    coord.r + 1 * dirChange[forwardDir][0],
    coord.c + 1 * dirChange[forwardDir][1],
  ];

  const sideBlocks = getSideBlocks({ r: nr, c: nc }, forwardDir, grid);

  if (
    !utils.isInBounds(nr, nc, grid) ||
    grid[coord.r][coord.c] === blocks.empty ||
    grid[nr][nc] === blocks.empty ||
    sideBlocks[0] === blocks.empty ||
    sideBlocks[1] === blocks.empty
  )
    return true;

  return false;
}

function makeAllCorridors(start, direction, grid) {
  let end = start;
  let dir = direction;

  let turns = [];

  for (let i = 0; i < 9; i++) {
    end = makeCorridor(end, dir, grid, i);
    let prevDir = dir;
    dir = getNewDirection(end, dir, grid);

    if (getTurnDirection(prevDir, dir) !== null)
      turns.push(getTurnDirection(prevDir, dir));
  }

  console.log(turns);

  return end;
}

// return random end coords for a straight corridor given a start position and direction
// corridors cannot cross walls: walls are wall blocks with thickness 1
// corridors cannot cross the 4 edges of maze
function makeCorridor(start, direction, grid, n) {
  const [nRows, nCols] = [grid.length, grid[0].length];

  let maxCorridorLength;

  if (n === 0) maxCorridorLength = 6;
  else if (direction === dirCodes.left) maxCorridorLength = start.c - 1;
  else if (direction === dirCodes.right)
    maxCorridorLength = nCols - 1 - start.c;
  else if (direction === dirCodes.up) maxCorridorLength = start.r - 1;
  else maxCorridorLength = nRows - 1 - start.r;

  if (maxCorridorLength % 2 !== 0) maxCorridorLength -= 1;

  let corridorLength = utils.randEven(
    Math.floor(maxCorridorLength / 4),
    Math.floor(maxCorridorLength)
  );

  let remaining = corridorLength;

  let curr = { r: start.r, c: start.c };

  while (
    remaining > 0 &&
    !isWall(
      {
        r: curr.r + 2 * dirChange[direction][0],
        c: curr.c + 2 * dirChange[direction][1],
      },
      direction,
      grid
    )
  ) {
    grid[curr.r][curr.c] = blocks.empty;
    grid[curr.r + dirChange[direction][0]][curr.c + dirChange[direction][1]] =
      blocks.empty;

    curr.r += 2 * dirChange[direction][0];
    curr.c += 2 * dirChange[direction][1];
    remaining -= 2;
  }

  return curr;
}

// BFS algo to determine if there exists a path from coord to border of grid
// only wall blocks are traversable
function isEdgeReachable(coord, grid) {
  let visited = JSON.parse(JSON.stringify(grid));
  const dirs = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  let queue = [coord];
  let curr, next;

  while (queue) {
    curr = queue.shift();

    if (
      curr.r <= 1 ||
      curr.r >= grid.length - 2 ||
      curr.c <= 1 ||
      curr.c >= grid[0].length - 2
    )
      return true;

    visited[curr.r][curr.c] = blocks.empty; // set to empty block

    for (let i in dirs) {
      let dir = dirs[i];
      next = { r: curr.r + dir[0], c: curr.c + dir[1] };

      // if not visited (wall block), add to queue
      if (visited[next.r][next.c] === blocks.wall) {
        queue.push(next);
        visited[next.r][next.c] = blocks.empty;
      }
    }
  }

  return false;
}

// determine possible next directions at a given point
// return random direction
function getNewDirection(start, direction, grid) {
  let possibleDirs = [];
  for (let i = 0; i < 4; i++) {
    const [nr, nc] = [
      start.r + 2 * dirChange[i][0],
      start.c + 2 * dirChange[i][1],
    ];

    if (
      !isWall({ r: nr, c: nc }, i, grid) &&
      grid[nr][nc] === blocks.wall &&
      isEdgeReachable({ r: nr, c: nc }, grid) === true &&
      i !== direction
    ) {
      possibleDirs.push(i);
    }
  }

  if (possibleDirs.length === 0) return null;

  const newDir = utils.randChoice(possibleDirs);

  return newDir;
}

// determine if turn made was towards left or right
function getTurnDirection(prevDir, nextDir) {
  if (prevDir === nextDir) return null;

  if (prevDir === dirCodes.left && nextDir === dirCodes.up)
    return dirCodes.right;
  else if (nextDir === dirCodes.left && prevDir === dirCodes.up)
    return dirCodes.left;

  if (nextDir === prevDir + 1) return dirCodes.right;
  return dirCodes.left;
}

module.exports = {
  generateMaze,
  isWall,
  initStartPos,
  getTurnDirection,
  getSideBlocks,
  isEdgeReachable,
};
