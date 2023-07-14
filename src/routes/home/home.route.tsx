import React, { useRef, useState } from "react";
import { computeStats } from "../../computeStats";
import { Quote, Stat } from "../../types";
import { statisticsApi } from "../../api/statApi";
import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appStore } from "../../stores/app.store";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { appConfig } from "../../config/app.config";
import { observer } from "mobx-react-lite";

export const HomeRoute = observer(() => {
  const websocketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [quotesLimit, setQuotesLimit] = useState(100);

  const statMutation = useMutation({
    mutationFn: (record: Stat) => {
      return statisticsApi.addStat(record);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["stats"]);
    },
  });

  const connectWebsocket = () => {
    if (!websocketRef.current) {
      appStore.setWebSocketState(WebSocket.CONNECTING);
      websocketRef.current = new WebSocket(appConfig.wsUrl);
      if (websocketRef.current !== null) {
        const onMessage = (ev: MessageEvent<string>) => {
          const quote = JSON.parse(ev.data) as Quote;
          appStore.addQuote(quote);
          if (
            appStore.quotes.length -
              appStore.stats.length * quotesLimit ===
            quotesLimit
          ) {
            const record = computeStats(appStore.quotes);

            statMutation.mutate(record);

            console.log("statistics computed", record);
            appStore.addStat(record);
          }
        };
        const onFail = () => {
          appStore.setWebSocketState(WebSocket.CLOSING);
        };
        const onClose = () => {
          appStore.setWebSocketState(WebSocket.CLOSED);
        };
        const onOpen = (ev: Event) => {
          appStore.setWebSocketState(WebSocket.OPEN);
        };

        websocketRef.current.addEventListener("open", onOpen);
        websocketRef.current.addEventListener("close", onClose);
        websocketRef.current.addEventListener("fail", onFail);
        websocketRef.current.addEventListener("message", onMessage);
      }
    }
  };

  const disconnectWebsocket = () => {
    appStore.setWebSocketState(WebSocket.CLOSING);
    websocketRef.current?.close(1000);
    websocketRef.current = null;
  };

  const showStats = () => {
    navigate("/stats");
    if (appStore.quotes.length > 2) {
      const record = computeStats(appStore.quotes);
      statMutation.mutate(record);
    }
  }

  return (
    <S.Container>
      <main>
        <DebugPanel />
        <S.ControlsContainer>
          <S.InputContainer>
            <S.Input
              type="number"
              min="2"
              defaultValue={quotesLimit}
              placeholder="Кол-во котировок"
              onChange={(event) => {
                setQuotesLimit(+event.currentTarget.value);
              }}
            />
            {quotesLimit < 2 && (
              <S.ValidationMsg>
                Котировок должно быть не меньше двух
              </S.ValidationMsg>
            )}
          </S.InputContainer>
          <S.ButtonGroup>
            <S.PrimaryButton
              disabled={+quotesLimit < 2}
              onClick={() => {
                if (appStore.websocketState === WebSocket.CLOSED) {
                  connectWebsocket();
                } else {
                  disconnectWebsocket();
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
