const { colors } = require('../../theme');
const { sleep } = require('../../utils');

/**
 * Draw a rect of specified dimensions and color, using bottom-left corner as basis
 * @param {*} ctx - Context
 * @param {*} x - Left edge x value
 * @param {*} y - Bottom edge y value
 * @param {*} width - Width (pixels)
 * @param {*} height - Height (pixels)
 * @param {*} color - Fill color for rect
 */
function drawRectBottomLeft(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x, y - height, width, height);
  ctx.fill();
}

function makeBarData(n, maxHeight) {
  const minHeight = Math.round(0.05 * maxHeight);
  const step = (maxHeight - minHeight) / (n - 1);
  const bars = {};
  for (let val = 0; val < n; val++) {
    const height = minHeight + val * step;
    bars[val] = { height };
  }
  return bars;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Create a shuffled array containing 0 to n-1
 * @param {*} n - Array size
 * @returns Shuffled array
 */
function makeShuffledArray(n) {
  const arr = Array.from(Array(n).keys());
  return shuffle(arr);
}

/**
 * Return bar color based on its index
 * @param {*} i
 * @param {*} sortData
 * @returns - Color
 */
function getBarColor(i, sortData) {
  const defaultColor = colors.neonPink;
  if (!sortData || !sortData.compare) return defaultColor; // default

  const colorsMap = {
    left: colors.neonGreen,
    right: colors.neonGreen,
    mid: colors.neonBlue,
  };

  for (let k in sortData.compare) {
    if (i === sortData.compare[k]) return colorsMap[k];
  }

  return defaultColor;
  //   if (Object.values(sortData.compare).includes(i)) {
  //     return colors[]
  //   }
  //   return Object.values(sortData.compare).includes(i);
}

function drawBars(arr, drawData, sortData) {
  const left = 0;
  for (let i = 0; i < arr.length; i++) {
    // draw
    const x = left + i * drawData.barWidth + i * drawData.barGap;
    drawRectBottomLeft(
      drawData.ctx,
      x,
      drawData.h,
      drawData.barWidth,
      drawData.barData[arr[i]]?.height || 0,
      getBarColor(i, sortData)
    );
  }
}

/**
 * Highlight a region on the canvas showing the section of array the sort algorithm is operating on
 */
function drawWindow(drawData, sortData) {
  if (!sortData || !sortData.boundary) return;
  const span = Math.abs(sortData.boundary.right - sortData.boundary.left) + 1;
  const highlightLeft =
    sortData.boundary.left * drawData.barWidth +
    (sortData.boundary.left - 1) * drawData.barGap;
  const highlightWidth = (drawData.barGap + drawData.barWidth) * span;
  drawRectBottomLeft(
    drawData.ctx,
    highlightLeft,
    drawData.h,
    highlightWidth,
    drawData.h,
    'rgba(68, 255, 76, 0.1)'
  );
}

function swap(i, j, arr) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Draw
 * @param {*} arr
 * @param {*} drawData
 * @param {{ compare: { left: Number, right: Number}, boundary: { left: Number, right: Number} }} sortData - Index of items currently being swapped
 */
async function drawToCanvas(arr, drawData, sortData) {
  drawData.ctx.clearRect(0, 0, drawData.w, drawData.h);
  drawWindow(drawData, sortData);
  drawBars(arr, drawData, sortData);
  await sleep((drawData.maxSpeed - drawData.speed.current) * 2);
}

module.exports = {
  drawRectBottomLeft,
  makeBarData,
  drawBars,
  makeShuffledArray,
  swap,
  drawToCanvas,
};
