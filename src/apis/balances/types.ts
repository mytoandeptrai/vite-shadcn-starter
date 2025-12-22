import type { BaseResponseType } from '@/types';

export interface IBalance {
  availableBalance: number;
  incomingBalance: number;
}

export interface GetBalanceMarketplaceParams {
  id: string;
  chain: string;
  token: string;
}

export interface GetBalanceMerchantParams {
  chain: string;
  token: string;
}

export interface GetBalanceMarketplaceResponse extends BaseResponseType<IBalance> {}
export interface GetBalanceMerchantResponse extends BaseResponseType<IBalance> {}