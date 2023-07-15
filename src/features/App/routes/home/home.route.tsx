import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../../app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { observer } from "mobx-react-lite";
import { statsRoutePaths } from "../../../Stats/route.paths";
import { computeStatsFromQuotes } from "../../../Stats/computations/computeStatsFromQuotes";
import { useAddStat } from "../../../Stats/mutations";
import { toJS } from "mobx";
import { profile } from "../../../Stats/utils";

export const HomeRoute = observer(() => {
  const appStore = useAppStore();

  const navigate = useNavigate();

  const statMutation = useAddStat();

  const showStats = () => {
    if (appStore.quotes.length > 2) {
      // use toJS to convert ObservableArray to plain array, so calculations are faster
      const profileResult = profile(() => {
        return computeStatsFromQuotes(toJS(appStore.quotes));
      })
      appStore.addStat(profileResult.result);
      statMutation.mutate({
        ...profileResult.result,
        start_time: profileResult.startTime,
        end_time: profileResult.endTime,
        time_spent: profileResult.timeSpent
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
                    onCollectEnough: (quotes) => {
                      const profileResult = profile(() => {
                        return computeStatsFromQuotes(quotes);
                      });
               
                      appStore.addStat(profileResult.result);
                      statMutation.mutate({
                        ...profileResult.result,
                        start_time: profileResult.startTime,
                        end_time: profileResult.endTime,
                        time_spent: profileResult.timeSpent
                      });
                      console.log("statistics computed", profileResult);
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
