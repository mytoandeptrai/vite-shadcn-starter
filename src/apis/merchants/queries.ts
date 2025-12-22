import type { BaseResponseType } from '@/types';
import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createMerchant, getMerchantExchangeRates, getMerchantList, updateMerchantStatus } from './requests';
import type {
  CreateMerchantParams,
  GetMerchantExchangeRatesParams,
  GetMerchantExchangeRatesResponse,
  GetMerchantListParams,
  GetMerchantListResponse,
  IMerchant,
  UpdateMerchantStatusParams,
} from './types';

export const useGetMerchantList = (
  params: GetMerchantListParams,
  options?: Omit<UseQueryOptions<GetMerchantListResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetMerchantListResponse, Error>({
    queryKey: [KEYS.MERCHANTS, params],
    queryFn: ({ signal }) => getMerchantList(params, signal),
    ...options,
  });
};

export const useCreateMerchant = () => {
  return useMutation<IMerchant, BaseResponseType, CreateMerchantParams>({
    mutationKey: [KEYS.MERCHANTS],
    mutationFn: (data) => createMerchant(data),
  });
};

export const useUpdateMerchantStatus = () => {
  return useMutation<IMerchant, BaseResponseType, UpdateMerchantStatusParams>({
    mutationKey: [KEYS.MERCHANT_STATUS],
    mutationFn: (data) => updateMerchantStatus(data),
  });
};

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