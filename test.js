// for testing of javascript code

const arr = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];
console.log(arr);
arr[0] = arr[1];
arr[1] = { x: 0, y: 0 };
console.log(arr);
