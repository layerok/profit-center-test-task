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
              <S.Value>{debugStore.totalQuotesReceived} </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Time: </S.Label>
              <S.Value>
                {debugStore.secondsPassedFromFirstQuote} (seconds)
              </S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Reports created: </S.Label>
              <S.Value> {debugStore.reportsCreated}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Lost quotes: </S.Label>
              <S.Value> {debugStore.lostQuotes}</S.Value>
            </S.Stat>
            {debugStore.lastQuoteId != null && (
              <S.Stat>
                <S.Label>Last quote id: </S.Label>
                <S.Value> {debugStore.lastQuoteId}</S.Value>
              </S.Stat>
            )}

            <S.Stat>
              <S.Label>Speed: </S.Label>
              <S.Value> {debugStore.speed} quotes/second</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Min value: </S.Label>
              <S.Value> {statsStore.minValue}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Max value: </S.Label>
              <S.Value> {statsStore.maxValue}</S.Value>
            </S.Stat>
            <S.Stat>
              <S.Label>Avg: </S.Label>
              <S.Value> {statsStore.avg}</S.Value>
            </S.Stat>
            {statsStore.mode != null && (
              <S.Stat>
                <S.Label>Mode: </S.Label>
                <S.Value>
                  {statsStore.mode} ({statsStore.maxModeCount}x)
                </S.Value>
              </S.Stat>
            )}

            {statsStore.standardDeviation != null && (
              <S.Stat>
                <S.Label>Standard deviation: </S.Label>
                <S.Value> {statsStore.standardDeviation}</S.Value>
              </S.Stat>
            )}

            {statsStore.startTime != null && (
              <S.Stat>
                <S.Label>Start time: </S.Label>
                <S.Value>
                  {format(new Date(Number(statsStore.startTime)), "hh:mm:ss")}
                </S.Value>
              </S.Stat>
            )}
            {statsStore.endTime != null && (
              <S.Stat>
                <S.Label>End time: </S.Label>
                <S.Value>
                  {format(new Date(Number(statsStore.endTime)), "hh:mm:ss")}
                </S.Value>
              </S.Stat>
            )}
            <S.Stat>
              <S.Label>Time spent on computations: </S.Label>
              <S.Value>{statsStore.timeSpent} (seconds)</S.Value>
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
