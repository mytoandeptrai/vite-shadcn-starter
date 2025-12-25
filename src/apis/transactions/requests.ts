import httpInstance from '../http-instance';
import { KEYS } from './keys';
import type {
  GetTransactionDetailParams,
  GetTransactionDetailResponse,
  GetTransactionListParams,
  GetTransactionListResponse,
} from './types';

export const getTransactionList = (params: GetTransactionListParams, signal?: AbortSignal) => {
  return httpInstance.get<GetTransactionListResponse>(KEYS.TRANSACTIONS, { params, signal }).then((res) => res);
};

export const getTransactionDetail = (
  params: GetTransactionDetailParams,
  signal?: AbortSignal
): Promise<GetTransactionDetailResponse> => {
  const url = KEYS.TRANSACTION_DETAIL.replace(':id', params.id);
  return httpInstance.get<GetTransactionDetailResponse>(url, { signal }).then((res) => res);
};