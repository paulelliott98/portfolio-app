import React, { useEffect, useState, useRef } from "react";

export default function Snake(props) {
  const [pause, setPause] = useState(false);
  const [showArenaVals, setShowArenaVals] = useState(false);

  const canvasRef = useRef(null);
  const scale = window.devicePixelRatio || 1;
  const blockDim = 20;
  const gap = 0;
  const drawAdjustment = 0.2;
  const [nRows, nCols] = [
    Math.floor((props.h - gap) / (gap + blockDim)),
    Math.floor((props.w - gap) / (gap + blockDim)),
  ];

  // final canvas dimensions after accounting for gaps
  const [adjustedW, adjustedH] = [
    nCols * (gap + blockDim) + gap,
    nRows * (gap + blockDim) + gap,
  ];

  // game variables
  const startDir = 0;
  const startLen = 3;
  const maxLen = nCols * nRows;
  const startPos = {
    c: startLen,
    r: Math.floor(nRows / 2),
  };

  // difficulty settings and frame rate
  const k = 180;
  const multScale = 0.5;
  const [minDifficulty, maxDifficulty] = [10, (3 * k) / 5];
  const [difficulty, setDifficulty] = useState(
    Math.floor((maxDifficulty + minDifficulty) / 2)
  );
  const [updateDelay, setUpdateDelay] = useState(k - difficulty);
  const [frame, setFrame] = useState(0);
  const [multiplier, setMultiplier] = useState(
    Math.floor(Math.sqrt(multScale * difficulty) * 10)
  );

  const [len, setLen] = useState(startLen);
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState(startPos);
  const [prevDir, setPrevDir] = useState(startDir);
  const [dir, setDir] = useState(startDir);
  const [nextDir, setNextDir] = useState(startDir);

  var a = createArena(nRows, nCols);
  a = addSnake(startLen, pos, a);
  var f = spawnFruit(a);

  const [arena, setArena] = useState(a);
  const [fruitPos, setFruitPos] = useState(f);
  const [gameState, setGameState] = useState(-1);
  const [instructions, setInstructions] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);

  const resetArena = () => {
    setPos(startPos);
    setDir(startDir);
    setNextDir(startDir);
    setLen(startLen);
    setScore(0);
    setFrame(0);
    setInstructions(false);
    setUpdateDelay(k - difficulty);

    var newArena = createArena(nRows, nCols);
    newArena = addSnake(startLen, pos, newArena);
    f = spawnFruit(newArena);

    setArena(newArena);
    setFruitPos(f);

    setGameState(-1);
  };

  useEffect(
    () => {
      const drawArena = (ctx, canvas) => {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const arr = arena;

        // draw fruit
        ctx.beginPath();
        ctx.arc(
          gap + fruitPos[1] * (blockDim + gap) + 0.5 * blockDim,
          gap + fruitPos[0] * (blockDim + gap) + 0.5 * blockDim,
          blockDim / 4,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = getFillColor(-1);
        ctx.fill();

        const diff = gap + (getLastFrame() / updateDelay) * blockDim;
        var corners = [];

        for (let j = 0; j < nRows; j++) {
          for (let i = 0; i < nCols; i++) {
            const type = arr[j][i];

            if (type <= 0) {
              continue;
            }

            const color = getFillColor(type);
            const [r, c] = [
              gap + j * (blockDim + gap),
              gap + i * (blockDim + gap),
            ];

            var offsets = getDrawOffsets(j, i, arr);

            // if block is corner block, add to corners array
            const corner = getCornerDirection(j, i, arr, len, dir);
            if (corner.length !== 0) {
              if (type === len)
                corners.push([corner, getFillColor(len - 1), r, c, j, i]);
              else corners.push([corner, color, r, c, j, i]);
            }

            // if not corner or is head
            if (corner.length === 0 || type === len) {
              ctx.beginPath();
              ctx.fillStyle = color;
              ctx.rect(
                c + offsets[0],
                r + offsets[1],
                blockDim + offsets[2],
                blockDim + offsets[3]
              );
              ctx.fill();
            }

            // if block is warping to other side of canvas and block is not a corner block,
            // draw the partial block
            var partialRect = getPartialRect(
              c + offsets[0],
              r + offsets[1],
              blockDim,
              blockDim
            );

            // if (type === len && dir !== prevDir) partialRect = null;

            if (partialRect) {
              ctx.beginPath();
              ctx.fillStyle = getFillColor(type);
              ctx.rect(...partialRect);
              ctx.fill();
            }
          }
        }

        for (let i in corners) {
          var [corner, color, y, x, cornerj, corneri] = corners[i];
          const pi = Math.PI;
          var [start, end] = [0, 2 * pi];
          var [cx, cy] = [x, y]; // origin to draw quarter circle at

          // right to bottom
          if (corner[0] && corner[1]) {
            [start, end] = [pi, 1.5 * pi];
            cx += blockDim;
            cy += blockDim;
          }
          // bottom to left
          else if (corner[1] && corner[2]) {
            [start, end] = [1.5 * pi, 0];
            cy += blockDim;
          }
          // left to top
          else if (corner[2] && corner[3]) {
            [start, end] = [0, 0.5 * pi];
          }
          // top to right
          else if (corner[3] && corner[0]) {
            [start, end] = [0.5 * pi, pi];
            cx += blockDim;
          }

          ctx.clearRect(x, y, blockDim, blockDim);

          // draw quarter circle (corner)
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, blockDim, start, end, false);
          ctx.fill();

          // fill in rect between head and corner
          if (Math.abs(arr[cornerj][corneri] - len) === 1 && prevDir === dir) {
            ctx.beginPath();
            if (dir === 1) {
              ctx.rect(x + blockDim, y, diff, blockDim);
            } else if (dir === 2) {
              ctx.rect(x, y + blockDim, blockDim, diff);
            } else if (dir === 3) {
              ctx.rect(x - diff, y, diff, blockDim);
            } else if (dir === 4) {
              ctx.rect(x, y - diff, blockDim, diff);
            }
            ctx.fill();
          }
        }

        if (showArenaVals) drawArrayVals(ctx);
      };
      const drawArrayVals = (ctx) => {
        for (let j = 0; j < nRows; j++) {
          for (let i = 0; i < nCols; i++) {
            const [r, c] = [
              gap + j * (blockDim + gap),
              gap + i * (blockDim + gap),
            ];
            ctx.fillStyle = "red";
            ctx.fillText(arena[j][i], c + 7, r + 13);
          }
        }
      };

      function rgb(r, g, b) {
        return ["rgb(", r, ",", g, ",", b, ")"].join("");
      }

      function getFillColor(n) {
        var c = "";

        if (n === len) {
          // head
          c = "#fff";
        } else if (n === -1) {
          // fruit
          c = "#c792e9";
        } else if (n === 0) {
          // background
          c = "#1f234177";
        } else {
          // body
          const offset = (len - n) * 5;
          c = rgb(
            Math.max(0, 221 - offset),
            Math.max(0, 254 - offset),
            Math.max(0, 144 - offset)
          );
          // c = rgb(221, 254, 144);
        }
        return c;
      }

      // identify part of snake body that has been cut off by canvas boundary
      // returning new rect (col, row, width, height) on opposite side of canvas
      function getPartialRect(x, y, w, h) {
        // if entire body is within canvas boundary, return null
        const pixelInaccuracy = 0;
        if (
          x >= -pixelInaccuracy &&
          x + w <= adjustedW + pixelInaccuracy &&
          y >= -pixelInaccuracy &&
          y + h <= adjustedH + pixelInaccuracy
        ) {
          return null;
        }

        if (x < 0) {
          return [adjustedW + x - drawAdjustment, y, -x, h];
        } else if (x + w > adjustedW) {
          return [drawAdjustment, y, x + w - adjustedW, h];
        }
        if (y < 0) {
          return [x, adjustedH + y - drawAdjustment, w, -y];
        } else if (y + h > adjustedH) {
          return [x, drawAdjustment, w, y + h - adjustedH];
        }

        return null;
      }

      // 0 0 0 0 0
      // 0 0 4 5 0
      // 0 2 3 0 0
      // 0 1 0 0 0
      // 0 0 0 0 0
      // snake body animation to make position change appear smooth
      function getDrawOffsets(r, c, arr) {
        var offset = [0, 0, 0, 0]; // offsetCol, offsetRow

        // if game over or corner block
        if (gameState !== -1 || dir === 0) return offset;

        const n = arr[r][c];

        // const diff = gap + (frame / updateDelay) * blockDim - blockDim;
        const diff = gap + (frame / updateDelay) * blockDim;

        // if head, get offset using prevDir
        if (n === len) {
          if (prevDir === 1) {
            offset[0] += diff;
          } else if (prevDir === 2) {
            offset[1] += diff;
          } else if (prevDir === 3) {
            offset[0] -= diff;
          } else {
            offset[1] -= diff;
          }
          if (prevDir !== dir) {
            offset = [0, 0, 0, 0];
            if (dir === 1) {
              offset[2] = diff;
            } else if (dir === 2) {
              offset[3] = diff;
            } else if (dir === 3) {
              offset[0] = -diff;
              offset[2] = diff;
            } else {
              offset[1] = -diff;
              offset[3] = diff;
            }
          }
          return offset;
        }

        // else body
        // get body values in 4 adjacent cells
        var adjVals = [0, 0, 0, 0]; // right, bottom, left, top
        var adjC = getAdjacentCoords(r, c, arr);

        for (let i = 0; i < adjVals.length; i++) {
          const rc = getrc(i + 1);
          const row = rc[0] ? adjC[i] : r;
          const col = rc[1] ? adjC[i] : c;
          adjVals[i] = arr[row][col];
        }

        // look for previous and next body cells
        const [prev, next] = [getBody(r, c, -1, arr), getBody(r, c, 1, arr)];

        var [prevIsCorner, nextIsCorner] = [false, false];

        // set offsets based on direction
        if (prev) {
          var d = prev.dir;
          if (d === 1) offset[0] += diff;
          else if (d === 2) offset[1] += diff;
          else if (d === 3) offset[0] -= diff;
          else offset[1] -= diff;
        }

        // if prev block is a corner block set width and height offsets
        // aka this is the block after corner block (closer to tail)
        if (prev && getCornerDirection(prev.r, prev.c, arr, len).length !== 0) {
          prevIsCorner = true;

          // corner block on right
          if (prev.dir === 1) {
            offset[2] = -diff;
          }
          // corner block below
          else if (prev.dir === 2) {
            offset[3] = -diff;
          }
          // corner block on left
          else if (prev.dir === 3) {
            offset[0] = 0;
            offset[2] = -diff;
          }
          // corner block above
          else if (prev.dir === 4) {
            offset[1] = 0;
            offset[3] = -diff;
          }
        }

        // if next block is a corner block, set width and height offsets
        // aka this is the block before (closer to head)
        if (next && getCornerDirection(next.r, next.c, arr, len).length !== 0) {
          nextIsCorner = true;

          // corner block right
          if (next.dir === 1) {
            offset[2] = diff;
          }
          // corner block below
          else if (next.dir === 2) {
            offset[3] = diff;
          }
          // corner block left
          else if (next.dir === 3) {
            offset[0] = 0;
            offset[2] = diff;
          }
          // corner block above
          else if (next.dir === 4) {
            offset[1] = 0;
            offset[3] = diff;
          }
        }

        // if block between two corners, or block is a corner block, return 0 offsets
        if (
          (prevIsCorner &&
            nextIsCorner &&
            Math.abs(prev.dir - next.dir) === 2) ||
          getCornerDirection(r, c, arr, len, dir).length !== 0
        )
          return [0, 0, 0, 0];

        // add a small offset to cover gaps between body segments
        if (prev) {
          if (prev.dir === 1 || prev.dir === 3) offset[2] += 0.2;
          else offset[3] += 0.2;
        }

        return offset;
      }

      // return r, c indices and dir (1,2,3 or 4) of prev (-1) or next (1) body segment
      function getBody(r, c, prevOrNext, arr) {
        if (prevOrNext !== 1 && prevOrNext !== -1) return null;
        const n = arr[r][c];
        const adjC = getAdjacentCoords(r, c, arr);
        for (let i = 0; i < 4; i++) {
          const rc = getrc(i + 1);
          const row = rc[0] ? adjC[i] : r;
          const col = rc[1] ? adjC[i] : c;
          if (arr[row][col] === n - prevOrNext && arr[row][col] !== 0) {
            return { r: row, c: col, dir: i + 1 };
          }
        }
      }

      // return dir
      function getDir() {
        return dir;
      }

      // return r and c indices for upcoming head position
      function nextCell() {
        var [r, c] = [pos.r, pos.c];
        switch (getDir()) {
          case 0:
            break;
          case 1: // right
            c += 1;
            break;
          case 2: // down
            r += 1;
            break;
          case 3: // left
            c -= 1;
            break;
          case 4: // up
            r -= 1;
            break;
          default:
            break;
        }

        // if out of bounds, wrap around
        if (r >= nRows) {
          r = 0;
        } else if (r < 0) {
          r = nRows - 1;
        } else if (c >= nCols) {
          c = 0;
        } else if (c < 0) {
          c = nCols - 1;
        }

        return [r, c];
      }

      function isValidNextDir(d) {
        return Math.abs(dir - d) === 2 ? false : true;
      }

      function handleKeyDown(e) {
        const input = e.keyCode;

        // pause
        if (input === 49) setPause(!pause);
        if (input === 187) setShowArenaVals(!showArenaVals);

        if (gameState !== -1) {
          return;
        }

        const wasdCodes = [68, 83, 65, 87];
        const ijklCodes = [76, 75, 74, 73];

        var nextDirection = -1;

        if (
          (input === wasdCodes[2] || input === ijklCodes[2]) &&
          getDir() === 0
        ) {
          return;
        }

        if (input === wasdCodes[0] || input === ijklCodes[0]) {
          nextDirection = 1;
        } else if (input === wasdCodes[1] || input === ijklCodes[1]) {
          nextDirection = 2;
        } else if (input === wasdCodes[2] || input === ijklCodes[2]) {
          nextDirection = 3;
        } else if (input === wasdCodes[3] || input === ijklCodes[3]) {
          nextDirection = 4;
        }

        if (nextDirection === -1) {
          return;
        }

        if (!pause) {
          setNextDir(nextDirection);
        }
      }

      // returns number of next frame
      function getNextFrame() {
        if (frame + 1 > updateDelay) {
          return 1;
        }
        return frame + 1;
      }

      // returns number of previous frame
      function getLastFrame() {
        if (frame - 1 < 1) {
          return updateDelay;
        }
        return frame;
      }

      // update game state
      function update() {
        if (pause) return;

        // if game over, return
        if (gameState !== -1) {
          setUpdateDelay(0);
          return;
        }

        // if game still ongoing, update frame
        if (gameState === -1) {
          setFrame(getNextFrame()); // advance frame
        }

        // allow update function to proceed only on first frame
        if (frame !== updateDelay) {
          return;
        }

        // check win
        if (len === maxLen) {
          setGameState(1);
          return;
        }

        setPrevDir(dir);
        if (isValidNextDir(nextDir)) {
          setDir(nextDir);
        } else {
          setNextDir(dir);
        }

        if (dir === 0) return;

        // clone of arena array. This will be updated to be our new arena state
        var arr = [...arena];

        // store next head position
        var [nr, nc] = nextCell();

        // if next cell is fruit, grow snake, increase score, and spawn another fruit
        var grow = arr[nr][nc] === -1 ? true : false;
        if (grow) {
          setLen(len + 1);
          setScore(score + multiplier);

          const f = spawnFruit(arr);
          arr[f[0]][f[1]] = -1;
          setFruitPos(f);
        }

        // update body
        for (let r = 0; r < nRows; r++) {
          for (let c = 0; c < nCols; c++) {
            // decrease number in each body cell by 1
            if (arr[r][c] > 0) {
              if (!grow) {
                arr[r][c] -= 1;
              }
            }
          }
        }

        // check collision
        // if next cell is body (not 0 or -1), end game
        if (arr[nr][nc] > 0 && arr[nr][nc] !== len) {
          setGameState(0);
          return;
        }

        // 1 2 3 0 x
        // 0 1 2 3 x
        // 0 1 2 3 4
        // update head
        if (grow) {
          arr[nr][nc] = len + 1;
        } else {
          arr[nr][nc] = len;
        }
        setPos({ r: nr, c: nc }); // update head position
        setArena(arr); // update arena array
      }

      // create HD canvas
      function createHiPPICanvas(w, h) {
        let cv = canvasRef.current;
        cv.width = w * scale;
        cv.height = h * scale;
        cv.style.width = w + "px";
        cv.style.height = h + "px";
        cv.getContext("2d").scale(scale, scale);
        return cv;
      }

      window.addEventListener("keydown", handleKeyDown);

      if (!canvasRef.current) return;

      const canvas = createHiPPICanvas(adjustedW, adjustedH);
      const context = canvas.getContext("2d");

      const interval = setInterval(() => {
        update();
      }, 1);

      drawArena(context, canvas);

      return () => {
        clearInterval(interval);
        window.removeEventListener("keydown", handleKeyDown);
      };
    },
    // dependencies
    [
      adjustedH,
      adjustedW,
      arena,
      prevDir,
      dir,
      nextDir,
      frame,
      gameState,
      len,
      maxLen,
      multiplier,
      nCols,
      nRows,
      pos,
      scale,
      updateDelay,
      fruitPos,
      pause,
      showArenaVals,
      score,
    ]
  );

  return (
    <div
      className="flex flex-col snake-container"
      style={{
        width: canvasRef.current ? canvasRef.current.style.width : adjustedW,
      }}
      onMouseOver={() => {
        setShowDifficulty(true);
      }}
      onMouseLeave={() => {
        setShowDifficulty(false);
      }}
    >
      <div className="snake-top-bar">
        <div
          className="flex justify-center h-5"
          style={{ display: showDifficulty ? "none" : "flex" }}
        >
          <p>Snake</p>
        </div>
        <div
          className="flex items-center justify-between h-5"
          style={{ display: showDifficulty ? "flex" : "none" }}
        >
          <label htmlFor="difficulty">Difficulty:</label>
          <input
            type="range"
            id="difficulty"
            name="difficulty"
            min={minDifficulty}
            max={maxDifficulty}
            step={1}
            defaultValue={difficulty}
            onInput={(e) => {
              e.preventDefault();
              setUpdateDelay(k - e.target.value);
              setDifficulty(e.target.value);
              setMultiplier(
                Math.floor(Math.sqrt(multScale * e.target.value) * 10)
              );
            }}
          />
        </div>
      </div>
      <div
        className="relative flex items-center justify-center canvas-container-inner"
        style={{
          height: canvasRef.current
            ? canvasRef.current.style.height
            : adjustedH,
        }}
      >
        <canvas className="absolute" id="canvas" ref={canvasRef}></canvas>
        <div
          className="absolute play-again"
          style={{ background: gameState === -1 ? "" : "#1f2341f5" }}
        >
          {gameState !== -1 ? (
            <a
              href="/#"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                resetArena();
              }}
            >
              <p className="inline-block text-end content-end">Play Again</p>
            </a>
          ) : null}
        </div>
      </div>
      <div className="snake-bottom-bar">
        <div className="flex justify-between ">
          <p className="inline-block">Score: {score}</p>
          <p
            className="inline-block text-end content-end"
            onMouseOver={() => {
              if (getDisplayText(gameState) === "Instructions") {
                setInstructions(true);
              }
            }}
            onMouseLeave={() => {
              setInstructions(false);
            }}
          >
            {getDisplayText(gameState)}
          </p>
        </div>
        <div
          className="justify-end text-end"
          style={{ display: instructions ? "flex" : "none" }}
        >
          <div>
            <p>up- w/i </p>
            <p>down- s/k</p>
            <p>left- a/j</p>
            <p>right- d/l</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// returns array containing coords of right, bottom, left, and top cells
function getAdjacentCoords(r, c, arena) {
  const nRows = arena.length;
  const nCols = arena[0].length;
  const rc = c + 1 < nCols ? c + 1 : 0;
  const lc = c - 1 >= 0 ? c - 1 : nCols - 1;
  const bc = r + 1 < nRows ? r + 1 : 0;
  const tc = r - 1 >= 0 ? r - 1 : nRows - 1;
  return [rc, bc, lc, tc];
}

// 1: right, 2: bottom, 3: left, 4: top
// returned array indicates if the r/c coord changes
// e.g. to move right/left, row doesnt change, but col does, so return [0, 1]
function getrc(dir) {
  if (dir === 1 || dir === 3) {
    return [0, 1];
  }
  return [1, 0];
}

// return array of 4 binary values corresponding to directions of adjacent body blocks
// e.g. [1,1,0,0] means adjacent body blocks are in right and bottom of current cell
function getCornerDirection(r, c, a, len, dir) {
  const n = a[r][c];

  // if tail block, not a corner block
  if (n === 1) {
    return [];
  }

  const adjC = getAdjacentCoords(r, c, a);
  var adj = [0, 0, 0, 0]; // right, bottom, left, top

  // if head block
  if (n === len) {
    adj[dir - 1] = 1;
  }

  for (let i = 0; i < adj.length; i++) {
    const rc = getrc(i + 1);
    const row = rc[0] ? adjC[i] : r;
    const col = rc[1] ? adjC[i] : c;

    // compare values in adjacent cell and current cell
    if (Math.abs(a[row][col] - n) === 1) {
      adj[i] = 1;
    }
  }

  // compare adjacent directions
  // e.g. if dirs 1 (right) and 2 (down) both have value 1, they form a corner
  for (let i = 0; i < adj.length - 1; i++) {
    if (adj[i] && adj[i + 1]) {
      return adj;
    }
  }

  if (adj[3] && adj[0]) {
    return adj;
  }

  return [];
}

function getDisplayText(gameState) {
  if (gameState === 1) {
    return "You win!";
  } else if (gameState === 0) {
    return "Game Over!";
  } else {
    return "Instructions";
  }
}

function createArena(nRows, nCols) {
  var arr = [];
  for (let j = 0; j < nRows; j++) {
    var row = [];
    for (let i = 0; i < nCols; i++) {
      row.push(0);
    }
    arr.push(row);
  }
  return arr;
}

function addSnake(startLen, pos, arr) {
  for (let i = 0; i < startLen; i++) {
    arr[pos.r][pos.c - i] = startLen - i;
  }
  return arr;
}

// generate random int in [min, max]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// takes in arena as input, returns fruit position
const spawnFruit = (a) => {
  var arr = [...a];
  const [nRows, nCols] = [a.length, a[0].length];
  var [row, col] = [getRandomInt(0, nRows - 1), getRandomInt(0, nCols - 1)];

  // if empty space return
  // else keep looping through each position in arena in order until empty space (0) is encountered
  var [i, j] = [row, col];
  const nCells = nRows * nCols;
  var count = 0;
  while (count < nCells) {
    if (arr[i][j] === 0) {
      arr[i][j] = -1;
      return [i, j];
    }
    j++;
    if (j >= nCols) {
      j = 0;
      i++;
    }
    if (i >= nRows) {
      i = 0;
    }
    count++;
  }
};
