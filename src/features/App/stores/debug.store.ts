import { makeAutoObservable } from "mobx";
import { Quote, Stat } from "../../Stats/types";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  totalQuotesReceived = 0;
  lastQuoteId: number | null = null;
  statsComputedCount = 0;
  lostQuotes = 0;
  firstQuoteReceivedTimestamp: number | null = null;
  secondsPassedFromFirstQuote = 0;
  speed = 0;

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

  onQuoteReceived(incomingQuote: Quote) {
    if (this.totalQuotesReceived === 0) {
      this.firstQuoteReceivedTimestamp = Date.now();
    }
    this.secondsPassedFromFirstQuote = Math.round(
      (Date.now() - this.firstQuoteReceivedTimestamp!) / 1000
    );

    this.speed = Math.round(
      this.totalQuotesReceived / this.secondsPassedFromFirstQuote
    );

    this.incrementTotalQuotesReceived();
    if (this.lastQuoteId !== null) {
      const lostQuotes = incomingQuote.id - this.lastQuoteId - 1;
      this.addLostQuotes(lostQuotes);
    }

    this.setLastQuoteId(incomingQuote.id);
  }

  onStatCreated(stat: Omit<Stat, "id">) {
    this.incrementStatsComputedCount();
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = () => {
  return debugStore;
};
