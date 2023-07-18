import { createContext, useContext } from "react";

export const appConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "",
  wsUrl: process.env.REACT_APP_WS_URL || "",
};

export const AppConfigContext = createContext(appConfig);

export const useAppConfig = () => {
  const appConfig = useContext(AppConfigContext);
  return appConfig;
};
