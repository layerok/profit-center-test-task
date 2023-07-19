let oddValues = 0;

export const recalculateOddValues = (value: number) => {
  if (value % 2 !== 0) {
    oddValues++;
  }
  return oddValues;
};

export const getOddValues = () => {
  return oddValues;
}

export const resetOddValues = () => {
  oddValues = 0;
}
