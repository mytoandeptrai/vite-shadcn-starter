import { faker } from '@faker-js/faker';
import type {
  GetTransactionDetailParams,
  GetTransactionDetailResponse,
  GetTransactionListParams,
  GetTransactionListResponse,
  ITransaction,
  TransactionStatus,
  TransactionType,
} from './types';

const generateEthereumAddress = (): string => {
  return `0x${faker.string.hexadecimal({ length: 40, casing: 'lower' }).replace('0x', '')}`;
};

const generateTxHash = (): string => {
  return `0x${faker.string.hexadecimal({ length: 64, casing: 'lower' }).replace('0x', '')}`;
};

const mockTransactionList = (count: number, type?: TransactionType, status?: TransactionStatus): ITransaction[] => {
  const types: TransactionType[] = type ? [type] : ['PAYMENT', 'PAYOUT'];
  const statuses: TransactionStatus[] = status ? [status] : ['pending', 'confirming', 'confirmed', 'failed'];
  const chainIds = ['11155111', '56'];
  const chains = ['Ethereum', 'Binance Smart Chain'];
  const cryptos = ['USDT', 'USDC'];
  const relatedTypes: Array<'ORDER' | 'WITHDRAWAL'> = ['ORDER', 'WITHDRAWAL'];

  return Array.from({ length: count }, () => {
    const transactionType = faker.helpers.arrayElement(types);
    const transactionStatus = faker.helpers.arrayElement(statuses);
    const amount = Number.parseFloat(faker.finance.amount({ min: 10, max: 1000, dec: 2 }));
    const crypto = faker.helpers.arrayElement(cryptos);
    const chainId = faker.helpers.arrayElement(chainIds);
    const chain = chainId === '11155111' ? chains[0] : chains[1];
    const blockNumber = faker.number.int({ min: 1000000, max: 99999999 });
    const confirmations = faker.number.int({ min: 0, max: 100 });
    const relatedType = faker.helpers.arrayElement(relatedTypes);
    const blockTimestamp = faker.date.recent({ days: 30 });
    const firstSeenAt = faker.date.recent({ days: 31, refDate: blockTimestamp });
    // confirmedAt: use blockTimestamp for confirmed/failed, future date for confirming, recent past for pending
    const confirmedAt =
      transactionStatus === 'confirmed' || transactionStatus === 'failed'
        ? blockTimestamp
        : transactionStatus === 'confirming'
          ? faker.date.future({ refDate: blockTimestamp })
          : faker.date.recent({ days: 1, refDate: blockTimestamp });

    return {
      id: faker.number.int({ min: 1, max: 999999 }),
      type: transactionType,
      relatedType,
      relatedId: faker.number.int({ min: 1, max: 999999 }),
      status: transactionStatus,
      chainId,
      txHash: generateTxHash(),
      chain,
      smartContract: generateEthereumAddress(),
      blockNumber,
      confirmations,
      blockTimestamp: blockTimestamp.toISOString(),
      amount,
      crypto,
      fromAddress: generateEthereumAddress(),
      toAddress: generateEthereumAddress(),
      firstSeenAt: firstSeenAt.toISOString(),
      confirmedAt: confirmedAt.toISOString(),
      rawData: {
        gasUsed: faker.number.int({ min: 21000, max: 100000 }),
        gasPrice: faker.number.int({ min: 1000000000, max: 100000000000 }),
        nonce: faker.number.int({ min: 0, max: 999 }),
      },
    };
  });
};

export const getTransactionList = (
  params: GetTransactionListParams,
  signal?: AbortSignal
): Promise<GetTransactionListResponse> => {
  console.log('🚀 ~ getTransactionList ~ signal:', params, signal);
  return new Promise<GetTransactionListResponse>((resolve) => {
    const random = Math.floor(Math.random() * 10) + 1;

    // Extract filter types and statuses from params
    // If type array is provided, use first one; otherwise undefined
    const filterType =
      params.type && params.type.length > 0 ? (params.type[0].toUpperCase() as TransactionType) : undefined;

    // If status array is provided, use first one; otherwise undefined
    const filterStatus =
      params.status && params.status.length > 0 ? (params.status[0].toLowerCase() as TransactionStatus) : undefined;

    setTimeout(() => {
      const allData = mockTransactionList(random * 2, filterType, filterStatus);

      // Apply pagination
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const data = allData.slice(startIndex, endIndex);

      resolve({
        data,
        pagination: {
          page,
          pageSize,
          totalPages: Math.ceil(allData.length / pageSize),
          totalCount: allData.length,
          hasNext: endIndex < allData.length,
          hasPrev: page > 1,
        },
      });
    }, 1000);
  });
};

export const getTransactionDetail = (
  params: GetTransactionDetailParams,
  signal?: AbortSignal
): Promise<GetTransactionDetailResponse> => {
  console.log("🚀 ~ getTransactionDetail ~ params:", params, signal)
  return new Promise<GetTransactionDetailResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '',
        data: mockTransactionList(1, undefined, undefined)[0],
      });
    }, 1000);
  });
};