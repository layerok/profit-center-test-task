import { Stat } from "../types";

export function computeStats(values: number[]): {
  avg: number;
  min_value: number;
  max_value: number;
  standard_deviation: number;
  mode: number;
  mode_count: number;
} {
  if (values.length < 2) {
    throw Error("provide at least 2 values to compute stats");
  }

  let valueSum = 0;
  let minValue = +Infinity;
  let maxValue = -Infinity;
  let valueCountMap: Record<number, number> = {};

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    valueSum += value;

    if (minValue > value) {
      minValue = value;
    }

    if (maxValue < value) {
      maxValue = value;
    }

    if (valueCountMap[value]) {
      valueCountMap[value]++;
    } else {
      valueCountMap[value] = 1;
    }
  }

  const avg = valueSum / values.length;

  let mostFrequentValue = values[0];
  let mostFrequentValueCount = valueCountMap[values[0]];

  let sum2 = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const diff = value - avg;

    sum2 += diff * diff;

    if (valueCountMap[value] > mostFrequentValueCount) {
      mostFrequentValue = value;
      mostFrequentValueCount = valueCountMap[value];
    }
  }

  const standartDeviation = Math.sqrt(sum2 / (values.length - 1));

  return {
    avg,
    min_value: minValue,
    max_value: maxValue,
    standard_deviation: standartDeviation,
    mode: mostFrequentValue,
    mode_count: mostFrequentValueCount,
  };
}
