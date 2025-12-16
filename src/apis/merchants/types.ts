import type { CommonRequestType, IPaginatedResponseType } from '@/types';

export interface IMerchant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  balance: number;
  status: 'active' | 'inactive';
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

export interface GetMerchantListResponse extends IPaginatedResponseType<IMerchant[]> {}
