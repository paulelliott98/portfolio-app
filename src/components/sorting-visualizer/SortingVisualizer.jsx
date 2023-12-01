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

const SortingVisualizer = ({ ...props }) => {
  const canvasRef = useRef(null);

  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [arraySize, setArraySize] = useState(50); // n items in array
  const arr = useRef(makeShuffledArray(arraySize));
  const drawData = useRef({});
  //   const BubbleSort = useCallback((arr, drawData) => {
  //     const { barData, ctx, w, h, run } = drawData;
  //     bubbleSort(arr, {
  //       barData,
  //       ctx,
  //       w,
  //       h,
  //       run
  //     });
  //   }, []);

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
      barData,
      ctx: context,
      w,
      h,
      run: false,
    };

    drawBars(arr.current, drawData.current);
  }, [arraySize]);

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

  function runAlgorithm() {
    drawData.current.run = false;
    if (algorithm === 'bubbleSort') {
      drawData.current.run = true;
      bubbleSort(arr.current, drawData.current);
    }
  }

  return (
    <Grid item container alignItems="center">
      <Grid
        item
        container
        justifyContent="center"
        sx={{ flexFlow: 'row nowrap', gap: '16px', height: '500px' }}
      >
        <GridGlass item container sx={{ flex: '1 1 auto', padding: '16px' }}>
          <canvas
            // width="100%"
            // height="100%"
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.25)',
            }}
          />
        </GridGlass>
        <GridGlass item container sx={{ flex: '1 1 500px' }}>
          <FormControl>
            <FormLabel>Sorting Algorithm</FormLabel>
            <RadioGroup row onChange={(e) => setAlgorithm(e.target.value)}>
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
                drawData.current.run = false;
                setArraySize(() => e.target.value);
                arr.current = makeShuffledArray(arraySize);
              }}
            />
          </FormControl>

          <Button onClick={runAlgorithm}>Run</Button>
        </GridGlass>
      </Grid>
    </Grid>
  );
};

export default SortingVisualizer;
