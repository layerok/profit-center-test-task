let minValue = +Infinity;

export const recalculateMinValue = (value: number) => {
  if (value < minValue) {
    minValue = value;
  }
  return minValue;
};

export const getMinValue = () => {
  return minValue;
};

export const resetMinValue = () => {
  minValue = +Infinity;
};
