import { appConfig } from "../../../config/app.config";
import { IStat } from "../types";
import {
  IAddStatRes,
  IGetStatRes,
  IGetStatsReq,
  IGetStatsRes,
} from "./api.types";

export const getAllStats = async (
  params: IGetStatsReq = {}
): Promise<IGetStatsRes> => {
  const { limit = 25, offset = 0 } = params;

  const searchParams = new URLSearchParams();
  searchParams.append("limit", String(limit));
  searchParams.append("offset", String(offset));

  const url = `${appConfig.apiBaseUrl}/stats.php?${searchParams.toString()}`;
  const res = await fetch(url);
  return res.json();
};

export const addStat = async (
  params: Omit<IStat, "id">
): Promise<IAddStatRes> => {
  const formData = new FormData();
  formData.append("avg", String(params.avg));
  formData.append("min_value", String(params.min_value));
  formData.append("max_value", String(params.max_value));
  formData.append("start_time", String(params.start_time));
  formData.append("mode", String(params.mode));
  formData.append("mode_count", String(params.mode_count));
  formData.append("end_time", String(params.end_time));
  formData.append("time_spent", String(params.time_spent));
  formData.append("standard_deviation", String(params.standard_deviation));
  formData.append("lost_quotes", String(params.lost_quotes));
  formData.append("quotes_count", String(params.quotes_count));

  const url = `${appConfig.apiBaseUrl}/add_stat.php`;

  return fetch(url, {
    method: "POST",
    body: formData,
  });
};

export const getStat = async (id: number): Promise<IGetStatRes> => {
  const searchParams = new URLSearchParams();
  searchParams.append("id", String(id));

  const url = `${appConfig.apiBaseUrl}/get_stat.php?${searchParams.toString()}`;
  const res = await fetch(url);
  return res.json();
};
