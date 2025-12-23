import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
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
import { KEYS } from "./keys";
import {
  createMarketplaceMerchant,
  createMarketplaceMerchantWallet,
  deleteMarketplacesMerchant,
  getDetailsMarketplacesMerchant,
  getMarketplacesMerchantsList,
  updateMarketplacesMerchant,
} from "./requests";

export const useGetMarketplaceMerchantsList = (
  params: GetMarketplaceMerchantsListParams,
  options?: Omit<
    UseQueryOptions<GetMarketplaceMerchantsListResponse, Error>,
    "queryKey"
  >
) => {
  return useQuery<GetMarketplaceMerchantsListResponse, Error>({
    queryKey: [KEYS.MERCHANTS, params],
    queryFn: ({ signal }) => getMarketplacesMerchantsList(params, signal),
    ...options,
  });
};

export const useGetDetailsMarketplaceMerchant = (
  params: GetDetailsMarketplaceMerchantParams,
  options?: Omit<
    UseQueryOptions<GetDetailsMarketplacesMerchantResponse, Error>,
    "queryKey"
  >
) => {
  return useQuery<GetDetailsMarketplacesMerchantResponse, Error>({
    queryKey: [KEYS.MERCHANT_DETAIL, params],
    queryFn: ({ signal }) => getDetailsMarketplacesMerchant(params, signal),
    ...options,
  });
};

export const useCreateMarketplaceMerchant = () => {
  return useMutation({
    mutationKey: [KEYS.MERCHANTS],
    mutationFn: (params: CreateMarketplaceMerchantParams) =>
      createMarketplaceMerchant(params),
  });
};

export const useCreateMarketplaceMerchantWallet = () => {
  return useMutation({
    mutationKey: [KEYS.MERCHANT_WALLETS],
    mutationFn: (params: CreateMarketplaceMerchantWalletParams) =>
      createMarketplaceMerchantWallet(params),
  });
};

export const useUpdateMarketplaceMerchant = () => {
  return useMutation({
    mutationKey: [KEYS.MERCHANT_DETAIL],
    mutationFn: (params: UpdateMarketplaceMerchantParams) =>
      updateMarketplacesMerchant(params),
  });
};

export const useDeleteMarketplaceMerchant = () => {
  return useMutation({
    mutationKey: [KEYS.MERCHANT_DETAIL],
    mutationFn: (params: DeleteMarketplaceMerchantParams) =>
      deleteMarketplacesMerchant(params),
  });
};
