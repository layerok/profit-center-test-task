let modeMap: Record<number, number> = {};
let maxCount = 0;
let mode = 0;

export const recalculateMode = (value: number): number => {
  let count = modeMap[value] || 0;
  modeMap[value] = ++count;

  if (count > maxCount) {
    mode = value;
    maxCount = count;
  }
  return mode;
};

export const getMode = () => {
  return mode;
}

export const getModeCount = () => {
  return maxCount;
};

export const resetMode = () => {
  mode = 0;
  maxCount = 0;
  modeMap = {};
};
