import { makeAutoObservable } from "mobx";

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      quoteValues: false,
    });
  }
  
  lastQuoteId: number | null = null;
  newQuotes = 0;
  quotesLimit = 100;
  lostQuotes = 0;
  quoteValues: number[] = [];

  incrementNewQuotes() {
    this.newQuotes++;
  }

  addQuoteValue(value: number) {
    this.quoteValues.push(value);
  }

  setLastQuoteId(id: number) {
    this.lastQuoteId = id;
  }

  setLostQuotes(count: number) {
    this.lostQuotes = count;
  }

  setQuotesLimit(limit: number) {
    this.quotesLimit = limit;
  }

}

export const statsStore = new StatsStore();

export const useStatsStore = () => {
  return statsStore;
};
