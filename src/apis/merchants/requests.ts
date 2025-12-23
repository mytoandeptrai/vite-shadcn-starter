import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  GetMerchantExchangeRatesParams,
  GetMerchantExchangeRatesResponse
} from './types';

export const getMerchantExchangeRates = (params: GetMerchantExchangeRatesParams, signal?: AbortSignal) => {
  return httpInstance
    .get<GetMerchantExchangeRatesResponse>(KEYS.MERCHANT_EXCHANGE_RATES, { params, signal })
    .then((res) => res);
};
