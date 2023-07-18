import { observer } from "mobx-react-lite";
import { useDebugStore } from "../../stores/debug.store";
import * as S from "./DebugPanel.style";
import { ReactComponent as DebugIcon } from "../../assets/debug.svg";
import { useStatsStore } from "../../../Stats/stats.store";
import { format } from "date-fns";

export const DebugPanel = observer(() => {
  const debugStore = useDebugStore();
  const statsStore = useStatsStore();

  return (
    <>
      {!debugStore.panelHidden && (
        <S.Container>
          <S.Stats>
            <S.Stat>
              <S.Label>Total quotes: </S.Label>
              <S.Value>{statsStore.totalQuotesCount} </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Time: </S.Label>
              <S.Value>{Math.round(statsStore.time / 1000)} seconds</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Speed: </S.Label>
              <S.Value>
                {Math.round(statsStore.speed / 1000)} quotes/second
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Reports created: </S.Label>
              <S.Value> {debugStore.reportsCreated}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Lost quotes: </S.Label>
              <S.Value> {statsStore.lostQuotes}</S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Time spent on computations: </S.Label>
              <S.Value>{statsStore.timeSpent} (seconds)</S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Last quote id: </S.Label>
              <S.Value> {statsStore.lastQuoteId || "?"}</S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Min value: </S.Label>
              <S.Value>
                {statsStore.minValue === null ? "?" : statsStore.minValue}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Max value: </S.Label>
              <S.Value>
                {statsStore.maxValue === null ? "?" : statsStore.maxValue}
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Avg: </S.Label>
              <S.Value>
                {statsStore.avg !== null ? statsStore.avg : "?"}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Mode: </S.Label>
              <S.Value>
                {statsStore.mode !== null ? (
                  <>
                    {statsStore.mode} ({statsStore.modeCount}x)
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Standard deviation: </S.Label>
              <S.Value>
                {statsStore.standardDeviation === null
                  ? "?"
                  : statsStore.standardDeviation}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>Start time: </S.Label>
              <S.Value>
                {statsStore.startTime != null ? (
                  <>
                    {format(new Date(Number(statsStore.startTime)), "hh:mm:ss")}
                  </>
                ) : (
                  "?"
                )}
              </S.Value>
            </S.Stat>

            <S.Stat>
              <S.Label>End time: </S.Label>
              <S.Value>
                {statsStore.endTime != null ? (
                  <>
                    {format(new Date(Number(statsStore.endTime)), "hh:mm:ss")}
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
