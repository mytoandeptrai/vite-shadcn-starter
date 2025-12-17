import { PAGE_SIZE_OPTIONS } from '@/constant';
import { MerchantContainer } from '@/modules/merchants';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const merchantsSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.union([z.literal('asc'), z.literal('desc'), z.undefined()]),
  status: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute('/(public)/merchants/')({
  validateSearch: (search) => {
    const result = merchantsSearchSchema.parse(search);
    return {
      page: result.page ?? 1,
      pageSize: result.pageSize ?? PAGE_SIZE_OPTIONS[0],
      sortBy: result.sortBy ?? 'createdAt',
      sortOrder: result.sortOrder ?? 'desc',
      status: result.status ? result.status.filter((el) => Boolean(el)) : undefined,
      search: result.search ?? '',
    };
  },
  component: MerchantContainer,
});
