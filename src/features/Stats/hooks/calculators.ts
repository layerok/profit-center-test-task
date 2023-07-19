import { useRef } from "react";
import { AvgCalculator } from "../calculators/avg";
import { ModeCalculator } from "../calculators/mode";
import { MinValueCalculator } from "../calculators/minValue";
import { MaxValueCalculator } from "../calculators/maxValue";
import { StandardDeviationCalculator } from "../calculators/standardDeviation";
import { EvenValuesCalculator } from "../calculators/evenValues";
import { OddValuesCalculator } from "../calculators/oddValues";
import { LostQuotesCounter } from "../calculators/lostQuotes";
import { StatsCalculator } from "../StatsCalculator";

export const useAvgCalculator = () => {
  const ref = useRef(new AvgCalculator());
  return ref.current;
};

export const useMinValueCalculator = () => {
  const ref = useRef(new MinValueCalculator());
  return ref.current;
};

export const useModeCalculator = () => {
  const ref = useRef(new ModeCalculator());
  return ref.current;
};

export const useMaxValueCalculator = () => {
  const ref = useRef(new MaxValueCalculator());
  return ref.current;
};

export const useStandardDeviationCalculator = () => {
  const ref = useRef(new StandardDeviationCalculator());
  return ref.current;
};

export const useEvenValuesCalculator = () => {
  const ref = useRef(new EvenValuesCalculator());
  return ref.current;
};

export const useLostQuotesCounter = () => {
  const ref = useRef(new LostQuotesCounter());
  return ref.current;
};

export const useOddValuesCalculator = () => {
  const ref = useRef(new OddValuesCalculator());
  return ref.current;
};

export const useStatsCalculator = () => {
  const ref = useRef(new StatsCalculator());
  return ref.current;
}
