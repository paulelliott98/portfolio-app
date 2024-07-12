import { drawToCanvas } from '../drawUtils';

async function mergeSort(arr, drawData) {
  await mergeSortUtils(arr, 0, arr.length - 1, drawData);
}

async function mergeSortUtils(arr, l, r, drawData) {
  if (l >= r) return;
  // Return if stop signal given
  if (!drawData.run.mergeSort) return;

  const m = Math.floor((l + r) / 2);
  await mergeSortUtils(arr, l, m, drawData);
  await mergeSortUtils(arr, m + 1, r, drawData);
  await merge(arr, l, m, r, drawData);
}

async function merge(arr, l, m, r, drawData) {
  const temp = [];
  let [lptr, rptr] = [l, m + 1];
  while (lptr <= m || rptr <= r) {
    // Return if stop signal given
    if (!drawData.run.mergeSort) return;
    await drawToCanvas(arr, drawData, {
      compare: { mid: m, left: l + temp.length },
      boundary: { left: l, right: r },
    });

    if (lptr > m) {
      temp.push(arr[rptr]);
      rptr++;
    } else if (rptr > r) {
      temp.push(arr[lptr]);
      lptr++;
    } else {
      // compare
      if (arr[lptr] < arr[rptr]) {
        temp.push(arr[lptr]);
        lptr++;
      } else {
        temp.push(arr[rptr]);
        rptr++;
      }
    }
  }

  // Return if stop signal given
  if (!drawData.run.mergeSort) return;

  let i = 0;
  while (i < temp.length) {
    await drawToCanvas(arr, drawData, {
      compare: { left: l + i, mid: m },
      boundary: { left: l, right: r },
    });

    arr[l + i] = temp[i];
    i++;
  }
}

export default mergeSort;
