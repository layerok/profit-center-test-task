import { observer } from "mobx-react-lite";
import { useAppStore } from "../../app.store";
import * as S from "./DebugPanel.style";

export const DebugPanel = observer(() => {
  const appStore = useAppStore();
  return (
    <S.Container>
      <S.Stats>
        <S.Stat>
          <S.Label>WebsSocket state: </S.Label>
          <S.Value>
            {appStore.websocketState === WebSocket.CLOSED ? "Closed" : ""}
            {appStore.websocketState === WebSocket.CONNECTING
              ? "Connecting"
              : ""}
            {appStore.websocketState === WebSocket.OPEN ? "Open" : ""}
            {appStore.websocketState === WebSocket.CLOSING ? "Closing" : ""}
          </S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Quotes received: </S.Label>
          <S.Value>{appStore.quotes.length}</S.Value>
        </S.Stat>
        <S.Stat>
          <S.Label>Stats computed: </S.Label>
          <S.Value> {appStore.stats.length}</S.Value>
        </S.Stat>
      </S.Stats>
    </S.Container>
  );
});
