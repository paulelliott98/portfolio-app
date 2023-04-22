import blocks from "./blocks";
const utils = require("../../utils");

// const blocks = require("./blocks");

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

export function generateMaze(nRows, nCols) {
  const nCorridors = Math.floor(nRows / 2);
  var grid = utils.createArray(nRows, nCols, blocks.wall);
  const startDir = utils.randInt(0, 3);
  const startPos = initStartPos(startDir, nRows, nCols); // start coordinate
  const startNext = {
    r: startPos.r + dirChange[startDir][0],
    c: startPos.c + dirChange[startDir][1],
  };

  // carve out main path from one border coordinate to another boorder coordinate
  const endPos = carveMainPath(startNext, startDir, grid, nCorridors);

  // carve out side paths starting from coords on the main path
  let isSidePathsCarvable = false;
  do {
    isSidePathsCarvable = carveSidePaths(startPos, grid);
  } while (isSidePathsCarvable);

  grid[startPos.r][startPos.c] = blocks.source;
  grid[endPos.r][endPos.c] = blocks.sink;

  return {
    grid: grid,
    startPos: startPos,
    endPos: endPos,
  };
}

// return random start position on grid border based on defined direction
export function initStartPos(startDir, nRows, nCols) {
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
export function getSideBlocks(coord, forwardDir, grid) {
  if (forwardDir === dirCodes.up || forwardDir === dirCodes.down) {
    return [grid[coord.r][coord.c - 1], grid[coord.r][coord.c + 1]];
  }
  return [grid[coord.r - 1][coord.c], grid[coord.r + 1][coord.c]];
}

// return true if block at coord is a wall block; wall blocks cannot be excavated
// walls are wall blocks with thickness 1
// a wall is either a border block, or is adjacent to an empty block in the forward/side directions
export function isWall(coord, forwardDir, grid) {
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

export function isInMaze(r, c, grid) {
  if (r >= 1 && r < grid.length - 1 && c >= 1 && c < grid[0].length - 1)
    return true;
  return false;
}

export function drawCorridorsToEdge(path, grid) {
  let [l, r] = [0, 1];
  let end = null;

  while (r < path.length) {
    let [c1, c2] = [path[l], path[r]];
    for (let i = Math.min(c1.r, c2.r); i <= Math.max(c1.r, c2.r); i++) {
      for (let j = Math.min(c1.c, c2.c); j <= Math.max(c1.c, c2.c); j++) {
        if (utils.isInBounds(i, j, grid)) {
          if (grid[i][j] === blocks.wall) grid[i][j] = blocks.empty;
          if (end === null && !isInMaze(i, j, grid)) {
            end = { r: i, c: j };
          }
        }
      }
    }
    l++;
    r++;
  }

  if (end === null) return path[path.length - 1];
  return end;
}

export function carveMainPath(start, direction, grid, nCorridors) {
  let end = [start.r, start.c];
  let dir = direction;

  let prevEnd;

  for (let i = 0; i < nCorridors; i++) {
    if (end !== null && typeof end !== "undefined") prevEnd = [...end];

    end = makeCorridor(end, dir, grid);
    dir = getNewDirection(end, dir, grid);

    if (end === null || dir === null) break;
  }

  if (end === null) end = prevEnd;

  // if end is already on border of grid, return
  if (utils.isInBounds(end[0], end[1], grid) && !isInMaze(end[0], end[1], grid))
    return { r: end[0], c: end[1] };

  let shortestPath = shortestPathToEdge(null, { r: end[0], c: end[1] }, grid)
    .path;

  if (shortestPath !== null) return drawCorridorsToEdge(shortestPath, grid);

  return { r: end[0], c: end[1] };
}

// check if (i, j) is a valid start coordinate for side paths to branch off of
function isValidStartCoord(i, j, startPos, grid) {
  // return false if corner coordinate
  // if (
  //   !(
  //     (grid[i - 1][j] === blocks.wall && grid[i + 1][j] === blocks.wall) ||
  //     (grid[i][j - 1] === blocks.wall && grid[i][j + 1] === blocks.wall)
  //   )
  // )
  //   return false;

  let [r, c] = [startPos.r, startPos.c];

  if (r % 2 !== 0 && c % 2 !== 0)
    // if both r and c of startPos are odd, then all valid positions we can carve side paths
    // from are [even, odd] or [odd, even]
    return (i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0);
  // if either r or c of startPos is even, then all valid positions we can carve side paths
  // from are [odd, odd]
  else if (r % 2 === 0 || c % 2 === 0) return i % 2 !== 0 && j % 2 !== 0;
}

export function carveSidePaths(startPos, grid) {
  let validCoords = [];
  let isCarvable = false;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (
        isInMaze(i, j, grid) &&
        grid[i][j] === blocks.empty &&
        isValidStartCoord(i, j, startPos, grid)
      ) {
        validCoords.push([i, j]);
      }
    }
  }

  // utils.shuffleArray(validCoords);

  for (let h in validCoords) {
    let [i, j] = validCoords[h];

    let dirs = utils.shuffleArray([0, 1, 2, 3]);
    for (let k in dirs) {
      let [di, dj] = [dirChange[dirs[k]][0], dirChange[dirs[k]][1]];
      if (
        !isInMaze(i + 2 * di, j + 2 * dj, grid) ||
        grid[i + 2 * di][j + 2 * dj] !== blocks.wall
      )
        continue;

      let end = [i, j];
      let dir = dirs[k];

      while (end !== null && dir !== null) {
        end = makeCorridor(end, dir, grid, true);
        dir = getNewDirection(end, dir, grid, true);
        // console.log(end, dir);
      }

      // grid[i][j] = blocks.visited;
      isCarvable = true;
      break;
    }
  }

  return isCarvable;
}

// return random end coords for a straight corridor given a start position and direction
// corridors cannot cross walls: walls are wall blocks with thickness 1
// corridors cannot cross the 4 edges of maze
export function makeCorridor(st, direction, grid, isDeadEnd = false) {
  if (st === null || direction === null) return null;

  let curr = { r: st[0], c: st[1] };
  let next = {
    r: curr.r + 2 * dirChange[direction][0],
    c: curr.c + 2 * dirChange[direction][1],
  };

  let maxCorridorLength = 0;
  while (isInMaze(next.r, next.c, grid)) {
    maxCorridorLength += 2;
    next.r += 2 * dirChange[direction][0];
    next.c += 2 * dirChange[direction][1];
  }

  let corridorLength = utils.randEven(
    Math.min(6, maxCorridorLength),
    Math.floor(maxCorridorLength / 2)
    // maxCorridorLength
  );

  let remaining = corridorLength;

  next = {
    r: curr.r + 2 * dirChange[direction][0],
    c: curr.c + 2 * dirChange[direction][1],
  };

  while (
    remaining > 0 &&
    isInMaze(next.r, next.c, grid) &&
    grid[next.r][next.c] === blocks.wall &&
    // !isWall(next, direction, grid) &&
    ((!isDeadEnd && shortestPathToEdge(curr, next, grid).nTraversable !== -1) ||
      isDeadEnd)
  ) {
    grid[curr.r][curr.c] = blocks.empty;
    grid[curr.r + dirChange[direction][0]][curr.c + dirChange[direction][1]] =
      blocks.empty;

    [curr.r, curr.c] = [next.r, next.c];
    next.r += 2 * dirChange[direction][0];
    next.c += 2 * dirChange[direction][1];

    remaining -= 2;
  }

  grid[curr.r][curr.c] = blocks.empty;

  return [curr.r, curr.c];
}

// BFS algo to determine if there exists a path from coord to border of grid
// only wall blocks are traversable
// traverseBorder=false -> bfs cannot enter border of grid
// return { nTraversable, path }
export function shortestPathToEdge(prevCoord, coord, grid) {
  let res = { nTraversable: -1, path: null };
  if (coord === null || typeof coord === "undefined") return res;

  let visited = JSON.parse(JSON.stringify(grid));
  if (prevCoord !== null) visited[prevCoord.r][prevCoord.c] = blocks.empty;
  visited[coord.r][coord.c] = blocks.empty; // set to visited (empty block)

  const dirs = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  // map for backtracking
  let prev = new Map();
  prev.set(coord.r + "," + coord.c, null);

  let queue = [coord];

  let isReachable = false;
  let area = 1;
  let curr, next;
  let path = [];

  while (queue.length > 0) {
    curr = queue.shift();

    for (let i in dirs) {
      let dir = dirs[i];
      next = { r: curr.r + dir[0], c: curr.c + dir[1] };

      // if we found edge, set isReachable to true
      if (!isInMaze(next.r, next.c, grid)) {
        isReachable = true;
        prev.set(next.r + "," + next.c, curr);

        if (res.path === null) {
          let currCoord = prev.get(`${next.r},${next.c}`);
          path.push({ r: next.r, c: next.c });

          while (currCoord !== null) {
            path.push(currCoord);
            currCoord = prev.get(`${currCoord.r},${currCoord.c}`);
          }

          path.reverse();
          res.path = path;
        }
      }

      // if not visited (wall block), add to queue
      else if (visited[next.r][next.c] === blocks.wall) {
        queue.push({ r: next.r, c: next.c });
        visited[next.r][next.c] = blocks.empty; // set to visited
        area++;
        prev.set(next.r + "," + next.c, curr);
      }
    }
  }

  if (isReachable) res.nTraversable = area;

  return res;
}

// determine possible next directions at a given point
export function getNewDirection(start, direction, grid, isDeadEnd = false) {
  if (start === null || direction === null) return null;

  let newDir = null;
  let largestTraversableArea = -1;
  let isSameDirValid = false;

  let possibleDirs = [];

  for (let i = 0; i < 4; i++) {
    const [nr, nc] = [
      start[0] + 2 * dirChange[i][0],
      start[1] + 2 * dirChange[i][1],
    ];

    if (i === reverseDir[direction] || !isInMaze(nr, nc, grid)) continue;

    if (!isWall({ r: nr, c: nc }, i, grid) && grid[nr][nc] === blocks.wall) {
      let traversableArea = shortestPathToEdge(
        { r: start[0], c: start[1] },
        { r: nr, c: nc },
        grid
      ).nTraversable;

      if (!isDeadEnd && traversableArea === -1) continue;

      if (i === direction) {
        isSameDirValid = true;
        continue;
      }

      if (traversableArea > largestTraversableArea) {
        largestTraversableArea = traversableArea;
        possibleDirs = [i];
      } else if (traversableArea === largestTraversableArea) {
        possibleDirs.push(i);
      }
    }
  }

  // if able to turn -> pick random turn direction
  // if unable to turn into a different direction and able to keep going in same direction ->
  // return the forward direction
  // if cannot turn and cannot go forward -> return null
  if (possibleDirs.length === 0 && isSameDirValid) newDir = direction;
  else if (possibleDirs.length > 0) newDir = utils.randChoice(possibleDirs);
  else newDir = null;

  return newDir;
}

// determine if turn made was towards left or right
// function getTurnDirection(prevDir, nextDir) {
//   if (prevDir === nextDir) return null;

//   if (prevDir === dirCodes.left && nextDir === dirCodes.up)
//     return dirCodes.right;
//   else if (nextDir === dirCodes.left && prevDir === dirCodes.up)
//     return dirCodes.left;

//   if (nextDir === prevDir + 1) return dirCodes.right;
//   return dirCodes.left;
// }
