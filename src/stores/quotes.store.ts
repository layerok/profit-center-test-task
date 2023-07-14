import { makeAutoObservable } from "mobx";
import { Quote } from "../types";

class QuotesStore {
  constructor() {
    makeAutoObservable(this);
  }
  quotes: Quote[] = [];

  addQuote(quote: Quote) {
    this.quotes.push(quote);
  }
}

export const quotesStore = new QuotesStore();