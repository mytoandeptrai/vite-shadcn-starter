import * as React from 'react';
import { Check, PlusCircle, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Option } from '@/types';
import { useTranslation } from '@/integrations/i18n';

interface MultiSelectPickerProps {
  title?: string;
  options: Option<string>[];
  value?: string[];
  multiple?: boolean;
  onChange?: (value?: string[]) => void;
}

export default function MultiSelectPicker({
  title,
  options,
  value = [],
  multiple = true,
  onChange,
}: MultiSelectPickerProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const selectedValues = React.useMemo(() => new Set(value), [value]);

  const onItemSelect = React.useCallback(
    (option: Option<string>) => {
      const isSelected = selectedValues.has(option.value);

      if (multiple) {
        const next = new Set(selectedValues);

        if (isSelected) {
          next.delete(option.value);
        } else {
          next.add(option.value);
        }

        const result = Array.from(next);
        onChange?.(result.length ? result : undefined);
      } else {
        onChange?.(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [multiple, onChange, selectedValues]
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      onChange?.(undefined);
    },
    [onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {selectedValues.size > 0 ? (
            <div
              onClick={onReset}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onReset();
                }
              }}
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className='rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}

          {title}

          {selectedValues.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-0.5 data-[orientation=vertical]:h-4' />

              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>

              <div className='hidden items-center gap-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant='secondary' key={option.value} className='rounded-sm px-1 font-normal'>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[12.5rem] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className='max-h-full'>
            <CommandEmpty>{t('messages.no-results-found', { ns: 'common' })}</CommandEmpty>

            <CommandGroup className='max-h-[18.75rem] overflow-y-auto'>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem key={option.value} onSelect={() => onItemSelect(option)}>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary [&_svg]:text-white' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className='text-white dark:text-black' />
                    </div>

                    <span className='truncate'>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onChange?.(undefined)} className='justify-center text-center'>
                    {t('messages.clear-filters', { ns: 'common' })}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
