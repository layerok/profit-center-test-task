import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { AppStateEnum, useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect, useRef, useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { SecondaryButton } from "../../../../common/components/SecondaryButton/SecondaryButton";
import { IStat } from "../../../Stats/types";
import { PrimaryButton } from "../../../../common/components/PrimaryButton/PrimaryButton";
import {
  useAvgCalculator,
  useEvenValuesCounter,
  useLostQuotesCounter,
  useMaxValueFinder,
  useMinValueFinder,
  useModeFinder,
  useModeCounter,
  useOddValuesCounter,
  useStandardDeviationCalculator,
} from "../../../Stats/hooks";

const MIN_STEP = 2;
const INITIAL_STEP = 10000;

export const HomeRoute = () => {
  const appStore = useAppStore();
  const addStatMutation = useAddStat();
  const navigate = useNavigate();

  const avgCalculator = useAvgCalculator();
  const minValueFinder = useMinValueFinder();
  const maxValueFinder = useMaxValueFinder();
  const modeFinder = useModeFinder();
  const standardDeviationCalculator = useStandardDeviationCalculator();

  const evenValuesCounter = useEvenValuesCounter();
  const oddValuesCounter = useOddValuesCounter();
  const lostQuotesCounter = useLostQuotesCounter();
  const modeCounter = useModeCounter();

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
    navigate(statsRoutePaths.list);
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
