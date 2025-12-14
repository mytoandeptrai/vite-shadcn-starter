import type { IPaginatedResponseType } from '@/types';

export type TransactionType = 'payment' | 'payout';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'desc' | 'asc';
  search?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetTransactionListResponse extends IPaginatedResponseType<ITransaction[]> {}
