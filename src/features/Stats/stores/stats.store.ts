import { makeAutoObservable } from "mobx";
import { IQuote } from "../types";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import * as mobxUtils from "mobx-utils";

class StatsStore {
  constructor() {
    makeAutoObservable(this, {
      modeMap: false,
    });
  }

  totalQuotesCount = 0;

  lastQuoteId: number | null = null;
  lostQuotes = 0;

  minValue: number | null = null;
  maxValue: number | null = null;
  avg: number | null = null;

  oddValues: number = 0;
  evenValues: number = 0;

  modeMap: Record<number, number> = {};
  mode: number | null = null;
  modeCount = 0;

  standardDeviation: number | null = null;
  temp: number = 0;

  startTime: number | null = null;
  endTime: number | null = null;
  timeSpent = 0;

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

    if (incomingQuote.value % 2 === 0) {
      this.evenValues++;
    } else {
      this.oddValues++;
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

    this.endTime = Date.now();

    return {
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
      odd_values: 2,
      even_values: 2,
      quotes_count: this.totalQuotesCount,
    };
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
    this.evenValues = 0;
    this.oddValues = 0;
  }
}


export const statsStore = new StatsStore();

export const useStatsStore = (): StatsStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.statsStore;
};
