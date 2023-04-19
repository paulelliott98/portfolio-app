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
  var grid = utils.createArray(nRows, nCols, blocks.wall);

  var startDir = utils.randInt(0, 3);
  const start = initStartPos(startDir, nRows, nCols); // start coordinate

  const [startR, startC] = [
    start.r + dirChange[startDir][0],
    start.c + dirChange[startDir][1],
  ];

  var endPos = makeAllCorridors({ r: startR, c: startC }, startDir, grid);

  // console.log(`(${endPos.r}, ${endPos.c})`);

  grid[start.r][start.c] = blocks.source;
  grid[endPos.r][endPos.c] = blocks.sink;

  return {
    grid: grid,
    startPos: start,
    endPos: { r: endPos.r, c: endPos.c },
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
  if (path.length <= 1) return null;

  let [l, r] = [0, 1];

  while (r < path.length) {
    let [c1, c2] = [path[l], path[r]];
    for (let i = Math.min(c1.r, c2.r); i <= Math.max(c1.r, c2.r); i++) {
      for (let j = Math.min(c1.c, c2.c); j <= Math.max(c1.c, c2.c); j++) {
        if (utils.isInBounds(i, j, grid)) {
          // if (grid[i][j] === blocks.wall)
          // grid[i][j] = blocks.empty;
          grid[i][j] = blocks.visited;
          if (!isInMaze(i, j, grid)) {
            return { r: i, c: j };
          }
        }
      }
    }
    l++;
    r++;
  }
}

export function makeAllCorridors(start, direction, grid) {
  let end = { r: start.r, c: start.c };
  let dir = direction;

  // let prevEnd;

  for (let i = 0; i < 20; i++) {
    // prevEnd = { r: end.r, c: end.c };
    end = makeCorridor({ r: end.r, c: end.c }, dir, grid);
    dir = getNewDirection({ r: end.r, c: end.c }, dir, grid);

    if (end === null || dir === null) break;
  }

  // if end is already on border of grid, return
  // if (
  //   end !== null &&
  //   utils.isInBounds(end.r, end.c, grid) &&
  //   !isInMaze(end.r, end.c, grid)
  // )
  //   return { r: end.r, c: end.c };

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

    let shortestPath = shortestPathToEdge(end, next, grid, true, "prevCoord")
      .path;

    if (shortestPath !== null) {
      console.log("");
      console.log("Path:");
      for (let i in shortestPath) {
        console.log(shortestPath[i]);
      }
      end = drawCorridorsToEdge(shortestPath, grid);
    }
  }

  // if (end.r + 1 === grid.length - 1) end.r = grid.length - 1;
  // else if (end.r - 1 === 0) end.r = 0;
  // else if (end.c + 1 === grid[0].length - 1) end.c = grid[0].length - 1;
  // else if (end.c - 1 === 0) end.c = 0;

  return { r: end.r, c: end.c };
}

// return random end coords for a straight corridor given a start position and direction
// corridors cannot cross walls: walls are wall blocks with thickness 1
// corridors cannot cross the 4 edges of maze
export function makeCorridor(start, direction, grid) {
  if (start === null || direction === null) return null;

  let maxCorridorLength = 0;
  let curr, next;

  curr = { r: start.r, c: start.c };
  next = [
    curr.r + 2 * dirChange[direction][0],
    curr.c + 2 * dirChange[direction][1],
  ];

  while (
    curr !== null &&
    isInMaze(...next, grid) &&
    grid[next[0]][next[1]] === blocks.wall &&
    !isWall({ r: next[0], c: next[1] }, direction, grid) &&
    shortestPathToEdge(curr, { r: next[0], c: next[1] }, grid).nTraversable !==
      -1
  ) {
    maxCorridorLength += 2;
    [curr.r, curr.c] = [next[0], next[1]];
    next[0] += 2 * dirChange[direction][0];
    next[1] += 2 * dirChange[direction][1];
  }

  if (maxCorridorLength % 2 !== 0) maxCorridorLength -= 1;

  let corridorLength = utils.randEven(2, maxCorridorLength);

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
export function shortestPathToEdge(
  prevCoord,
  coord,
  grid,
  traverseBorder = false,
  startPoint = "coord"
) {
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

  let queue;
  if (startPoint === "coord") queue = [coord];
  else queue = [prevCoord];

  let isReachable = false;
  let area = 1;
  let curr, next;
  let path = [];

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
        prev.set(next.r + "," + next.c, curr);

        if (res.path === null) {
          path.push({ r: next.r, c: next.c });
          let currCoord = prev.get(`${next.r},${next.c}`);
          // let currCoord = next;

          while (prev.get(`${currCoord.r},${currCoord.c}`) !== null) {
            path.push(currCoord);
            currCoord = prev.get(`${currCoord.r},${currCoord.c}`);
          }
          path.push(prevCoord);
          path.push(coord);
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

  // console.log(`${coord.r}, ${coord.c}, ${nTraversable}`);

  if (isReachable) {
    res.nTraversable = area;

    // let currCoord = prev.get(`${boundaryCoord.r},${boundaryCoord.c}`);

    // while (currCoord !== null) {
    //   path.push(currCoord);
    //   currCoord = prev.get(`${currCoord.r},${currCoord.c}`);
    // }
    // path.push(prevCoord);
    // // path.push(coord);
    // path.reverse();
    // res.path = path;
  }

  return res;
}

// determine possible next directions at a given point
export function getNewDirection(start, direction, grid) {
  let newDir = null;
  let largestTraversableArea = -1;
  let isSameDirValid = false;

  for (let i = 0; i < 4; i++) {
    const [nr, nc] = [
      start.r + 2 * dirChange[i][0],
      start.c + 2 * dirChange[i][1],
    ];

    if (i === reverseDir[direction] || !isInMaze(nr, nc, grid)) continue;

    if (!isWall({ r: nr, c: nc }, i, grid) && grid[nr][nc] === blocks.wall) {
      let traversableArea = shortestPathToEdge(start, { r: nr, c: nc }, grid)
        .nTraversable;

      if (traversableArea === -1) continue;
      if (i === direction) isSameDirValid = true;

      if (traversableArea > largestTraversableArea) {
        largestTraversableArea = traversableArea;
        newDir = i;
      }
    }
  }

  // if unable to turn into a different direction and able to keep going in same direction,
  // return the forward direction
  if (newDir === null && isSameDirValid) newDir = direction;

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
