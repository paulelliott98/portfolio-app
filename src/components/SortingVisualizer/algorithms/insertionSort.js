import { drawToCanvas } from '../drawUtils';

// insertion sort
async function insertionSort(arr, drawData) {
  // return if arr has less than 2 elements
  if (arr.length < 2) return arr;

  for (let step = 1; step < arr.length; step++) {
    const key = arr[step];
    let i = step - 1;
    while (i >= 0 && key < arr[i]) {
      arr[i + 1] = arr[i];
      i--;

      // draw to canvas
      await drawToCanvas(arr, drawData, {
        // compare: { left: i + 1, right: step },
        boundary: { left: i + 1, right: step },
      });
    }
    arr[i + 1] = key;
    // draw to canvas
    await drawToCanvas(arr, drawData, {
      compare: { left: i + 1, right: step },
      boundary: { left: i + 1, right: step },
    });

    // if stop signal given, return
    if (!drawData.run.insertionSort) {
      drawToCanvas(arr, drawData);
      return;
    }
  }
  drawToCanvas(arr, drawData);
}

export default insertionSort;
