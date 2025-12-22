import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getBalanceMarketplace, getMerchantBalance } from './requests';
import { KEYS } from './keys';
import type {
  GetBalanceMarketplaceParams,
  GetBalanceMarketplaceResponse,
  GetBalanceMerchantParams,
  GetBalanceMerchantResponse,
} from './types';

export const useGetMerchantBalance = (
  params: GetBalanceMerchantParams,
  options?: Omit<UseQueryOptions<GetBalanceMerchantResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetBalanceMerchantResponse, Error>({
    queryKey: [KEYS.BALANCE_MERCHANT, params],
    queryFn: ({ signal }) => getMerchantBalance(params, signal),
    ...options,
  });
};

export const useGetBalanceMarketplace = (
  params: GetBalanceMarketplaceParams,
  options?: Omit<UseQueryOptions<GetBalanceMarketplaceResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetBalanceMarketplaceResponse, Error>({
    queryKey: [KEYS.BALANCE_MARKETPLACE, params],
    queryFn: ({ signal }) => getBalanceMarketplace(params, signal),
    ...options,
  });
};