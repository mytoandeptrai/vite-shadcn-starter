import type { ITransaction } from '@/apis/transactions';
import { Badge } from '@/components/ui/badge';
import CopyButton from '@/components/ui/copy-button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import TruncateParagraph from '@/components/ui/truncate-paragraph';
import { capitalizeFirstLetter, formatAddress, formatDate, formatNaturalNumber } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

interface TransactionColumnsProps {
  t: TFunction;
}

export const getTypeDisplay = (type: string, t: TFunction): string => {
  if (type === 'PAYMENT') return t('types.PAYMENT');
  if (type === 'PAYOUT') return t('types.PAYOUT');
  return capitalizeFirstLetter(type);
};

export const getStatusText = (status: string, t: TFunction): string => {
  return t(`status.${status}`);
};

export const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
  if (status === 'confirmed') return 'default';
  if (status === 'pending' || status === 'confirming') return 'secondary';
  return 'destructive';
};

export const createColumns = ({ t }: TransactionColumnsProps): ColumnDef<ITransaction>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.id')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.id}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.type')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{getTypeDisplay(_row.type, t)}</div>;
    },
  },
  {
    accessorKey: 'relatedType',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.relatedType')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.relatedType}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.status')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const status = _row.status;
      return <Badge variant={getStatusVariant(status)}>{getStatusText(status, t)}</Badge>;
    },
  },
  {
    accessorKey: 'chain',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.chain')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.chain}</div>;
    },
  },
  {
    accessorKey: 'chainId',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.chainId')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.chainId}</div>;
    },
  },
  {
    accessorKey: 'txHash',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.txHash')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return (
        <div className='flex items-center gap-1'>
          <TruncateParagraph truncatedContent={formatAddress(_row.txHash)} fullContent={_row.txHash} />
          <CopyButton value={_row.txHash} className='border-none bg-transparent! shadow-none!' />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'blockNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.blockNumber')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatNaturalNumber(_row.blockNumber)}</div>;
    },
  },
  {
    accessorKey: 'confirmations',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.confirmations')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.confirmations}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.amount')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const amount = formatNaturalNumber(_row.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return (
        <div className='font-medium'>
          {amount} {_row.crypto}
        </div>
      );
    },
  },
  {
    accessorKey: 'crypto',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.crypto')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.crypto}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'fromAddress',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.fromAddress')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return (
        <div className='flex items-center gap-1'>
          <TruncateParagraph truncatedContent={formatAddress(_row.fromAddress)} fullContent={_row.fromAddress} />
          <CopyButton value={_row.fromAddress} className='border-none bg-transparent! shadow-none!' />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'toAddress',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.toAddress')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return (
        <div className='flex items-center gap-1'>
          <TruncateParagraph truncatedContent={formatAddress(_row.toAddress)} fullContent={_row.toAddress} />
          <CopyButton value={_row.toAddress} className='border-none bg-transparent! shadow-none!' />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'blockTimestamp',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.blockTimestamp')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.blockTimestamp)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'firstSeenAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.firstSeenAt')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.firstSeenAt)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'confirmedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.date')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.confirmedAt)}</div>;
    },
  },
];
