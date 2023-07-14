import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { StatsRoute } from "./routes/stats/stats.route";
import { HomeRoute } from "./routes/home/home.route";
import { StatRoute } from "./routes/stat/stat.route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutRoute } from "./routes/layout/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
    children: [
      {
        element: <LayoutRoute />,
        children: [
          {
            path: "/stats",
            element: <StatsRoute />,
          },
          {
            path: "/stat/:id",
            element: <StatRoute />,
          },
        ],
      },
    ],
  },
]);

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
