import React, { useRef, useState } from "react";
import { computeStats } from "../../computeStats";
import { Quote, Stat } from "../../types";
import { statisticsApi } from "../../api/statApi";
import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { quotesStore } from "../../stores/quotes.store";

const Debug = observer(() => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        padding: 5,
        fontSize: 10,
        color: "white",
        background: `rgba(28,28,28,.8)`,
      }}
    >
      Total quotes: {quotesStore.quotes.length}
    </div>
  );
});

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
      websocketRef.current = new WebSocket(
        "wss://trade.termplat.com:8800/?password=1234"
      );
      if (websocketRef.current !== null) {
        const onMessage = (ev: MessageEvent<string>) => {
          const quote = JSON.parse(ev.data) as Quote;
          quotesStore.addQuote(quote);
          if (
            quotesStore.quotes.length -
              statisticsRef.current.length * quotesLimit ===
            quotesLimit
          ) {
            const record = computeStats(quotesStore.quotes);

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
        <Debug />
        <S.ControlsContainer>
          <S.Input
            type="number"
            min="2"
            defaultValue={quotesLimit}
            placeholder="Enter quotes amount"
            onChange={(event) => {
              setQuotesLimit(+event.currentTarget.value);
            }}
          />
          <S.PrimaryButton
            style={{
              marginTop: 14,
            }}
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
        </S.ControlsContainer>
        <S.StatsButtonContainer>
          <S.SecondaryButton
            onClick={() => {
              navigate("/stats");
              if (quotesStore.quotes.length > 2) {
                const record = computeStats(quotesStore.quotes);
                statMutation.mutate(record);
              }
            }}
          >
            Stats
          </S.SecondaryButton>
        </S.StatsButtonContainer>
      </main>
      <Outlet />
    </S.Container>
  );
};
