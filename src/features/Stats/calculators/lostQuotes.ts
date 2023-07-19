
export class LostQuotesCalculator {
  lastQuoteId: null | number = null;
  lostQuotes = 0;
  recalculate(id: number) {
     if (this.lastQuoteId !== null) {
       this.lostQuotes += id - this.lastQuoteId - 1;
     }
     this.lastQuoteId = id;
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

