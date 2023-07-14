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

export const HomeRoute = () => {
  const websocketRef = useRef<WebSocket | null>(null);
  const statisticsRef = useRef<Stat[]>([]);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [quotesLimit, setQuotesLimit] = useState(100);
  const [websocketState, setWebsocketState] = useState<number>(
    WebSocket.CLOSED
  );

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
      setWebsocketState(WebSocket.CONNECTING);
      websocketRef.current = new WebSocket(appConfig.wsUrl);
      if (websocketRef.current !== null) {
        const onMessage = (ev: MessageEvent<string>) => {
          const quote = JSON.parse(ev.data) as Quote;
          appStore.addQuote(quote);
          if (
            appStore.quotes.length -
              statisticsRef.current.length * quotesLimit ===
            quotesLimit
          ) {
            const record = computeStats(appStore.quotes);

            statMutation.mutate(record);

            console.log("statistics computed", record);
            statisticsRef.current.push(record);
          }
        };
        const onFail = () => {
          setWebsocketState(WebSocket.CLOSING);
        };
        const onClose = () => {
          setWebsocketState(WebSocket.CLOSED);
        };
        const onOpen = (ev: Event) => {
          setWebsocketState(WebSocket.OPEN);
        };

        websocketRef.current.addEventListener("open", onOpen);
        websocketRef.current.addEventListener("close", onClose);
        websocketRef.current.addEventListener("fail", onFail);
        websocketRef.current.addEventListener("message", onMessage);
      }
    }
  };

  const disconnectWebsocket = () => {
    setWebsocketState(WebSocket.CLOSING);
    websocketRef.current?.close(1000);
    websocketRef.current = null;
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
          <div style={{
            display: 'flex',
            marginTop: 14,
            justifyContent: 'space-between'
          }}>
            <S.PrimaryButton
              disabled={+quotesLimit < 2}
 
              onClick={() => {
                if (websocketState === WebSocket.CLOSED) {
                  connectWebsocket();
                } else {
                  disconnectWebsocket();
                }
              }}
            >
              {websocketState === WebSocket.CLOSED ? "Start" : ""}
              {websocketState === WebSocket.CONNECTING ? "connecting..." : ""}
              {websocketState === WebSocket.OPEN ? "Stop" : ""}
              {websocketState === WebSocket.CLOSING ? "closing..." : ""}
            </S.PrimaryButton>
            <S.SecondaryButton
              onClick={() => {
                navigate("/stats");
                if (appStore.quotes.length > 2) {
                  const record = computeStats(appStore.quotes);
                  statMutation.mutate(record);
                }
              }}
            >
              Статистика
            </S.SecondaryButton>
          </div>
        </S.ControlsContainer>
      </main>
      <Outlet />
    </S.Container>
  );
};
