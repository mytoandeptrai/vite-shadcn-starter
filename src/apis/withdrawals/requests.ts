import httpInstance from '../http-instance';
import type {
  CreateWithdrawalParams,
  CreateWithdrawalResponse,
  GetWithdrawalListParams,
  GetWithdrawalListResponse,
} from './types';
import { KEYS } from './keys';

export const getWithdrawalList = (params: GetWithdrawalListParams, signal?: AbortSignal) => {
  return httpInstance.get<GetWithdrawalListResponse>(KEYS.WITH_DRAWALS, { params, signal }).then((res) => res);
};

export const createWithdrawal = (params: CreateWithdrawalParams, signal?: AbortSignal) => {
  return httpInstance.post<CreateWithdrawalResponse>(KEYS.WITH_DRAWALS, params, { signal }).then((res) => res);
};