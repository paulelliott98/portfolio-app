import { colors } from '../../theme';
import blocks from './blocks';
import { randInt, createArray } from '../../utils';

const blockColors = {
  source: '#d21f3c',
  sink: '#1aa7ec',
  visited: colors.neonPink,
  empty: '#ffffff',
  wall: '#444444',
  path: '#ffff00',
};

const blockOpacity = 'ee';

// return color based on value of grid[j][i]
const getFillColor = (j, i, grid) => {
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

// check if mouse is hovering over rect
const isMouseOverBlock = (r, c, blockSize, gap, mousePosition) => {
  return (
    mousePosition.x >= c - 0.5 * gap &&
    mousePosition.x < c + blockSize + 0.5 * gap &&
    mousePosition.y >= r - 0.5 * gap &&
    mousePosition.y < r + blockSize + 0.5 * gap
  );
};

const drawGrid = (
  ctx,
  grid,
  blockSize,
  gap,
  canvasDimensions,
  mousePosition
) => {
  if (!grid || !grid.length) return;

  const [nRows, nCols] = [grid.length, grid[0].length];
  ctx.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
  let [hoverR, hoverC, fillColor] = [null, null, null];

  for (let j = 0; j < nRows; j++) {
    for (let i = 0; i < nCols; i++) {
      const [r, c] = [j * (blockSize + gap), i * (blockSize + gap)];

      ctx.beginPath();

      if (isMouseOverBlock(r, c, blockSize, gap, mousePosition)) {
        [hoverR, hoverC, fillColor] = [r, c, getFillColor(j, i, grid)];
      }
      ctx.fillStyle = getFillColor(j, i, grid);
      ctx.rect(c, r, blockSize, blockSize);
      ctx.fill();
    }
  }

  if (hoverR !== null) {
    const lineThickness = Math.min(2, blockSize / 8);
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.rect(
      hoverC + 0.5 * lineThickness,
      hoverR + 0.5 * lineThickness,
      blockSize - lineThickness,
      blockSize - lineThickness
    );
    ctx.fill();

    ctx.lineWidth = lineThickness;
    ctx.strokeStyle = '#00ff00ff';
    ctx.stroke();
  }
};

/**
 * Calculate how many cols and rows can fit into canvas based on canvas container dimensions
 * @param {*} canvasDimensions
 * @param {*} gap
 * @param {*} blockSize
 * @returns
 */
const calculateGridDimensions = (canvasDimensions, gap, blockSize) => {
  return {
    rows: Math.floor((canvasDimensions.height - gap) / (blockSize + gap)),
    cols: Math.floor((canvasDimensions.width - gap) / (blockSize + gap)),
  };
};

/**
 * Create grid that fits into canvas container and init random start and end blocks,
 * returning [grid, startPosition, endPosition]
 */
const initializeGrid = (canvasDimensions, gap, blockSize) => {
  // Calculate how many cols and rows can fit into canvas based on canvas container dimensions
  const { rows, cols } = calculateGridDimensions(
    canvasDimensions,
    gap,
    blockSize
  );

  // Create array
  const temp = createArray(rows, cols);

  // Initialize source and sink blocks at random positions
  const startPosition = {
    r: randInt(0, Math.floor(Math.max(rows - 1, 0) / 2)),
    c: randInt(0, Math.max(cols - 1, 0)),
  };
  const endPosition = {
    r: randInt(Math.floor(Math.max(rows - 1, 0) / 2) + 1, rows - 1),
    c: randInt(0, Math.max(cols - 1, 0)),
  };
  temp[startPosition.r][startPosition.c] = blocks.source;
  temp[endPosition.r][endPosition.c] = blocks.sink;

  return [temp, startPosition, endPosition];
};

export {
  blockColors,
  blockOpacity,
  getFillColor,
  isMouseOverBlock,
  drawGrid,
  calculateGridDimensions,
  initializeGrid,
};
