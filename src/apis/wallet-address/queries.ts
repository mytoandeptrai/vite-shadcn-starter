import type { IAxiosResponse } from '@/types';
import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createWalletAddress, deleteWalletAddress, getWalletAddressList, updateWalletAddress } from './requests';
import type {
  CreateWalletAddressParams,
  DeleteWalletAddressParams,
  GetWalletAddressListParams,
  GetWalletAddressListResponse,
  IWalletAddress,
  UpdateWalletAddressParams,
} from './types';

export const useGetWalletAddressList = (
  params: GetWalletAddressListParams,
  options?: Omit<UseQueryOptions<GetWalletAddressListResponse, Error>, 'queryKey'>
) => {
  return useQuery<GetWalletAddressListResponse, Error>({
    queryKey: [KEYS.WALLET_ADDRESS, params],
    queryFn: ({ signal }) => getWalletAddressList(params, signal),
    ...options,
  });
};

export const useCreateWalletAddress = () => {
  return useMutation<IWalletAddress, IAxiosResponse, CreateWalletAddressParams>({
    mutationKey: [KEYS.WALLET_ADDRESS_DETAIL],
    mutationFn: (data) => createWalletAddress(data),
  });
};

export const useUpdateWalletAddress = () => {
  return useMutation<IWalletAddress, IAxiosResponse, UpdateWalletAddressParams>({
    mutationKey: [KEYS.WALLET_ADDRESS_DETAIL],
    mutationFn: (data) => updateWalletAddress(data),
  });
};

export const useDeleteWalletAddress = () => {
  return useMutation<void, IAxiosResponse, DeleteWalletAddressParams>({
    mutationKey: [KEYS.WALLET_ADDRESS_DETAIL],
    mutationFn: (data) => deleteWalletAddress(data),
  });
};