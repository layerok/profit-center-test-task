export function findMode(items: number[]): {
  value: number;
  count: number;
} {
  let map: Record<number, number> = {};
  let maxCount = 0;
  let mode = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    let count = map[item] || 0;
    
    count++;

    map[item] = count;

    if (count > maxCount) {
      mode = item;
      maxCount = count;
    }
  }

  return {
    value: mode,
    count: maxCount,
  };
}
