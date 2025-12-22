import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  CreateWalletAddressParams,
  DeleteWalletAddressParams,
  GetWalletAddressListParams,
  GetWalletAddressListResponse,
  IWalletAddress,
  UpdateWalletAddressParams,
} from './types';

export const getWalletAddressList = (params: GetWalletAddressListParams, signal?: AbortSignal) => {
  return httpInstance.get<GetWalletAddressListResponse>(KEYS.WALLET_ADDRESS, { params, signal }).then((res) => res);
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
  return httpInstance.put<IWalletAddress>(url, params, { signal }).then((res) => res);
};

export const deleteWalletAddress = (params: DeleteWalletAddressParams, signal?: AbortSignal): Promise<void> => {
  const url = KEYS.WALLET_ADDRESS_DETAIL.replace(':id', params.id);
  return httpInstance.delete<void>(url, { signal }).then((res) => res);
};
