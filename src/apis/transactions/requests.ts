import { faker } from '@faker-js/faker';
import type {
  GetTransactionListParams,
  GetTransactionListResponse,
  ITransaction,
  TransactionStatus,
  TransactionType,
} from './types';

const mockTransactionList = (
  count: number,
  type?: TransactionType,
  status?: TransactionStatus
): ITransaction[] => {
  const types: TransactionType[] = type ? [type] : ['payment', 'payout'];
  const statuses: TransactionStatus[] = status
    ? [status]
    : ['completed', 'pending', 'failed', 'cancelled'];

  return Array.from({ length: count }, () => {
    const transactionType = faker.helpers.arrayElement(types);
    const transactionStatus = faker.helpers.arrayElement(statuses);
    const amount = faker.finance.amount({ min: 10, max: 1000, dec: 2 });

    return {
      id: faker.string.uuid(),
      type: transactionType,
      amount: `$${amount}`,
      status: transactionStatus,
      date: faker.date.recent({ days: 30 }).toISOString(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
    };
  });
};

export const getTransactionList = (
  params: GetTransactionListParams,
  signal?: AbortSignal
): Promise<GetTransactionListResponse> => {
  return new Promise<GetTransactionListResponse>((resolve) => {
    const random = Math.floor(Math.random() * 10) + 1;
    setTimeout(() => {
      const data = mockTransactionList(
        random,
        params.type as TransactionType | undefined,
        params.status as TransactionStatus | undefined
      );

      resolve({
        data,
        hasNextPage: false,
        page: params.page ?? 1,
        totalPage: 1,
        totalCount: data.length,
      });
    }, 1000);
  });
};
