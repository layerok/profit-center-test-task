import { makeAutoObservable } from "mobx";
import { IQuote, IStat } from "../types";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

import { recalculateAvg, resetAvg } from "../../App/computations/avg";
import {
  recalculateMaxValue,
  resetMaxValue,
} from "../../App/computations/maxValue";
import {
  recalculateMinValue,
  resetMinValue,
} from "../../App/computations/minValue";
import {
  recalculateOddValues,
  resetOddValues,
} from "../../App/computations/oddValues";
import {
  recalculateEvenValues,
  resetEvenValues,
} from "../../App/computations/evenValues";
import {
  recalculateMode,
  getModeCount,
  resetMode,
} from "../../App/computations/mode";
import {
  recalculateStandardDeviation,
  resetStandardDeviation,
} from "../../App/computations/standardDeviation";
import {
  recalculateLostQuotes,
  resetLastLostQuotes,
} from "../../App/computations/lostQuotes";

class StatsStore {
  constructor() {
    makeAutoObservable(this);
  }

  startTime: number | null = null;
  endTime: number | null = null;
  timeSpent = 0;
  totalQuotesCount = 0;

  lastStat: null | Omit<IStat, "id"> = null;

  setStartTime(time: number) {
    this.startTime = time;
  }

  compute(incomingQuote: IQuote) {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    this.totalQuotesCount++;

    const computationStartTime = Date.now();

    const avg = recalculateAvg(incomingQuote.value);
    const maxValue = recalculateMaxValue(incomingQuote.value);
    const minValue = recalculateMinValue(incomingQuote.value);
    const oddValues = recalculateOddValues(incomingQuote.value);
    const evenValues = recalculateEvenValues(incomingQuote.value);
    const mode = recalculateMode(incomingQuote.value);
    const modeCount = getModeCount();
    const standardDeviation = recalculateStandardDeviation(incomingQuote.value);
    const lostQuotes = recalculateLostQuotes(incomingQuote.id);

    const computationEndTime = Date.now();

    this.timeSpent += computationEndTime - computationStartTime;

    this.endTime = Date.now();

    this.lastStat = {
      avg: avg,
      min_value: minValue,
      max_value: maxValue,
      standard_deviation: standardDeviation!,
      mode: mode,
      mode_count: modeCount,
      lost_quotes: lostQuotes,
      odd_values: oddValues,
      even_values: evenValues,

      end_time: this.endTime,
      start_time: this.startTime,
      time_spent: this.timeSpent,
      quotes_count: this.totalQuotesCount,
    };

    return this.lastStat;
  }

  reset() {
    resetAvg();
    resetMinValue();
    resetMaxValue();
    resetMode();
    resetLastLostQuotes();
    resetStandardDeviation();
    resetEvenValues();
    resetOddValues();
    resetLastLostQuotes();

    this.startTime = null;
    this.endTime = null;
    this.timeSpent = 0;
    this.totalQuotesCount = 0;
    this.lastStat = null;
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = (): StatsStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.statsStore;
};
