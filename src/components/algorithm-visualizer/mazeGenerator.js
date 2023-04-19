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
  var grid = utils.createArray(nRows, nCols, blocks.wall);

  var startDir = utils.randInt(0, 3);
  const start = initStartPos(startDir, nRows, nCols); // start coordinate

  const [startR, startC] = [
    start.r + dirChange[startDir][0],
    start.c + dirChange[startDir][1],
  ];

  var endPos = makeAllCorridors({ r: startR, c: startC }, startDir, grid);

  grid[start.r][start.c] = blocks.source;
  grid[endPos.r][endPos.c] = blocks.sink;

  return {
    grid: grid,
    startPos: start,
    endPos: { r: endPos.r, c: endPos.c },
  };
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
  if (!isInMaze(coord.r, coord.c, grid)) return true;

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

function isInMaze(r, c, grid) {
  if (r >= 1 && r < grid.length - 1 && c >= 1 && c < grid[0].length - 1)
    return true;
  return false;
}

function drawCorridorsToEdge(path, grid) {
  if (path.length <= 1) return null;

  let end;
  let [l, r] = [0, 1];

  while (r < path.length) {
    let [c1, c2] = [path[l], path[r]];
    for (let i = Math.min(c1.r, c2.r); i <= Math.max(c1.r, c2.r); i++) {
      for (let j = Math.min(c1.c, c2.c); j <= Math.max(c1.c, c2.c); j++) {
        if (utils.isInBounds(i, j, grid)) {
          if (grid[i][j] === blocks.wall) grid[i][j] = blocks.empty;
          if (!isInMaze(i, j, grid)) {
            end = { r: i, c: j };
            return end;
          }
        }
      }
    }
    l++;
    r++;
  }
}

function makeAllCorridors(start, direction, grid) {
  let end = { r: start.r, c: start.c };
  let dir = direction;

  // let prevEnd;

  for (let i = 0; i < 14; i++) {
    // prevEnd = end;
    end = makeCorridor({ r: end.r, c: end.c }, dir, grid);
    dir = getNewDirection({ r: end.r, c: end.c }, dir, grid);

    if (end === null || dir === null) break;
  }

  // if (end === null) end = prevEnd;

  for (let i = 0; i < 4; i++) {
    let next = {
      r: end.r + 2 * dirChange[i][0],
      c: end.c + 2 * dirChange[i][1],
    };

    if (
      !utils.isInBounds(next.r, next.c, grid) ||
      grid[next.r][next.c] !== blocks.wall
    )
      continue;

    let path = shortestPathToEdge(end, next, grid, true).path;

    if (path !== null) {
      // console.log("");
      // for (let i in path) {
      //   console.log(path[i]);
      // }

      return drawCorridorsToEdge(path, grid);
    }
  }

  if (end.r + 1 === grid.length - 1) end.r = grid.length - 1;
  else if (end.r - 1 === 0) end.r = 0;
  else if (end.c + 1 === grid[0].length - 1) end.c = grid[0].length - 1;
  else if (end.c - 1 === 0) end.c = 0;

  return end;
}

// return random end coords for a straight corridor given a start position and direction
// corridors cannot cross walls: walls are wall blocks with thickness 1
// corridors cannot cross the 4 edges of maze
function makeCorridor(start, direction, grid) {
  if (start === null || direction === null) return null;

  let maxCorridorLength = 0;
  let curr;

  curr = { r: start.r, c: start.c };

  while (
    curr !== null &&
    isInMaze(curr.r, curr.c, grid) &&
    grid[curr.r][curr.c] === blocks.wall &&
    !isWall(
      {
        r: curr.r + 2 * dirChange[direction][0],
        c: curr.c + 2 * dirChange[direction][1],
      },
      direction,
      grid
    ) &&
    shortestPathToEdge(
      curr,
      {
        r: curr.r + 2 * dirChange[direction][0],
        c: curr.c + 2 * dirChange[direction][1],
      },
      grid
    ).nTraversable !== -1
  ) {
    maxCorridorLength += 2;
    curr.r += 2 * dirChange[direction][0];
    curr.c += 2 * dirChange[direction][1];
  }

  if (maxCorridorLength % 2 !== 0) maxCorridorLength -= 1;

  let corridorLength = utils.randEven(
    Math.floor(maxCorridorLength / 2),
    Math.floor((maxCorridorLength / 4) * 3)
  );

  let remaining = corridorLength;

  curr = { r: start.r, c: start.c };

  while (remaining > 0) {
    grid[curr.r][curr.c] = blocks.empty;
    grid[curr.r + dirChange[direction][0]][curr.c + dirChange[direction][1]] =
      blocks.empty;

    curr.r += 2 * dirChange[direction][0];
    curr.c += 2 * dirChange[direction][1];
    remaining -= 2;
  }

  return { r: curr.r, c: curr.c };
}

// BFS algo to determine if there exists a path from coord to border of grid
// only wall blocks are traversable
// traverseBorder=false -> bfs cannot enter border of grid
// return { nTraversable, path }
function shortestPathToEdge(prevCoord, coord, grid, traverseBorder = false) {
  let res = { nTraversable: -1, path: null };
  if (coord === null) return res;

  let visited = JSON.parse(JSON.stringify(grid));
  visited[prevCoord.r][prevCoord.c] = blocks.empty;

  const dirs = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  // map for backtracking
  let prev = new Map();
  prev.set(coord.r + "," + coord.c, null);

  let isReachable = false;
  let area = 1;
  let queue = [coord];
  let curr, next;

  while (queue.length > 0) {
    curr = queue.shift();

    visited[curr.r][curr.c] = blocks.empty; // set to visited (empty block)

    for (let i in dirs) {
      let dir = dirs[i];
      next = { r: curr.r + dir[0], c: curr.c + dir[1] };

      // if we found edge, set isReachable to true
      if (
        (!traverseBorder && !isInMaze(next.r, next.c, grid)) ||
        (traverseBorder && !utils.isInBounds(next.r, next.c, grid))
      ) {
        isReachable = true;

        if (res.path === null) {
          let path = [];
          path.push(next);

          prev.set(next.r + "," + next.c, curr);
          let currCoord = prev.get(`${next.r},${next.c}`);

          while (prev.get(`${currCoord.r},${currCoord.c}`) !== null) {
            path.push(currCoord);
            currCoord = prev.get(`${currCoord.r},${currCoord.c}`);
          }

          path.push(coord);
          path.push(prevCoord);
          path.reverse();
          res.path = path;
        }
      }

      // if not visited (wall block), add to queue
      else if (visited[next.r][next.c] === blocks.wall) {
        queue.push({ r: next.r, c: next.c });
        visited[next.r][next.c] = blocks.empty; // set to visited
        prev.set(next.r + "," + next.c, curr);
        area++;
      }
    }
  }

  // console.log(`${coord.r}, ${coord.c}, ${nTraversable}`);

  if (isReachable) res.nTraversable = area;

  return res;
}

// determine possible next directions at a given point
function getNewDirection(start, direction, grid) {
  let newDir = null;
  let largestTraversableArea = -1;
  let possibleDirs = [];

  for (let i = 0; i < 4; i++) {
    const [nr, nc] = [
      start.r + 2 * dirChange[i][0],
      start.c + 2 * dirChange[i][1],
    ];

    if (i === reverseDir[direction] || !isInMaze(nr, nc, grid)) continue;

    if (!isWall({ r: nr, c: nc }, i, grid) && grid[nr][nc] === blocks.wall) {
      let traversableArea = shortestPathToEdge(start, { r: nr, c: nc }, grid)
        .nTraversable;

      possibleDirs.push([`[${i}, ${traversableArea}]`]);

      if (traversableArea > largestTraversableArea) {
        largestTraversableArea = traversableArea;
        newDir = i;
      }
    }
  }

  // console.log(`(${start.r}, ${start.c}), ${possibleDirs}`);
  // console.log(`New Dir: ${newDir}`);

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
  shortestPathToEdge,
};
