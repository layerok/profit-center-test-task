import { profile } from "../utils";
import { calculateAvg } from "./calculateAvg";

export const computeStandardDeviation = (values: number[]) => {
  if (values.length < 2) {
    throw new Error(
      "provide at least 2 values to calculate standard deviation"
    );
  }

  const profileResult = profile(() => {
    return calculateAvg(values);
  });
  console.log('avg', profileResult);
  const avg = profileResult.result;

  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const diff = value - avg
    // don't use Math.pow here, it is much slower
    sum += diff * diff;
  }

  return Math.sqrt(sum / (values.length - 1));
};
