import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IQuote, IStat } from "../../Stats/types";
import { createContext, useMemo, useCallback } from "react";

type IDebugStore = {
  panelHidden: boolean;
  reportsCreatedCount: number;
  startTime: null | number;
  totalQuotesCount: number;
  lastQuote: IQuote | null;
  lastStat: Omit<IStat, "id"> | null;
  hideDebugPanel: () => void;
  showDebugPanel: () => void;
  toggleDebugPanel: () => void;
  incrementReportsCreatedCount: () => void;
  incrementTotalQuotesCount: () => void;
  setStartTime: Dispatch<SetStateAction<number | null>>;
  reset: () => void;
  setLastStat: Dispatch<SetStateAction<Omit<IStat, "id"> | null>>;
  setLastQuote: Dispatch<SetStateAction<null | IQuote>>;
};

export const DebugContext = createContext<IDebugStore | undefined>(undefined);

export const DebugProvider = ({ children }: { children: ReactElement }) => {
  const [panelHidden, setPanelHidden] = useState(true);
  const [reportsCreatedCount, setReportsCreatedCount] = useState(0);
  const [totalQuotesCount, setTotalQuotesCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastQuote, setLastQuote] = useState<IQuote | null>(null);
  const [lastStat, setLastStat] = useState<Omit<IStat, "id"> | null>(null);

  const incrementReportsCreatedCount = useCallback(() => {
    setReportsCreatedCount((prev) => prev + 1);
  }, []);

  const incrementTotalQuotesCount = useCallback(() => {
    setTotalQuotesCount((prev) => prev + 1);
  }, []);

  const showDebugPanel = useCallback(() => {
    setPanelHidden(false);
  }, []);
  
  const hideDebugPanel = useCallback(() => {
    setPanelHidden(true);
  }, []);

  const toggleDebugPanel = useCallback(() => {
    setPanelHidden((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setReportsCreatedCount(0);
    setStartTime(null);
    setLastQuote(null);
    setLastStat(null);
    setTotalQuotesCount(0);
  }, []);

  const ctx = useMemo(
    () => ({
      panelHidden,
      startTime,
      totalQuotesCount,
      lastQuote,
      lastStat,
      reportsCreatedCount,
      setLastQuote,
      setStartTime,
      showDebugPanel,
      hideDebugPanel,
      toggleDebugPanel,
      incrementReportsCreatedCount,
      incrementTotalQuotesCount,
      setLastStat,
      reset,
    }),
    [
      panelHidden,
      startTime,
      totalQuotesCount,
      lastQuote,
      lastStat,
      reportsCreatedCount,
      setLastQuote,
      setStartTime,
      showDebugPanel,
      hideDebugPanel,
      toggleDebugPanel,
      incrementReportsCreatedCount,
      incrementTotalQuotesCount,
      setLastStat,
      reset,
    ]
  );

  return <DebugContext.Provider value={ctx}>{children}</DebugContext.Provider>;
};

export const useDebugStore = (): IDebugStore => {
  const ctx = useContext(DebugContext);
  if (!ctx)
    throw new Error("No DebugContext.Provider found when calling useAppStore.");
  return ctx;
};
