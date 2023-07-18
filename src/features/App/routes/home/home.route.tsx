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

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();

  const addStatMutation = useAddStat();

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (incomingQuote) => {
      statsStore.addQuote(incomingQuote);
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = statsStore.on("statCreated", (stat) => {
      debugStore.incrementReportsCreatedCount();
      addStatMutation.mutate(stat);
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
      statsStore.createStat();
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
                    statsStore.stepper.step < statsStore.stepper.minStep ||
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
