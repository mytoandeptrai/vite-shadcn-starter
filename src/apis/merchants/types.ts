import type { BaseResponseType, CommonRequestType, IPaginatedResponseType } from '@/types';
import type { IWalletAddress } from '../wallet-address';

export interface IMerchant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  balance: number;
  status: 'active' | 'inactive';
  walletAddresses?: IWalletAddress[];
}

export interface IExchangeRate {
  currency: string;
  token: string;
  rate: number;
  source: string;
}

export interface IBalance{
  availableBalance: number;
  incomingBalance: number;
}

export interface GetMerchantListParams extends CommonRequestType {
  search?: string;
  status?: string[];
}

export interface CreateMerchantParams {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateMerchantStatusParams {
  id: string;
  status: 'active' | 'inactive';
}

export interface GetMerchantExchangeRatesParams {
  currency: string;
  token: string;
}

export interface GetMerchantListResponse extends IPaginatedResponseType<IMerchant[]> {}

export interface GetMerchantExchangeRatesResponse extends BaseResponseType<IExchangeRate> {}
