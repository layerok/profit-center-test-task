import React, { useRef, useState } from "react";
import { computeStats } from "../../computeStats";
import { Quote, Statistic } from "../../types";
import { statisticsApi } from "../../api/statisticsApi";
import * as S from "./home.style";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../..";

export const HomeRoute = () => {
  const websocketRef = useRef<WebSocket | null>(null);
  const quotesRef = useRef<Quote[]>([]);
  const statisticsRef = useRef<Statistic[]>([]);

  const navigate = useNavigate();
  const [quotesLimit, setQuotesLimit] = useState(100);
  const [websocketState, setWebsocketState] = useState<number>(
    WebSocket.CLOSED
  );

  const statMutation = useMutation({
    mutationFn: (record: Statistic) => {
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
          quotesRef.current.push(quote);
          if (
            quotesRef.current.length -
              statisticsRef.current.length * quotesLimit ===
            quotesLimit
          ) {
            const record = computeStats(quotesRef.current);

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
              if (quotesRef.current.length > 2) {
                const record = computeStats(quotesRef.current);
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
