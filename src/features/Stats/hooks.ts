import { useRef } from "react";
import { AvgCalculator } from "./calculators/avg";
import { ModeFinder } from "./calculators/mode";
import { MinValueFinder } from "./finders/minValue";
import { MaxValueFinder } from "./finders/maxValue";
import { StandardDeviationCalculator } from "./calculators/standardDeviation";
import { EvenValuesCounter } from "./counters/evenValues";
import { OddValuesCounter } from "./counters/oddValues";
import { LostQuotesCounter } from "./counters/lostQuotes";
import { ModeCounter } from "./counters/modeCount";

export const useAvgCalculator = () => {
  const ref = useRef(new AvgCalculator());
  return ref.current;
};

export const useMinValueFinder = () => {
  const ref = useRef(new MinValueFinder());
  return ref.current;
};

export const useModeFinder = () => {
  const ref = useRef(new ModeFinder());
  return ref.current;
};

export const useMaxValueFinder = () => {
  const ref = useRef(new MaxValueFinder());
  return ref.current;
};

export const useStandardDeviationCalculator = () => {
  const ref = useRef(new StandardDeviationCalculator());
  return ref.current;
};

export const useEvenValuesCounter = () => {
  const ref = useRef(new EvenValuesCounter());
  return ref.current;
};

export const useLostQuotesCounter = () => {
  const ref = useRef(new LostQuotesCounter());
  return ref.current;
};

export const useOddValuesCounter = () => {
  const ref = useRef(new OddValuesCounter());
  return ref.current;
};

export const useModeCounter = () => {
  const ref = useRef(new ModeCounter());
  return ref.current;
};
