import type { IPaginatedResponseType } from '@/types';

export type TransactionType = 'PAYMENT' | 'PAYOUT';
export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed';
export type TransactionRelatedType = 'ORDER' | 'WITHDRAWAL';

export interface ITransaction {
  id: number;
  type: TransactionType;
  relatedType: TransactionRelatedType;
  relatedId: number;
  status: TransactionStatus;
  chainId: string;
  txHash: string;
  chain: string;
  smartContract: string;
  blockNumber: number;
  confirmations: number;
  blockTimestamp: string;
  amount: number;
  crypto: string;
  fromAddress: string;
  toAddress: string;
  firstSeenAt: string;
  confirmedAt: string;
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
  dateFrom?: string;
  dateTo?: string;
}

export interface GetTransactionListResponse extends IPaginatedResponseType<ITransaction[]> {}
