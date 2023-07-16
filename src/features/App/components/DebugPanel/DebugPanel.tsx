import { observer } from "mobx-react-lite";
import { useDebugStore } from "../../stores/debug.store";
import * as S from "./DebugPanel.style";

export const DebugPanel = observer(() => {
  const debugStore = useDebugStore();
  if (debugStore.panelHidden) {
    return null;
  }
  return (
    <S.Container>
      <S.Stats>
        <S.Stat>
          <S.Label>Total quotes: </S.Label>
          <S.Value>{debugStore.totalQuotesReceived}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Stats computed: </S.Label>
          <S.Value> {debugStore.statsComputedCount}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Lost quotes: </S.Label>
          <S.Value> {debugStore.lostQuotes}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Last quote id: </S.Label>
          <S.Value> {debugStore.lastQuoteId}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Seconds passed since first quote: </S.Label>
          <S.Value> {debugStore.secondsPassedFromFirstQuote} seconds</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Speed: </S.Label>
          <S.Value> {debugStore.speed} quotes/second</S.Value>
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
  );
});
