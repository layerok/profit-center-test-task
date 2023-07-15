import { Quote, Stat } from "./../types";

export function computeStatsFromQuotes(quotes: Quote[]): Stat {
  if (quotes.length < 2) {
    throw Error("provide at least 2 quotes to compute stats");
  }

  let valueSum = 0;
  let minValue = +Infinity;
  let maxValue = -Infinity;
  let valueCountMap: Record<number, number> = {};
  let lostQuotes = 0;

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];

    if (i !== 0) {
      // here I assume provided quotes are sorted by id in ascending order
      // I it is not the case, then lostQuotes will be incorrect
      const prevQuote = quotes[i - 1];
      if (prevQuote.id + 1 !== quote.id) {
        lostQuotes += quote.id - (prevQuote.id + 1);
      }
    }

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
    lost_quotes: lostQuotes,
    mode: mostFrequentValue,
    quotes_count: quotes.length,
    mode_count: mostFrequentValueCount,
  };
}
