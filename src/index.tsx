import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./stores/app.store";
import { DebugProvider } from "./stores/debug.store";
import { routePaths } from "./constants";

console.log("env", process.env);

const router = createBrowserRouter([
  {
    path: routePaths.home,
    lazy: () => import("./routes/home/home.route"),
    children: [
      {
        lazy: () => import("./routes/stats/layout/layout"),
        children: [
          {
            path: routePaths.statsList,
            lazy: () => import("./routes/stats/list/list.route"),
          },
          {
            path: routePaths.statsDetail,
            lazy: () => import("./routes/stats/detail/detail.route"),
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DebugProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </DebugProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
