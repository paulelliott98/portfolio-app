import React, { useEffect, useRef } from 'react';
import { Grid, Typography } from '@mui/material';
import GridGlass from '../GridGlass';
import * as utils from '../../utils';
import { makeBarData, makeShuffledArray } from './drawUtils';
import bubbleSort from './algorithms/bubbleSort';
import { useCallback } from 'react';

const SortingVisualizer = ({ ...props }) => {
  const canvasRef = useRef(null);

  const n = 100;
  const arr = useRef(makeShuffledArray(n));

  const BubbleSort = useCallback((arr, drawData) => {
    const { barData, context, w, h } = drawData;
    bubbleSort(arr, {
      barData,
      context,
      w,
      h,
    });
  }, []);

  useEffect(() => {
    const [w, h] = [
      canvasRef.current.scrollWidth,
      canvasRef.current.scrollHeight,
    ];
    const scale = window.devicePixelRatio || 1;
    const canvas = utils.createHiPPICanvas(w, h, canvasRef, scale);
    const context = canvas.getContext('2d');
    const barData = makeBarData(n, h);

    BubbleSort(arr.current, {
      barData,
      context,
      w,
      h,
    });
  }, [BubbleSort]);

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
            ref={canvasRef}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </GridGlass>
        <GridGlass item container sx={{ flex: '1 1 500px' }}>
          <Typography variant="body1">Algorithm</Typography>
        </GridGlass>
      </Grid>
    </Grid>
  );
};

export default SortingVisualizer;
