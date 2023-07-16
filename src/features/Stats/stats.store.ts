import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { Quote, Stat } from "./types";
import { createNanoEvents, Emitter } from "nanoevents";
import { computeStats } from "./computations/computeStats";

type Events = {
  statCreated: (stat: Omit<Stat, "id">) => void;
};

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      quoteValues: false,
      emitter: false,
    });
    this.emitter = createNanoEvents<Events>();
    this.stepper = new QuotesStepper(100, 2);
  }
  emitter: Emitter<Events>;

  lastQuoteId: number | null = null;
  lostQuotes = 0;
  quoteValues: number[] = [];

  stepper: Stepper;

  addQuote(quote: Quote) {
    this.quoteValues.push(quote.value);
  }

  setLastQuoteId(id: number) {
    this.lastQuoteId = id;
  }

  setLostQuotes(count: number) {
    this.lostQuotes = count;
  }

  setStepper(stepper: Stepper) {
    this.stepper = stepper;
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

    this.addQuote(incomingQuote);

    this.stepper.onQuoteReceived(incomingQuote);
    if (this.stepper.isStepReached()) {
      if (this.quoteValues.length > 1) {
        const stat = this.createStat(this.quoteValues);
        this.stepper.onStatCreated(stat);
      }
    }
  }

  createStat(values: number[]) {
    const startTime = Date.now();
    const result = computeStats(values);
    const endTime = Date.now();

    const stat = {
      avg: result.avg,
      min_value: result.minValue,
      max_value: result.maxValue,
      standard_deviation: result.standardDeviation,
      mode: result.mode,
      mode_count: result.modeCount,
      end_time: endTime,
      start_time: startTime,
      lost_quotes: this.lostQuotes,
      time_spent: endTime - startTime,
      quotes_count: this.quoteValues.length,
    };

    this.emitter.emit("statCreated", stat);
    return stat;
  }
}

class Stepper {
  step: number = 0;
  minimumStep: number = 0;

  constructor(step: number, minimumStep: number) {
    this.step = step;
    this.minimumStep = minimumStep;
    makeObservable(this, {
      step: observable,
      minimumStep: observable,
      setStep: action,
      onQuoteReceived: action,
      onStatCreated: action,
    });
  }
  onQuoteReceived(quote: Quote) {}

  onStatCreated(stat: Omit<Stat, "id">) {}

  isStepReached() {
    return false;
  }

  setStep(step: number) {
    this.step = step;
  }

  getStep() {
    return this.step;
  }

  getMinimumStep() {
    return this.minimumStep;
  }
}

export class SecondsStepper extends Stepper {
  secondsAfterLastStatCreated = 0;
  lastStatCreatedTimestamp: number | null = null;

  onQuoteReceived(quote: Quote) {
    if (!this.lastStatCreatedTimestamp) {
      this.lastStatCreatedTimestamp = Date.now();
    }
    this.secondsAfterLastStatCreated =
      (Date.now() - this.lastStatCreatedTimestamp) / 1000;
  }
  onStatCreated(stat: Stat) {
    this.lastStatCreatedTimestamp = Date.now();

    this.secondsAfterLastStatCreated = 0;
  }

  isStepReached() {
    return this.secondsAfterLastStatCreated >= this.step;
  }
}

export class QuotesStepper extends Stepper {
  quotesAfterLastStatCreated = 0;

  onQuoteReceived(quote: Quote) {
    this.quotesAfterLastStatCreated++;
  }
  onStatCreated(stat: Stat) {
    this.quotesAfterLastStatCreated = 0;
  }
  isStepReached() {
    return this.quotesAfterLastStatCreated === this.step;
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = () => {
  return statsStore;
};
