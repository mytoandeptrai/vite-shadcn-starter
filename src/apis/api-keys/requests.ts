import httpInstance from "../http-instance";
import { KEYS } from "./keys";
import type {
  ApiKeyDetailParams,
  CreateApiKeyParams,
  GetApiKeyMetricsResponse,
  GetApiKeyResponse,
} from "./types";

export const createApiKey = (
  params: CreateApiKeyParams,
  signal?: AbortSignal
) => {
  return httpInstance
    .post<GetApiKeyResponse>(KEYS.API_KEYS, params, { signal })
    .then((res) => res);
};

export const getApiKey = (params: ApiKeyDetailParams, signal?: AbortSignal) => {
  const url = `${KEYS.API_KEY_DETAIL.replace(":id", params.id)}`;
  return httpInstance
    .get<GetApiKeyResponse>(url, { signal })
    .then((res) => res);
};

export const deleteApiKey = (
  params: ApiKeyDetailParams,
  signal?: AbortSignal
) => {
  const url = `${KEYS.API_KEY_DETAIL.replace(":id", params.id)}`;
  return httpInstance
    .delete<GetApiKeyResponse>(url, { signal })
    .then((res) => res);
};

export const getApiKeyMetrics = (
  params: ApiKeyDetailParams,
  signal?: AbortSignal
) => {
  const url = `${KEYS.API_KEY_METRICS.replace(":id", params.id)}`;
  return httpInstance
    .get<GetApiKeyMetricsResponse>(url, { signal })
    .then((res) => res);
};
