import type { Column } from '@tanstack/react-table';
import { DebouncedInput } from './debounced-input';

interface TableFilterProps {
  column: Column<any, unknown>;
}

export function TableFilter({ column }: TableFilterProps) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder='Search...'
      className='w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-white outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500'
    />
  );
}
