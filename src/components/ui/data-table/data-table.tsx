import NoDataIcon from '@/assets/icons/no-data-icon.svg?react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableLoading, TableRow } from '@/components/ui/table';
import { Show } from '@/components/utilities';
import { cn } from '@/lib/utils';
import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { DataTablePagination } from './data-table-pagination';

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  onSortingChange?: (sorting: SortingState) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
  };
  isLoading?: boolean;
  children?: React.ReactNode;
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, row: TData) => void;
  containerClassName?: React.ComponentProps<"div">["className"];
  tableContainerClassName?: React.ComponentProps<"div">["className"];
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onPaginationChange,
  onSortingChange,
  onFilterChange,
  pagination,
  children,
  onRowClick,
  isLoading = false,
  containerClassName,
  tableContainerClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      sorting,
      columnVisibility,
    },

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: (updaterOrValue) => {
      setSorting(updaterOrValue);
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
      onSortingChange?.(newValue);
    },

    onColumnFiltersChange: (updaterOrValue) => {
      setColumnFilters(updaterOrValue);
      const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;
      onFilterChange?.(newValue);
    },

    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className='space-y-4'>
      {children}
      <div className={cn('flex w-full flex-col gap-4', containerClassName)}>
        <div className={cn('flex flex-2/3 flex-col overflow-hidden rounded-md border', tableContainerClassName)}>
          <Table>
            <TableHeader className='sticky top-0 z-10 bg-background shadow-md'>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <TableRow key={headerGroup.id} className='*:whitespace-nowrap'>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className='p-2 px-4'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableHeader>
            <TableBody>
              <Show when={isLoading}>
                <TableLoading cols={columns.length} rows={rows.length} />
              </Show>

              <Show when={!isLoading && !!rows?.length}>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(e) => onRowClick?.(e, row.original)}
                    className='*:whitespace-nowrap odd:bg-muted/50'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='p-2 px-4'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </Show>

              <Show when={!isLoading && !rows.length}>
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    <div className='flex w-full items-center justify-center'>
                      <NoDataIcon className='h-40 w-32' />
                    </div>
                  </TableCell>
                </TableRow>
              </Show>
            </TableBody>
          </Table>
          <Show when={!!pagination?.pageCount && !isLoading && data.length > 0}>
            <DataTablePagination pagination={pagination} onPaginationChange={onPaginationChange} />
          </Show>
        </div>
      </div>
    </div>
  );
}