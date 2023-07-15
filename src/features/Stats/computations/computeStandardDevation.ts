import { calculateAvg } from "./calculateAvg";

export const calculateStandardDeviation = (values: number[]) => {
  if (values.length < 2) {
    throw new Error(
      "provide at least 2 values to calculate standard deviation"
    );
  }

  const avg = calculateAvg(values);

  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += Math.pow(values[i] - avg, 2);
  }

  return Math.sqrt(sum / (values.length - 1));
};


