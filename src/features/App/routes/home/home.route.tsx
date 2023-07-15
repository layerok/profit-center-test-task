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
    const onQuoteReceived = (incomingQuote: Quote) => {
      if (statsStore.lastQuoteId !== null) {
        // I assume the order of quotes is never violated,
        // so quote#5 can't come before quote#4
        if (statsStore.lastQuoteId + 1 !== incomingQuote.id) {
          const lostQuotes =
            statsStore.lostQuotes +
            incomingQuote.id -
            (statsStore.lastQuoteId + 1);
          statsStore.setLostQuotes(lostQuotes);
          debugStore.setLostQuotes(lostQuotes);
        }
      }
      statsStore.setLastQuoteId(incomingQuote.id);
      debugStore.setLastQuoteId(incomingQuote.id);
      statsStore.incrementNewQuotes();
      debugStore.incrementTotalQuotesReceived();
      statsStore.addQuoteValue(incomingQuote.value);
      if (statsStore.newQuotes === statsStore.quotesLimit) {
        const startTime = Date.now();
        const result = computeStatsFromQuotes(statsStore.quoteValues);
        const endTime = Date.now();
        runInAction(() => {
          statsStore.newQuotes = 0;
        });

        debugStore.incrementStatsComputedCount();
        statMutation.mutate({
          ...result,
          start_time: startTime,
          end_time: endTime,
          time_spent: endTime - startTime,
          lost_quotes: statsStore.lostQuotes,
        });
      }
    };
    const unbind = appStore.emitter.on("quoteReceived", onQuoteReceived);

    return () => {
      unbind();
    };
  }, []);

  const showStats = () => {
    if (statsStore.quoteValues.length > 2) {
      const startTime = Date.now();
      const result = computeStatsFromQuotes(statsStore.quoteValues);
      const endTime = Date.now();

      debugStore.incrementStatsComputedCount();
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
              defaultValue={statsStore.quotesLimit}
              placeholder="Кол-во котировок"
              onChange={(event) => {
                statsStore.setQuotesLimit(+event.currentTarget.value);
              }}
            />
            {statsStore.quotesLimit < 2 && (
              <S.ValidationMsg>
                Котировок должно быть не меньше двух
              </S.ValidationMsg>
            )}
          </S.InputContainer>
          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={statsStore.quotesLimit < 2}
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
