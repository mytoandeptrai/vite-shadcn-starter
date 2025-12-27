import { regexEmail } from '@/constant';
import type { TFunction } from 'i18next';
import z from 'zod';
import { isValidEthereumAddress } from '@/utils/common';

const merchantCreateFormSchema = (t: TFunction) => {
  const walletAddressItemSchema = z
    .object({
      address: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.wallet-address.label'),
          ns: 'common',
        }),
      }),
      chain: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.chain.label'),
          ns: 'common',
        }),
      }),
      label: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.label.label'),
          ns: 'common',
        }),
      }),
      crypto: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.crypto.label'),
          ns: 'common',
        }),
      }),
      id: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      /** Validate address format based on selected chain */
      if (data.address && data.chain) {
        if (!isValidEthereumAddress(data.address)) {
          ctx.addIssue({
            code: 'custom',
            path: ['address'],
            message: t('errors.common.address-invalid-format', {
              chain: data.chain,
              ns: 'common',
            }),
          });
        }
      }
    });

  return z
    .object({
      firstName: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.first-name.label'),
          ns: 'common',
        }),
      }),
      lastName: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.last-name.label'),
          ns: 'common',
        }),
      }),
      email: z
        .string()
        .min(1, {
          message: t('errors.common.field-required', {
            field: t('fields.email.label'),
            ns: 'common',
          }),
        })
        .superRefine((val, ctx) => {
          if (val.trim().length === 0) {
            ctx.addIssue({
              code: 'custom',
              message: t('errors.common.field-required', {
                field: t('fields.email.label'),
                ns: 'common',
              }),
            });
          }
          if (!regexEmail.test(val.trim())) {
            ctx.addIssue({
              code: 'custom',
              message: t('errors.validations.MSG-1.10', { ns: 'common' }),
            });
          }
        }),
      walletAddresses: z.array(walletAddressItemSchema).min(1, {
        message: t('errors.wallet-addresses-required'),
      }),
    })
    .superRefine((data, ctx) => {
      // Check for duplicate wallet addresses - must match all 4 fields: chain, crypto, label, address
      const walletAddressKeys = new Set<string>();

      data.walletAddresses.forEach((wa, index) => {
        // Create composite key from all 4 fields (case-insensitive for address and label)
        const chainKey = wa.chain?.trim() || '';
        const cryptoKey = wa.crypto?.trim() || '';
        const labelKey = wa.label?.toLowerCase().trim() || '';
        const addressKey = wa.address?.toLowerCase().trim() || '';

        // Only check if all fields are present
        if (chainKey && cryptoKey && labelKey && addressKey) {
          const compositeKey = `${chainKey}|${cryptoKey}|${labelKey}|${addressKey}`;

          if (walletAddressKeys.has(compositeKey)) {
            // Duplicate found - add error to all fields to make it clear
            ctx.addIssue({
              code: 'custom',
              path: ['walletAddresses', index, 'address'],
              message: t('errors.duplicate-wallet-address'),
            });
          } else {
            walletAddressKeys.add(compositeKey);
          }
        }
      });
    });
};

type MerchantCreateFormData = z.infer<ReturnType<typeof merchantCreateFormSchema>>;

const initialMerchantCreateFormData: MerchantCreateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  walletAddresses: [],
};

export { initialMerchantCreateFormData, merchantCreateFormSchema, type MerchantCreateFormData };
