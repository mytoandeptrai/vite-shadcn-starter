import { PAGE_SIZE_OPTIONS } from '@/constant';
import { TransactionContainer } from '@/modules/transactions';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const transactionsSearchSchema = z.object({
  tab: z.union([z.literal('payments'), z.literal('payouts'), z.literal('all')]).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.union([z.literal('asc'), z.literal('desc'), z.undefined()]),
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const Route = createFileRoute('/(public)/transactions')({
  validateSearch: (search) => {
    const result = transactionsSearchSchema.parse(search);
    return {
      tab: result.tab ?? 'payments',
      page: result.page ?? 1,
      pageSize: result.pageSize ?? PAGE_SIZE_OPTIONS[0],
      sortBy: result.sortBy ?? 'createdAt',
      sortOrder: result.sortOrder ?? 'desc',
      search: result.search ?? undefined,
      status: result.status ?? undefined,
      type: result.type ?? undefined,
      dateFrom: result.dateFrom ?? undefined,
      dateTo: result.dateTo ?? undefined,
    };
  },
  component: TransactionContainer,
});

