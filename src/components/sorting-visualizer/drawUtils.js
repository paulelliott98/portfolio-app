const { colors } = require('../../theme');

/**
 * Draw a rect of specified height, using bottom-left corner as basis
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

function drawBars(arr, drawData) {
  const left = 0;
  const gap = 1;
  const width = (drawData.w - (arr.length - 1) * gap) / arr.length;
  for (let i = 0; i < arr.length; i++) {
    // draw
    const x = left + i * width + i * gap;
    drawRectBottomLeft(
      drawData.ctx,
      x,
      drawData.h,
      width,
      drawData.barData[arr[i]].height,
      colors.neonBlue
    );
  }
}

function swap(i, j, arr) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

module.exports = {
  drawRectBottomLeft,
  makeBarData,
  drawBars,
  makeShuffledArray,
  swap,
};
