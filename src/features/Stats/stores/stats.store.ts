import { makeAutoObservable } from "mobx";
import { IQuote, IStat } from "../types";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

import { AvgCalculator } from "../calculators/avg";
import { MaxValueCalculator } from "../calculators/maxValue";
import { MinValueCalculator } from "../calculators/minValue";
import { OddValuesCalculator } from "../calculators/oddValues";
import { EvenValuesCalculator } from "../calculators/evenValues";
import { ModeCalculator } from "../calculators/mode";
import { StandardDeviationCalculator } from "../calculators/standardDeviation";
import { LostQuotesCalculator } from "../calculators/lostQuotes";

class StatsStore {
  constructor() {
    makeAutoObservable(this);
    this.avgCalculator = new AvgCalculator();
    this.evenValuesCalculator = new EvenValuesCalculator();
    this.oddValuesCalculator = new OddValuesCalculator();
    this.maxValueCalculator = new MaxValueCalculator();
    this.minValueCalculator = new MinValueCalculator();
    this.standardDeviationCalculator = new StandardDeviationCalculator();
    this.modeCalculator = new ModeCalculator();
    this.lostQuotesCalculator = new LostQuotesCalculator();
  }

  startTime: number | null = null;
  endTime: number | null = null;

  totalQuotesCount = 0;

  avgCalculator: AvgCalculator;
  evenValuesCalculator: EvenValuesCalculator;
  oddValuesCalculator: OddValuesCalculator;
  maxValueCalculator: MaxValueCalculator;
  minValueCalculator: MinValueCalculator;
  standardDeviationCalculator: StandardDeviationCalculator;
  modeCalculator: ModeCalculator;
  lostQuotesCalculator: LostQuotesCalculator;

  lastStat: null | Omit<IStat, "id"> = null;

  recalculate(incomingQuote: IQuote): Omit<IStat, "id"> {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    this.totalQuotesCount++;

    const computationStartTime = Date.now();

    const avg = this.avgCalculator.recalculate(incomingQuote.value);
    const maxValue = this.maxValueCalculator.recalculate(incomingQuote.value);
    const minValue = this.minValueCalculator.recalculate(incomingQuote.value);
    const oddValues = this.oddValuesCalculator.recalculate(incomingQuote.value);
    const evenValues = this.evenValuesCalculator.recalculate(
      incomingQuote.value
    );
    const mode = this.modeCalculator.recalculate(incomingQuote.value);
    const standardDeviation = this.standardDeviationCalculator.recalculate(
      incomingQuote.value
    );
    const lostQuotes = this.lostQuotesCalculator.recalculate(incomingQuote.id);

    const computationEndTime = Date.now();

    this.endTime = Date.now();

    return {
      avg: avg,
      min_value: minValue,
      max_value: maxValue,
      standard_deviation: standardDeviation!,
      mode: mode,
      mode_count: this.modeCalculator.getCount(),
      lost_quotes: lostQuotes,
      odd_values: oddValues,
      even_values: evenValues,

      end_time: this.endTime,
      start_time: this.startTime,
      time_spent: computationEndTime - computationStartTime,
      quotes_count: this.totalQuotesCount,
    };
  }

  setLastStat(stat: Omit<IStat, "id">) {
    this.lastStat = stat;
  }

  reset() {
    this.avgCalculator.reset();
    this.minValueCalculator.reset();
    this.maxValueCalculator.reset();
    this.modeCalculator.reset();
    this.lostQuotesCalculator.reset();
    this.standardDeviationCalculator.reset();
    this.evenValuesCalculator.reset();
    this.oddValuesCalculator.reset();

    this.startTime = null;
    this.endTime = null;
    this.totalQuotesCount = 0;
    this.lastStat = null;
  }

  setStartTime(time: number) {
    this.startTime = time;
  }

  setEndTime(time: number) {
    this.endTime = time;
  }
}

export const statsStore = new StatsStore();

export const useStatsStore = (): StatsStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.statsStore;
};
