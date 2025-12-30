import type { IMerchant } from '@/apis/marketplace';
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
import { formatDate, formatNaturalNumber } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { MoreHorizontal } from 'lucide-react';
import type { ActionType } from '../../hooks';
import TruncateParagraph from '@/components/ui/truncate-paragraph';

interface MerchantColumnsProps {
  t: TFunction;
  onAction?: (merchant: IMerchant, actionType: ActionType) => void;
}

export const createColumns = ({ t, onAction }: MerchantColumnsProps): ColumnDef<IMerchant>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.name')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const name = `${_row.firstname ?? '-'} ${_row.lastname ?? '-'}`;
      return <TruncateParagraph truncatedContent={name} fullContent={name} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.email')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.email}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.balance')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{formatNaturalNumber(_row.balance)}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.status')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const status = _row.status.toLowerCase();
      return <Badge variant={status === 'active' ? 'default' : 'failed'}>{t(`table.labels.${status}`)}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.created-at')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const date = formatDate(_row.createdAt);
      return <div className='font-medium'>{date}</div>;
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.actions')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const status = _row.status;

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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction?.(_row, status === 'ACTIVE' ? 'inactive' : 'active')}>
              {status === 'ACTIVE' ? t('table.actions.inactive') : t('table.actions.active')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.(_row, 'view')}>{t('table.actions.view')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.(_row, 'delete')}>{t('table.actions.delete')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
