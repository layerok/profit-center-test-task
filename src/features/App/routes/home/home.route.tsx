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
import { useStepperStore } from "../../stores/stepper.store";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();
  const stepperStore = useStepperStore();
  const addStatMutation = useAddStat();

  useEffect(() => {
    const unbind = appStore.on("appStarted", () => {
      statsStore.setStartTime(Date.now());
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (incomingQuote) => {
      const isTimeToSaveStat = stepperStore.stepper.check(incomingQuote);
      const stat = statsStore.compute(incomingQuote);
      debugStore.setLastStat(stat);
      if (isTimeToSaveStat) {
        addStatMutation.mutate(stat);
        debugStore.incrementReportsCreatedCount();
        stepperStore.stepper.reset();
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
    const stat = statsStore.lastStat;
    if (stat) {
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
