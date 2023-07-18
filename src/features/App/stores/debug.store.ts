import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { MobXProviderContext } from "mobx-react";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  panelHidden = true;
  reportsCreatedCount = 0;

  hideDebugPanel() {
    this.panelHidden = true;
  }

  showDebugPanel() {
    this.panelHidden = false;
  }

  toggleDebugPanel() {
    this.panelHidden = !this.panelHidden;
  }

  incrementReportsCreatedCount() {
    this.reportsCreatedCount++;
  }

  setReportsCreatedCount(count: number) {
    this.reportsCreatedCount = count;
  }

  reset() {
    this.reportsCreatedCount = 0;
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = (): DebugStore => {
  const ctx = useContext(MobXProviderContext);
  return ctx.debugStore;
};
