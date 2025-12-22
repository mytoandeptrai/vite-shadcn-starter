import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  GetBalanceMarketplaceParams,
  GetBalanceMarketplaceResponse,
  GetBalanceMerchantParams,
  GetBalanceMerchantResponse,
} from './types';

export const getMerchantBalance = (params: GetBalanceMerchantParams, signal?: AbortSignal) => {
  return httpInstance.get<GetBalanceMerchantResponse>(KEYS.BALANCE_MERCHANT, { params, signal }).then((res) => res);
};

export const getBalanceMarketplace = (params: GetBalanceMarketplaceParams, signal?: AbortSignal) => {
  return httpInstance
    .get<GetBalanceMarketplaceResponse>(KEYS.BALANCE_MARKETPLACE, { params, signal })
    .then((res) => res);
};