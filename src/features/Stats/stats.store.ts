import { makeAutoObservable } from "mobx";
import { Quote, Stat } from "./types";
import { createNanoEvents, Emitter } from "nanoevents";

type Events = {
  statCreated: (stat: Stat) => void;
};

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      quoteValues: false,
      emitter: false,
    });
    this.emitter = createNanoEvents<Events>();
  }
  emitter: Emitter<Events>;

  lastQuoteId: number | null = null;
  freshQuotes = 0;
  step = 100;
  lostQuotes = 0;
  quoteValues: number[] = [];

  incrementFreshQuotes() {
    this.freshQuotes++;
  }

  addQuote(quote: Quote) {
    this.quoteValues.push(quote.value);
  }

  setLastQuoteId(id: number) {
    this.lastQuoteId = id;
  }

  setLostQuotes(count: number) {
    this.lostQuotes = count;
  }

  setStep(step: number) {
    this.step = step;
  }

  addLostQuotes(amount: number) {
    this.lostQuotes += amount;
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = () => {
  return statsStore;
};
