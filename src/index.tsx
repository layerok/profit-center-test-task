import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { router } from "./router";

import { appConfig, AppConfigContext } from "./config/app.config";
import { AppProvider } from "./features/App/stores/app.store";
import { DebugProvider } from "./features/App/stores/debug.store";

console.log("env", process.env);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppConfigContext.Provider value={appConfig}>
      <QueryClientProvider client={queryClient}>
        <DebugProvider>
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        </DebugProvider>
      </QueryClientProvider>
    </AppConfigContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
