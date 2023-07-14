import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { appRoutePaths } from "./features/App/route.paths";
import { statsRoutePaths } from "./features/Stats/route.paths";

const router = createBrowserRouter([
  {
    path: appRoutePaths.home,
    lazy: () => import("./features/App/routes/home/home.route"),
    children: [
      {
        lazy: () => import("./features/Stats/routes/layout/layout"),
        children: [
          {
            path: statsRoutePaths.list,
            lazy: () => import("./features/Stats/routes/list/list.route"),
          },
          {
            path: statsRoutePaths.detail,
            lazy: () => import("./features/Stats/routes/detail/detail.route"),
          },
        ],
      },
    ],
  },
]);

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
