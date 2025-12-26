import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

interface DataTablePaginationProps {
  onPaginationChange?: (page: number, pageSize: number, action: 'pagination' | 'limiting') => void;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function DataTablePagination({ onPaginationChange, pagination }: DataTablePaginationProps) {
  const { t } = useTranslation();
  return (
    <div className='my-4 flex flex-col items-center justify-between gap-4 p-2 px-4 md:flex-row md:gap-0'>
      <div className='flex items-center space-x-2'>
        <p className='font-medium text-sm'>{t('data-table.pagination.rows-per-page')}</p>
        <Select
          value={pagination?.pageSize.toString() ?? PAGE_SIZE_OPTIONS[0].toString()}
          onValueChange={(value) => {
            onPaginationChange?.(pagination?.pageIndex ?? 0, Number(value), 'limiting');
          }}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={pagination?.pageSize.toString() ?? PAGE_SIZE_OPTIONS[0].toString()} />
          </SelectTrigger>
          <SelectContent side='top'>
            {PAGE_SIZE_OPTIONS.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center font-medium text-sm'>
          {t('data-table.pagination.page-size', {
            pageSize: pagination?.pageIndex ?? 0 + 1,
            pageCount: pagination?.pageCount,
          })}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => onPaginationChange?.(1, pagination?.pageSize ?? PAGE_SIZE_OPTIONS[0], 'pagination')}
            disabled={!pagination?.hasPrev}
          >
            <span className='sr-only'>{t('data-table.pagination.go-to-first-page')}</span>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() =>
              onPaginationChange?.((pagination?.pageIndex ?? 0) - 1, pagination?.pageSize ?? PAGE_SIZE_OPTIONS[0], 'pagination')
            }
            disabled={!pagination?.hasPrev}
          >
            <span className='sr-only'>{t('data-table.pagination.go-to-previous-page')}</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() =>
              onPaginationChange?.((pagination?.pageIndex ?? 0) + 1, pagination?.pageSize ?? PAGE_SIZE_OPTIONS[0], 'pagination')
            }
            disabled={!pagination?.hasNext}
          >
            <span className='sr-only'>{t('data-table.pagination.go-to-next-page')}</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() =>
              onPaginationChange?.((pagination?.pageCount ?? 0), pagination?.pageSize ?? PAGE_SIZE_OPTIONS[0], 'pagination')
            }
            disabled={!pagination?.hasNext}
          >
            <span className='sr-only'>{t('data-table.pagination.go-to-last-page')}</span>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
