const utils = require("../utils");
const blocks = require("../components/algorithm-visualizer/blocks");
const mg = require("../components/algorithm-visualizer/mazeGenerator");

const dirs = { up: 0, right: 1, down: 2, left: 3 };

describe("Maze Generator Tests", () => {
  var nRows, nCols;
  var newMaze;

  beforeAll(() => {
    [nRows, nCols] = [64, 64];
  });

  // beforeEach(() => {
  //   newMaze = null;
  // });

  test("getSideBlocks", () => {
    newMaze = utils.createArray(nRows, nCols);
    newMaze[5][4] = -1; // right
    newMaze[5][6] = -1; // left
    newMaze[4][5] = -2; // up
    newMaze[6][5] = -2; // down

    let leftRight = mg.getSideBlocks({ r: 5, c: 5 }, dirs.down, newMaze);
    let upDown = mg.getSideBlocks({ r: 5, c: 5 }, dirs.right, newMaze);

    expect(leftRight[0]).toBe(-1); // left
    expect(leftRight[1]).toBe(-1); // right
    expect(upDown[0]).toBe(-2); // up
    expect(upDown[1]).toBe(-2); // down
  });

  test("isWall", () => {
    newMaze = utils.createArray(nRows, nCols, blocks.wall);

    expect(mg.isWall({ r: 0, c: 1 }, dirs.down, newMaze)).toBe(true);
    expect(mg.isWall({ r: nRows - 1, c: 1 }, dirs.up, newMaze)).toBe(true);
    expect(mg.isWall({ r: 1, c: 0 }, dirs.right, newMaze)).toBe(true);
    expect(mg.isWall({ r: 1, c: nCols - 1 }, dirs.left, newMaze)).toBe(true);

    newMaze[3][3] = blocks.empty;
    expect(mg.isWall({ r: 2, c: 2 }, dirs.down, newMaze)).toBe(true);
    expect(mg.isWall({ r: 4, c: 4 }, dirs.left, newMaze)).toBe(true);
    expect(mg.isWall({ r: 4, c: 2 }, dirs.right, newMaze)).toBe(true);
    expect(mg.isWall({ r: 4, c: 3 }, dirs.up, newMaze)).toBe(true);

    expect(mg.isWall({ r: 10, c: 10 }, dirs.up, newMaze)).toBe(false);
    expect(mg.isWall({ r: 10, c: 10 }, dirs.down, newMaze)).toBe(false);
    expect(mg.isWall({ r: 10, c: 10 }, dirs.left, newMaze)).toBe(false);
    expect(mg.isWall({ r: 10, c: 10 }, dirs.right, newMaze)).toBe(false);
  });

  test("initStartPos should return coord on border of grid", () => {
    for (let i = 0; i < 4; i++) {
      for (let k = 0; k < nRows * 3; k++) {
        const startPos = mg.initStartPos(i, nRows, nCols);
        if (i === dirs.up) expect(startPos.r).toBe(nRows - 1);
        else if (i === dirs.down) expect(startPos.r).toBe(0);
        else if (i === dirs.left) expect(startPos.c).toBe(nCols - 1);
        else if (i === dirs.right) expect(startPos.c).toBe(0);
      }
    }
  });

  test("getTurnDirection", () => {
    const rightTurns = [
      [dirs.up, dirs.right],
      [dirs.right, dirs.down],
      [dirs.down, dirs.left],
      [dirs.left, dirs.up],
    ];

    for (let i in rightTurns) {
      const [prev, next] = rightTurns[i];
      expect(mg.getTurnDirection(prev, next)).toBe(dirs.right);
      expect(mg.getTurnDirection(next, prev)).toBe(dirs.left);
    }
  });

  // test("generateMaze: maze should be nRows x nCols", () => {
  //   newMaze = mg.generateMaze(63, 63).grid;
  //   expect(newMaze.length).toBe(63);
  //   expect(newMaze[0].length).toBe(63);
  // });
});

describe("Util Functions Tests", () => {
  test("randInt should pick random int between [a, b] inclusive", () => {
    let s = new Set();
    for (let i = 0; i < 200; i++) {
      s.add(utils.randInt(0, 3));
    }
    expect(s.size).toBe(4); // 0,1,2,3
  });

  test("randChoice should choose be able to pick any item in list", () => {
    let s = new Set();
    const d = ["up", "right", "down", "left"];
    for (let i = 0; i < 200; i++) {
      let item = utils.randChoice(d);
      s.add(item);
    }
    expect(s.size).toBe(d.length);
    expect(s.has("up")).toBe(true);
    expect(s.has("down")).toBe(true);
    expect(s.has("left")).toBe(true);
    expect(s.has("right")).toBe(true);
  });
});
