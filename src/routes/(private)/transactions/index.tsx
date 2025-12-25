import { PAGE_SIZE_OPTIONS } from '@/constant';
import { TransactionContainer } from '@/modules/transactions';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const transactionsSearchSchema = z.object({
  tab: z.union([z.literal('payments'), z.literal('payouts'), z.literal('all')]).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortBy: z.string().optional(),
  orderBy: z.union([z.literal('asc'), z.literal('desc'), z.undefined()]),
  search: z.string().optional(),
  status: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  chain: z.array(z.string()).optional(),
  crypto: z.array(z.string()).optional(),
  network: z.array(z.string()).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const Route = createFileRoute('/(private)/transactions/')({
  validateSearch: (search) => {
    const result = transactionsSearchSchema.parse(search);
    return {
      tab: result.tab ?? 'payments',
      page: result.page ?? 1,
      pageSize: result.pageSize ?? PAGE_SIZE_OPTIONS[0],
      sortBy: result.sortBy ?? 'updatedAt',
      orderBy: result.orderBy ?? 'desc',
      search: result.search ?? undefined,
      status: result.status ?? undefined,
      type: result.type ?? undefined,
      chain: result.chain ?? undefined,
      crypto: result.crypto ?? undefined,
      network: result.network ?? undefined,
      fromDate: result.fromDate ?? undefined,
      toDate: result.toDate ?? undefined,
    };
  },
  component: TransactionContainer,
});
