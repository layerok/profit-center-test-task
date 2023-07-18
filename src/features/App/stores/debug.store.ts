import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { Quote, Stat } from "../../Stats/types";
import { MobXProviderContext } from "mobx-react";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  panelHidden = false;
  totalQuotesReceived = 0;
  lastQuoteId: number | null = null;
  reportsCreated = 0;
  lostQuotes = 0;
  firstQuoteReceivedTimestamp: number | null = null;
  secondsPassedFromFirstQuote = 0;

  hideDebugPanel() {
    this.panelHidden = true;
  }

  showDebugPanel() {
    this.panelHidden = false;
  }

  toggleDebugPanel() {
    this.panelHidden = !this.panelHidden;
  }

  incrementTotalQuotesReceived() {
    this.totalQuotesReceived++;
  }

  incrementStatsComputedCount() {
    this.reportsCreated++;
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

  get speed() {
    if (this.secondsPassedFromFirstQuote === 0) {
      return 0;
    }
    return Math.round(
      this.totalQuotesReceived / this.secondsPassedFromFirstQuote
    );
  }

  onQuoteReceived(incomingQuote: Quote) {
    if (this.totalQuotesReceived === 0) {
      this.firstQuoteReceivedTimestamp = Date.now();
    }
    this.secondsPassedFromFirstQuote = Math.round(
      (Date.now() - this.firstQuoteReceivedTimestamp!) / 1000
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

  onAppStopped() {
    this.totalQuotesReceived = 0;
    this.lostQuotes = 0;
    this.lastQuoteId = null;
    this.firstQuoteReceivedTimestamp = null;
    this.reportsCreated = 0;
    this.secondsPassedFromFirstQuote = 0;
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = (): DebugStore => {
    const ctx = useContext(MobXProviderContext);
    return ctx.debugStore;
};
