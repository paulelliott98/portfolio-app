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

module.exports = {
  sleep,
  createArray,
  isInBounds,
  changeAll,
  randInt,
  randChoice,
  randEven,
  randOdd,
};
