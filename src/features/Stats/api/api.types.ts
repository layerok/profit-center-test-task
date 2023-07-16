import { Stat } from "../types";

export type IGetStatsRes = {
  records: Stat[];
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
