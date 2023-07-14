import { observer } from "mobx-react-lite";
import { useAppStore } from "../../stores/app.store";
import * as S from "./DebugPanel.style";

export const DebugPanel = observer(() => {
  const appStore = useAppStore();
  return (
    <S.Container>
      <S.Title>Debug panel</S.Title>
      <S.Stats>
        <div>Quotes received: {appStore.quotes.length}</div>
        <div>Stats computed: {appStore.stats.length}</div>
      </S.Stats>
    </S.Container>
  );
});
