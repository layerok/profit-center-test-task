import { Quote } from "../types";

export const calculateAvg = (values: number[]): number => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
};

export const calculateAvg2 = (quotes: Quote[]): number => {
  let sum = 0;
  for (let i = 0; i < quotes.length; i++) {
    const quote = quotes[i];
    sum += quote.value
  }
  return sum / quotes.length;
};
