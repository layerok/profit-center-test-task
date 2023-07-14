import { DbStatistic } from "../types";

export type IGetStatsRes = {
  records: DbStatistic[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type IGetStatsReq = {
  limit?: number;
  offset?: number;
};
