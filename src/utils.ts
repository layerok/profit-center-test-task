import {IQuote} from "./api";

export const calculateValues = (quotes: IQuote[]) => {
  let sum = 0;
  let avg = 0;
  let minValue:number = +Infinity;
  let maxValue: number = -Infinity;
  let evenValues = 0;
  let oddValues = 0;

  let modeMap: Record<number, number> = {};
  let maxCount = 0;
  let mode = 0;
  let temp = 0;
  let standardDeviation:null | number = null;
  const quotesCount = quotes.length;

  for(let i = 0; i <  quotes.length; i++) {
    const quote = quotes[i];
    sum += quote.value;

    avg = sum / quotesCount;

    if (quote.value < minValue) {
      minValue = quote.value;
    }

    if (quote.value > maxValue) {
      maxValue = quote.value;
    }

    if (quote.value % 2 === 0) {
      evenValues++;
    }

    if (quote.value % 2 !== 0) {
      oddValues++;
    }

    let count = modeMap[quote.value] || 0;
    modeMap[quote.value] = ++count;

    if (count > maxCount) {
      mode = quote.value;
      maxCount = count;
    }

    const diff = quote.value - avg;

    temp += diff * diff;

    if (quotesCount > 1) {
      standardDeviation = Math.sqrt(temp / (quotesCount - 1));
    }
  }

  return {
    minValue: minValue,
    maxValue: maxValue,
    mode: mode,
    avg: avg,
    standardDeviation: standardDeviation,
    modeCount: maxCount,
    evenValuesCount: evenValues,
    oddValuesCount: oddValues,
    quotesCount: quotesCount,
  }
}
