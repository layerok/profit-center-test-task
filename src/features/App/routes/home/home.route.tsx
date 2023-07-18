import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect } from "react";
import { useDebugStore } from "../../stores/debug.store";
import { useStatsStore } from "../../../Stats/stores/stats.store";
import { Stepper } from "../../components/Stepper/Stepper";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { PrimaryButton } from "../../../../common/components/PrimaryButton/PrimaryButton";
import { SecondaryButton } from "../../../../common/components/SecondaryButton/SecondaryButton";
import { IStat } from "../../../Stats/types";
import { useStepperStore } from "../../stores/stepper.store";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();
  const stepperStore = useStepperStore();

  const addStatMutation = useAddStat();

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (incomingQuote) => {
      const stat = statsStore.compute(incomingQuote);
      const isTimeToSaveStat = stepperStore.stepper.check(incomingQuote);

      if (isTimeToSaveStat) {
        if (statsStore.totalQuotesCount > 1) {
          addStatMutation.mutate(stat);
          debugStore.incrementReportsCreatedCount();
          stepperStore.stepper.reset();
        }
      }
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("appStopped", () => {
      statsStore.reset();
      debugStore.reset();
    });

    return () => unbind();
  }, []);

  const navigate = useNavigate();

  const viewStats = () => {
    if (statsStore.totalQuotesCount > 2) {
      const stat = {
        avg: statsStore.avg!,
        min_value: statsStore.minValue!,
        max_value: statsStore.maxValue!,
        standard_deviation: statsStore.standardDeviation!,
        mode: statsStore.mode!,
        mode_count: statsStore.modeCount,
        end_time: statsStore.endTime,
        start_time: statsStore.startTime!,
        lost_quotes: statsStore.lostQuotes,
        time_spent: statsStore.timeSpent,
        odd_values: 2,
        even_values: 2,
        quotes_count: statsStore.totalQuotesCount,
      } as IStat;
      debugStore.incrementReportsCreatedCount();
      addStatMutation.mutate(stat);
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
            <Stepper />
            <S.ButtonContainer>
              <S.StartButton>
                <PrimaryButton
                  disabled={
                    stepperStore.stepper.step < stepperStore.stepper.minStep ||
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
});

export const Component = HomeRoute;

Object.assign(Component, {
  displayName: "LazyHomeRoute",
});
