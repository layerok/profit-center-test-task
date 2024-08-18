import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addStat, getAllStats, getStat, IStat, IGetStatsRes} from "./api";
import { statsQueryKeys } from "./constants";

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
    return useQuery<IStat>({
      queryKey: statsQueryKeys.detail(id),
      queryFn: () => {
        return getStat(id);
      },
    });
}

export const useAddStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStat,
    onSettled: () => {
      queryClient.invalidateQueries(statsQueryKeys.lists());
      queryClient.invalidateQueries(statsQueryKeys.infiniteList());
    },
  });
};
