import { makeAutoObservable } from "mobx";
import { Quote, Stat } from "./types";
import { createNanoEvents, Emitter } from "nanoevents";
import { computeStats } from "./computations/computeStats";

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

  onQuoteReceived(incomingQuote: Quote) {
    if (this.lastQuoteId !== null) {
      const lostQuotes = incomingQuote.id - this.lastQuoteId - 1;
      this.addLostQuotes(lostQuotes);
    }
    this.setLastQuoteId(incomingQuote.id);
    this.incrementFreshQuotes();
    this.addQuote(incomingQuote);

    if (this.freshQuotes === this.step) {
      this.createStat(this.quoteValues);

      this.freshQuotes = 0;
    }
  }

  createStat(values: number[]) {
    const startTime = Date.now();
    const result = computeStats(values);
    const endTime = Date.now();

    const stat = {
      ...result,
      end_time: endTime,
      start_time: startTime,
      lost_quotes: this.lostQuotes,
      time_spent: endTime - startTime,
      quotes_count: this.quoteValues.length,
    };

    this.emitter.emit("statCreated", stat);
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = () => {
  return statsStore;
};
