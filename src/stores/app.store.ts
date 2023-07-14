import { makeAutoObservable } from "mobx";
import { Quote } from "../types";

class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  quotes: Quote[] = [];

  addQuote(quote: Quote) {
    this.quotes.push(quote);
  }
}

export const appStore = new AppStore();