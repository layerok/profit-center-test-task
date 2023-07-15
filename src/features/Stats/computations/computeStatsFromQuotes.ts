import { Quote, Stat } from "./../types";

export function computeStatsFromQuotes(quotes: Quote[]): Stat {
  if (quotes.length < 2) {
    throw Error("provide at least 2 quotes to compute stats");
  }

  let valueSum = 0;
  let minValue = +Infinity;
  let maxValue = -Infinity;
  let valueCountMap: Record<number, number> = {};

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];

    valueSum += quote.value;

    if (minValue > quote.value) {
      minValue = quote.value;
    }

    if (maxValue < quote.value) {
      maxValue = quote.value;
    }

    if (valueCountMap[quote.value]) {
      valueCountMap[quote.value]++;
    } else {
      valueCountMap[quote.value] = 1;
    }
  }

  const avg = valueSum / quotes.length;

  let mostFrequentValue = quotes[0].value;
  let mostFrequentValueCount = valueCountMap[quotes[0].value];

  let sum2 = 0;

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];
    const diff = quote.value - avg;

    sum2 += diff * diff;

    if (valueCountMap[quote.value] > mostFrequentValueCount) {
      mostFrequentValue = quote.value;
      mostFrequentValueCount = valueCountMap[quote.value];
    }
  }

  const standartDeviation = Math.sqrt(sum2 / (quotes.length - 1));

  return {
    avg,
    min_value: minValue,
    max_value: maxValue,
    standard_deviation: standartDeviation,
    mode: mostFrequentValue,
    quotes_count: quotes.length,
    mode_count: mostFrequentValueCount,
  };
}
