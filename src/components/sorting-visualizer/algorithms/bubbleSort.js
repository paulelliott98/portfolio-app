// bubble sort

import { sleep } from '../../../utils';
import { drawBars, swap } from '../drawUtils';

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
      drawData.ctx.clearRect(0, 0, drawData.w, drawData.h);
      drawBars(arr, drawData);
      if (!drawData.run) return;
      await sleep(0);
    }
    end--;
  }
}

export default bubbleSort;
