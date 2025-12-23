import type { BaseResponseType } from '@/types';

export interface IExchangeRate {
  currency: string;
  token: string;
  rate: number;
  source: string;
}

export interface GetMerchantExchangeRatesParams {
  currency: string;
  token: string;
}

export interface GetMerchantExchangeRatesResponse extends BaseResponseType<IExchangeRate> {}
