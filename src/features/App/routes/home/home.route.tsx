import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { computeStatsFromQuotes } from "../../../Stats/computations/computeStatsFromQuotes";
import { useAddStat } from "../../../Stats/mutations";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();

  const navigate = useNavigate();

  const statMutation = useAddStat();

  const showStats = () => {
    if (appStore.quoteValues.length > 2) {
      const startTime = Date.now();
      const result = computeStatsFromQuotes(appStore.quoteValues);
      const endTime = Date.now();
      appStore.incrementStatsComputedCount();
      statMutation.mutate({
        ...result,
        start_time: startTime,
        end_time: endTime,
        time_spent: endTime - startTime,
        lost_quotes: appStore.lostQuotes,
      });
    }
    navigate(statsRoutePaths.list);
  };

  const start = () => {
    if (appStore.websocketState === WebSocket.CLOSED) {
      appStore.connectWebSocket({
        onQuoteRecieved: (quote) => {
          if (appStore.newlyReceivedQuotes === appStore.quotesLimit) {
            const startTime = Date.now();
            const result = computeStatsFromQuotes(appStore.quoteValues);
            const endTime = Date.now();

            appStore.incrementStatsComputedCount();
            statMutation.mutate({
              ...result,
              start_time: startTime,
              end_time: endTime,
              time_spent: endTime - startTime,
              lost_quotes: appStore.lostQuotes,
            });
          }
        },
      });
    } else {
      appStore.disconnectWebsocket();
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
              defaultValue={appStore.quotesLimit}
              placeholder="Кол-во котировок"
              onChange={(event) => {
                appStore.setQuotesLimit(+event.currentTarget.value);
              }}
            />
            {appStore.quotesLimit < 2 && (
              <S.ValidationMsg>
                Котировок должно быть не меньше двух
              </S.ValidationMsg>
            )}
          </S.InputContainer>
          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={appStore.quotesLimit < 2}
              onClick={start}
            >
              {appStore.websocketState === WebSocket.CLOSED ? "Start" : ""}
              {appStore.websocketState === WebSocket.CONNECTING
                ? "connecting..."
                : ""}
              {appStore.websocketState === WebSocket.OPEN ? "Stop" : ""}
              {appStore.websocketState === WebSocket.CLOSING
                ? "closing..."
                : ""}
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
