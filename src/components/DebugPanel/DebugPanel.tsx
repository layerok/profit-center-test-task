import { observer } from "mobx-react-lite";
import { appStore } from "../../stores/app.store";
import * as S from "./DebugPanel.style";

export const DebugPanel = observer(() => {
  return (
    <S.Container>
      <S.Title>Debug panel</S.Title>
      <S.Stats>Quotes received: {appStore.quotes.length}</S.Stats>
    </S.Container>
  );
});
