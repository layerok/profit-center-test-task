const modeMap: Record<number, number> = {};
let maxCount = 0;
let mode = 0;

export const findMode = (value: number): number => {
  let count = modeMap[value] || 0;
  modeMap[value] = ++count;

  if (count > maxCount) {
    mode = value;
    maxCount = count;
  }
  return mode;
};

export const getLastModeCount = () => {
  return maxCount;
};
