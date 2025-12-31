'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { BaseFormFieldProps } from '@/types/base-form';
import type * as React from 'react';

interface FormattedNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
  suffix?: React.ReactNode;
}

function FormattedNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  readOnly,
  suffix,
}: FormattedNumberInputProps<TFieldValues, TName>) {
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
          <FormControl>
            <Input
              type="text"
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              suffix={suffix}
              value={field.value !== undefined && field.value !== null && !Number.isNaN(Number(field.value)) ? Number(field.value).toLocaleString('en-US') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  const numValue = value === '' ? undefined : Number.parseFloat(value);
                  field.onChange(numValue);
                }
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormattedNumberInput };