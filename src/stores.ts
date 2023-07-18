import { appStore } from "./features/App/stores/app.store";
import { debugStore } from "./features/App/stores/debug.store";
import { stepperStore } from "./features/App/stores/stepper.store";
import { statsStore } from "./features/Stats/stores/stats.store";

export const stores = {
  appStore,
  debugStore,
  statsStore,
  stepperStore
};
