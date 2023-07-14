import { StatsRoute } from "./routes/stats/stats.route";
import { HomeRoute } from "./routes/home/home.route";
import { StatRoute } from "./routes/stat/stat.route";
import { LayoutRoute } from "./routes/layout/layout";
import { routePaths } from "./constants/route.constant";

export const appRoutes = [
  {
    path: routePaths.home,
    element: <HomeRoute />,
    children: [
      {
        element: <LayoutRoute />,
        children: [
          {
            path: routePaths.stats,
            element: <StatsRoute />,
          },
          {
            path: routePaths.stat,
            element: <StatRoute />,
          },
        ],
      },
    ],
  },
];
