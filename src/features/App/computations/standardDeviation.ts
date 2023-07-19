let sum = 0;
let avg = 0;
let quotesCount = 0;

let temp = 0;
let standardDeviation: null | number = null;

export const recalculateStandardDeviation = (value: number): null | number => {
  quotesCount++;
  sum += value;

  avg = sum / quotesCount;

  const diff = value - avg;

  temp += diff * diff;

  if (quotesCount > 1) {
    standardDeviation = Math.sqrt(temp / (quotesCount - 1));
  }
  return standardDeviation;
};

export const getStandardDeviation = () => {
  return standardDeviation;
}

export const resetStandardDeviation = () => {
  sum = 0;
  avg = 0;
  quotesCount = 0;
  temp = 0;
};
