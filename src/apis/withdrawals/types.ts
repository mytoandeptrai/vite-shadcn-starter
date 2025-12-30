import type { BaseResponseType, CommonRequestType, IPaginatedResponseType } from '@/types';

export interface Withdrawal {
  amount: number;
  chain: string;
  crypto: string;
  destination_address: string;
  fee: number;
  net_amount: number;
  requested_at: string;
  status: string;
  tx_hash: string;
  withdrawal_id: number;
}

export interface CreateWithdrawalParams {
  amount: number;
  external_wallet_id: number;
  wallet_balance_id: number;
  idempotencyKey: string;
}

export interface GetWithdrawalListParams extends CommonRequestType {
  status?: string[];
  chain?: string[];
  crypto?: string[];
  fromDate?: string;
  toDate?: string;
}

export interface CreateWithdrawalResponse extends BaseResponseType<Withdrawal> {}

export interface GetWithdrawalListResponse extends IPaginatedResponseType<Withdrawal[]> {}