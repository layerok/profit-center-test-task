import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { AppStateEnum, useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel";
import { useEffect, useRef, useState } from "react";
import { Stepper } from "../../components/Stepper";
import { SecondaryButton } from "../../components/SecondaryButton";
import { IQuote, IStat } from "../../api";
import { PrimaryButton } from "../../components/PrimaryButton";
import { routePaths } from "../../constants";
import { useAddStat } from "../../hooks";

const MIN_STEP = 2;
const INITIAL_STEP = 10000;

class ModeCounter {
  modeMap: Record<number, number> = {};
  maxCount = 0;
  mode = 0;

  count(value: number) {
    let count = this.modeMap[value] || 0;
    this.modeMap[value] = ++count;

    if (count > this.maxCount) {
      this.mode = value;
      this.maxCount = count;
    }
    return this.maxCount;
  }
  reset() {
    this.mode = 0;
    this.maxCount = 0;
    this.modeMap = {};
  }
  get() {
    return this.maxCount;
  }

}

class OddValuesCounter {
  oddValues = 0;
  count(value: number) {
    if (value % 2 !== 0) {
      this.oddValues++;
    }
    return this.oddValues;
  }
  reset() {
    this.oddValues = 0;
  }
  get() {
    return this.oddValues;
  }
}

class LostQuotesCounter {
  lastQuoteId: null | number = null;
  lostQuotes = 0;
  count(quote: IQuote) {
    if (this.lastQuoteId !== null) {
      this.lostQuotes += quote.id - this.lastQuoteId - 1;
    }

    this.lastQuoteId = quote.id;

    return this.lostQuotes;
  }
  reset() {
    this.lastQuoteId = null;
    this.lostQuotes = 0;
  }
  get() {
    return this.lostQuotes;
  }
}

class EvenValuesCounter {
  evenValues = 0;
  count(value: number) {
    if (value % 2 === 0) {
      this.evenValues++;
    }
    return this.evenValues;
  }
  reset() {
    this.evenValues = 0;
  }
  get() {
    return this.evenValues;
  }
}

class StandardDeviationCalculator {
  sum = 0;
  avg = 0;
  quotesCount = 0;

  temp = 0;
  standardDeviation: null | number = null;

  calculate() {
    if (this.quotesCount > 1) {
      this.standardDeviation = Math.sqrt(this.temp / (this.quotesCount - 1));
    }
    return this.standardDeviation;
  }

  add(value: number) {
    this.quotesCount++;
    this.sum += value;
    this.avg = this.sum / this.quotesCount;
    const diff = value - this.avg;

    this.temp += diff * diff;
    return this;
  }

  reset() {
    this.sum = 0;
    this.avg = 0;
    this.quotesCount = 0;
    this.temp = 0;
  }
  get() {
    return this.standardDeviation;
  }
}


class MaxValueFinder {
  maxValue = -Infinity;
  find(value: number) {
    if (value > this.maxValue) {
      this.maxValue = value;
    }
    return this.maxValue;
  }
  reset() {
    this.maxValue = -Infinity;
  }
  get() {
    return this.maxValue;
  }
}

export class ModeFinder {
  modeMap: Record<number, number> = {};
  maxCount = 0;
  mode = 0;

  find(value: number) {
    let count = this.modeMap[value] || 0;
    this.modeMap[value] = ++count;

    if (count > this.maxCount) {
      this.mode = value;
      this.maxCount = count;
    }
    return this.mode;
  }

  reset() {
    this.mode = 0;
    this.maxCount = 0;
    this.modeMap = {};
  }
  get() {
    return this.mode;
  }
}

class MinValueFinder {
  minValue = +Infinity;
  find(value: number) {
    if (value < this.minValue) {
      this.minValue = value;
    }
    return this.minValue;
  }
  reset() {
    this.minValue = +Infinity;
  }
  get() {
    return this.minValue;
  }
}

class AvgCalculator {
  sum = 0;
  quotesCount = 0;
  avg = 0;
  calculate() {
    this.avg = this.sum / this.quotesCount;
    return this.avg;
  }
  add(value: number) {
    this.quotesCount++;
    this.sum += value;
    return this;
  }
  reset() {
    this.sum = 0;
    this.quotesCount = 0;
    this.avg = 0;
  }
  get() {
    return this.avg;
  }
}

export const HomeRoute = () => {
  const appStore = useAppStore();
  const addStatMutation = useAddStat();
  const navigate = useNavigate();

  const avgCalculator = useRef(new AvgCalculator()).current;
  const minValueFinder =  useRef(new MinValueFinder()).current;
  const maxValueFinder = useRef(new MaxValueFinder()).current;
  const modeFinder = useRef(new ModeFinder()).current;
  const standardDeviationCalculator = useRef(new StandardDeviationCalculator()).current;

  const evenValuesCounter = useRef(new EvenValuesCounter()).current;
  const oddValuesCounter = useRef(new OddValuesCounter()).current;
  const lostQuotesCounter = useRef(new LostQuotesCounter()).current;
  const modeCounter = useRef(new ModeCounter()).current;

  const startTime = useRef<null | number>(null);
  const endTime = useRef<null | number>(null);
  const totalQuotes = useRef(0);
  const lastComputedStat = useRef<null | Omit<IStat, "id">>(null);

  const [step, setStep] = useState(INITIAL_STEP);
  const progress = useRef(0);

  useEffect(() => {
    const unbind = appStore.on("appStarted", () => {
      startTime.current = Date.now();
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (incomingQuote) => {
      if (!startTime.current) {
        startTime.current = Date.now();
      }
      totalQuotes.current++;
      progress.current++;

      const startComputationTime = Date.now();

      const computed = {
        minValue: minValueFinder.find(incomingQuote.value),
        maxValue: maxValueFinder.find(incomingQuote.value),
        mode: modeFinder.find(incomingQuote.value),

        avg: avgCalculator.add(incomingQuote.value).calculate(),
        standardDeviation: standardDeviationCalculator
          .add(incomingQuote.value)
          .calculate(),

        modeCount: modeCounter.count(incomingQuote.value),
        evenValuesCount: evenValuesCounter.count(incomingQuote.value),
        oddValuesCount: oddValuesCounter.count(incomingQuote.value),
        lostQuotesCount: lostQuotesCounter.count(incomingQuote),
      };

      const endComputationTime = Date.now();

      endTime.current = Date.now();

      const stat: Omit<IStat, "id"> = {
        avg: computed.avg,
        min_value: computed.minValue,
        max_value: computed.maxValue,
        mode: computed.mode,
        standard_deviation: computed.standardDeviation || 0,

        mode_count: computed.modeCount,
        even_values: computed.evenValuesCount,
        odd_values: computed.oddValuesCount,
        lost_quotes: computed.lostQuotesCount,

        time_spent: endComputationTime - startComputationTime,
        start_time: startTime.current!,
        end_time: endTime.current,
        quotes_count: totalQuotes.current,
      };

      appStore.emit("statComputed", stat);
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("statComputed", (stat: Omit<IStat, "id">) => {
      lastComputedStat.current = stat;
      const isTimeToSaveStat = progress.current === step;

      if (isTimeToSaveStat) {
        appStore.emit("statSaved", lastComputedStat.current);
        addStatMutation.mutate(stat);
        progress.current = 0;
      }
    });

    return () => unbind();
  }, [step]);

  useEffect(() => {
    const unbind = appStore.on("appStopped", () => {
      minValueFinder.reset();
      maxValueFinder.reset();
      modeFinder.reset();

      avgCalculator.reset();
      standardDeviationCalculator.reset();

      evenValuesCounter.reset();
      oddValuesCounter.reset();
      modeCounter.reset();

      progress.current = 0;
    });

    return () => unbind();
  }, []);

  const viewStats = () => {
    if (lastComputedStat.current) {
      addStatMutation.mutate(lastComputedStat.current);
      appStore.emit("statSaved", lastComputedStat.current);
    }
    navigate(routePaths.statsList);
  };

  const startApp = () => {
    const { start, stop } = appStore;
    appStore.state === AppStateEnum.Idling ? start() : stop();
  };

  return (
    <S.Container>
      <main>
        <S.Inner>
          <div>
            <Stepper
              disabled={!(appStore.state === AppStateEnum.Idling)}
              minStep={MIN_STEP}
              step={step}
              onChange={(step) => {
                setStep(step);
              }}
            />

            <S.ButtonContainer>
              <S.StartButton>
                <PrimaryButton
                  disabled={
                    step < MIN_STEP ||
                    appStore.state === AppStateEnum.Starting ||
                    appStore.state === AppStateEnum.Stopping
                  }
                  onClick={startApp}
                >
                  {{
                    starting: "Starting...",
                    stopping: "Stoppping...",
                    started: "Stop",
                    idling: "Start",
                  }[appStore.state]}
                </PrimaryButton>
              </S.StartButton>

              <S.StatsButton>
                <SecondaryButton onClick={viewStats}>
                  Статистика
                </SecondaryButton>
              </S.StatsButton>
            </S.ButtonContainer>
          </div>
        </S.Inner>
        <DebugPanel />
      </main>
      <Outlet />
    </S.Container>
  );
};

export const Component = HomeRoute;

Object.assign(Component, {
  displayName: "LazyHomeRoute",
});
