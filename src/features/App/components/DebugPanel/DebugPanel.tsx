import { observer } from "mobx-react-lite";
import { useDebugStore } from "../../stores/debug.store";
import * as S from "./DebugPanel.style";
import { ReactComponent as DebugIcon } from "../../assets/debug.svg";
import { format } from "date-fns";

export const DebugPanel = observer(() => {
  const debugStore = useDebugStore();

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
              <S.Value>{Math.round(debugStore.time / 1000)} seconds</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Speed: </S.Label>
              <S.Value>{Math.round(debugStore.speed)} quotes/second</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Last quote id: </S.Label>
              <S.Value> {debugStore?.lastQuote?.id || "?"}</S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Reports created: </S.Label>
              <S.Value> {debugStore.reportsCreatedCount}</S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Time spent on computations: </S.Label>
              <S.Value>
                {debugStore.lastStat === null
                  ? "?"
                  : debugStore.lastStat.time_spent / 1000}
                (seconds)
              </S.Value>
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
});
