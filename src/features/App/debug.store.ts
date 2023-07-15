import { makeAutoObservable } from "mobx";
import { Quote } from "../Stats/types";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  totalQuotesReceived = 0;
  lastQuoteId: number | null = null;
  statsComputedCount = 0;
  lostQuotes = 0;

  incrementTotalQuotesReceived() {
    this.totalQuotesReceived++;
  }

  incrementStatsComputedCount() {
    this.statsComputedCount++;
  }

  setLastQuoteId(id: number) {
    this.lastQuoteId = id;
  }

  setLostQuotes(count: number) {
    this.lostQuotes = count;
  }

  addLostQuotes(amount: number) {
    this.lostQuotes += amount;
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = () => {
  return debugStore;
};
