export const appConfig = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "",
    wsUrl: process.env.REACT_APP_WS_URL || ""
}

export const useAppConfig = () => {
    return appConfig;
}