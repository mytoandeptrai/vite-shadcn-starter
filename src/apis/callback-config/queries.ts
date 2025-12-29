import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getCallbackConfig, updateCallbackConfig } from './requests';
import type { GetCallbackConfigResponse, UpdateCallbackConfigParams } from './types';

export const useGetCallbackConfig = (
  options?: Omit<UseQueryOptions<GetCallbackConfigResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetCallbackConfigResponse, Error>({
    queryKey: [KEYS.CALLBACK_CONFIG],
    queryFn: ({ signal }) => getCallbackConfig(signal),
    ...options,
  });
};

export const useUpdateCallbackConfig = () => {
  return useMutation({
    mutationKey: [KEYS.CALLBACK_CONFIG],
    mutationFn: (data: UpdateCallbackConfigParams) => updateCallbackConfig(data),
  });
};