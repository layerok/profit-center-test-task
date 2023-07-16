import { useQuery } from "@tanstack/react-query";
import { getAllStats, getStat } from "./api/api";
import { IGetStatsRes } from "./api/api.types";
import { statsQueryKeys } from "./query-keys";
import { Stat } from "./types";

export const useStatsQuery = ({
  limit = 25,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) => {
  return useQuery<IGetStatsRes>({
    queryKey: statsQueryKeys.list({
      limit,
      offset,
    }),
    queryFn: () => {
      return getAllStats({
        limit,
        offset,
      });
    },
  });
};

export const useStatQuery = (id: number) => {
    return useQuery<Stat>({
      queryKey: statsQueryKeys.detail(id),
      queryFn: () => {
        return getStat(id);
      },
    });
}
