import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getTransactionDetail, getTransactionList } from './requests';
import type {
  GetTransactionDetailParams,
  GetTransactionDetailResponse,
  GetTransactionListParams,
  GetTransactionListResponse,
} from './types';

export const useGetTransactionList = (
  params: GetTransactionListParams,
  options?: Omit<UseQueryOptions<GetTransactionListResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetTransactionListResponse, Error>({
    queryKey: [KEYS.TRANSACTIONS, params],
    queryFn: ({ signal }) => getTransactionList(params, signal),
    ...options,
  });
};

export const useGetTransactionDetail = (
  params: GetTransactionDetailParams,
  options?: Omit<UseQueryOptions<GetTransactionDetailResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetTransactionDetailResponse, Error>({
    queryKey: [KEYS.TRANSACTION_DETAIL, params],
    queryFn: ({ signal }) => getTransactionDetail(params, signal),
    ...options,
  });
};