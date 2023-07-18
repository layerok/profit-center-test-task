import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { IQuote, IStat } from "../types";
import { createNanoEvents, Emitter } from "nanoevents";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import * as mobxUtils from "mobx-utils";

type IEvents = {
  statCreated: (stat: Omit<IStat, "id">) => void;
};

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      emitter: false,
      modeMap: false,
    });
    this.emitter = createNanoEvents<IEvents>();
    this.stepper = new QuotesStepper(this, {
      step: 10000,
      min: 2,
    });
  }
  readonly emitter: Emitter<IEvents>;

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

  get time() {
    if (this.startTime != null) {
      return mobxUtils.now() - this.startTime;
    }
    return 0;
  }

  get speed() {
    if (this.time !== 0) {
      return this.totalQuotesCount / (this.time / 1000);
    }
    return 0;
  }

  setStepper(stepper: Stepper) {
    this.stepper = stepper;
  }

  compute(incomingQuote: IQuote) {
    if (this.totalQuotesCount === 0) {
      this.startTime = Date.now();
      this.avg = incomingQuote.value;
      this.maxValue = incomingQuote.value;
      this.minValue = incomingQuote.value;
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

    this.stepper.check(incomingQuote);
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

  reset() {
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

  emit<E extends keyof IEvents>(event: E, ...args: Parameters<IEvents[E]>) {
    return this.emitter.emit(event, ...args);
  }

  on<E extends keyof IEvents>(event: E, callback: IEvents[E]) {
    return this.emitter.on(event, callback);
  }
}

type IStepperOptions = {
  step: number;
  min: number;
};

class Stepper {
  step: number = 0;
  minStep: number = 0;

  constructor(protected readonly store: StatsStore, options: IStepperOptions) {
    this.step = options.step;
    this.minStep = options.min;
    makeObservable<Stepper, "store">(this, {
      step: observable,
      setStep: action,
      minStep: observable,
      check: action,
      store: false,
    });
  }

  setStep(step: number) {
    this.step = step;
  }

  check(quote: IQuote) {}
}

export class SecondsStepper extends Stepper {
  private secondsPassedAfterLastStatCreated = 0;
  private lastStatCreatedTimestamp: number | null = null;

  check(quote: IQuote) {
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
  private quotesReceivedAfterLastStatCreated = 0;

  onQuoteReceived(quote: IQuote) {
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
