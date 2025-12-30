import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { CalendarIcon, XCircle } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { HStack, Show, VStack } from '../utilities';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange;
  onOK?: (dateRange?: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  placeholder?: string;
}

export default function DateRangePicker({
  className,
  dateRange,
  onOK,
  minDate,
  maxDate,
  disabledDates = [],
  placeholder = 'Pick a date',
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const draftRef = React.useRef(dateRange);

  const onReset = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    draftRef.current = undefined;
    setDate(undefined);
    onOK?.(undefined);
    setOpen(false);
  };

  const onCancel = () => {
    setDate(draftRef.current);
    setOpen(false);
  };

  const onClick = () => {
    draftRef.current = date;
    onOK?.(date);
    setOpen(false);
  };

  React.useEffect(() => {
    setDate(dateRange);
  }, [dateRange]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
            size='sm'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span className='font-medium'>{placeholder}</span>
            )}
            <Show when={!!date?.from || !!date?.to}>
              <div
                onClick={onReset}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event?.stopPropagation();
                    onReset();
                  }
                }}
                role='button'
                tabIndex={0}
                className='rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              >
                <XCircle />
              </div>
            </Show>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <VStack>
            <Calendar
              initialFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return disabledDates.some((disabledDate) => date.getTime() === disabledDate.getTime());
              }}
            />
            <HStack noWrap justify='end' spacing={12} className='p-4'>
              <Button className='w-fit' size='lg' type='button' variant='outline' onClick={onCancel}>
                {t('buttons.cancel', { ns: 'common' })}
              </Button>
              <Button className='w-20' size='lg' type='button' onClick={onClick}>
                {t('buttons.ok', { ns: 'common' })}
              </Button>
            </HStack>
          </VStack>
        </PopoverContent>
      </Popover>
    </div>
  );
}
