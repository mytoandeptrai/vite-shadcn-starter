
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { BaseFormFieldProps } from '@/types/base-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Input } from '../ui/input';

interface FormNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName>,
    Omit<NumericFormatProps, keyof BaseFormFieldProps<TFieldValues, TName>> {
  defaultValue?: number;
}

function FormNumberInput<
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
  thousandSeparator,
  min,
  max,
  suffix,
  prefix,
  fixedDecimalScale,
  decimalScale,
  defaultValue,
  ...props
}: FormNumberInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, name: fieldName, onBlur, ref } = field;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
              </FormLabel>
            )}
            <FormControl>
              <NumericFormat
                value={value}
                name={fieldName}
                onBlur={onBlur}
                getInputRef={ref}
                disabled={disabled}
                readOnly={readOnly}
                placeholder={placeholder}
                {...props}
                allowLeadingZeros
                thousandSeparator={thousandSeparator}
                decimalScale={decimalScale}
                fixedDecimalScale={fixedDecimalScale}
                suffix={suffix}
                prefix={prefix}
                customInput={Input}
                allowNegative={false}
                onValueChange={(values) => {
                  field.onChange(values.floatValue ?? 0);
                }}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export { FormNumberInput };
