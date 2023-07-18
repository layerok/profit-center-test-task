let sum = 0;
let quotesCount = 0;

export const findAvg = (value: number) => {
  quotesCount++;
  sum += value;
  return sum / quotesCount;
};
