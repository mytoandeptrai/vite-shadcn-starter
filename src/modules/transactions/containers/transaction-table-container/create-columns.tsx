import type { ITransaction } from '@/apis/transactions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { capitalizeFirstLetter, formatDate } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

interface TransactionColumnsProps {
  t: TFunction;
}

export const createColumns = ({ t }: TransactionColumnsProps): ColumnDef<ITransaction>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.id')} />,
    cell: ({ row }) => {
      const _row = row.original;
      return <div className='font-medium'>{_row.id}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.type')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const type = _row.type;
      return <div className='font-medium'>{capitalizeFirstLetter(type)}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.amount')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const amount = _row.amount;
      return <div className='font-medium'>{amount}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.status')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const status = _row.status;
      return (
        <Badge variant={status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}>
          {capitalizeFirstLetter(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.date')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const date = _row.date;
      return <div className='font-medium'>{formatDate(date)}</div>;
    },
  },
];
