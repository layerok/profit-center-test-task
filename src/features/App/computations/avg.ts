let sum = 0;
let quotesCount = 0;
let avg = 0;

export const recalculateAvg = (value: number) => {
  quotesCount++;
  sum += value;
  avg = sum / quotesCount;
  return avg;
};

export const getAvg = () => {
  return avg;
};

export const resetAvg = () => {
  sum = 0;
  quotesCount = 0;
  avg = 0;
};
