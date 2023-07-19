import { IQuote } from "./types";
import { AvgCalculator } from "./calculators/avg";
import { MaxValueCalculator } from "./calculators/maxValue";
import { MinValueCalculator } from "./calculators/minValue";
import { OddValuesCalculator } from "./calculators/oddValues";
import { EvenValuesCalculator } from "./calculators/evenValues";
import { ModeCalculator } from "./calculators/mode";
import { StandardDeviationCalculator } from "./calculators/standardDeviation";

export class StatsCalculator {
  constructor() {
    this.avgCalculator = new AvgCalculator();
    this.evenValuesCalculator = new EvenValuesCalculator();
    this.oddValuesCalculator = new OddValuesCalculator();
    this.maxValueCalculator = new MaxValueCalculator();
    this.minValueCalculator = new MinValueCalculator();
    this.standardDeviationCalculator = new StandardDeviationCalculator();
    this.modeCalculator = new ModeCalculator();
  }

  avgCalculator: AvgCalculator;
  evenValuesCalculator: EvenValuesCalculator;
  oddValuesCalculator: OddValuesCalculator;
  maxValueCalculator: MaxValueCalculator;
  minValueCalculator: MinValueCalculator;
  standardDeviationCalculator: StandardDeviationCalculator;
  modeCalculator: ModeCalculator;

  calculate(incomingQuote: IQuote) {
    const avg = this.avgCalculator.calculate(incomingQuote.value);
    const maxValue = this.maxValueCalculator.calculate(incomingQuote.value);
    const minValue = this.minValueCalculator.calculate(incomingQuote.value);
    const oddValues = this.oddValuesCalculator.calculate(incomingQuote.value);
    const evenValues = this.evenValuesCalculator.calculate(incomingQuote.value);
    const mode = this.modeCalculator.calculate(incomingQuote.value);
    const standardDeviation = this.standardDeviationCalculator.calculate(
      incomingQuote.value
    );

    return {
      avg,
      minValue,
      maxValue,
      oddValues,
      evenValues,
      mode,
      modeCount: this.modeCalculator.getCount(),
      standardDeviation,
    };
  }

  reset() {
    this.avgCalculator.reset();
    this.minValueCalculator.reset();
    this.maxValueCalculator.reset();
    this.modeCalculator.reset();
    this.standardDeviationCalculator.reset();
    this.evenValuesCalculator.reset();
    this.oddValuesCalculator.reset();
  }
}
