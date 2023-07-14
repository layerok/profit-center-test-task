import { computeStatsFromQuotes } from "../../computeStatsFromQuotes";
import { Stat } from "../../types";
import { addStat } from "../../api/stats.api";
import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { routePaths } from "../../constants/route.constant";

export const HomeRoute = observer(() => {
  const queryClient = useQueryClient();

  const appStore = useAppStore();

  const navigate = useNavigate();

  const statMutation = useMutation({
    mutationFn: (record: Stat) => {
      return addStat(record);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["stats"]);
    },
  });

  const showStats = () => {
    if (appStore.quotes.length > 2) {
      const record = computeStatsFromQuotes(appStore.quotes);
      appStore.addStat(record);
      statMutation.mutate(record);
    }
    navigate(routePaths.stats);
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
                    onComputeStat: (record) => {
                      statMutation.mutate(record);
                      console.log("statistics computed", record);
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
