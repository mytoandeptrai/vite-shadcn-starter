import type { BaseResponseType, CommonRequestType, IPaginatedResponseType } from "@/types";
import type { IWalletAddress } from "../wallet-address";

export interface IMerchant {
  balance: number;
  createdAt: string;
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  status: string;
  type: string;
  walletAddresses?: IWalletAddress[];
}

export interface GetMarketplaceMerchantsListParams extends CommonRequestType {
  search?: string;
  status?: string[];
}

export interface CreateMarketplaceMerchantParams {
  firstname?: string;
  lastname?: string;
  email?: string;
  walletAddresses?: Partial<IWalletAddress>[];
}

export interface UpdateMarketplaceMerchantParams extends CreateMarketplaceMerchantParams {
  id: string;
  status?: string;
}

export interface DeleteMarketplaceMerchantParams {
  id: string;
}

export interface GetDetailsMarketplaceMerchantParams {
  id: string;
}

export interface CreateMarketplaceMerchantWalletParams {
  merchantId: string;
  label: string;
  chain: string;
  crypto: string;
  address: string;
}

export interface GetMarketplaceMerchantsListResponse extends IPaginatedResponseType<IMerchant[]> {}

export interface GetDetailsMarketplacesMerchantResponse extends BaseResponseType<IMerchant> {}
