import * as algorithms from "../components/algorithm-visualizer/algorithms";
import * as mg from "../components/algorithm-visualizer/mazeGenerator";
import blocks from "../components/algorithm-visualizer/blocks";
const utils = require("../utils");

const dirs = { up: 0, right: 1, down: 2, left: 3 };
const dirChange = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

describe("Maze Generator Tests", () => {
  var nRows, nCols;
  var newMaze;

  beforeAll(() => {
    [nRows, nCols] = [24, 24];
  });

  beforeEach(() => {
    newMaze = utils.createArray(nRows, nCols, blocks.wall);
  });

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

  test("makeAllCorridors should not return null or undefined", () => {
    for (let i = 0; i < 200; i++) {
      const nCorridors = utils.randInt(1, 8);
      var grid = utils.createArray(nRows, nCols, blocks.wall);
      var startDir = utils.randInt(0, 3); // start direction
      const start = mg.initStartPos(startDir, nRows, nCols); // start coordinate

      const [startR, startC] = [
        start.r + dirChange[startDir][0],
        start.c + dirChange[startDir][1],
      ];

      var endPos = mg.makeAllCorridors(
        { r: startR, c: startC },
        startDir,
        grid,
        nCorridors
      );
      expect(endPos === null).toBe(false);
      expect(typeof endPos === "undefined").toBe(false);
    }
  });

  // test("getTurnDirection", () => {
  //   const rightTurns = [
  //     [dirs.up, dirs.right],
  //     [dirs.right, dirs.down],
  //     [dirs.down, dirs.left],
  //     [dirs.left, dirs.up],
  //   ];

  //   for (let i in rightTurns) {
  //     const [prev, next] = rightTurns[i];
  //     expect(mg.getTurnDirection(prev, next)).toBe(dirs.right);
  //     expect(mg.getTurnDirection(next, prev)).toBe(dirs.left);
  //   }
  // });

  test("generateMaze: start position should be on border", () => {
    for (let i = 0; i < 100; i++) {
      newMaze = mg.generateMaze(nRows, nCols);
      let [sr, sc] = [newMaze.startPos.r, newMaze.startPos.c];
      expect(sr === 0 || sr === nRows - 1 || sc === 0 || sc === nCols - 1).toBe(
        true
      );
    }
  });

  test("generateMaze: end position should be on border", () => {
    const n = 100;
    for (let i = 0; i < n; i++) {
      newMaze = mg.generateMaze(nRows, nCols);
      let [er, ec] = [newMaze.endPos.r, newMaze.endPos.c];
      expect(er === 0 || er === nRows - 1 || ec === 0 || ec === nCols - 1).toBe(
        true
      );
    }
  });

  test("generateMaze: path should exist between source and dest", () => {
    const speed = { current: 100 };
    const run = { current: true };

    for (let i = 0; i < 50; i++) {
      newMaze = mg.generateMaze(nRows, nCols);

      algorithms
        .bfs(newMaze.startPos, newMaze.endPos, newMaze.grid, run, speed, null)
        .then((res) => {
          expect(res).toBe("Yes");
        });
    }
  });
});

describe("Util Functions Tests", () => {
  test("randInt should be able to pick any int between [a, b] inclusive", () => {
    let s = new Set();
    for (let i = 0; i < 200; i++) {
      s.add(utils.randInt(0, 3));
    }
    expect(s.size).toBe(4); // 0,1,2,3
  });

  test("randEven should return an even number between [a, b] inclusive", () => {
    const [a, b] = [2, 6];
    let [min, max] = [Infinity, -Infinity];

    for (let i = 0; i < 100; i++) {
      let [n1, n2, n3] = [
        utils.randEven(a, b),
        utils.randEven(a, b + 1),
        utils.randEven(a - 1, b),
      ];
      expect(n1 % 2 === 0).toBe(true);
      expect(n2 % 2 === 0).toBe(true);
      expect(n3 % 2 === 0).toBe(true);
      min = Math.min(n1, n2, n3, min);
      max = Math.max(n1, n2, n3, max);
    }

    expect(min).toBe(a);
    expect(max).toBe(b);
  });

  test("randChoice should be able to pick any item in list", () => {
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
