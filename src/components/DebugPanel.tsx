
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { IQuote, IStat } from "../api";
import styled from "styled-components";
import { media } from "../lib/styled-components";
import {emitter} from "../emitter";

export const DebugPanel = ({
  isHidden,
  onChangeVisibility
}: {
  isHidden: boolean,
  onChangeVisibility: (visible: boolean) => void,
}) => {
  const [reportsCreatedCount, setReportsCreatedCount] = useState(0);
  const [totalQuotesCount, setTotalQuotesCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastQuote, setLastQuote] = useState<IQuote | null>(null);
  const [lastStat, setLastStat] = useState<Omit<IStat, "id"> | null>(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const unbind = emitter.on("appStarted", () => {
      setStartTime(Date.now());
    });
    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = emitter.on("appStopped", () => {
      setReportsCreatedCount(0);
      setStartTime(null);
      setLastQuote(null);
      setLastStat(null);
      setTotalQuotesCount(0);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = emitter.on("statSaved", () => {
     setReportsCreatedCount(prev => prev + 1);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = emitter.on("statComputed", (stat: Omit<IStat, "id">) => {
      setLastStat(stat);
    });

    return () => unbind();
  }, []);

  useEffect(() => {
    const unbind = emitter.on("quoteReceived", (quote: IQuote) => {
      setTotalQuotesCount(prev => prev + 1);
      setLastQuote(quote);
    });

    return () => unbind();
  }, []);

  const time = useMemo(() => {
    if (startTime != null) {
      return now - startTime;
    }
    return 0;
  }, [now, startTime]);

  const speed = useMemo(() => {
    if (time !== 0) {
      return totalQuotesCount / (time / 1000);
    }
    return 0;
  }, [time, totalQuotesCount]);

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
      {!isHidden && (
        <S.Container>
          <S.Stats>
            <S.Stat>
              <S.Label>Total quotes: </S.Label>
              <S.Value>{totalQuotesCount} </S.Value>
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
              <S.Value> {reportsCreatedCount}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Last quote id: </S.Label>
              <S.Value> {lastQuote?.id || "?"}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Lost quotes: </S.Label>
              <S.Value>
                {lastStat === null
                  ? "?"
                  : lastStat.lost_quotes}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Even values: </S.Label>
              <S.Value>
                {lastStat === null
                  ? "?"
                  : lastStat.even_values}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Odd values: </S.Label>
              <S.Value>
                {lastStat === null
                  ? "?"
                  : lastStat.odd_values}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Min value: </S.Label>
              <S.Value>
                {lastStat === null
                  ? "?"
                  :lastStat.min_value}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Max value: </S.Label>
              <S.Value>
                {lastStat === null
                  ? "?"
                  : lastStat.max_value}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Avg: </S.Label>
              <S.Value>
                {lastStat !== null ? lastStat.avg : "?"}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Mode: </S.Label>
              <S.Value>
                {lastStat !== null ? (
                  <>
                    {lastStat.mode} ({lastStat.mode_count}
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
                {lastStat === null
                  ? "?"
                  : lastStat.standard_deviation}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Start time: </S.Label>
              <S.Value>
                {startTime != null ? (
                  <>
                    {format(new Date(Number(startTime)), "hh:mm:ss")}
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>End time: </S.Label>
              <S.Value>
                {lastStat != null ? (
                  <>
                    {format(
                      new Date(Number(lastStat.end_time)),
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
              onChangeVisibility(false);
            }}
          >
            [X]
          </S.HideButton>
        </S.Container>
      )}


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

const S = {
  HideButton,
  Value,
  Label,
  Stat,
  Stats,
  Container
}
