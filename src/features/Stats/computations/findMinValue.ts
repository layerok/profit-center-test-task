import { Quote, Stat } from "./../types";

export function findMinValue(quotes: Quote[]): number {
  if (quotes.length < 2) {
    throw Error("provide at least 2 quotes to compute stats");
  }

  let minValue = +Infinity;

  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];

    if (minValue > quote.value) {
      minValue = quote.value;
    }
  }

  return minValue;
}
