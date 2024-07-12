import { drawToCanvas, swap } from '../drawUtils';

// bubble sort
async function bubbleSort(arr, drawData) {
  if (arr.length < 2) return arr;

  let end = arr.length - 1;

  while (end > 0) {
    for (let i = 0; i < end; i++) {
      const [left, right] = [i, i + 1];
      if (arr[right] < arr[left]) {
        swap(right, left, arr);
      }

      // draw to canvas
      if (!drawData.run.bubbleSort) return;
      await drawToCanvas(arr, drawData, {
        compare: { left, right },
        boundary: { left: 0, right: end },
      });
    }
    end--;
  }
}

export default bubbleSort;
