import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Button,
} from '@mui/material';
import GridGlass from '../GridGlass';
import * as utils from '../../utils';
import { drawBars, makeBarData, makeShuffledArray } from './drawUtils';
import bubbleSort from './algorithms/bubbleSort';
import quickSort from './algorithms/quickSort';

const SortingVisualizer = () => {
  const canvasRef = useRef(null);
  const [render, setRender] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [arraySize, setArraySize] = useState(50); // n items in array
  const arr = useRef(makeShuffledArray(arraySize)); // array to sort
  const arrCopy = useRef([...arr.current]); // store copy of arr to allow reset
  const minSpeed = 0;
  const maxSpeed = 100;
  const speed = useRef(maxSpeed);
  const drawData = useRef({
    run: { bubbleSort: false, quickSort: false },
  }); // all variables not part of the algorithm itself used in rendering

  // initialize variables. Re-run when variables are changed on the control panel
  useEffect(() => {
    const [w, h] = [
      canvasRef.current.scrollWidth,
      canvasRef.current.scrollHeight,
    ];
    const scale = window.devicePixelRatio || 1;
    const canvas = utils.createHiPPICanvas(w, h, canvasRef, scale);
    const context = canvas.getContext('2d');
    const barData = makeBarData(arr.current.length, h);

    drawData.current = {
      ...drawData.current,
      barData,
      ctx: context,
      w,
      h,
      speed, // ref; access using speed.current
      maxSpeed,
    };
    drawBars(arr.current, drawData.current);
  }, [arraySize, render]);

  // ---------- make canvas responsive ----------
  function handleResize() {
    canvasRef.current.style.width = '100%';
    canvasRef.current.style.height = '100%';
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  // ---------- make canvas responsive ----------

  function isRunning(algorithm) {
    return drawData.current.run[algorithm];
  }

  function stopAlgorithms() {
    drawData.current.run.bubbleSort = false;
    drawData.current.run.quickSort = false;
  }

  async function runAlgorithm() {
    if (algorithm === 'bubbleSort' && !isRunning(algorithm)) {
      drawData.current.run.bubbleSort = true;
      await bubbleSort(arr.current, drawData.current);
      drawData.current.run.bubbleSort = false;
    } else if (algorithm === 'quickSort' && !isRunning(algorithm)) {
      drawData.current.run.quickSort = true;
      await quickSort(arr.current, drawData.current);
      drawData.current.run.quickSort = false;
    }
    drawBars(arr.current, drawData.current);
  }

  function resetArray() {
    stopAlgorithms();

    arr.current = [...arrCopy.current];
    setRender((prev) => !prev);
  }

  function shuffleArray() {
    stopAlgorithms();

    arr.current = makeShuffledArray(arraySize);
    arrCopy.current = [...arr.current];
    setRender((prev) => !prev);
  }

  return (
    <Grid item container alignItems="center">
      <Grid
        item
        container
        justifyContent="center"
        sx={{ flexFlow: 'row nowrap', gap: '16px', height: '70vh' }}
      >
        <GridGlass item container sx={{ flex: '1 1 auto', padding: '16px' }}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.25)',
            }}
          />
        </GridGlass>
        <GridGlass item container sx={{ flex: '1 0 350px', padding: '1em' }}>
          <FormControl>
            <FormLabel>Sorting Algorithm</FormLabel>
            <RadioGroup
              row
              onChange={(e) => {
                stopAlgorithms();
                setAlgorithm(e.target.value);
              }}
            >
              <FormControlLabel
                checked={algorithm === 'bubbleSort'}
                value="bubbleSort"
                label="BubbleSort"
                control={<Radio />}
              />
              <FormControlLabel
                checked={algorithm === 'quickSort'}
                value="quickSort"
                label="QuickSort"
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>{`List Size: ${arraySize}`}</FormLabel>
            <Slider
              aria-label="size"
              value={arraySize}
              getAriaValueText={() => arraySize}
              valueLabelDisplay="auto"
              min={10}
              max={500}
              step={1}
              onChange={(e) => {
                stopAlgorithms();

                setArraySize(() => e.target.value);
                arr.current = makeShuffledArray(e.target.value);
                arrCopy.current = [...arr.current];
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel>
              {`Speed: ${speed.current === maxSpeed ? 'Max' : speed.current}`}
            </FormLabel>
            <Slider
              aria-label="Speed"
              value={speed.current}
              getAriaValueText={() => speed.current}
              valueLabelDisplay="auto"
              min={minSpeed}
              max={maxSpeed}
              step={1}
              onChange={(e) => {
                speed.current = e.target.value;
                drawData.current.speed.current = e.target.value;
                setRender((prev) => !prev);
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
            <Button variant="outlined" onClick={shuffleArray}>
              Shuffle
            </Button>
            <Button variant="outlined" onClick={resetArray}>
              Reset
            </Button>
            <Button variant="contained" onClick={runAlgorithm}>
              {`Run ${algorithm}`}
            </Button>
          </Grid>
        </GridGlass>
      </Grid>
    </Grid>
  );
};

export default SortingVisualizer;
