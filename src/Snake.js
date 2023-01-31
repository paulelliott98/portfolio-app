import React, { useEffect, useState, useRef } from "react";

export default function Snake({ w, h }) {
  const canvasRef = useRef(null);
  const scale = window.devicePixelRatio || 1;
  const blockDim = 15;
  const gap = 0;
  const [nRows, nCols] = [
    Math.floor((h - gap) / (gap + blockDim)),
    Math.floor((w - gap) / (gap + blockDim)),
  ];
  const [enableListener, setEnableListener] = useState(true);
  const [adjustedW, adjustedH] = [
    nCols * (gap + blockDim) + gap,
    nRows * (gap + blockDim) + gap,
  ];

  // game variables
  const startPos = {
    c: Math.floor(nCols / 2) - 3,
    r: Math.floor(nRows / 2),
  };
  const startDir = 1;
  const startLen = 3;
  const updateDelay = 50;
  const multiplier = 10;
  const maxScore = (nCols * nRows - startLen) * multiplier;

  var [len, setLen] = useState(startLen);
  var [score, setScore] = useState(0);
  var [pos, setPos] = useState(startPos);
  var [dir, setDir] = useState(startDir);
  var [arena, setArena] = useState(createArena());
  const [instructions, setInstructions] = useState(true);
  const [gameState, setGameState] = useState(-1);

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

    var fruitPos = spawnFruit(arr);
    arr[fruitPos.r][fruitPos.c] = -1; // update fruit position
    return arr;
  }

  // generate random int in [min, max]
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // takes in arena as input, returns object containing new fruit position
  function spawnFruit(arr) {
    var [row, col] = [getRandomInt(0, nRows - 1), getRandomInt(0, nCols - 1)];

    // if empty space return
    // else keep looping through each position in arena in order until empty space (0) is encountered
    var [i, j] = [row, col];
    const nCells = nRows * nCols;
    var count = 0;
    while (count < nCells) {
      if (arr[i][j] === 0) {
        return { r: i, c: j };
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

  // return r and c indices for upcoming head position
  function nextCell() {
    var [r, c] = [pos.r, pos.c];
    switch (dir) {
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

  function updateArena() {
    // if snake is stationary, return
    if (dir === 0) {
      return;
    }

    // check win
    if (score === maxScore) {
      setGameState(1);
      return;
    }

    // clone of arena array. This will be updated to be our new arena state
    var arr = [...arena];

    // store next head position
    var [nr, nc] = nextCell();

    // check collision
    // if next cell is body (not 0 or -1), end game
    if (arr[nr][nc] > 0) {
      setGameState(0);
      return;
    }

    // if next cell is fruit, grow snake, increase score, and spawn another fruit
    var grow = arr[nr][nc] === -1 ? true : false;
    if (grow) {
      setLen(len + 1);
      setScore((len + 1 - startLen) * multiplier);

      const fruitPos = spawnFruit(arr);
      arr[fruitPos.r][fruitPos.c] = -1;
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

    // update head
    if (grow) {
      arr[nr][nc] = len + 1;
    } else {
      arr[nr][nc] = len;
    }
    setPos({ r: nr, c: nc }); // update pos state

    setArena(arr); // update arena's state
  }

  function resetArena() {
    setPos(startPos);
    setDir(startDir);
    setLen(startLen);
    setScore(0);
    setInstructions(true);
    setGameState(-1);
    setArena(createArena());
  }

  function handleKeyDown(e) {
    setInstructions(false);
    if (!enableListener || gameState !== -1) {
      return;
    }

    setEnableListener(false);
    setTimeout(() => setEnableListener(true), updateDelay);

    const wasdCodes = [68, 83, 65, 87];
    const ijklCodes = [76, 75, 74, 73];

    if (
      (e.keyCode === wasdCodes[2] || e.keyCode === ijklCodes[2]) &&
      dir === 0
    ) {
      return;
    }

    if (
      (e.keyCode === wasdCodes[0] || e.keyCode === ijklCodes[0]) &&
      dir !== 3
    ) {
      setDir(1);
    } else if (
      (e.keyCode === wasdCodes[1] || e.keyCode === ijklCodes[1]) &&
      dir !== 4
    ) {
      setDir(2);
    } else if (
      (e.keyCode === wasdCodes[2] || e.keyCode === ijklCodes[2]) &&
      dir !== 1
    ) {
      setDir(3);
    } else if (
      (e.keyCode === wasdCodes[3] || e.keyCode === ijklCodes[3]) &&
      dir !== 2
    ) {
      setDir(4);
    }
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
      c = "#323551";
    } else {
      // body
      c = "#ddfe90";
    }
    return c;
  }

  function drawArena(ctx) {
    for (let j = 0; j < nRows; j++) {
      for (let i = 0; i < nCols; i++) {
        const type = arena[j][i];
        const [x, y] = [gap + i * (blockDim + gap), gap + j * (blockDim + gap)];
        ctx.fillStyle = getFillColor(type);
        ctx.beginPath();
        ctx.rect(x, y, blockDim, blockDim);
        // if (type === -1) {
        //   ctx.fillStyle = getFillColor(0);
        //   ctx.rect(x, y, blockDim, blockDim);

        //   ctx.fillStyle = getFillColor(type);
        //   ctx.arc(
        //     x + 0.5 * blockDim,
        //     y + 0.5 * blockDim,
        //     blockDim / 2,
        //     0,
        //     2 * Math.PI
        //   );
        // } else {
        //   ctx.rect(x, y, blockDim, blockDim);
        // }
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
  //         ctx.fillStyle = getComputedStyle(
  //           document.documentElement
  //         ).getPropertyValue("--bg-color-2");

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

  function getDisplayText() {
    if (gameState === 1) {
      return "You win!";
    } else if (gameState === 0) {
      return "Game Over!";
    } else if (instructions) {
      return "WASD/IJKL to move";
    }
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

  useEffect(() => {
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
      updateArena();
    }, updateDelay);

    const canvas = createHiPPICanvas(adjustedW, adjustedH);
    const context = canvas.getContext("2d");
    draw(context);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div class="canvas-container">
      <canvas id="canvas" ref={canvasRef}></canvas>
      {/* {gameState !== -1 ? (
        <div
          class="bg-green-400"
          style={{ width: adjustedW, height: adjustedH }}
        >
          <a
            href="/#"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setGameState(-1);
              resetArena();
            }}
          >
            <p class="">Play Again</p>
          </a>
        </div>
      ) : null} */}
      {/* <div
        class="absolute"
        style={{ width: adjustedW, height: adjustedH }}
      ></div> */}
      <div class="flex justify-between mt-1">
        <p class="inline-block">Score: {score}</p>
        <p class="inline-block text-end content-end">{getDisplayText()}</p>
      </div>
      <div class="text-end">
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
            <p class="">Play Again</p>
          </a>
        ) : null}
      </div>
    </div>
  );
}
