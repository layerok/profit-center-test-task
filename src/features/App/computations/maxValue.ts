let maxValue = -Infinity;

export const recalculateMaxValue = (value: number) => {
  if (value > maxValue) {
    maxValue = value;
  }
  return maxValue;
};

export const getMaxValue = () => {
    return maxValue;
}

export const resetMaxValue = () => {
  maxValue = -Infinity;
};
