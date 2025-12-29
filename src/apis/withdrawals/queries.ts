import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { createWithdrawal, getWithdrawalList } from './requests';
import type { CreateWithdrawalParams, GetWithdrawalListParams, GetWithdrawalListResponse } from './types';
import { KEYS } from './keys';

export const useGetWithdrawalList = (
  params: GetWithdrawalListParams,
  options?: Omit<UseQueryOptions<GetWithdrawalListResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetWithdrawalListResponse, Error>({
    queryKey: [KEYS.WITH_DRAWALS, params],
    queryFn: ({ signal }) => getWithdrawalList(params, signal),
    ...options,
  });
};

export const useCreateWithdrawal = () => {
  return useMutation({
    mutationKey: [KEYS.WITH_DRAWALS],
    mutationFn: (data: CreateWithdrawalParams) => createWithdrawal(data),
  });
};