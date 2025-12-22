import type {
  GetBalanceMarketplaceParams,
  GetBalanceMarketplaceResponse,
  GetBalanceMerchantParams,
  GetBalanceMerchantResponse,
} from './types';

export const getMerchantBalance = (params: GetBalanceMerchantParams, signal?: AbortSignal) => {
  console.log('🚀 ~ getMerchantBalance ~ signal:', signal);
  console.log('🚀 ~ getMerchantBalance ~ params:', params);
  return new Promise<GetBalanceMerchantResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          availableBalance: Math.floor(Math.random() * 100000),
          incomingBalance: Math.floor(Math.random() * 100000),
        },
        code: 200,
        message: 'Success',
      });
    }, 500);
  });
  // return httpInstance
  //   .get<GetMerchantBalanceResponse>(KEYS.BALANCE_MERCHANT, { params, signal })
  //   .then((res) => res);
};

export const getBalanceMarketplace = (params: GetBalanceMarketplaceParams, signal?: AbortSignal) => {
  console.log('🚀 ~ getBalanceMarketplace ~ signal:', signal);
  console.log('🚀 ~ getBalanceMarketplace ~ params:', params);
  return new Promise<GetBalanceMarketplaceResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          availableBalance: Math.floor(Math.random() * 100000),
          incomingBalance: Math.floor(Math.random() * 100000),
        },
        code: 200,
        message: 'Success',
      });
    }, 500);
  });
  //   const url = KEYS.BALANCE_MARKETPLACE.replace(':id', params.id);
  // return httpInstance
  //   .get<GetBalanceMarketplaceResponse>(url, { params, signal })
  //   .then((res) => res);
};