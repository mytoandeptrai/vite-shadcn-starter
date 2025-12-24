import type { IWalletAddress } from '@/apis/wallet-address';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import type { WalletActionType } from '../../hooks';

interface MerchantColumnsProps {
  t: TFunction;
  onAction?: (walletAddress: IWalletAddress, actionType: WalletActionType) => void;
}

export const createColumns = ({ t, onAction }: MerchantColumnsProps): ColumnDef<IWalletAddress>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('wallet-management.tables.headers.id')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.id}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('wallet-management.tables.headers.label')} />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.label}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'crypto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('wallet-management.tables.headers.crypto')} />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.crypto}</div>;
    },
    enableSorting: false,
  },

  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('wallet-management.tables.headers.address')} />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.address}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('wallet-management.tables.headers.actions')} />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      const isActive = _row.isActive;
      return (
        <div className='flex items-center justify-start gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onAction?.(_row, isActive ? 'inactive' : 'active')}
            className='h-8 w-8 p-0'
          >
            {!isActive ? <Check className='h-4 w-4 text-green-600' /> : <X className='h-4 w-4 text-red-600' />}
          </Button>
          <Button variant='ghost' size='sm' onClick={() => onAction?.(_row, 'update')} className='h-8 w-8 p-0'>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onAction?.(_row, 'delete')}
            className='h-8 w-8 p-0 text-destructive hover:text-destructive'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
