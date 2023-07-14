import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStat } from "./api/api";
import { statsQueryKeys } from "./query-keys";

export const useAddStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStat,
    onSettled: () => {
      queryClient.invalidateQueries(statsQueryKeys.lists());
    },
  });
};
