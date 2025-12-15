import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  GetWalletAddressListParams,
  GetWalletAddressListResponse,
  CreateWalletAddressParams,
  IWalletAddress,
  UpdateWalletAddressParams,
  DeleteWalletAddressParams,
} from './types';

import { faker } from '@faker-js/faker';

const mockWalletAddressList = (val: number): IWalletAddress[] => {
  return Array.from({ length: val }, () => ({
    id: faker.string.uuid(),
    label: faker.string.alpha(10),
    address: faker.finance.ethereumAddress(),
    blockchain: faker.helpers.arrayElement(['ETH', 'BNB']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
  }));
}

export const getWalletAddressList = (
  params: GetWalletAddressListParams,
  signal?: AbortSignal
): Promise<GetWalletAddressListResponse> => {
  return new Promise<GetWalletAddressListResponse>((resolve) => {
    const random = Math.floor(Math.random() * 10) + 1;
    setTimeout(() => {
      resolve({
        data: mockWalletAddressList(random),
        hasNextPage: false,
        page: 1,
        totalPage: 1,
        totalCount: 10,
      });
    }, 1000);
  });

  // return httpInstance.get<GetWalletAddressListResponse>(KEYS.WALLET_ADDRESS, { params, signal }).then((res) => res);
};

export const createWalletAddress = (
  params: CreateWalletAddressParams,
  signal?: AbortSignal
): Promise<IWalletAddress> => {
  return httpInstance.post<IWalletAddress>(KEYS.WALLET_ADDRESS, params, { signal }).then((res) => res);
};

export const updateWalletAddress = (
  params: UpdateWalletAddressParams,
  signal?: AbortSignal
): Promise<IWalletAddress> => {
  const url = KEYS.WALLET_ADDRESS_DETAIL.replace(':id', params.id);
  return httpInstance.patch<IWalletAddress>(url, params, { signal }).then((res) => res);
};

export const deleteWalletAddress = (params: DeleteWalletAddressParams, signal?: AbortSignal): Promise<void> => {
  const url = KEYS.WALLET_ADDRESS_DETAIL.replace(':id', params.id);
  return httpInstance.delete<void>(url, { signal }).then((res) => res);
};