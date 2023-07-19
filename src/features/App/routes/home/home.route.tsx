import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect, useRef, useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { SecondaryButton } from "../../../../common/components/SecondaryButton/SecondaryButton";
import { IStat } from "../../../Stats/types";
import {
  useLostQuotesCounter,
  useStatsCalculator,
} from "../../../Stats/hooks/calculators";
import { PrimaryButton } from "../../../../common/components/PrimaryButton/PrimaryButton";

const MIN_STEP = 2;
const INITIAL_STEP = 10000;

export const HomeRoute = () => {
  const appStore = useAppStore();
  const addStatMutation = useAddStat();
  const navigate = useNavigate();

  const statsCalculator = useStatsCalculator();
  const lostQuotesCounter = useLostQuotesCounter();

  const startTime = useRef<null | number>(null);
  const endTime = useRef<null | number>(null);
  const totalQuotes = useRef(0);
  const lastStat = useRef<null | Omit<IStat, "id">>(null);

  const [step, setStep] = useState(INITIAL_STEP);
  const progress = useRef(0);

  useEffect(() => {
    const unbind = appStore.on("appStarted", () => {
      const time = Date.now();
      startTime.current = time;
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

      lostQuotesCounter.check(incomingQuote);

      const {
        avg,
        minValue,
        maxValue,
        mode,
        modeCount,
        evenValues,
        oddValues,
        standardDeviation,
      } = statsCalculator.calculate(incomingQuote);

      const endComputationTime = Date.now();

      endTime.current = Date.now();

      const stat: Omit<IStat, "id"> = {
        avg,
        min_value: minValue,
        max_value: maxValue,
        mode,
        mode_count: modeCount,
        even_values: evenValues,
        odd_values: oddValues,
        standard_deviation: standardDeviation || 0,
        lost_quotes: lostQuotesCounter.get(),

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
      lastStat.current = stat;
      const isTimeToSaveStat = progress.current === step;

      if (isTimeToSaveStat) {
        appStore.emit("statSaved", lastStat.current);
        addStatMutation.mutate(stat);
        progress.current = 0;
      }
    });

    return () => unbind();
  }, [step]);

  useEffect(() => {
    const unbind = appStore.on("appStopped", () => {
      statsCalculator.reset();
      progress.current = 0;
    });

    return () => unbind();
  }, []);

  const viewStats = () => {
    if (lastStat.current) {
      addStatMutation.mutate(lastStat.current);
      appStore.emit("statSaved", lastStat.current);
    }
    navigate(statsRoutePaths.list);
  };

  const startApp = () => {
    if (appStore.isIdling) {
      appStore.start();
    } else {
      appStore.stop();
    }
  };

  return (
    <S.Container>
      <main>
        <S.Inner>
          <div>
            <Stepper
              disabled={!appStore.isIdling}
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
                    appStore.isStarting ||
                    appStore.isStopping
                  }
                  onClick={startApp}
                >
                  {appStore.isIdling ? "Start" : ""}
                  {appStore.isStarting ? "starting..." : ""}
                  {appStore.isStarted ? "Stop" : ""}
                  {appStore.isStopping ? "stopping..." : ""}
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
