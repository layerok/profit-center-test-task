import { IStat } from "../types";

export type IGetStatsRes = {
  records: IStat[];
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

export type IAddStatRes = {}

export type IGetStatRes = IStat;
