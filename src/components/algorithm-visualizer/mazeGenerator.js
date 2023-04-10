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
  const startPos = initStartPos(startDir, nRows, nCols);
  grid[startPos.r][startPos.c] = blocks.source;

  startPos.r += dirChange[startDir][0];
  startPos.c += dirChange[startDir][1];

  const end = makeAllCorridors(startPos, startDir, grid);

  grid[end.r][end.c] = blocks.sink;
  return { grid: grid, startPos: startPos, endPos: end };
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

// return true if block at coord is a wall coordinate
// walls are wall blocks with thickness 1
// a wall is either a border block, or is adjacent to an empty block in the forward/side directions
function isWall(coord, forwardDir, grid) {
  if (grid[coord.r][coord.c] === blocks.empty) return false;

  if (
    coord.r === 0 ||
    coord.r === grid.length - 1 ||
    coord.c === 0 ||
    coord.c === grid[0].length - 1
  )
    return true;

  // check 2 blocks down forwardDir: if r, c out of bounds or grid[r][c] is empty block -> return true
  let [nr, nc] = [
    coord.r + 2 * dirChange[forwardDir][0],
    coord.c + 2 * dirChange[forwardDir][1],
  ];

  if (!utils.isInBounds(nr, nc, grid) || grid[nr][nc] === blocks.empty)
    return true;

  return false;
}

function makeAllCorridors(start, direction, grid) {
  let end = start;
  let dir = direction;
  for (let i = 0; i < 7; i++) {
    end = makeCorridor(end, dir, grid);
    dir = getNewDirection(end, dir, grid);
  }

  return end;
}

// return random end coords for a straight corridor given a start position and direction
// corridors cannot cross walls: walls are wall blocks with thickness 1
// corridors cannot cross the 4 edges of maze
function makeCorridor(start, direction, grid) {
  const [nRows, nCols] = [grid.length, grid[0].length];

  let maxCorridorLength;

  if (direction === dirCodes.left) maxCorridorLength = start.c - 1;
  else if (direction === dirCodes.right)
    maxCorridorLength = nCols - 1 - start.c;
  else if (direction === dirCodes.up) maxCorridorLength = start.r - 1;
  else maxCorridorLength = nRows - 1 - start.r;

  let corridorLength = utils.randEven(
    Math.floor(maxCorridorLength / 2),
    maxCorridorLength
  );

  let remaining = corridorLength;

  let curr = { r: start.r, c: start.c };

  while (remaining > 0 && !isWall(curr, direction, grid)) {
    grid[curr.r][curr.c] = blocks.empty;
    curr.r += dirChange[direction][0];
    curr.c += dirChange[direction][1];
    remaining--;
  }

  return curr;
}

function getNewDirection(start, direction, grid) {
  let possibleDirs = [];
  for (let i = 0; i < 4; i++) {
    const [nr, nc] = [start.r + dirChange[i][0], start.c + dirChange[i][1]];

    if (
      !isWall(start, i, grid) &&
      grid[nr][nc] === blocks.wall &&
      i !== direction
    )
      possibleDirs.push(i);
  }

  return utils.randChoice(possibleDirs);
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

module.exports = { generateMaze, isWall, initStartPos, getTurnDirection };
