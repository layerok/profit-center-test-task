import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
} from "mobx";
import { Quote, Stat } from "./types";
import { createNanoEvents, Emitter } from "nanoevents";
import { computeStats } from "./computations/computeStats";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

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
    this.stepper = new QuotesStepper(this, {
      step: 100,
      min: 2,
    });
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
  store: StatsStore;

  constructor(
    store: StatsStore,
    options: {
      step: number;
      min: number;
    }
  ) {
    this.store = store;
    this.step = options.step;
    this.minimumStep = options.min;
    makeObservable(this, {
      step: observable,
      minimumStep: observable,
      setStep: action,
      onQuoteReceived: action,
      store: false,
    });
  }
  onQuoteReceived(quote: Quote) {}

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
  secondsPassedAfterLastStatCreated = 0;
  lastStatCreatedTimestamp: number | null = null;

  onQuoteReceived(quote: Quote) {
    if (!this.lastStatCreatedTimestamp) {
      this.lastStatCreatedTimestamp = Date.now();
    }
    this.secondsPassedAfterLastStatCreated =
      (Date.now() - this.lastStatCreatedTimestamp) / 1000;

    if (this.isStepReached()) {
      if (this.store.quoteValues.length > 1) {
        this.store.createStat(this.store.quoteValues);
        this.reset();
      }
    }
  }

  reset() {
    this.lastStatCreatedTimestamp = Date.now();
    this.secondsPassedAfterLastStatCreated = 0;
  }

  isStepReached() {
    return this.secondsPassedAfterLastStatCreated >= this.step;
  }
}

export class QuotesStepper extends Stepper {
  quotesReceivedAfterLastStatCreated = 0;

  onQuoteReceived(quote: Quote) {
    this.quotesReceivedAfterLastStatCreated++;

    if (this.isStepReached()) {
      if (this.store.quoteValues.length > 1) {
        this.store.createStat(this.store.quoteValues);
        this.reset();
      }
    }
  }

  reset() {
    this.quotesReceivedAfterLastStatCreated = 0;
  }

  isStepReached() {
    return this.quotesReceivedAfterLastStatCreated === this.step;
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = (): StatsStore => {
    const ctx = useContext(MobXProviderContext);
    return ctx.statsStore;
};
