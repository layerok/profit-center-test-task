import { observer } from "mobx-react-lite";
import { useStatsStore } from "../../../Stats/stores/stats.store";
import { useAppStore } from "../../stores/app.store";
import * as S from "./StartButton.style";

export const StartButton = observer(() => {
  const statsStore = useStatsStore();
  const appStore = useAppStore();

  const startApp = () => {
    if (appStore.isIdling) {
      appStore.start();
    } else {
      appStore.stop();
    }
  };
  return (
    <S.Button
      disabled={
        statsStore.stepper.step < statsStore.stepper.minStep ||
        appStore.isStarting ||
        appStore.isStopping
      }
      onClick={startApp}
    >
      {appStore.isIdling ? "Start" : ""}
      {appStore.isStarting ? "starting..." : ""}
      {appStore.isStarted ? "Stop" : ""}
      {appStore.isStopping ? "stopping..." : ""}
    </S.Button>
  );
});
