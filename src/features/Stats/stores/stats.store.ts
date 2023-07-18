import { makeAutoObservable } from "mobx";
import { IQuote } from "../types";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import * as mobxUtils from "mobx-utils";
import { findAvg } from "../../App/computations/findAvg";
import { findMaxValue } from "../../App/computations/findMaxValue";
import { findMinValue } from "../../App/computations/findMinValue";
import { findOddValues } from "../../App/computations/findOddValues";
import { findEvenValues } from "../../App/computations/findEvenValues";
import { findMode, getLastModeCount } from "../../App/computations/findMode";
import { findStandardDeviation } from "../../App/computations/findStandardDeviation";
import { findLostQuotes } from "../../App/computations/findLostQuotes";

class StatsStore {
  constructor() {
    makeAutoObservable(this);
  }

  totalQuotesCount = 0;
  lastQuoteId: number | null = null;

  lostQuotes = 0;
  minValue: number | null = null;
  maxValue: number | null = null;
  avg: number | null = null;
  oddValues: number = 0;
  evenValues: number = 0;
  mode: number | null = null;
  modeCount: number = 0;
  standardDeviation: number | null = null;

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
    if (this.startTime === null) {
      this.startTime = Date.now();
    }

    this.totalQuotesCount++;
    this.lastQuoteId = incomingQuote.id;

    const computationStartTime = Date.now();

    this.avg = findAvg(incomingQuote.value);
    this.maxValue = findMaxValue(incomingQuote.value);
    this.minValue = findMinValue(incomingQuote.value);
    this.oddValues = findOddValues(incomingQuote.value);
    this.evenValues = findEvenValues(incomingQuote.value);
    this.mode = findMode(incomingQuote.value);
    this.modeCount = getLastModeCount();
    this.standardDeviation = findStandardDeviation(incomingQuote.value);
    this.lostQuotes = findLostQuotes(incomingQuote.id);

    const computationEndTime = Date.now();

    this.timeSpent += computationEndTime - computationStartTime;

    this.endTime = Date.now();

    return {
      avg: this.avg,
      min_value: this.minValue,
      max_value: this.maxValue,
      standard_deviation: this.standardDeviation,
      mode: this.mode,
      mode_count: this.modeCount,
      end_time: this.endTime,
      start_time: this.startTime,
      lost_quotes: this.lostQuotes,
      time_spent: this.timeSpent,
      odd_values: this.oddValues,
      even_values: this.evenValues,
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
