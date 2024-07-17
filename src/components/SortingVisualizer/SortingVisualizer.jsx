import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Button,
  Typography,
} from '@mui/material';
import * as utils from '../../utils';
import { drawToCanvas, makeBarData, makeShuffledArray } from './drawUtils';
import Stopwatch, { makeTimeString } from './Stopwatch';
import bubbleSort from './algorithms/bubbleSort';
import quickSort from './algorithms/quickSort';
import insertionSort from './algorithms/insertionSort';
import selectionSort from './algorithms/selectionSort';
import mergeSort from './algorithms/mergeSort';
import heapSort from './algorithms/heapSort';

const sortFunctions = {
  bubbleSort,
  quickSort,
  insertionSort,
  selectionSort,
  mergeSort,
  heapSort,
};

const SortingVisualizer = ({ ...props }) => {
  const canvasRef = useRef();
  const canvasContainerRef = useRef();

  const [render, setRender] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [arraySize, setArraySize] = useState(50); // n items in array
  const [time, setTime] = useState({ m: 0, s: 0, ms: 0 });
  const stopwatch = useRef(null);
  const arr = useRef(makeShuffledArray(arraySize)); // array to sort
  const arrCopy = useRef([...arr.current]); // store copy of arr to allow reset
  const minSpeed = 1;
  const maxSpeed = 100;
  const speed = useRef(maxSpeed);
  const drawData = useRef({
    run: { bubbleSort: false, quickSort: false },
  }); // all variables not part of the algorithm itself used in rendering

  useEffect(() => {
    stopwatch.current = new Stopwatch(setTime);
    setTime(stopwatch.current.elapsed);
  }, []);

  const tick = useCallback(() => {
    const [w, h] = [
      canvasContainerRef.current?.clientWidth,
      canvasContainerRef.current?.clientHeight,
    ];
    const scale = window.devicePixelRatio || 1;
    const canvas = utils.createHiPPICanvas(w, h, canvasRef, scale);
    const context = canvas.getContext('2d');
    const barData = makeBarData(arraySize, h);
    const barGap = 1;
    drawData.current = {
      ...drawData.current,
      barData,
      ctx: context,
      w,
      h,
      barGap,
      barWidth: (w - (arr.current.length - 1) * barGap) / arr.current.length,
      speed, // ref; access using speed.current
      maxSpeed,
    };
    drawToCanvas(arr.current, drawData.current);
  }, [canvasContainerRef, arraySize]);

  // ---------- make canvas responsive to resize ----------
  useEffect(() => {
    function handleResize() {
      tick();
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tick]);
  // ---------- make canvas responsive to resize ----------

  function isRunning(algorithm) {
    return drawData.current.run[algorithm];
  }

  // Stop running timer, but does not clear its elapsed value
  function stopTimer() {
    stopwatch.current.stop();
  }

  // Stop running timer, and clear timer's elapsed value
  function resetTimer() {
    stopwatch.current.stop();
    stopwatch.current.reset();
  }

  // Stop running all algorithms
  function stopAlgorithms() {
    for (const func in sortFunctions) {
      drawData.current.run[func] = false;
    }
    stopTimer();
    setAlgorithmRunning(() => false);
    drawToCanvas(arr.current, drawData.current);
  }

  async function runAlgorithm() {
    if (!Object.keys(sortFunctions).includes(algorithm) || isRunning(algorithm))
      return;

    setAlgorithmRunning(() => true);
    drawData.current.run[algorithm] = true;
    stopwatch.current.start();
    await sortFunctions[algorithm](arr.current, drawData.current);
    drawData.current.run[algorithm] = false;
    stopwatch.current.stop();

    drawToCanvas(arr.current, drawData.current);
    stopAlgorithms();
  }

  function resetArray() {
    stopAlgorithms();
    resetTimer();

    arr.current = [...arrCopy.current];
    setRender(() => !render);
  }

  function shuffleArray() {
    stopAlgorithms();
    resetTimer();

    arr.current = makeShuffledArray(arraySize);
    arrCopy.current = [...arr.current];
    setRender(() => !render);
  }

  return (
    <Grid
      item
      container
      className="slide-bottom"
      sx={{
        // animation: 'slideBottom 400ms ease forwards',
        height: '100%',
        backgroundColor: 'var(--bg-color-2)',
      }}
    >
      <Grid
        item
        container
        justifyContent="center"
        sx={{
          flexFlow: 'row nowrap',
          height: '100%',
        }}
      >
        <Grid
          ref={canvasContainerRef}
          item
          container
          sx={{ flex: '1 1 auto', height: '100%' }}
        >
          <canvas
            ref={canvasRef}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </Grid>
        <Grid
          item
          container
          sx={{
            flexFlow: 'column nowrap',
            gap: '2em',
            flex: '0 0 350px',
            padding: '2em',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden auto',
          }}
        >
          <FormControl>
            <FormLabel>Sorting Algorithm</FormLabel>
            <RadioGroup
              row
              onChange={(e) => {
                stopAlgorithms();
                resetArray();
                setAlgorithm(e.target.value);
              }}
            >
              {Object.keys(sortFunctions).map((item, index) => (
                <FormControlLabel
                  key={index}
                  checked={algorithm === item}
                  value={item}
                  label={`${item[0].toUpperCase()}${item.substring(1)}`}
                  control={<Radio />}
                />
              ))}
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

                // Re-render only if algorithm isn't running,
                // since forcing re-render when it is already happening will make the draws lag
                if (!algorithmRunning) setRender((b) => !b);
              }}
            />
          </FormControl>

          <Grid
            item
            container
            justifyContent="space-between"
            sx={{ flexFlow: 'column nowrap', flex: '1 1 auto' }}
          >
            <Grid
              item
              container
              sx={{
                flex: '0 1 auto',
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
              <Button
                disabled={algorithmRunning}
                variant="contained"
                onClick={runAlgorithm}
              >
                {algorithmRunning ? 'Sorting...' : `Run ${algorithm}`}
              </Button>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              justifyContent="center"
              sx={{ flex: '1 1 auto' }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'Space Mono',
                  fontSize: '20px',
                  paddingTop: '1em',
                }}
              >
                {makeTimeString(time)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SortingVisualizer;
