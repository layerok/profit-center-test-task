import { appRoutePaths } from "./features/App/route.paths";
import { statsRoutePaths } from "./features/Stats/route.paths";

export const appRoutes = [
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
];
