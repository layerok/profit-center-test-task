import {IQuote} from "../../api";
import {calculateValues} from "../../utils";

let quotes: IQuote[] = [];

export const receiveQuote = (incomingQuote: IQuote) => {
  quotes.push(incomingQuote);
}

export const resetState = () => {
  quotes = [];
}

export const calculate = () => {
  return calculateValues(quotes)
}


