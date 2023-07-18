let sum = 0;
let avg = 0;
let quotesCount = 0;

let temp = 0;

export const findStandardDeviation = (value: number): null | number => {
  quotesCount++;
  sum += value;

  avg = sum / quotesCount;

  const diff = value - avg;

  temp += diff * diff;

  if (quotesCount > 1) {
    return Math.sqrt(temp / (quotesCount - 1));
  }
  return null;
};
