'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BaseFormFieldProps, FormOption } from '@/types/base-form';
import { Show } from '../utilities';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: FormOption[];
  placeholder?: string;
  searchable?: boolean;
  selectClassName?: string;
}

function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  options,
  placeholder = 'Select an option',
  disabled,
  className,
  selectClassName,
  fullWidth,
}: FormSelectProps<TFieldValues, TName>) {
  const { t } = useTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className='ml-1 text-red-500'>*</span>}
            </FormLabel>
          )}
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger
                className={cn(selectClassName, {
                  'w-full': fullWidth,
                })}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
              <Show when={!options || options.length === 0}>
                <SelectItem value='no-options' disabled>
                  {t('labels.no-options', { ns: 'common' })}
                </SelectItem>
              </Show>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormSelect, type FormOption };
