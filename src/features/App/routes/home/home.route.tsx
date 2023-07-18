import * as S from "./home.style";
import { Outlet } from "react-router-dom";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect } from "react";
import { useDebugStore } from "../../stores/debug.store";
import { useStatsStore } from "../../../Stats/stores/stats.store";
import { Stepper } from "../../components/Stepper/Stepper";
import { StartButton } from "../../components/StartButton/StartButton";
import { StatsButton } from "../../components/StatsButton/StatsButton";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();

  const addStatMutation = useAddStat();

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (incomingQuote) => {
      debugStore.onQuoteReceived(incomingQuote);
      statsStore.onQuoteReceived(incomingQuote);
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = statsStore.on("statCreated", (stat) => {
      debugStore.onStatCreated(stat);
      addStatMutation.mutate(stat);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("appStopped", () => {
      statsStore.onAppStopped();
      debugStore.onAppStopped();
    });

    return () => unbind();
  }, []);

  return (
    <S.Container>
      <main>
        <S.Inner>
          <div>
            <Stepper />
            <S.ButtonContainer>
              <StartButton />
              <StatsButton />
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
