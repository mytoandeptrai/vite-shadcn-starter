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

export const getStatusVariant = (status: string): 'pending' | 'confirming' | 'confirmed' | 'failed' | 'default' => {
  if (status === 'confirmed') return 'confirmed';
  if (status === 'pending' || status === 'confirming') return 'pending';
  if (status === 'failed') return 'failed';
  return 'default';
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
    enableSorting: false,
  },
  {
    accessorKey: 'relatedType',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.relatedType')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.relatedType}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.status')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const status = _row.status.toLocaleLowerCase();
      return <Badge variant={getStatusVariant(status)}>{getStatusText(status, t)}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'chain',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.chain')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.chain}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'network',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.network')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.network}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.amount')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const amount = formatNaturalNumber(Number(_row.amount ?? 0), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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
    accessorKey: 'blockNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.blockNumber')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatNaturalNumber(_row.blockNumber)}</div>;
    },
    enableSorting: false,
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
    accessorKey: 'confirmedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.date')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.confirmedAt)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.createdAt')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.createdAt)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.updatedAt')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatDate(_row.updatedAt)}</div>;
    },
    enableSorting: false,
  },
];
