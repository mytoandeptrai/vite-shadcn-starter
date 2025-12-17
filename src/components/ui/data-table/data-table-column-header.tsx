import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  customTitle?: React.ReactNode;
  customTitleClassName?: string;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  customTitle,
  customTitleClassName,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();
  if (!column.getCanSort()) {
    return customTitle ?? <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='-ml-3 h-8 data-[state=open]:bg-accent'>
            {customTitle ?? <span className={cn(customTitleClassName)}>{title}</span>}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : (
              <ChevronsUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            {t('data-table.sort.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            {t('data-table.sort.desc')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
