import React, { useEffect, useState, useRef } from "react";

export default function Snake({ w, h }) {
  const canvasRef = useRef(null);
  const scale = window.devicePixelRatio || 1;
  const blockDim = 20;
  const gap = 0;
  const [nRows, nCols] = [
    Math.floor((h - gap) / (gap + blockDim)),
    Math.floor((w - gap) / (gap + blockDim)),
  ];
  const [adjustedW, adjustedH] = [
    nCols * (gap + blockDim) + gap,
    nRows * (gap + blockDim) + gap,
  ];
  const [enableListener, setEnableListener] = useState(true);

  // game variables
  const startDir = 1;
  const startLen = 12;
  const maxLen = nCols * nRows;
  const startPos = {
    c: startLen,
    r: Math.floor(nRows / 2),
  };

  // difficulty
  const [minDiff, maxDiff] = [20, 70];
  const [diff, setDiff] = useState(
    Math.floor((maxDiff - minDiff) / 2) + minDiff
  );
  const [updateDelay, setUpdateDelay] = useState(150 - diff);
  const [multiplier, setMultiplier] = useState(Math.floor(0.5 * diff));

  var [len, setLen] = useState(startLen);
  var [score, setScore] = useState(0);
  var [pos, setPos] = useState(startPos);
  var [dir, setDir] = useState(startDir);
  var [prevDir, setPrevDir] = useState(startDir);
  var [arena, setArena] = useState(createArena());
  const [instructions, setInstructions] = useState(true);
  const [gameState, setGameState] = useState(-1);
  const [keyQueue, setKeyQueue] = useState([]);

  // takes in arena as input, returns new arena with fruit
  function spawnFruit(a) {
    var arr = [...a];
    var [row, col] = [getRandomInt(0, nRows - 1), getRandomInt(0, nCols - 1)];

    // if empty space return
    // else keep looping through each position in arena in order until empty space (0) is encountered
    var [i, j] = [row, col];
    const nCells = nRows * nCols;
    var count = 0;
    while (count < nCells) {
      if (arr[i][j] === 0) {
        arr[i][j] = -1;
        return arr;
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
  }

  function createArena() {
    var arr = [];
    for (let j = 0; j < nRows; j++) {
      var row = [];
      for (let i = 0; i < nCols; i++) {
        row.push(0);
      }
      arr.push(row);
    }

    for (let i = 0; i < startLen; i++) {
      arr[pos.r][pos.c - i] = startLen - i;
    }

    // arr[pos.r][pos.c - 0] = 3;
    // arr[pos.r][pos.c - 1] = 2;
    // arr[pos.r][pos.c - 2] = 1;
    arr = spawnFruit(arr);
    return arr;
  }

  // generate random int in [min, max]
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getDisplayText() {
    if (gameState === 1) {
      return "You win!";
    } else if (gameState === 0) {
      return "Game Over!";
    } else if (instructions) {
      return "wasd / ijkl to move";
    }
  }

  function resetArena() {
    setPos(startPos);
    setDir(startDir);
    setPrevDir(startDir);
    setLen(startLen);
    setScore(0);
    setArena(createArena());
    spawnFruit(arena);
    setInstructions(true);
    setGameState(-1);
    setKeyQueue([]);
  }

  useEffect(() => {
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

    // return dir
    function getDir() {
      return dir;
    }

    function isValidNextDir(d) {
      const invalidMappings = new Map();
      invalidMappings.set(1, 3);
      invalidMappings.set(3, 1);
      invalidMappings.set(2, 4);
      invalidMappings.set(4, 2);
      if (invalidMappings.get(prevDir) === d) {
        return false;
      }
      return true;
    }

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
        // c = "#323551";
        // c = getComputedStyle(document.documentElement).getPropertyValue(
        //   "--bg-color-2"
        // );
        c = "#1a1e40";
      } else {
        // body
        const offset = (len - n) * 5;
        c = rgb(
          Math.max(0, 221 - offset),
          Math.max(0, 254 - offset),
          Math.max(0, 144 - offset)
        );
      }
      return c;
    }

    function drawArena(ctx) {
      for (let j = 0; j < nRows; j++) {
        for (let i = 0; i < nCols; i++) {
          const type = arena[j][i];
          const [x, y] = [
            gap + i * (blockDim + gap),
            gap + j * (blockDim + gap),
          ];
          ctx.fillStyle = getFillColor(type);
          ctx.beginPath();
          ctx.rect(x, y, blockDim, blockDim);
          ctx.fill();

          // if head, draw eyes
          // if (type === len) {
          //   const n = dir === 0 ? 0 : dir - 1;
          //   const angle = (n * 90 * Math.PI) / 180;
          //   const translateX = x;
          //   const translateY = y;
          //   const offset = 3;
          //   const offsetX = 3;
          //   const r = 2;
          //   ctx.fillStyle = "#000000";
          //   ctx.translate(translateX, translateY);
          //   ctx.rotate(angle);
          //   ctx.beginPath();
          //   ctx.arc(
          //     blockDim / 2 + offsetX,
          //     blockDim / 2 - offset,
          //     r,
          //     0,
          //     2 * Math.PI
          //   );
          //   ctx.arc(
          //     blockDim / 2 + offsetX,
          //     blockDim / 2 + offset,
          //     r,
          //     0,
          //     2 * Math.PI
          //   );
          //   ctx.fill();
          //   ctx.rotate(-angle);
          //   ctx.translate(-translateX, -translateY);
          // }
        }
      }
    }

    //   function drawGameOver(ctx) {
    //     for (let j = 0; j < nRows; j++) {
    //       for (let i = 0; i < nCols; i++) {
    // ctx.fillStyle = getComputedStyle(
    //   document.documentElement
    // ).getPropertyValue("--bg-color-2");

    //         ctx.beginPath();
    //         ctx.rect(
    //           gap + i * (blockDim + gap),
    //           gap + j * (blockDim + gap),
    //           blockDim,
    //           blockDim
    //         );
    //         ctx.fill();
    //       }
    //     }
    //   }

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

    function handleKeyDown(e) {
      if (!enableListener) {
        return;
      }

      setEnableListener(false);

      if (e.repeat) {
        return;
      }

      const input = e.keyCode;
      if (gameState !== -1) {
        return;
      }

      const wasdCodes = [68, 83, 65, 87];
      const ijklCodes = [76, 75, 74, 73];

      var nextDir = -1;

      if (
        (input === wasdCodes[2] || input === ijklCodes[2]) &&
        getDir() === 0
      ) {
        return;
      }

      if (input === wasdCodes[0] || input === ijklCodes[0]) {
        nextDir = 1;
      } else if (input === wasdCodes[1] || input === ijklCodes[1]) {
        nextDir = 2;
      } else if (input === wasdCodes[2] || input === ijklCodes[2]) {
        nextDir = 3;
      } else if (input === wasdCodes[3] || input === ijklCodes[3]) {
        nextDir = 4;
      }

      if (nextDir === -1) {
        return;
      }

      if (!isValidNextDir(nextDir)) {
        return;
      }

      setDir(nextDir);
    }

    // update game state
    function update() {
      // remove instructions text if player starts playing
      if (instructions && getDir() !== startDir) {
        setInstructions(false);
      }

      // check win
      if (len === maxLen) {
        setGameState(1);
        return;
      }

      // if snake is stationary or game over, return
      if (getDir() === 0 || gameState !== -1) {
        return;
      }

      // clone of arena array. This will be updated to be our new arena state
      var arr = [...arena];

      // store next head position
      var [nr, nc] = nextCell();

      // if next cell is fruit, grow snake, increase score, and spawn another fruit
      var grow = arr[nr][nc] === -1 ? true : false;
      if (grow) {
        setLen(len + 1);
        setScore((len + 1 - startLen) * multiplier);

        arr = spawnFruit(arr);
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

      // 1 2 3 0 x
      // 0 1 2 3 x
      // 0 1 2 3 4

      // check collision
      // if next cell is body (not 0 or -1), end game
      if (arr[nr][nc] > 0) {
        setGameState(0);
        return;
      }

      // update head
      if (grow) {
        arr[nr][nc] = len + 1;
      } else {
        arr[nr][nc] = len;
      }
      setPos({ r: nr, c: nc }); // update pos state

      setArena(arr); // update arena's state
      setPrevDir(dir);
      setEnableListener(true);
    }
    // draw the grid
    const draw = (ctx) => {
      drawArena(ctx);
      //   if (gameState !== -1) {
      //     drawGameOver(ctx);
      //   } else {
      //     drawArena(ctx);
      //   }
    };

    window.addEventListener("keydown", handleKeyDown);

    const interval = setInterval(() => {
      update();
    }, updateDelay);

    const canvas = createHiPPICanvas(adjustedW, adjustedH);
    const context = canvas.getContext("2d");
    draw(context);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
    // sfg
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dir,
    arena,
    gameState,
    instructions,
    keyQueue,
    len,
    maxLen,
    nCols,
    nRows,
    pos,
    scale,
    score,
    enableListener,
    prevDir,
    updateDelay,
    multiplier,
    adjustedH,
    adjustedW,
  ]);

  return (
    <div class="canvas-container">
      <div class="flex items-center justify-between snake-top-bar">
        <label for="difficulty">Difficulty:</label>
        <input
          type="range"
          id="difficulty"
          name="difficulty"
          min={minDiff}
          max={maxDiff}
          step={1}
          defaultValue={diff}
          onInput={(e) => {
            e.preventDefault();
            setUpdateDelay(150 - e.target.value);
            setDiff(e.target.value);
            setMultiplier(Math.floor(0.5 * diff));
          }}
        />
      </div>
      <div
        class="relative flex items-center justify-center canvas-container-inner"
        style={{
          width: canvasRef.current ? canvasRef.current.style.width : adjustedW,
          height: canvasRef.current
            ? canvasRef.current.style.height
            : adjustedH,
        }}
      >
        <canvas class="absolute" id="canvas" ref={canvasRef}></canvas>
        <div
          class="absolute play-again"
          style={{ background: gameState === -1 ? "" : "#1f2341f5" }}
        >
          {gameState === 0 || gameState === 1 ? (
            <a
              href="/#"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setGameState(-1);
                resetArena();
              }}
            >
              <p class="inline-block text-end content-end">Play Again</p>
            </a>
          ) : null}
        </div>
      </div>
      <div class="flex justify-between snake-bottom-bar">
        <p class="inline-block">Score: {score}</p>
        <p class="inline-block text-end content-end">{getDisplayText()}</p>
      </div>
    </div>
  );
}
