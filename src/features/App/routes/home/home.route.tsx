import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { computeStatsFromQuotes } from "../../../Stats/computations/computeStatsFromQuotes";
import { useAddStat } from "../../../Stats/mutations";
import { useEffect } from "react";
import { Quote } from "../../../Stats/types";
import { useDebugStore } from "../../debug.store";
import { runInAction } from "mobx";
import { useStatsStore } from "../../../Stats/stats.store";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();

  const navigate = useNavigate();

  const statMutation = useAddStat();

  useEffect(() => {
    const unbind = appStore.emitter.on("quoteReceived", (incomingQuote) => {
      debugStore.incrementTotalQuotesReceived();
      if (debugStore.lastQuoteId !== null) {
        const lost = incomingQuote.id - debugStore.lastQuoteId - 1;
        debugStore.addLostQuotes(lost);
      }

      debugStore.setLastQuoteId(incomingQuote.id);
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = statsStore.emitter.on("statCreated", (stat) => {
      debugStore.incrementStatsComputedCount();
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.emitter.on(
      "quoteReceived",
      (incomingQuote: Quote) => {
        if (statsStore.lastQuoteId !== null) {
          const lostCount = incomingQuote.id - statsStore.lastQuoteId - 1;
          statsStore.addLostQuotes(lostCount);
        }
        statsStore.setLastQuoteId(incomingQuote.id);
        statsStore.incrementFreshQuotes();
        statsStore.addQuote(incomingQuote);

        if (statsStore.freshQuotes === statsStore.step) {
          const startTime = Date.now();
          const result = computeStatsFromQuotes(statsStore.quoteValues);
          const endTime = Date.now();
          statsStore.emitter.emit("statCreated", result);
          runInAction(() => {
            statsStore.freshQuotes = 0;
          });

          statMutation.mutate({
            ...result,
            start_time: startTime,
            end_time: endTime,
            time_spent: endTime - startTime,
            lost_quotes: statsStore.lostQuotes,
          });
        }
      }
    );

    return () => {
      unbind();
    };
  }, []);

  const showStats = () => {
    if (statsStore.quoteValues.length > 2) {
      const startTime = Date.now();
      const result = computeStatsFromQuotes(statsStore.quoteValues);
      const endTime = Date.now();

      statsStore.emitter.emit("statCreated", result);

      statMutation.mutate({
        ...result,
        start_time: startTime,
        end_time: endTime,
        time_spent: endTime - startTime,
        lost_quotes: statsStore.lostQuotes,
      });
    }
    navigate(statsRoutePaths.list);
  };

  const startOrStop = () => {
    if (appStore.isIdling) {
      appStore.start();
    } else {
      appStore.stop();
    }
  };

  return (
    <S.Container>
      <main>
        <DebugPanel />
        <S.ControlsContainer>
          <S.InputContainer>
            <S.Input
              type="number"
              min="2"
              defaultValue={statsStore.step}
              placeholder="Кол-во котировок"
              onChange={(event) => {
                statsStore.setStep(+event.currentTarget.value);
              }}
            />
            {statsStore.step < 2 && (
              <S.ValidationMsg>
                Котировок должно быть не меньше двух
              </S.ValidationMsg>
            )}
          </S.InputContainer>
          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={
                statsStore.step < 2 ||
                appStore.isStarting ||
                appStore.isStopping
              }
              onClick={startOrStop}
            >
              {appStore.isIdling ? "Start" : ""}
              {appStore.isStarting ? "starting..." : ""}
              {appStore.isStarted ? "Stop" : ""}
              {appStore.isStopping ? "stopping..." : ""}
            </S.PrimaryButton>
            <S.SecondaryButton onClick={showStats}>
              Статистика
            </S.SecondaryButton>
          </S.ButtonGroup>
        </S.ControlsContainer>
      </main>
      <Outlet />
    </S.Container>
  );
});

export const Component = HomeRoute;
