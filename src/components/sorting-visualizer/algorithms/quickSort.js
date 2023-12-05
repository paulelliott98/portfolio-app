import { drawToCanvas, swap } from '../drawUtils';

// quicksort
async function quickSort(arr, drawData) {
  await quickSortUtil(arr, 0, arr.length - 1, drawData);
  drawToCanvas(arr, drawData);
}

async function quickSortUtil(arr, l, r, drawData) {
  if (arr.length < 2 || l >= r) return;
  if (!drawData.run.quickSort) return;

  const p = await partition(arr, l, r, drawData);
  await quickSortUtil(arr, l, p, drawData);
  await quickSortUtil(arr, p + 1, r, drawData);
}

// Hoare's partition
async function partition(arr, l, r, drawData) {
  const mid = Math.floor((l + r) / 2); // middle index
  const pivot = arr[mid];

  let [left, right] = [l - 1, r + 1];

  while (true) {
    do {
      left++;
      // draw to canvas
      await drawToCanvas(arr, drawData, {
        compare: { left, right, mid },
        boundary: { left: l, right: r },
      });
    } while (arr[left] < pivot);

    do {
      right--;
      // draw to canvas
      await drawToCanvas(arr, drawData, {
        compare: { left, right, mid },
        boundary: { left: l, right: r },
      });
    } while (arr[right] > pivot);

    if (left >= right) {
      drawToCanvas(arr, drawData);
      return right;
    }
    swap(left, right, arr);

    // draw to canvas
    await drawToCanvas(arr, drawData, {
      compare: { left, right, mid },
      boundary: { left: l, right: r },
    });
    if (!drawData.run.quickSort) return;
  }
}

export default quickSort;
