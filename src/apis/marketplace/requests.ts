import httpInstance from "../http-instance";
import { KEYS } from "./keys";
import type {
  CreateMarketplaceMerchantParams,
  CreateMarketplaceMerchantWalletParams,
  DeleteMarketplaceMerchantParams,
  GetDetailsMarketplaceMerchantParams,
  GetDetailsMarketplacesMerchantResponse,
  GetMarketplaceMerchantsListParams,
  GetMarketplaceMerchantsListResponse,
  UpdateMarketplaceMerchantParams,
} from "./types";

export const getDetailsMarketplacesMerchant = (
  params: GetDetailsMarketplaceMerchantParams,
  signal?: AbortSignal
): Promise<GetDetailsMarketplacesMerchantResponse> => {
  const url = KEYS.MERCHANT_DETAIL.replace(":id", params.id);
  return httpInstance
    .get<GetDetailsMarketplacesMerchantResponse>(url, { signal })
    .then((res) => res);
};

export const getMarketplacesMerchantsList = (
  params: GetMarketplaceMerchantsListParams,
  signal?: AbortSignal
) => {
  return new Promise<GetMarketplaceMerchantsListResponse>((resolve) =>
    resolve({
      data: [],
      pagination: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        totalPages: 1,
        totalCount: 10,
        hasNext: false,
        hasPrev: false,
      },
    })
  );
  return httpInstance
    .get<GetMarketplaceMerchantsListResponse>(KEYS.MERCHANTS, {
      params,
      signal,
    })
    .then((res) => res);
};

export const createMarketplaceMerchant = (
  params: CreateMarketplaceMerchantParams,
  signal?: AbortSignal
) => {
  return httpInstance
    .post(KEYS.MERCHANTS, params, { signal })
    .then((res) => res);
};

export const createMarketplaceMerchantWallet = (
  params: CreateMarketplaceMerchantWalletParams,
  signal?: AbortSignal
) => {
  const url = KEYS.MERCHANT_WALLETS.replace(":id", params.merchantId);
  return httpInstance.post(url, params, { signal }).then((res) => res);
};

export const updateMarketplacesMerchant = (
  params: UpdateMarketplaceMerchantParams,
  signal?: AbortSignal
) => {
  const url = KEYS.MERCHANT_DETAIL.replace(":id", params.id);
  return httpInstance.put(url, params, { signal }).then((res) => res);
};

export const deleteMarketplacesMerchant = (
  params: DeleteMarketplaceMerchantParams,
  signal?: AbortSignal
) => {
  const url = KEYS.MERCHANT_DETAIL.replace(":id", params.id);
  return httpInstance.delete<void>(url, { signal }).then((res) => res);
};
