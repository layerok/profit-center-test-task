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
