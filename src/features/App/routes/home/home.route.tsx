import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { computeStatsFromQuotes } from "../../../Stats/computations/computeStatsFromQuotes";
import { useAddStat } from "../../../Stats/mutations";
import { profile } from "../../../Stats/utils";
import { useRef } from "react";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();

  const navigate = useNavigate();

  const statMutation = useAddStat();
  const quoteValuesRef = useRef<number[]>([]);

  const showStats = () => {
    if (quoteValuesRef.current.length > 2) {
      const profileResult = profile(() => {
        return computeStatsFromQuotes(quoteValuesRef.current);
      });
      appStore.incrementStatsComputedCount();
      statMutation.mutate({
        ...profileResult.result,
        start_time: profileResult.startTime,
        end_time: profileResult.endTime,
        time_spent: profileResult.timeSpent,
        lost_quotes: appStore.lostQuotes,
      });
    }
    navigate(statsRoutePaths.list);
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
              onClick={() => {
                if (appStore.websocketState === WebSocket.CLOSED) {
                  appStore.connectWebSocket({
                    onQuoteRecieved: (quote) => {
                      quoteValuesRef.current.push(quote.value);
                      if (
                        appStore.newlyReceivedQuotes === appStore.quotesLimit
                      ) {
                        const profileResult = profile(() => {
                          return computeStatsFromQuotes(quoteValuesRef.current);
                        });

                        appStore.incrementStatsComputedCount();
                        statMutation.mutate({
                          ...profileResult.result,
                          start_time: profileResult.startTime,
                          end_time: profileResult.endTime,
                          time_spent: profileResult.timeSpent,
                          lost_quotes: appStore.lostQuotes,
                        });
                        console.log("statistics computed", profileResult);
                      }
                    },
                  });
                } else {
                  appStore.disconnectWebsocket();
                }
              }}
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
