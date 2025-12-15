import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { KEYS } from "./keys";
import type {
  ApiKeyDetailParams,
  CreateApiKeyParams,
  GetApiKeyResponse,
} from "./types";
import { createApiKey, getApiKey } from "./requests";

export const useGetApiKeysDetail = (
  params: ApiKeyDetailParams,
  options?: Omit<UseQueryOptions<GetApiKeyResponse, Error>, "queryKey">
) => {
  return useQuery<GetApiKeyResponse, Error>({
    queryKey: [KEYS.API_KEY_DETAIL, params.id],
    queryFn: ({ signal }) => getApiKey(params, signal),
    ...options,
  });
};

export const useCreateApiKey = () => {
  return useMutation({
    mutationKey: [KEYS.API_KEYS],
    mutationFn: (data: CreateApiKeyParams) => createApiKey(data),
  });
};
