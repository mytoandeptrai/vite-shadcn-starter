import type { ITransaction } from '@/apis/transactions';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { capitalizeFirstLetter } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

interface TransactionColumnsProps {
  t: TFunction;
}

export const createColumns = ({ t }: TransactionColumnsProps): ColumnDef<ITransaction>[] => [
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
      return <div className='font-medium'>{capitalizeFirstLetter(status)}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.date')} />,
    cell: ({ row }) => {
      const _row = row.original;
      const date = new Date(_row.date);
      return <div className='font-medium'>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>;
    },
  },
];
