import type { CommonRequestType, IPaginatedResponseType } from '@/types';
export interface IWalletAddress {
  id: string;
  label: string;
  address: string;
  blockchain: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetWalletAddressListParams extends CommonRequestType {
  blockchain?: string;
  address?: string;
}

export interface UpdateWalletAddressParams extends Partial<IWalletAddress> {
  id: string;
}

export interface CreateWalletAddressParams extends Partial<IWalletAddress> {}

export interface DeleteWalletAddressParams {
  id: string;
}

export interface GetWalletAddressListResponse extends IPaginatedResponseType<IWalletAddress[]> {}