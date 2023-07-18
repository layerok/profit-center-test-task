let oddValues = 0;

export const findOddValues = (value: number) => {
  if (value % 2 !== 0) {
    oddValues++;
  }
  return oddValues;
};
