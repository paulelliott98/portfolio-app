import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
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
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from '@mui/material';
import HelpOutline from '@mui/icons-material/Help';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  blockColors,
  blockOpacity,
  drawGrid,
  initializeGrid,
} from './drawUtils';

export default function SearchVisualizer({ ...props }) {
  const canvasRef = useRef();
  const canvasContainerRef = useRef();

  const scale = window.devicePixelRatio || 1;

  const [minBlockScale, maxBlockScale] = [1, 3];
  const defaultBlockScale = minBlockScale;
  const baseBlockSize = 7;
  const base = 2;
  const blockScale = useRef(defaultBlockScale);
  const blockSize = useRef(baseBlockSize * Math.pow(base, blockScale.current));

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  const gap = useRef(0.5);

  const [result, setResult] = useState('-');
  const [algorithm, setAlgorithm] = useState('bfsShortestPath');
  const run = useRef(false);

  const [sliderMin, sliderMax] = [0, 100];
  const defaultSpeed = 99;
  const speed = useRef(defaultSpeed);

  // mouse data
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  let [isLeftMouseDown, isRightMouseDown, isShiftDown] = [
    useRef(false),
    useRef(false),
    useRef(false),
  ];

  let [hoverRow, hoverCol] = [useRef(0), useRef(0)];

  // array to store block states
  const [grid, setGrid] = useState([[]]);
  const [startPos, setStartPos] = useState({ r: 0, c: 0 });
  const [endPos, setEndPos] = useState({ r: 0, c: 0 });

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

  const updateGrid = useCallback(() => {
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
  }, [
    grid,
    hoverCol,
    hoverRow,
    isLeftMouseDown,
    isRightMouseDown,
    isShiftDown,
    result,
  ]);

  const createNewGrid = (lastGrid) => {
    if (
      canvasDimensions.width < blockSize.current ||
      canvasDimensions.height < blockSize.current
    )
      return;
    let [newGrid, newStartPos, newEndPos] = initializeGrid(
      canvasDimensions,
      gap.current,
      blockSize.current
    );
    if (lastGrid && lastGrid.length && lastGrid[0].length) {
      for (let i = 0; i < lastGrid.length; i++) {
        for (let j = 0; j < lastGrid[i].length; j++) {
          if (i >= newGrid.length || j >= newGrid[0].length) continue;
          const block = lastGrid[i][j];

          // Update newStartPos and newEndPos if we encounter them, and erase the old one from newGrid
          if (block === blocks.source) {
            utils.changeAll(block, blocks.empty, newGrid);
            newStartPos = { r: i, c: j };
          } else if (block === blocks.sink) {
            utils.changeAll(block, blocks.empty, newGrid);
            newEndPos = { r: i, c: j };
          }

          newGrid[i][j] = block;
        }
      }
    }

    newGrid[newStartPos.r][newStartPos.c] = blocks.source;
    newGrid[newEndPos.r][newEndPos.c] = blocks.sink;
    setGrid(newGrid);
    setStartPos(newStartPos);
    setEndPos(newEndPos);
  };

  // when canvas dimensions change on resize, create new grid only if nCols or nRows changes
  useEffect(() => {
    if (canvasDimensions.width && canvasDimensions.height) {
      createNewGrid(grid);
    } else {
      createNewGrid();
    }
  }, [canvasDimensions]); //eslint-disable-line

  useEffect(() => {
    function handleResize() {
      const [width, height] = [
        canvasContainerRef.current?.clientWidth || 0,
        canvasContainerRef.current?.clientHeight || 0,
      ];

      setCanvasDimensions({ width, height });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Attach event listeners
  useEffect(() => {
    const canvas = utils.createHiPPICanvas(
      canvasDimensions.width,
      canvasDimensions.height,
      canvasRef,
      scale
    );

    const handleMouseMove = (canvas) => (e) => {
      const rect = canvas.getBoundingClientRect();
      const [nRows, nCols] = [grid.length, grid[0].length];

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

      if (r < 0 || c < 0 || r >= nRows || c >= nCols) {
        hoverRow.current = -1;
        hoverCol.current = -1;
        return;
      }

      hoverRow.current = r;
      hoverCol.current = c;
    };

    function handleKeyDown(e) {
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

    function handleKeyRelease(e) {
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

    function handleContextMenu(e) {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        e.preventDefault();
      }
    }

    const tick = () => {
      const [width, height] = [
        canvasContainerRef.current?.clientWidth,
        canvasContainerRef.current?.clientHeight,
      ];

      const canvas = utils.createHiPPICanvas(width, height, canvasRef, scale);
      const context = canvas.getContext('2d');

      // Center-align canvas grid inside canvas element
      const canvasOnlyDimensions = {
        width: grid[0].length * (blockSize.current + gap.current) + gap.current,
        height: grid.length * (blockSize.current + gap.current) + gap.current,
      };

      context.translate(
        (canvasDimensions.width - canvasOnlyDimensions.width) / 2,
        (canvasDimensions.height - canvasOnlyDimensions.height) / 2
      );

      updateGrid();
      drawGrid(
        context,
        grid,
        blockSize.current,
        gap.current,
        canvasDimensions,
        mousePos
      );
    };

    tick();

    const mouseMoveHandler = handleMouseMove(canvas);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousedown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleKeyRelease);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousedown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleKeyRelease);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [
    canvasDimensions,
    grid,
    hoverCol,
    hoverRow,
    isLeftMouseDown,
    isRightMouseDown,
    isShiftDown,
    mousePos,
    scale,
    updateGrid,
  ]);

  const tileDetails = useMemo(() => {
    const tileData = [
      {
        color: blockColors.source,
        text: 'Source – Left Click',
      },
      {
        color: blockColors.sink,
        text: 'Destination – Right Click',
      },
      {
        color: blockColors.wall,
        text: 'Wall – Shift + Left Click',
      },
      {
        color: blockColors.empty,
        text: 'Empty – Shift + Right Click',
      },
      {
        color: blockColors.visited,
        text: 'Visited',
      },
      {
        color: blockColors.path,
        text: 'Path',
      },
    ];

    return tileData.map((item, index) => (
      <Grid
        key={index}
        item
        container
        alignItems="center"
        sx={{ gap: '1em', animation: 'slideBottom 400ms ease forwards' }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: `${item.color}${blockOpacity}`,
          }}
        />
        <Typography>{item.text}</Typography>
      </Grid>
    ));
  }, []);

  return (
    <Grid
      item
      container
      alignItems="center"
      sx={{
        height: '100%',
        backgroundColor: 'var(--bg-color-2)',
      }}
    >
      <Grid
        item
        container
        justifyContent="center"
        sx={{ flexFlow: 'row nowrap', height: '100%' }}
      >
        <Grid
          className="slide-bottom"
          ref={canvasContainerRef}
          item
          container
          sx={{ flex: '1 1 auto', maxHeight: '100%', maxWidth: '100%' }}
        >
          <canvas
            className="bfs-canvas"
            ref={canvasRef}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </Grid>
        <Grid
          item
          container
          style={{
            height: `100%`,
            flex: '0 0 350px',
            padding: '2em',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden auto',
          }}
        >
          {showInstructions ? (
            <Grid
              item
              container
              className="slide-bottom"
              sx={{
                flexDirection: 'column',
              }}
            >
              <Grid item sx={{ paddingBottom: '2em' }}>
                <IconButton
                  onClick={() => setShowInstructions(false)}
                  sx={{ padding: 0 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>

              <Grid item container sx={{ direction: 'column', gap: '4px' }}>
                {tileDetails}
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              sx={{
                flexFlow: 'column nowrap',
                gap: '16px',
              }}
            >
              <Grid
                item
                container
                style={{ flex: '0 1 auto' }}
                className="slide-bottom"
              >
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  style={{
                    flex: '1 1 auto',
                    flexFlow: 'column nowrap',
                    gap: '2em',
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
                        createNewGrid(grid);
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

                  <Button
                    sx={{ color: 'white', width: 'fit-content', padding: 0 }}
                    startIcon={<HelpOutline />}
                    onClick={() => setShowInstructions(true)}
                  >
                    Help
                  </Button>

                  <Grid
                    item
                    container
                    style={{
                      flex: '0 1 auto',
                      flexFlow: 'column nowrap',
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
                        const [nRows, nCols] = [grid.length, grid[0].length];
                        const obj = mg.generateMaze(nRows, nCols);

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
              </Grid>

              <Grid
                className="slide-bottom"
                item
                container
                sx={{ flex: '1 1 auto' }}
              >
                <Grid item sx={{ width: '100%' }}>
                  <Grid
                    sx={{
                      background: 'rgb(255 255 255 / 5%)',
                      width: '100%',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      position: 'relative',
                      marginTop: '1em',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        lineHeight: 1,
                        opacity: 0.9,
                        position: 'absolute',
                      }}
                    >
                      {algorithm === 'bfsShortestPath'
                        ? `Shortest Path`
                        : 'Path Exists'}
                    </Typography>
                    <Typography sx={{ paddingTop: '1em', lineHeight: 1 }}>
                      {`${result}${isNaN(result) ? '' : ' blocks'}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
