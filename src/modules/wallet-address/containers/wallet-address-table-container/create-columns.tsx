import type { IWalletAddress } from '@/apis/wallet-address';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { capitalizeFirstLetter, formatAddress, formatDate } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { MoreHorizontal } from 'lucide-react';

interface WalletAddressActionsProps {
  t: TFunction;
  onAction: (
    walletAddress: IWalletAddress,
    actionType: 'activate' | 'deactivate' | 'delete' | 'update' | 'create'
  ) => void;
}

export const createColumns = ({ t, onAction }: WalletAddressActionsProps): ColumnDef<IWalletAddress>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.id')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const id = _row.id;
      return <div className='font-medium'>{id}</div>;
    },
  },
  {
    accessorKey: 'label',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.label')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const label = _row.label;
      return <div className='font-medium'>{label}</div>;
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.address')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const address = _row.address;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='font-medium'>{formatAddress(address)}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{address}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'chain',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.chain')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const chain = _row.chain;
      return <div className='font-medium'>{capitalizeFirstLetter(chain)}</div>;
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.status')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const isActive = _row.isActive;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {t(`table.labels.${isActive ? 'active' : 'inactive'}`)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.created-at')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const updatedAt = _row.updatedAt;
      return <div className='font-medium'>{formatDate(updatedAt)}</div>;
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.actions')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const address = _row.address;
      const isActive = _row.isActive;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>{t('table.headers.actions')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(address)}>
              {t('table.actions.copy')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction?.(_row, 'update')}>{t('table.actions.edit')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.(_row, isActive ? 'deactivate' : 'activate')}>
              {isActive ? t('table.actions.deactivate') : t('table.actions.activate')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.(_row, 'delete')} className='text-destructive'>
              {t('table.actions.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
