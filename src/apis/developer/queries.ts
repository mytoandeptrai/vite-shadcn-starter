import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getSDKList, getSDKDetail } from './requests';
import type { GetSDKListParams, GetSDKListResponse, GetSDKDetailParams, GetSDKDetailResponse } from './types';

export const useGetSDKList = (
  params?: GetSDKListParams,
  options?: Omit<UseQueryOptions<GetSDKListResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetSDKListResponse, Error>({
    queryKey: [KEYS.SDK, params],
    queryFn: ({ signal }) => getSDKList(params || {}, signal),
    ...options,
  });
};

export const useGetSDKDetail = (
  params: GetSDKDetailParams,
  options?: Omit<UseQueryOptions<GetSDKDetailResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetSDKDetailResponse, Error>({
    queryKey: [KEYS.SDK_DETAIL, params.id],
    queryFn: ({ signal }) => getSDKDetail(params, signal),
    enabled: !!params.id,
    ...options,
  });
};
