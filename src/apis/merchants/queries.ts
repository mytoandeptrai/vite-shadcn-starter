import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getMerchantExchangeRates } from './requests';
import type {
  GetMerchantExchangeRatesParams,
  GetMerchantExchangeRatesResponse
} from './types';

export const useGetMerchantExchangeRates = (
  params: GetMerchantExchangeRatesParams,
  options?: Omit<UseQueryOptions<GetMerchantExchangeRatesResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetMerchantExchangeRatesResponse, Error>({
    queryKey: [KEYS.MERCHANT_EXCHANGE_RATES, params],
    queryFn: ({ signal }) => getMerchantExchangeRates(params, signal),
    ...options,
  });
};