import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { createContext, type ReactNode, useContext } from 'react';
import {
  useFieldArray,
  useForm,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
  type UseFormReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { initialMerchantCreateFormData, merchantCreateFormSchema, type MerchantCreateFormData } from '../hooks/schema';

interface MerchantFormContextType {
  form: UseFormReturn<MerchantCreateFormData>;
  fields: FieldArrayWithId<MerchantCreateFormData, 'walletAddresses', 'id'>[];
  append: UseFieldArrayAppend<MerchantCreateFormData, 'walletAddresses'>;
  remove: UseFieldArrayRemove;
}

const MerchantFormContext = createContext<MerchantFormContextType | undefined>(undefined);

export const MerchantFormContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation('merchants-page');

  const form = useForm<MerchantCreateFormData>({
    resolver: zodResolver(merchantCreateFormSchema(t)),
    defaultValues: initialMerchantCreateFormData,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'walletAddresses',
  });

  return (
    <MerchantFormContext.Provider
      value={{
        form,
        fields,
        append,
        remove,
      }}
    >
      {children}
    </MerchantFormContext.Provider>
  );
};

export const useMerchantFormContext = () => {
  const context = useContext(MerchantFormContext);
  if (context === undefined) {
    throw new Error('useMerchantFormContext must be used within a MerchantFormContextProvider');
  }
  return context;
};
