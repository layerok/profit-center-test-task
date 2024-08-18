export const statsQueryKeys = {
  all: ["stats"] as const,
  lists: () => [...statsQueryKeys.all, "list"] as const,
  list: (filters: { offset?: number; limit?: number }) => [
    ...statsQueryKeys.lists(),
    { filters } as const,
  ],
  details: () => [...statsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...statsQueryKeys.details(), id],
  infiniteList: () => [...statsQueryKeys.all, "infinite-list"] as const,
};

export const routePaths = {
  home: '/',
  statsList: "/stats",
  statsDetail: "/stat/:id",
}

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
export const WS_URL = process.env.REACT_APP_WS_URL || "";
