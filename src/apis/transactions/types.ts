import type { BaseResponseType, IPaginatedResponseType } from '@/types';

export type TransactionType = 'PAYMENT' | 'PAYOUT';
export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed';
export type TransactionRelatedType = 'ORDER' | 'WITHDRAWAL';

export interface ITransaction {
  amount: string
  blockNumber: number
  blockTimestamp: string
  chain: string
  confirmations: number
  confirmedAt: string
  createdAt: string
  crypto: string
  firstSeenAt: string
  fromAddress: string
  id: number
  network: string
  relatedId: number
  relatedType: string
  smartContract: string
  status: string
  toAddress: string
  txHash: string
  type: string
  updatedAt: string
  rawData: Record<string, unknown>;
}

export interface GetTransactionListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  orderBy?: 'desc' | 'asc';
  search?: string;
  type?: string[];
  status?: string[];
  fromDate?: string;
  toDate?: string;
  chain?: string[];
  crypto?: string[];
  network?: string[];
}

export interface GetTransactionDetailParams {
  id: string;
}

export interface GetTransactionListResponse extends IPaginatedResponseType<ITransaction[]> {}
export interface GetTransactionDetailResponse extends BaseResponseType<ITransaction> {}