import { DbStat } from "../types";

export type IGetStatsRes = {
  records: DbStat[];
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
