import type { BaseResponseType } from '@/types';

export interface IBalance {
  balance_available: string
  balance_incoming: string
  chain: string
  crypto: string
  id: number
  marketplace_id: number
  merchant_id: number
  updated_at: string
}

export interface GetBalanceMarketplaceParams {
  id?: string;
  chain?: string;
  token?: string;
}

export interface GetBalanceMerchantParams {
  chain?: string;
  token?: string;
}

export interface GetBalanceMarketplaceResponse extends BaseResponseType<IBalance[]> {}
export interface GetBalanceMerchantResponse extends BaseResponseType<IBalance[]> {}