function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// helper function to create an r x c array
function createArray(r, c, ph = 0) {
  var arr = [];

  for (let i = 0; i < r; i++) {
    var row = [];
    for (let j = 0; j < c; j++) {
      row.push(ph);
    }
    arr.push(row);
  }

  return arr;
}

function isInBounds(r, c, grid) {
  if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) return true;
  return false;
}

// set all v1's in grid to v2
function changeAll(v1, v2, grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === v1) {
        grid[r][c] = v2;
      }
    }
  }
}

// random integer generator
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// choose random item from list
function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// random even integer generator
function randEven(min, max) {
  let n = randInt(min, max);
  if (n % 2 !== 0) {
    if (n - 1 >= min) return n - 1;
    return n + 1;
  }
  return n;
}

// random odd integer generator
function randOdd(min, max) {
  let n = randInt(min, max);
  if (n % 2 === 0) {
    if (n - 1 >= min) return n - 1;
    return n + 1;
  }
  return n;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isInViewport(x, y) {
  if (x >= 0 && x <= 100 && y >= 0 && y <= 100) return true;
  return false;
}

// return height of page
function getPageHeight(document) {
  let body = document.body,
    html = document.documentElement;

  let documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  return documentHeight;
}

// create HD canvas
function createHiPPICanvas(w, h, canvasRef, scale) {
  let cv = canvasRef.current;
  cv.width = w * scale;
  cv.height = h * scale;
  cv.style.width = w + 'px';
  cv.style.height = h + 'px';
  cv.getContext('2d').scale(scale, scale);
  return cv;
}

module.exports = {
  sleep,
  createArray,
  isInBounds,
  changeAll,
  randInt,
  randChoice,
  randEven,
  randOdd,
  shuffleArray,
  isInViewport,
  getPageHeight,
  createHiPPICanvas,
};
