import { calculateAvg } from "./calculateAvg";

export const computeStandardDeviation = (values: number[]) => {
  const avg = calculateAvg(values);

  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const diff = value - avg;
    // don't use Math.pow here, it is much slower
    sum += diff * diff;
  }


  return Math.sqrt(sum / (values.length - 1));
};

