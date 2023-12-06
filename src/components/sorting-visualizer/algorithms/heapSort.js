import { drawToCanvas, swap } from '../drawUtils';

async function heapSort(arr, drawData) {
  await heapSortUtils(arr, arr.length - 1, drawData);
}

async function heapSortUtils(arr, end, drawData) {
  await buildMaxHeap(arr, end, drawData);

  let last = end;
  while (last > 0) {
    swap(0, last, arr); // swap

    if (!drawData.run.heapSort) return;
    await drawToCanvas(arr, drawData, { compare: { left: 0, right: last } });

    last--; // remove
    await heapify(arr, 0, last, drawData); // heapify
  }
}

async function buildMaxHeap(arr, end, drawData) {
  for (let i = Math.floor((end + 1) / 2) - 1; i >= 0; i--) {
    if (!drawData.run.heapSort) return;
    await drawToCanvas(arr, drawData);

    await heapify(arr, i, end, drawData);
  }
}

async function heapify(arr, i, n, drawData) {
  if (!drawData.run.heapSort) return;

  let largest = i;

  // left and right child
  const [left, right] = [2 * i + 1, 2 * i + 2];

  if (left <= n && arr[left] > arr[largest]) largest = left;
  if (right <= n && arr[right] > arr[largest]) largest = right;

  drawToCanvas(arr, drawData, { compare: { left: largest, right: i } });

  if (largest !== i) {
    swap(largest, i, arr);
    await drawToCanvas(arr, drawData, { compare: { left: largest, right: i } });

    await heapify(arr, largest, n, drawData);
  }
}

export default heapSort;
