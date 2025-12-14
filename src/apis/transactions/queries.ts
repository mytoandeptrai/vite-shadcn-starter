import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getTransactionList } from './requests';
import type {
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
