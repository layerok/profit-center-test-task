export const calculateStandardDeviation = (values: number[]) => {
  if (values.length < 2) {
    throw new Error(
      "provide at least to values to calculate standard deviation"
    );
  }

  const avg = calculateAvg(values);

  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += Math.pow(values[i] - avg, 2);
  }

  return Math.sqrt(sum / (values.length - 1));
};

export const calculateAvg = (values: number[]) => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
};
