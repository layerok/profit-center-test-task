import { observer } from "mobx-react-lite";
import { quotesStore } from "../../stores/quotes.store";

export const DebugPanel = observer(() => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        padding: 5,
        fontSize: 10,
        color: "white",
        background: `rgba(28,28,28,.8)`,
      }}
    >
      Total quotes: {quotesStore.quotes.length}
    </div>
  );
});
