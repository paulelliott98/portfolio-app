import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
var profanity = require('@2toad/profanity').profanity;
const utils = require('../utils');

const fruits = [
  '🍒',
  '🍑',
  '🍎',
  '🍓',
  '🍇',
  '🍉',
  '🍊',
  '🍋',
  '🍍',
  '🍏',
  '🍐',
  '🥝',
  '🥭',
  '🍅',
  '🫐',
  '🍌',
  '🍈',
];

var axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081'
      : 'https://snake-backend.fly.dev',
  timeout: 5000,
});

export default function Snake(props) {
  const [pause, setPause] = useState(false);
  const [showArenaVals, setShowArenaVals] = useState(false);

  const canvasRef = useRef(null);
  const drawAdjustment = 0.08;
  const scale = window.devicePixelRatio || 1;
  const blockDim = 27;
  const gap = 0;
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
  const startDir = 1;
  const startLen = 3;
  const maxLen = nCols * nRows;
  const startPos = {
    c: startLen,
    r: Math.floor(nRows / 2),
  };
  const [len, setLen] = useState(startLen);
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState(startPos);
  const [prevDir, setPrevDir] = useState(startDir);
  const [dir, setDir] = useState(startDir);
  const nextDir = useRef(startDir);
  const [fruit, setFruit] = useState(utils.randChoice(fruits));
  const [playerName, setPlayerName] = useState('');

  var a = createArena(nRows, nCols);
  a = addSnake(startLen, pos, a);
  var f = spawnFruit(a);

  const [arena, setArena] = useState(a);
  const [fruitPos, setFruitPos] = useState(f);
  const [gameState, setGameState] = useState(-2);

  // difficulty settings and frame rate
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    typeof CSS !== 'undefined' &&
    /webkit/i.test(navigator.userAgent);
  const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

  const k = 14;
  var updateInterval = 1000 / 200; // fps
  if (isSafari || isFirefox) updateInterval /= 0.9;

  const [minDifficulty, maxDifficulty] = [1, 10];
  const [difficulty, setDifficulty] = useState(maxDifficulty);
  const [updateDelay, setUpdateDelay] = useState(
    maxDifficulty - difficulty + 1 + k
  );
  const [frame, setFrame] = useState(0);
  const [nUpdates, setnUpdates] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [fps, setfps] = useState(updateInterval);

  // set which page is shown on screen
  const [page, setPage] = useState('homeScreen');

  const [highScores, setHighScores] = useState([]);
  const [isHighScore, setIsHighScore] = useState(false);
  const [isChangePlayer, setIsChangePlayer] = useState(false);
  const [lastPostDate, setLastPostDate] = useState(null);

  const [showNameError, setShowNameError] = useState(false);
  const [nameErrorTimeout, setNameErrorTimeout] = useState(null);

  // search for matching date object return 0-9
  const getPlayerRank = () => {
    if (!lastPostDate) return null;

    // for i: 9,8, ... , 0
    for (let i = highScores.length - 1; i >= 0; i--) {
      if (highScores[i].Date === '-') continue;
      // Date: '2023-02-18', Time: '10:28:35'
      const [y, m, d] = highScores[i].Date.split('-').map((item) => {
        return parseInt(item);
      });
      const [hr, min, sec] = highScores[i].Time.split(':').map((item) => {
        return parseInt(item);
      });
      const dateObj = new Date(y, m - 1, d, hr, min, sec);
      lastPostDate.setMilliseconds(0);
      dateObj.setMilliseconds(0);
      if (lastPostDate.getTime() === dateObj.getTime()) {
        return i;
      }
    }

    return null;
  };

  const resetArena = () => {
    setPos(startPos);
    setPrevDir(startDir);
    setDir(startDir);
    nextDir.current = startDir;
    setLen(startLen);
    setScore(0);
    setFrame(0);
    setUpdateDelay(maxDifficulty - difficulty + 1 + k);

    var newArena = createArena(nRows, nCols);
    newArena = addSnake(startLen, startPos, newArena);
    f = spawnFruit(newArena);

    setArena(newArena);
    setFruitPos(f);
    setFruit(utils.randChoice(fruits));
    setPause(false);
    setIsHighScore(false);
  };

  const keyframes = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2)
    }
    100% {
      transform: scale(1);
    }
  }
`;

  const homeScreen = () => {
    return (
      <div className="flex justify-center h-full">
        <div className="game-options">
          <a
            href="/#"
            draggable="false"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              if (playerName) {
                setPage('game');
                setGameState(-1);
              } else {
                setPage('enterNameScreen');
              }
            }}
          >
            <span>👾 Play</span>
          </a>
          <a
            href="/#"
            draggable="false"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              getHighScoresData();
              setPage('highScoresScreen');
            }}
          >
            <span>📊 High Scores</span>
          </a>
          <a
            href="/#"
            draggable="false"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setPage('instructionsScreen');
            }}
          >
            <span>📜 Instructions</span>
          </a>

          <a
            href="/#"
            draggable="false"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setPage('setDifficultyScreen');
            }}
          >
            <span>⏩ Change Difficulty</span>
          </a>
          {playerName ? (
            <a
              href="/#"
              draggable="false"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setIsChangePlayer(true);
                setPage('enterNameScreen');
              }}
            >
              <span>🏷️ Change Player</span>
            </a>
          ) : null}
        </div>
      </div>
    );
  };

  const enterNameScreen = () => {
    return (
      <div className="h-full">
        <div className="flex flex-col items-center justify-end h-1/2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label className="inline" htmlFor="name">
              Player Name:
            </label>
            <input
              className="text-black"
              type="text"
              id="name"
              name="name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const inp = e.target.value.trim();
                  if (inp) {
                    if (profanity.exists(inp)) {
                      setShowNameError(true);
                      if (nameErrorTimeout) clearTimeout(nameErrorTimeout);
                      const timeout = setTimeout(() => {
                        setShowNameError(false);
                      }, 2000);
                      setNameErrorTimeout(timeout);
                      return;
                    } else setPlayerName(inp);
                  } else setPlayerName('');

                  if (isChangePlayer) {
                    setPage('homeScreen');
                    setGameState(-2);
                  } else if (!profanity.exists(inp)) {
                    setPage('game');
                    setGameState(-1);
                  }
                }
              }}
              maxLength="20"
              autoComplete="off"
              defaultValue={playerName}
              autoFocus
            />
          </form>
        </div>
        <div className="flex justify-center">
          {showNameError ? (
            <span className="invalid-name-warning text-red-600">
              Please choose a different name
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  const playAgainScreen = () => {
    return (
      <div className="game-options">
        <a
          href="/#"
          draggable="false"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            setPage('game');
            setGameState(-1);
            resetArena();
          }}
        >
          <p className="inline-block text-end content-end">Play Again</p>
        </a>
        <a
          href="/#"
          draggable="false"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            resetArena();
            setPage('homeScreen');
            setGameState(-2);
          }}
        >
          <p className="inline-block text-end content-end">Main Menu</p>
        </a>
      </div>
    );
  };

  const instructionsScreen = () => {
    return (
      <div className="flex flex-col justify-center h-full mx-10">
        <div className="flex justify-center mb-5 font-bold">
          <span>Instructions</span>
        </div>

        <div className="instructions">
          <p>Change direction of snake head using the following keys:</p>
          <div className="my-4 flex">
            <div className="mr-10">
              <p>⬆️ / w / i </p>
              <p>⬇️ / s / k</p>
            </div>
            <div className="mr-10">
              <p>⬅️ / a / j</p>
              <p>➡️ / d / l</p>
            </div>
          </div>
          <div className="my-4">
            <p>Eat fruits to score points and grow:</p>
            <p>🍒🍎🍑🍓🍇🍉🍊🍋🍍🍏🍐🥝🥭🍅🫐🍌🍈</p>
          </div>
          <p className="my-4">Do not collide into body! ☠️</p>
        </div>
      </div>
    );
  };

  const highScoresScreen = () => {
    let rows = [];

    if (highScores.length === 0) {
      for (let i = 0; i < 10; i++) {
        rows.push(
          <tr>
            <td>{i + 1}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        );
      }
    } else {
      rows = highScores.map((row, i) => {
        var dateString = '-';
        if (row.Date !== '-') {
          const [y, m, d] = row.Date.split('-');
          dateString = `${('0' + m).slice(-2)}-${('0' + d).slice(-2)}-${y}`;
        }
        return (
          <tr
            key={i + 1}
            className={
              isHighScore && i === getPlayerRank() ? 'text-green-400' : ''
            }
          >
            <style>{keyframes}</style>
            <td>{i + 1}</td>
            <td>{row.Name}</td>
            <td>{row.Score}</td>
            <td>{dateString}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <div className="flex justify-center mt-3 high-scores">
          <span className="font-bold">High Scores</span>
        </div>
        <div className="flex justify-center">
          <table>
            <thead>
              <tr>
                <th className="rank"></th>
                <th className="name">Name</th>
                <th className="score">Score</th>
                <th className="date">Date</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  };

  const setDifficultyScreen = () => {
    return (
      <div className="flex items-center justify-between h-full content-center px-10">
        <label htmlFor="difficulty">{`Difficulty: ${difficulty}`}</label>
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
            const val = parseInt(e.target.value);
            setDifficulty(val);
            setUpdateDelay(maxDifficulty - difficulty + 1 + k);
          }}
        />
      </div>
    );
  };

  // current displayed page on canvas
  const getPage = () => {
    if (page === 'homeScreen') return homeScreen();
    else if (page === 'enterNameScreen') return enterNameScreen();
    else if (page === 'playAgainScreen') return playAgainScreen();
    else if (page === 'instructionsScreen') return instructionsScreen();
    else if (page === 'highScoresScreen') return highScoresScreen();
    else if (page === 'setDifficultyScreen') return setDifficultyScreen();
    else if (page === 'game') return null;
  };

  // return the right element to display in snake bottom bar, right side
  const getDisplayText = () => {
    if (gameState === 1) {
      return 'You win!';
    } else if (gameState === 0) {
      if (isHighScore)
        return (
          <div>
            <p className="text-green-400">New high score!</p>
          </div>
        );
      else
        return (
          <div>
            <p>Game Over!</p>
          </div>
        );
    } else if (gameState === -2 && page === 'homeScreen') {
      return null;
    } else {
      return (
        <div className="flex justify-end main-menu">
          <a
            draggable="false"
            href="/#"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              if (page === 'game' && score > 0) {
                postScores(playerName, score, difficulty, new Date())
                  .then((d) => {
                    setLastPostDate(d);
                    getHighScoresData();
                  })
                  .catch((e) => console.log(e));

                setPage('highScoresScreen');
                setGameState(0);
              } else {
                setPage('homeScreen');
                setGameState(-2);
                resetArena();
              }
            }}
          >
            {page === 'game' ? <span>End Game</span> : <span>Main Menu</span>}
          </a>
        </div>
      );
    }
  };

  async function getHighScoresData() {
    var scores = [];
    await axiosInstance
      .get('/high-score')
      .then((r) => {
        scores = r.data;
        var numEmptyRows = 10;
        if (scores) numEmptyRows = 10 - scores.length;
        for (let i = 0; i < numEmptyRows; i++) {
          scores.push({ Name: '-', Score: '-', Date: '-', Time: '-' });
        }
        setHighScores(scores);
      })
      .catch((err) => {
        console.error(err);
        setHighScores([]);
      });
  }

  // send game data to backend upon game over
  async function postScores(playerName, score, difficulty, d) {
    const [month, day, year] = [d.getMonth() + 1, d.getDate(), d.getFullYear()];
    const [hour, minute, second] = [
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
    ];
    await axiosInstance
      .post('/high-score', {
        name: playerName,
        score: score,
        difficulty: difficulty,
        date: `${month}-${day}-${year}`,
        time: `${hour}:${minute}:${second}`,
      })
      .then(() => {
        return d;
      })
      .catch((err) => {
        console.log(err);
        return d;
      });
  }

  useEffect(() => {
    getHighScoresData();
  }, []);

  useEffect(
    () => {
      const drawArena = (ctx, canvas) => {
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const arr = arena;

        // draw fruit
        ctx.font = '20px sans-serif';
        ctx.fillText(
          fruit,
          gap + fruitPos[1] * (blockDim + gap) + 0.2 * blockDim,
          gap + fruitPos[0] * (blockDim + gap) + 0.8 * blockDim
        );

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

              // draw eyes
              if (type === len)
                drawSnakeEyes(c + offsets[0], r + offsets[1], ctx);
            }

            // if block is warping to other side of canvas,
            // draw the partial block
            drawPartialRect(
              c + offsets[0],
              r + offsets[1],
              blockDim + offsets[2],
              blockDim + offsets[3],
              getFillColor(type),
              ctx
            );
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
            cx += blockDim + 3 * drawAdjustment;
            cy += blockDim + 3 * drawAdjustment;
            ctx.clearRect(
              x - 4 * drawAdjustment,
              y - 4 * drawAdjustment,
              blockDim,
              blockDim
            );
          }
          // bottom to left
          else if (corner[1] && corner[2]) {
            [start, end] = [1.5 * pi, 0];
            cy += blockDim;
            cx -= 3 * drawAdjustment;
            cy += 3 * drawAdjustment;
            ctx.clearRect(
              x + 4 * drawAdjustment,
              y - 4 * drawAdjustment,
              blockDim,
              blockDim
            );
          }
          // left to top
          else if (corner[2] && corner[3]) {
            [start, end] = [0, 0.5 * pi];
            cx -= 3 * drawAdjustment;
            cy -= 3 * drawAdjustment;
            ctx.clearRect(
              x + 4 * drawAdjustment,
              y + 4 * drawAdjustment,
              blockDim,
              blockDim
            );
          }
          // top to right
          else if (corner[3] && corner[0]) {
            [start, end] = [0.5 * pi, pi];
            cx += blockDim;
            cx += 3 * drawAdjustment;
            cy -= 3 * drawAdjustment;
            ctx.clearRect(
              x - 4 * drawAdjustment,
              y + 4 * drawAdjustment,
              blockDim,
              blockDim
            );
          }

          // draw quarter circle (corner)
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, blockDim + 2.5 * drawAdjustment, start, end, false);
          ctx.fill();

          // fill in rect between head and corner
          if (Math.abs(arr[cornerj][corneri] - len) === 1 && prevDir === dir) {
            var temp = [0, 0, 0, 0];
            if (dir === 1) temp = [x + blockDim, y, diff, blockDim];
            else if (dir === 2) temp = [x, y + blockDim, blockDim, diff];
            else if (dir === 3) temp = [x - diff, y, diff, blockDim];
            else if (dir === 4) temp = [x, y - diff, blockDim, diff];

            ctx.beginPath();
            ctx.rect(...temp);
            ctx.fill();

            if (dir === 1) temp[2] += blockDim;
            else if (dir === 2) temp[3] += blockDim;
            else if (dir === 3) temp[2] -= diff;
            else temp[3] -= diff;
            drawPartialRect(...temp, color, ctx);
          }
        }

        if (showArenaVals) drawArrayVals(ctx);
      };

      const drawPartialRect = (i, j, w, h, color, ctx) => {
        var partialRect = getPartialRect(i, j, w, h);

        if (partialRect) {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.rect(...partialRect);
          ctx.fill();
        }
      };

      const drawSnakeEyes = (row, col, ctx) => {
        const n = dir === 0 ? 0 : dir - 1;
        const angle = (n * 90 * Math.PI) / 180;

        // when we rotate ctx to draw, the rotation origin is the upper left hand corner
        // hence we need to account for draw position
        var ctxOffset = [0, 0];
        if (dir === 2) ctxOffset = [0, -blockDim];
        else if (dir === 3) ctxOffset = [-blockDim, -blockDim];
        else if (dir === 4) ctxOffset = [-blockDim, 0];

        const offsetX = 3; // distance to front of head
        const offsetY = 3; // distance between eyes

        const radius = 1; // eye radius
        ctx.fillStyle = '#000000'; // eye color

        ctx.translate(row, col);
        ctx.rotate(angle);
        ctx.translate(ctxOffset[0], ctxOffset[1]);
        ctx.beginPath();
        ctx.arc(
          blockDim / 2 + offsetX,
          blockDim / 2 - offsetY,
          radius,
          0,
          2 * Math.PI
        );
        ctx.arc(
          blockDim / 2 + offsetX,
          blockDim / 2 + offsetY,
          radius,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.translate(-ctxOffset[0], -ctxOffset[1]);
        ctx.rotate(-angle);
        ctx.translate(-row, -col);
      };

      const drawArrayVals = (ctx) => {
        for (let j = 0; j < nRows; j++) {
          for (let i = 0; i < nCols; i++) {
            const [r, c] = [
              gap + j * (blockDim + gap),
              gap + i * (blockDim + gap),
            ];
            ctx.fillStyle = 'red';
            ctx.font = '10px sans-serif';
            ctx.fillText(arena[j][i], c + 0.4 * blockDim, r + 0.6 * blockDim);
          }
        }
      };

      // return color of block based on int value in arena array
      function getFillColor(n) {
        // head
        if (n === len) return '#fff';
        // fruit
        else if (n === -1) return '#c792e9';
        // background
        else if (n === 0) return '#1f234177';
        // body
        else return getBodyColor(n);
      }

      const getBodyColor = (n) => {
        const currDate = new Date();
        const [ms, month, day] = [
          currDate.getMilliseconds(),
          currDate.getMonth() + 1,
          currDate.getDate(),
        ];

        // color definitions
        var defaultGreen = [221, 254, 144]; // green
        var [xmasGreen, xmasRed] = [rgb(39, 93, 40), rgb(231, 57, 62)]; // christmas season
        var [valPurple, valPink, valRed] = [
          rgb(195, 194, 236),
          rgb(255, 192, 203),
          rgb(175, 51, 67),
        ]; // valentines day

        // christmas colors
        if (month === 12) {
          if (ms < 500) [xmasRed, xmasGreen] = [xmasGreen, xmasRed];
          if (n % 2 === 0) return xmasRed;
          else return xmasGreen;
        }
        // valentines day colors
        else if (month === 2 && day === 14) {
          // if (ms < 333)
          //   [valPink, valPurple, xmasRed] = [valPurple, xmasRed, valPink];
          // else if (ms >= 333 && ms < 666)
          //   [valPink, valPurple, xmasRed] = [xmasRed, valPink, valPurple];
          if (n % 3 === 0) return valPink;
          else if (n % 3 === 1) return valPurple;
          return valRed;
        }
        // else default
        else {
          const offset = (len - n) * 3;
          return rgb(
            Math.max(0, defaultGreen[0] - offset),
            Math.max(0, defaultGreen[1] - offset),
            Math.max(0, defaultGreen[2] - offset)
          );
        }
      };

      // identify part of snake body that has been cut off by canvas boundary
      // returning new rect (col, row, width, height) on opposite side of canvas
      function getPartialRect(x, y, w, h) {
        // if entire body is within canvas boundary, return null
        const pixelInaccuracy = 2;
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
        ) {
          offset = [0, 0, 0, 0];
          return offset;
        }

        // add a small offset to cover gaps between body segments
        if (prev) {
          if (prev.dir === 1 || prev.dir === 3) offset[2] += 4 * drawAdjustment;
          else offset[3] += 4 * drawAdjustment;
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
        if (gameState !== -1 && page !== 'highScoresScreen') return;

        e.preventDefault();

        const input = e.keyCode;

        // pause
        if (input === 49) setPause(!pause);
        if (input === 187) setShowArenaVals(!showArenaVals);

        if (gameState !== -1) return;

        const wasdCodes = [68, 83, 65, 87];
        const ijklCodes = [76, 75, 74, 73];
        const arrowCodes = [39, 40, 37, 38];

        var nextDirection = -1;

        if (
          (input === wasdCodes[2] || input === ijklCodes[2]) &&
          getDir() === 0
        )
          return;

        // set snake direction based on key input
        for (let i = 0; i < 4; i++) {
          if (
            input === wasdCodes[i] ||
            input === ijklCodes[i] ||
            input === arrowCodes[i]
          ) {
            nextDirection = i + 1;
          }
        }

        if (nextDirection === -1) return;

        if (!pause) nextDir.current = nextDirection;
      }

      // returns number of next frame
      function getNextFrame(f) {
        if (frame + f > updateDelay) {
          return frame + f - updateDelay;
        }
        return frame + f;
      }

      // returns number of previous frame
      function getLastFrame() {
        if (frame - 1 < 1) {
          return updateDelay;
        }
        return frame;
      }

      // update game state
      function update(frames) {
        setnUpdates(nUpdates + 1);
        // if game still ongoing, update frame
        const toUpdate = frame + frames >= updateDelay ? 1 : 0;

        if (gameState === -1 && !pause) {
          setFrame(getNextFrame(frames)); // advance frame
        } else {
          return;
        }

        // allow update function to proceed only on last frame
        if (frame !== updateDelay || !toUpdate) return;

        // check win
        if (len === maxLen) {
          postScores(playerName, score, difficulty, new Date())
            .then((d) => {
              setLastPostDate(d);
              getHighScoresData();
            })
            .catch((e) => console.log(e));

          setGameState(1);
          setPage('highScoresScreen');
          return;
        }

        setPrevDir(dir);

        if (isValidNextDir(nextDir.current)) {
          setDir(nextDir.current);
        } else {
          nextDir.current = dir;
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
          setScore(score + difficulty * 10);

          const f = spawnFruit(arr);
          arr[f[0]][f[1]] = -1;
          setFruitPos(f);
          setFruit(utils.randChoice(fruits));
        }

        // check collision/loss
        // if next cell is body (not 0 or -1), end game
        if (arr[nr][nc] > 1 && arr[nr][nc] !== len) {
          postScores(playerName, score, difficulty, new Date())
            .then((d) => {
              setLastPostDate(d);
              getHighScoresData();
            })
            .catch((e) => console.log(e));

          setGameState(0);
          setPage('highScoresScreen');
          return;
        }

        // update body
        if (!grow) {
          var b = { r: pos.r, c: pos.c };
          while (arena[b.r][b.c] > 0) {
            let nextB = getBody(b.r, b.c, 1, arena);
            arr[b.r][b.c] -= 1;
            if (!nextB) break;
            b = nextB;
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

        setPos({ r: nr, c: nc }); // update head position
        setArena(arr); // update arena array
      }

      // create HD canvas
      function createHiPPICanvas(w, h) {
        let cv = canvasRef.current;
        cv.width = w * scale;
        cv.height = h * scale;
        cv.style.width = w + 'px';
        cv.style.height = h + 'px';
        cv.getContext('2d').scale(scale, scale);
        return cv;
      }

      window.addEventListener('keydown', handleKeyDown);

      const canvas = createHiPPICanvas(adjustedW, adjustedH);
      const context = canvas.getContext('2d');

      const fpsCheckInterval = 1000;
      const t = new Date();
      if (t - lastUpdateTime >= fpsCheckInterval) {
        setfps(nUpdates);
        setLastUpdateTime(t);
        setnUpdates(0);
      }

      const interval = setTimeout(() => {
        update(1);
      }, updateInterval);

      if (canvasRef.current && gameState === -1) {
        drawArena(context, canvas);
      }

      return () => {
        clearTimeout(interval);
        window.removeEventListener('keydown', handleKeyDown);
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
      nCols,
      nRows,
      pos,
      scale,
      updateDelay,
      fruitPos,
      pause,
      showArenaVals,
      score,
      difficulty,
      minDifficulty,
      playerName,
      highScores,
      nUpdates,
      lastUpdateTime,
      fps,
      updateInterval,
      fruit,
      page,
      isHighScore,
    ]
  );

  return (
    <Grid
      className="snake-container"
      sx={{
        flexFlow: 'column nowrap',
        width: canvasRef.current ? canvasRef.current.style.width : adjustedW,
      }}
    >
      <div className="snake-top-bar">
        <div className="flex justify-center items-center h-5">
          {(() => {
            if (gameState === -1 || gameState === -2) return <p>Snake 🐍</p>;
            else
              return (
                <div className="flex justify-between w-full">
                  <div className="flex pink-on-hover">
                    <a
                      href="/#"
                      draggable="false"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage('homeScreen');
                        setGameState(-2);
                        resetArena();
                      }}
                    >
                      <span>Main Menu</span>
                    </a>
                  </div>
                  <div className="flex pink-on-hover">
                    <a
                      href="/#"
                      draggable="false"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage('game');
                        setGameState(-1);
                        resetArena();
                      }}
                    >
                      <p className="inline-block text-end content-end">
                        Play Again
                      </p>
                    </a>
                  </div>
                </div>
              );
          })()}
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
        <div className="absolute game-options-text-container">{getPage()}</div>
      </div>
      <div className="snake-bottom-bar">
        <div className="flex justify-between w-full">
          <div>
            {gameState !== -2 ? (
              <div>
                <p className="inline-block">Score:</p>
                <p
                  className="inline-block mx-3"
                  style={(() => {
                    if (!highScores) return {};

                    const lowestItem =
                      highScores
                        .slice()
                        .reverse()
                        .find((item) => item.Score !== '-') || null;
                    var lowest = lowestItem ? lowestItem.Score : 0;
                    if (
                      highScores.length > 0 &&
                      highScores[highScores.length - 1].Score === '-'
                    )
                      lowest = 0;
                    if (score > lowest && gameState === -1) {
                      if (!isHighScore) setIsHighScore(true);
                      return {
                        color: '#c792e9',
                        animation: 'pulse 0.8s linear infinite',
                      };
                    } else return {};
                  })()}
                >
                  <style>{keyframes}</style>
                  {score}
                </p>
              </div>
            ) : (
              <p className="inline-block"></p>
            )}
          </div>
          <div className="inline-block text-end content-end">
            {getDisplayText()}
          </div>
        </div>
      </div>
    </Grid>
  );
}

function rgb(r, g, b) {
  return ['rgb(', r, ',', g, ',', b, ')'].join('');
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
  var a = [...arr];
  for (let i = 0; i < startLen; i++) {
    a[pos.r][pos.c - i] = startLen - i;
  }
  return a;
}

// takes in arena as input, returns fruit position
const spawnFruit = (a) => {
  var arr = [...a];
  const [nRows, nCols] = [a.length, a[0].length];
  var [row, col] = [utils.randInt(0, nRows - 1), utils.randInt(0, nCols - 1)];

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
