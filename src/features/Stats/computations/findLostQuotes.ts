import { Quote } from "./../types";

export function findLostQuotes(quotes: Quote[]): {
    lost_quotes: number;
    spent_time: number;
} {
  if (quotes.length < 2) {
    throw Error("provide at least 2 quotes to compute stats");
  }
  let lostQuotes = 0;

  const startTime = Date.now();

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
  }
  const endTime = Date.now();

  return {
    lost_quotes: lostQuotes,
    spent_time: endTime - startTime,
  };
}
