import type { CommonRequestType, IPaginatedResponseType } from '@/types';
export interface IWalletAddress {
  address: string;
  chain: string;
  token?: string;
  createdAt: string;
  id: string;
  isActive: boolean;
  label: string;
  merchantId: number;
  updatedAt: string;
}

export interface GetWalletAddressListParams extends CommonRequestType {
  chain?: string[];
}

export interface UpdateWalletAddressParams extends Partial<IWalletAddress> {
  id: string;
}

export interface CreateWalletAddressParams extends Partial<IWalletAddress> {}

export interface DeleteWalletAddressParams {
  id: string;
}

export interface GetWalletAddressListResponse extends IPaginatedResponseType<{ wallets: IWalletAddress[] }> {}