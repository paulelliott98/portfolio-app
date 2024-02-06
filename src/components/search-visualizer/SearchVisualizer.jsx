import React, { useState, useEffect, useRef } from 'react';
import './algoVisualizer.css';
import * as algorithms from './algorithms';
import * as mg from './mazeGenerator';
import * as utils from '../../utils';
import blocks from './blocks';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from '@mui/material';
import GridGlass from '../GridGlass';
import { colors } from '../../theme';

const DEBUG = false;

const blockColors = {
  source: '#d21f3c',
  sink: '#1aa7ec',
  visited: colors.neonPink,
  empty: '#ffffff',
  wall: '#444444',
  path: '#ffff00',
};
const blockOpacity = 'BB';

export default function SearchVisualizer(props) {
  const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const canvasRef = useRef(null);
  const scale = window.devicePixelRatio || 1;

  const [minBlockScale, maxBlockScale] = [1, 3];
  const defaultBlockScale = minBlockScale;
  const baseBlockSize = 7;
  const base = 2;
  let blockScale = useRef(defaultBlockScale);
  let blockSize = useRef(baseBlockSize * Math.pow(base, blockScale.current));
  let [nRows, nCols] = [
    useRef(Math.floor(props.h / blockSize.current)),
    useRef(Math.floor(props.w / blockSize.current)),
  ];

  let gap = useRef((props.h % blockSize.current) / (nCols.current + 1)); // gap size

  const [result, setResult] = useState('-');
  const [algorithm, setAlgorithm] = useState('bfsShortestPath');
  let run = useRef(false);

  const [sliderMin, sliderMax] = [0, 100];
  const defaultSpeed = 99;
  const speed = useRef(defaultSpeed);

  // mouse data
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
  let [isLeftMouseDown, isRightMouseDown, isShiftDown] = [
    useRef(false),
    useRef(false),
    useRef(false),
  ];

  let [hoverRow, hoverCol] = [useRef(-1), useRef(-1)];
  let isEventListenersAttached = useRef(false);

  // initialize random start and end positions
  let _start = {
    r: randomInteger(0, Math.floor((nRows.current - 1) / 2)),
    c: randomInteger(0, nCols.current - 1),
  };
  let _end = {
    r: randomInteger(
      Math.floor((nRows.current - 1) / 2) + 1,
      nRows.current - 1
    ),
    c: randomInteger(0, nCols.current - 1),
  };

  const [startPos, setStartPos] = useState(_start);
  const [endPos, setEndPos] = useState(_end);

  let tempGrid = utils.createArray(nRows.current, nCols.current);
  tempGrid[_start.r][_start.c] = 2;
  tempGrid[_end.r][_end.c] = 3;

  // array to store block states
  let [grid, setGrid] = useState(tempGrid);

  const [showInstructions, setShowInstructions] = useState(false);

  function runSearch(start, end) {
    run.current = true;
    let res = null;
    if (algorithm === 'dfs')
      res = algorithms.dfs(start, end, grid, run, speed, setGrid);
    else if (algorithm === 'bfs')
      res = algorithms.bfs(start, end, grid, run, speed, setGrid);
    else if (algorithm === 'bfsShortestPath')
      res = algorithms.bfsShortestPath(start, end, grid, run, speed, setGrid);

    return res;
  }

  function resetVisited() {
    run.current = false;

    let newGrid = [...grid];
    utils.changeAll(blocks.visited, blocks.empty, newGrid);
    utils.changeAll(blocks.path, blocks.empty, newGrid);
    setGrid(newGrid);
    setResult('-');
  }

  useEffect(() => {
    // handles logic for user interactions
    function updateGrid() {
      if (hoverRow.current === -1 || hoverCol.current === -1) return;

      let n; // type of block we want to add to grid

      if (isLeftMouseDown.current) {
        if (result !== '-') setResult('-');
        // if shift is pressed, we are adding wall (n = 4)
        if (isShiftDown.current) n = blocks.wall;
        else n = blocks.source; // source block
      } else if (isRightMouseDown.current) {
        if (result !== '-') setResult('-');
        if (isShiftDown.current) n = blocks.empty;
        else n = blocks.sink; // sink block
      } else {
        return;
      }

      const hovered = grid[hoverRow.current][hoverCol.current];

      // if same -> return
      if (n === hovered) return;

      // if clearing start point -> return
      if (hovered === blocks.source || hovered === blocks.sink) return;

      // if attempting to place start/end point on wall -> return
      if ((n === blocks.source || n === blocks.sink) && hovered === blocks.wall)
        return;

      if (hovered === blocks.source) setStartPos({ r: -1, c: -1 });
      if (hovered === blocks.sink) setEndPos({ r: -1, c: -1 });

      // if setting start/end point, remove other start/end points from grid, and set startPos
      if (n === blocks.source) {
        utils.changeAll(n, blocks.empty, grid);
        setStartPos({ r: hoverRow.current, c: hoverCol.current });
      } else if (n === blocks.sink) {
        utils.changeAll(n, blocks.empty, grid);
        setEndPos({ r: hoverRow.current, c: hoverCol.current });
      }

      // update grid with new value, and trigger a rerender
      let newGrid = [...grid];
      newGrid[hoverRow.current][hoverCol.current] = n;
      utils.changeAll(blocks.visited, blocks.empty, newGrid); // clear all visited blocks in grid
      utils.changeAll(blocks.path, blocks.empty, newGrid); // clear all path blocks in grid
      setGrid(newGrid);
      run.current = false; // stop currently running algorithms
    }

    // check if mouse is hovering over rect
    const isMouseOverBlock = (r, c) => {
      return (
        mousePos.x >= c - 0.5 * gap.current &&
        mousePos.x < c + blockSize.current + 0.5 * gap.current &&
        mousePos.y >= r - 0.5 * gap.current &&
        mousePos.y < r + blockSize.current + 0.5 * gap.current
      );
    };

    // return color based on value of grid[j][i]
    const getFillColor = (j, i) => {
      var color = '';
      // unvisited block
      if (grid[j][i] === blocks.empty) {
        color = blockColors.empty;
      }
      // visited block
      else if (grid[j][i] === blocks.visited) {
        color = blockColors.visited;
      }
      // start block
      else if (grid[j][i] === blocks.source) {
        color = blockColors.source;
      }
      // end block
      else if (grid[j][i] === blocks.sink) {
        color = blockColors.sink;
      }
      // wall block
      else if (grid[j][i] === blocks.wall) {
        color = blockColors.wall;
      }
      // path block
      else if (grid[j][i] === blocks.path) {
        color = blockColors.path;
      }

      return color.concat(blockOpacity);
    };

    const drawGrid = (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let [hoverR, hoverC, fillColor] = [null, null, null];

      for (let j = 0; j < nRows.current; j++) {
        for (let i = 0; i < nCols.current; i++) {
          const [r, c] = [
            j * (blockSize.current + gap.current),
            i * (blockSize.current + gap.current),
          ];

          ctx.beginPath();

          if (isMouseOverBlock(r, c)) {
            [hoverR, hoverC, fillColor] = [r, c, getFillColor(j, i)];
          } else {
            ctx.fillStyle = getFillColor(j, i);
            ctx.rect(c, r, blockSize.current, blockSize.current);
            ctx.fill();
          }

          if (DEBUG) {
            ctx.font = '10px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(String(grid[j][i]), c + 7, r + 14);
          }
        }
      }

      if (hoverR !== null) {
        const lineThickness = Math.min(2, blockSize.current / 10);
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.rect(
          hoverC + 0.5 * lineThickness,
          hoverR + 0.5 * lineThickness,
          blockSize.current - lineThickness,
          blockSize.current - lineThickness
        );
        ctx.fill();

        ctx.lineWidth = lineThickness;
        ctx.strokeStyle = '#00ff00ff';
        ctx.stroke();
      }
    };

    function handleMouseMove(e, canvas) {
      const rect = canvas.getBoundingClientRect();
      const [relX, relY] = [
        Math.floor(e.clientX - rect.left),
        Math.floor(e.clientY - rect.top),
      ];
      setMousePos({
        x: relX,
        y: relY,
      });

      // update mouse hover position (hoverRow and hoverCol)
      let [r, c] = [-1, -1];
      r = Math.floor(relY / (blockSize.current + gap.current));
      c = Math.floor(relX / (blockSize.current + gap.current));

      if (r < 0 || c < 0 || r >= nRows.current || c >= nCols.current) {
        hoverRow.current = -1;
        hoverCol.current = -1;
        return;
      }

      hoverRow.current = r;
      hoverCol.current = c;
    }

    function handleKeyDown(e, canvas) {
      if (e.keyCode === 16) {
        isShiftDown.current = true;
        updateGrid();
      }

      // return if click did not occur within canvas
      const rect = canvas.getBoundingClientRect();
      if (
        !(
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        )
      )
        return;

      e.preventDefault();

      // left
      if (e.button === 0) isLeftMouseDown.current = true;
      // right
      else isRightMouseDown.current = true;

      const [currX, currY] = [
        Math.floor(e.clientX - rect.left),
        Math.floor(e.clientY - rect.top),
      ];

      setMousePos({ x: currX, y: currY });
    }

    function handleKeyRelease(e, canvas) {
      if (e.keyCode === 16) {
        isShiftDown.current = false;
        updateGrid();
      }

      e.preventDefault();

      const rect = canvas.getBoundingClientRect();

      if (e.button === 0) {
        isLeftMouseDown.current = false; // left
      } else {
        isRightMouseDown.current = false; // right
      }

      const [currX, currY] = [
        Math.floor(e.clientX - rect.left),
        Math.floor(e.clientY - rect.top),
      ];

      if (mousePos.x !== currX && mousePos.y !== currY) {
        setMousePos({ x: currX, y: currY });
      }
    }

    const canvas = utils.createHiPPICanvas(props.w, props.h, canvasRef, scale);
    const context = canvas.getContext('2d');

    if (!isEventListenersAttached.current) {
      window.addEventListener('mousemove', (e) => {
        handleMouseMove(e, canvas);
      });

      window.addEventListener('contextmenu', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          e.preventDefault();
        }
      });
      window.addEventListener('mousedown', (e) => {
        handleKeyDown(e, canvas);
      });
      window.addEventListener('keydown', (e) => {
        handleKeyDown(e, canvas);
      });
      window.addEventListener('mouseup', (e) => {
        handleKeyRelease(e, canvas);
      });
      window.addEventListener('keyup', (e) => {
        handleKeyRelease(e, canvas);
      });
    }

    isEventListenersAttached.current = true;
    updateGrid();
    drawGrid(context, canvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleKeyDown);
      window.removeEventListener('mouseup', handleKeyRelease);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [
    props,
    nRows,
    nCols,
    scale,
    grid,
    blockSize,
    blockScale,
    algorithm,
    mousePos,
    hoverRow,
    hoverCol,
    isLeftMouseDown,
    isRightMouseDown,
    isShiftDown,
    result,
    speed,
    gap,
  ]);

  return (
    <Grid
      item
      container
      alignItems="center"
      style={{ animation: 'scaleIn 200ms ease' }}
    >
      <Grid
        item
        container
        justifyContent="center"
        sx={{ flexFlow: 'row nowrap', gap: '16px', height: 'min-content' }}
      >
        <Grid
          item
          container
          justifyContent="center"
          sx={{ flexFlow: 'column nowrap', width: 'fit-content' }}
        >
          <canvas className="bfs-canvas" ref={canvasRef} {...props} />
          <div
            className="flex justify-between"
            style={{ width: `${props.w}px` }}
          >
            <div>
              <Typography variant="body1">
                {hoverRow.current !== -1
                  ? `${hoverRow.current}, ${hoverCol.current}`
                  : null}
              </Typography>
            </div>
            <a
              href="/#"
              rel="noopener noreferrer"
              className=""
              onClick={(e) => e.preventDefault()}
              onMouseOver={() => {
                setShowInstructions(true);
              }}
              onMouseLeave={() => {
                setShowInstructions(false);
              }}
            >
              Help
            </a>
          </div>
        </Grid>

        <Grid
          item
          container
          style={{ height: `${props.h}px`, flex: '0 1 350px' }}
        >
          {showInstructions ? (
            <GridGlass item container style={{ padding: '1em' }}>
              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.source}${blockOpacity}`,
                  }}
                />
                <Typography>Source – Left Click</Typography>
              </div>

              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.sink}${blockOpacity}`,
                  }}
                />
                <Typography>Destination – Right Click</Typography>
              </div>

              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.wall}${blockOpacity}`,
                  }}
                />
                <Typography>Wall – Shift + Left Click</Typography>
              </div>

              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.empty}${blockOpacity}`,
                  }}
                />
                <Typography>Empty – Shift + Right Click</Typography>
              </div>

              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.visited}${blockOpacity}`,
                  }}
                />
                <Typography>Visited</Typography>
              </div>

              <div className="flex gap-4">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    minWidth: '24px',
                    minHeight: '24px',
                    backgroundColor: `${blockColors.path}${blockOpacity}`,
                  }}
                />
                <Typography>Path</Typography>
              </div>
            </GridGlass>
          ) : (
            <Grid
              item
              container
              style={{ flexFlow: 'column nowrap', gap: '16px' }}
            >
              <GridGlass
                item
                container
                style={{ flex: '1 1 auto', padding: '1em' }}
              >
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  style={{
                    flex: '1 1 auto',
                    flexFlow: 'column nowrap',
                    gap: '16px',
                  }}
                >
                  <FormControl>
                    <FormLabel>Search Algorithm</FormLabel>
                    <RadioGroup
                      row
                      onChange={(e) => {
                        setAlgorithm(e.target.value);
                        setResult('-');
                      }}
                    >
                      <FormControlLabel
                        checked={algorithm === 'bfsShortestPath'}
                        value="bfsShortestPath"
                        label="BFS Shortest Path"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        checked={algorithm === 'dfs'}
                        value="dfs"
                        label="DFS"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      Block Size: {Math.round(blockSize.current)}
                    </FormLabel>
                    <Slider
                      aria-label="Block Size"
                      defaultValue={defaultBlockScale}
                      getAriaValueText={() => blockSize.current}
                      valueLabelDisplay="auto"
                      min={minBlockScale}
                      max={maxBlockScale}
                      marks
                      valueLabelFormat={(val) => <div>{blockSize.current}</div>}
                      onChange={(e) => {
                        e.preventDefault();
                        const val = parseInt(e.target.value);
                        blockScale.current = val;

                        run.current = false;
                        setResult('-');

                        blockSize.current = baseBlockSize * Math.pow(base, val);
                        nRows.current = Math.floor(props.h / blockSize.current);
                        nCols.current = Math.floor(props.w / blockSize.current);
                        gap.current =
                          (props.h % blockSize.current) / (nCols.current + 1);

                        // initialize random start and end positions
                        _start = {
                          r: randomInteger(
                            0,
                            Math.floor((nRows.current - 1) / 2)
                          ),
                          c: randomInteger(0, nCols.current - 1),
                        };

                        _end = {
                          r: randomInteger(
                            Math.floor((nRows.current - 1) / 2) + 1,
                            nRows.current - 1
                          ),
                          c: randomInteger(0, nCols.current - 1),
                        };

                        let tempGrid = utils.createArray(
                          nRows.current,
                          nCols.current
                        );
                        tempGrid[_start.r][_start.c] = blocks.source;
                        tempGrid[_end.r][_end.c] = blocks.sink;

                        setStartPos(_start);
                        setEndPos(_end);
                        setGrid(tempGrid);
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      {`Speed: ${
                        speed.current === sliderMax
                          ? 'Max'
                          : `${speed.current} / ${sliderMax}`
                      }`}
                    </FormLabel>
                    <Slider
                      aria-label="Speed"
                      value={speed.current}
                      getAriaValueText={() => speed.current}
                      valueLabelDisplay="auto"
                      min={sliderMin}
                      max={sliderMax}
                      step={1}
                      onChange={(e) => {
                        speed.current = e.target.value;
                      }}
                    />
                  </FormControl>

                  <Grid
                    item
                    container
                    style={{
                      flex: '1 1 auto',
                      flexFlow: 'column nowrap',
                      justifyContent: 'flex-end',
                      gap: '8px',
                    }}
                  >
                    <Button variant="outlined" onClick={resetVisited}>
                      Clear Visited
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        resetVisited();
                        utils.changeAll(blocks.wall, blocks.empty, grid);
                      }}
                    >
                      Clear Walls
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        resetVisited();

                        const obj = mg.generateMaze(
                          nRows.current,
                          nCols.current
                        );

                        setStartPos(obj.startPos);
                        setEndPos(obj.endPos);
                        setGrid(obj.grid);
                      }}
                    >
                      Generate Maze
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (startPos.r === -1 || run.current) return;

                        resetVisited();

                        runSearch(startPos, endPos).then((res) => {
                          setResult(res);
                          run.current = false;
                        });
                      }}
                    >
                      Begin Search
                    </Button>
                  </Grid>
                </Grid>
              </GridGlass>
              <GridGlass item container style={{ padding: '1em' }}>
                <Typography variant="subtitle1">
                  {algorithm === 'bfsShortestPath'
                    ? `Shortest Path: ${result}${
                        isNaN(result) ? '' : ' blocks'
                      }`
                    : `Path Exists: ${result}`}
                </Typography>
              </GridGlass>
            </Grid>
          )}
        </Grid>

        {DEBUG === false ? null : (
          <div className="mx-3 w-70">
            <div>
              <div>
                Keys Down:
                {` ${String(isLeftMouseDown.current)}, ${String(
                  isRightMouseDown.current
                )}, ${String(isShiftDown.current)}`}
              </div>
              <div>
                Grid Val:
                {hoverRow.current !== -1 &&
                hoverRow.current < nRows.current &&
                hoverCol.current < nCols.current
                  ? ` ${grid[hoverRow.current][hoverCol.current]}, (${
                      hoverRow.current
                    }, ${hoverCol.current})`
                  : ''}
              </div>
              <div>nRows, nCols: {`(${nRows.current}, ${nCols.current})`}</div>
              <div>
                Grid Dimensions: {`(${grid.length}, ${grid[0].length})`}
              </div>
              <div>Block Scale: {blockScale.current}</div>
              <div>Block Size: {blockSize.current}</div>
            </div>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
