import { IQuote } from "../types";

export class LostQuotesCounter {
  lastQuoteId: null | number = null;
  lostQuotes = 0;
  check(quote: IQuote) {
    if (this.lastQuoteId !== null) {
      this.lostQuotes += quote.id - this.lastQuoteId - 1;
    }
    this.lastQuoteId = quote.id;
    return this.lostQuotes;
  }
  reset() {
    this.lastQuoteId = null;
    this.lostQuotes = 0;
  }
  get() {
    return this.lostQuotes;
  }
}
