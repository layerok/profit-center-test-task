import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { Quote, Stat } from "../../Stats/types";
import { MobXProviderContext } from "mobx-react";

class DebugStore {
  constructor() {
    makeAutoObservable(this);
  }

  panelHidden = true;
  reportsCreated = 0;

  hideDebugPanel() {
    this.panelHidden = true;
  }

  showDebugPanel() {
    this.panelHidden = false;
  }

  toggleDebugPanel() {
    this.panelHidden = !this.panelHidden;
  }


  incrementStatsComputedCount() {
    this.reportsCreated++;
  }

  onQuoteReceived(incomingQuote: Quote) {

  }

  onStatCreated(stat: Omit<Stat, "id">) {
    this.incrementStatsComputedCount();
  }

  onAppStopped() {
    this.reportsCreated = 0;
  }
}

export const debugStore = new DebugStore();

export const useDebugStore = (): DebugStore => {
    const ctx = useContext(MobXProviderContext);
    return ctx.debugStore;
};
