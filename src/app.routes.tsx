import { StatsRoute } from "./routes/stats/stats.route";
import { HomeRoute } from "./routes/home/home.route";
import { StatRoute } from "./routes/stat/stat.route";
import { LayoutRoute } from "./routes/layout/layout";

export const appRoutes = [
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
];
