export function findMinValue(items: number[]): number {
  let minValue = +Infinity;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (minValue > item) {
      minValue = item;
    }
  }

  return minValue;
}
