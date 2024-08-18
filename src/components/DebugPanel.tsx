import { useDebugStore } from "../stores/debug.store";
import { ReactComponent as DebugIcon } from "../assets/debug.svg";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../stores/app.store";
import { IQuote, IStat } from "../api";
import styled from "styled-components";
import { media } from "../lib/styled-components";

export const DebugPanel = () => {
  const debugStore = useDebugStore();
  const appStore = useAppStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const unbind = appStore.on("appStarted", () => {
      debugStore.setStartTime(Date.now());
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("appStopped", () => {
      debugStore.reset();
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("statSaved", () => {
      debugStore.incrementReportsCreatedCount();
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("statComputed", (stat: Omit<IStat, "id">) => {
      debugStore.setLastStat(stat);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = appStore.on("quoteReceived", (quote: IQuote) => {
      debugStore.incrementTotalQuotesCount();
      debugStore.setLastQuote(quote);
    });

    return () => unbind();
  }, []);

  const time = useMemo(() => {
    if (debugStore.startTime != null) {
      return now - debugStore.startTime;
    }
    return 0;
  }, [now, debugStore.startTime]);

  const speed = useMemo(() => {
    if (time !== 0) {
      return debugStore.totalQuotesCount / (time / 1000);
    }
    return 0;
  }, [time, debugStore.totalQuotesCount]);

  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      setNow(Date.now());
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {!debugStore.panelHidden && (
        <S.Container>
          <S.Stats>
            <S.Stat>
              <S.Label>Total quotes: </S.Label>
              <S.Value>{debugStore.totalQuotesCount} </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Time: </S.Label>
              <S.Value>{Math.round(time / 1000)} seconds</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Speed: </S.Label>
              <S.Value>{Math.round(speed)} quotes/second</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Reports created: </S.Label>
              <S.Value> {debugStore.reportsCreatedCount}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Last quote id: </S.Label>
              <S.Value> {debugStore?.lastQuote?.id || "?"}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Lost quotes: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.lost_quotes}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Even values: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.even_values}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Odd values: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.odd_values}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Min value: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.min_value}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Max value: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.max_value}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Avg: </S.Label>
              <S.Value>
                {debugStore.lastStat !== null ? debugStore.lastStat.avg : "?"}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Mode: </S.Label>
              <S.Value>
                {debugStore.lastStat !== null ? (
                  <>
                    {debugStore.lastStat.mode} ({debugStore.lastStat.mode_count}
                    x)
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Standard deviation: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.standard_deviation}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Start time: </S.Label>
              <S.Value>
                {debugStore.startTime != null ? (
                  <>
                    {format(new Date(Number(debugStore.startTime)), "hh:mm:ss")}
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>End time: </S.Label>
              <S.Value>
                {debugStore.lastStat != null ? (
                  <>
                    {format(
                      new Date(Number(debugStore.lastStat.end_time)),
                      "hh:mm:ss"
                    )}
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>
          </S.Stats>
          <S.HideButton
            onClick={() => {
              debugStore.hideDebugPanel();
            }}
          >
            [X]
          </S.HideButton>
        </S.Container>
      )}

      <S.Trigger
        onClick={() => {
          debugStore.toggleDebugPanel();
        }}
      >
        <DebugIcon />
      </S.Trigger>
    </>
  );
};

const Container = styled.div`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  padding: 5px 10px;
  color: white;
  background: rgba(28, 28, 28, 0.8);
  min-width: 320px;
  padding-bottom: 10px;
  ${media.lessThan("mobile")`
    width: 100%;
  `}
`;

const Stats = styled.div`
  text-align: right;
`;

const Stat = styled.div`
  display: flex;
  font-size: 10px;
  margin-top: 5px;
`;

const Label = styled.div`
  width: 150px;
`;

const Value = styled.div`
  margin-left: 2px;
`;

const HideButton = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  cursor: pointer;
`;

const Trigger = styled.div`
  margin-top: 100px;
  position: fixed;
  bottom: 50px;
  width: 30px;
  right: 50px;
  cursor: pointer;
`;

const S = {
  Trigger,
  HideButton,
  Value,
  Label,
  Stat,
  Stats,
  Container
}
