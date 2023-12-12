import { drawToCanvas, swap } from '../drawUtils';

// selection sort
async function selectionSort(arr, drawData) {
  if (arr.length < 2) return;

  for (let boundary = 0; boundary < arr.length; boundary++) {
    let [index, key] = [boundary, arr[boundary]];

    // find minimum in unsorted subarray
    for (let i = boundary; i < arr.length; i++) {
      if (arr[i] < key) {
        [index, key] = [i, arr[i]];
      }

      if (!drawData.run.selectionSort) return;
      await drawToCanvas(arr, drawData, {
        compare: { left: boundary, right: index },
        boundary: { left: boundary, right: i },
      });
    }
    swap(boundary, index, arr);
    await drawToCanvas(arr, drawData, {
      compare: { left: boundary, right: index },
    });
  }
}

export default selectionSort;
