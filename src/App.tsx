import React, { useEffect, useRef, useState } from "react";
import { computeStats } from "./computeStats";
import { Quote, Statistic } from "./types";
import { statisticsApi } from "./statisticsApi";
import * as S from "./App.style";
import ReactModal from "react-modal";
import { BaseModal } from "./components/BaseModal";

function App() {
  const websocketRef = useRef<WebSocket | null>(null);
  const quotesRef = useRef<Quote[]>([]);
  const statisticsRef = useRef<Statistic[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    statisticsApi.getAll().then(console.log);
  }, []);

  const [quotesLimit, setQuotesLimit] = useState(25);

  const start = () => {
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(
        "wss://trade.termplat.com:8800/?password=1234"
      );
      if (websocketRef.current !== null) {
        websocketRef.current.addEventListener("open", (ev: Event) => {
          console.log("open", ev);
        });
        websocketRef.current.addEventListener(
          "message",
          (ev: MessageEvent<string>) => {
            const quote = JSON.parse(ev.data) as Quote;
            quotesRef.current.push(quote);
            if (
              quotesRef.current.length -
                statisticsRef.current.length * quotesLimit >
              quotesLimit
            ) {
              const record = computeStats(quotesRef.current);
              if (false) {
                statisticsApi.addStat(record);
              }
              console.log("statistics computed", record);
              statisticsRef.current.push(record);
            }
          }
        );
      }
    }
  };

  const stop = () => {
    websocketRef.current?.close(1000);
    websocketRef.current = null;
  };

  const openStats = () => {
    setShowStatistics((prevState) => !prevState);
  };

  return (
    <S.Container>
      <button onClick={stop}>Stop</button>
      <main>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
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
            onClick={start}
          >
            Start
          </S.PrimaryButton>
        </div>

        <div
          style={{
            position: "absolute",
            top: 15,
            right: 13,
          }}
        >
          <S.SecondaryButton onClick={openStats}>Stats</S.SecondaryButton>
        </div>
       


      </main>
    </S.Container>
  );
}

export default App;
