import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { Quote, Stat } from "./types";
import { createNanoEvents, Emitter } from "nanoevents";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import * as mobxUtils from "mobx-utils";

type Events = {
  statCreated: (stat: Omit<Stat, "id">) => void;
};

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      emitter: false,
      modeMap: false,
    });
    this.emitter = createNanoEvents<Events>();
    this.stepper = new QuotesStepper(this, {
      step: 10000,
      min: 2,
    });
  }
  emitter: Emitter<Events>;

  totalQuotesCount = 0;

  lastQuoteId: number | null = null;
  lostQuotes = 0;

  minValue: number | null = null;
  maxValue: number | null = null;
  avg: number | null = null;

  modeMap: Record<number, number> = {};
  mode: number | null = null;
  modeCount = 0;

  standardDeviation: number | null = null;
  temp: number = 0;

  startTime: number | null = null;
  endTime: number | null = null;
  timeSpent = 0;

  stepper: Stepper;

  setStepper(stepper: Stepper) {
    this.stepper = stepper;
  }

  get time() {
    if (this.startTime != null) {
      return mobxUtils.now() - this.startTime;
    }
    return 0;
  }

  get speed() {
    if (this.time != 0) {
      return this.totalQuotesCount / this.time;
    }
    return 0;
  }

  onFirstQuote(firstQuote: Quote) {
    this.startTime = Date.now();
    this.avg = firstQuote.value;
    this.maxValue = firstQuote.value;
    this.minValue = firstQuote.value;
  }

  onQuoteReceived(incomingQuote: Quote) {
    if (this.totalQuotesCount === 0) {
      this.onFirstQuote(incomingQuote);
    }

    const computationStartTime = Date.now();
    if (this.lastQuoteId !== null) {
      const lostQuotes = incomingQuote.id - this.lastQuoteId - 1;
      this.lostQuotes += lostQuotes;
    }
    this.lastQuoteId = incomingQuote.id;

    this.totalQuotesCount++;

    if (this.minValue! > incomingQuote.value) {
      this.minValue = incomingQuote.value;
    }

    if (this.maxValue! < incomingQuote.value) {
      this.maxValue = incomingQuote.value;
    }

    let count = this.modeMap[incomingQuote.value] || 0;
    this.modeMap[incomingQuote.value] = ++count;

    if (count > this.modeCount) {
      this.mode = incomingQuote.value;
      this.modeCount = count;
    }

    const diff = incomingQuote.value - this.avg!;

    this.temp += diff * diff;

    if (this.totalQuotesCount > 1) {
      this.avg = (this.avg! + incomingQuote.value) / 2;
      this.standardDeviation = Math.sqrt(
        this.temp / (this.totalQuotesCount - 1)
      );
    }

    const computationEndTime = Date.now();

    this.timeSpent += computationEndTime - computationStartTime;

    this.stepper.onQuoteReceived(incomingQuote);
  }

  createStat() {
    this.endTime = Date.now();

    const stat = {
      avg: this.avg!,
      min_value: this.minValue!,
      max_value: this.maxValue!,
      standard_deviation: this.standardDeviation!,
      mode: this.mode!,
      mode_count: this.modeCount,
      end_time: this.endTime,
      start_time: this.startTime!,
      lost_quotes: this.lostQuotes,
      time_spent: this.timeSpent,
      quotes_count: this.totalQuotesCount,
    };

    this.emitter.emit("statCreated", stat);
    return stat;
  }

  onAppStopped() {
    this.resetStats();
  }

  resetStats() {
    this.totalQuotesCount = 0;
    this.avg = null;
    this.minValue = null;
    this.maxValue = null;
    this.mode = null;
    this.modeCount = 0;
    this.startTime = null;
    this.endTime = null;
    this.lostQuotes = 0;
    this.timeSpent = 0;
    this.standardDeviation = null;
    this.temp = 0;
    this.lastQuoteId = null;
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
      if (this.store.totalQuotesCount > 1) {
        this.store.createStat();
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
      if (this.store.totalQuotesCount > 1) {
        this.store.createStat();
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
