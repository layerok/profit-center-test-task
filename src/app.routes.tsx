import { routePaths } from "./constants/route.constant";

export const appRoutes = [
  {
    path: routePaths.home,
    lazy: () => import('./routes/home/home.route'),
    children: [
      {
        lazy: () => import('./routes/layout/layout'),
        children: [
          {
            path: routePaths.stats,
            lazy: () => import('./routes/stats/stats.route')
          },
          {
            path: routePaths.stat,
            lazy: () => import('./routes/stat/stat.route'),
          },
        ],
      },
    ],
  },
];
