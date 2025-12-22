import { PAGE_SIZE_OPTIONS } from '@/constant';
import { WalletAddressContainer } from '@/modules/wallet-address';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const walletAddressSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortBy: z.string().optional(),
  orderBy: z.union([z.literal('asc'), z.literal('desc'), z.undefined()]),
  chain: z.array(z.string()).optional(),
  crypto: z.array(z.string()).optional(),
  forceAddWallet: z.boolean().optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute('/(private)/wallet-address')({
  validateSearch: (search) => {
    const result = walletAddressSearchSchema.parse(search);
    return {
      page: result.page ?? 1,
      pageSize: result.pageSize ?? PAGE_SIZE_OPTIONS[0],
      sortBy: result.sortBy ?? 'created_at',
      orderBy: result.orderBy ?? 'desc',
      chain: result.chain ?? undefined,
      crypto: result.crypto ?? undefined,
      forceAddWallet: result.forceAddWallet ?? false,
      search: result.search ?? '',
    };
  },
  component: WalletAddressContainer,
});
