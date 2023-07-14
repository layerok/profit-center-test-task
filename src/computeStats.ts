import { Quote, Stat } from "./types";

export function computeStats(quotes: Quote[]): Stat {
  if (quotes.length < 2) {
    throw Error("provide at least 2 quotes to compute stats");
  }

  let sum = 0;
  let min = +Infinity;
  let max = -Infinity;
  let modaMap: Record<number, number> = {};
  let lostQuotes = 0;

  const startTime = Date.now();

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];

    if (i !== 0) {
      const prevQuote = quotes[i - 1];
      if (prevQuote.id + 1 !== quote.id) {
        lostQuotes += quote.id - (prevQuote.id + 1);
      }
    }

    sum += quote.value;

    if (min > quote.value) {
      min = quote.value;
    }

    if (max < quote.value) {
      max = quote.value;
    }

    if (modaMap[quote.value]) {
      modaMap[quote.value]++;
    } else {
      modaMap[quote.value] = 1;
    }
  }

  const avg = sum / quotes.length;
  let sum2 = 0;
  let biggestModaCount = modaMap[quotes[0].value];
  let quoteWithBiggestModa: Quote = quotes[0];

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];

    sum2 += Math.pow(quote.value - avg, 2);

    if (modaMap[quote.value] > biggestModaCount) {
      biggestModaCount = modaMap[quote.value];
      quoteWithBiggestModa = quote;
    }
  }

  const standartDeviation = Math.sqrt(sum2 / (quotes.length - 1));

  const endTime = Date.now();

  return {
    avg,
    min,
    max,
    start: startTime,
    end: endTime,
    time_spent: endTime - startTime,
    standard_deviation: standartDeviation,
    lost_quotes: lostQuotes,
    moda: quoteWithBiggestModa.value,
    quotes_amount: quotes.length,
    moda_count: biggestModaCount,
  };
}
