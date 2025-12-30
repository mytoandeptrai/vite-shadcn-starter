import { regexEmail, MAX_WALLETS_PER_CHAIN } from '@/constant';
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
      const walletKeys = new Set<string>(); // chain + crypto + address
      const chainCounts = new Map<string, number>(); // count wallets per chain

      data.walletAddresses.forEach((wa, index) => {
        const chainKey = wa.chain?.trim() || '';
        const cryptoKey = wa.crypto?.trim() || '';
        const addressKey = wa.address?.toLowerCase().trim() || '';

        // Only validate if required fields are present
        if (chainKey && cryptoKey && addressKey) {
          // 1. Check for duplicate wallet: chain + crypto + address
          const compositeKey = `${chainKey}|${cryptoKey}|${addressKey}`;
          if (walletKeys.has(compositeKey)) {
            ctx.addIssue({
              code: 'custom',
              path: ['walletAddresses', index, 'address'],
              message: t('errors.duplicate-wallet-address'),
            });
          } else {
            walletKeys.add(compositeKey);
          }

          // 2. Count wallets per chain and validate max limit
          const currentCount = chainCounts.get(chainKey) || 0;
          chainCounts.set(chainKey, currentCount + 1);

          if (chainCounts.get(chainKey)! > MAX_WALLETS_PER_CHAIN) {
            ctx.addIssue({
              code: 'custom',
              path: ['walletAddresses', index, 'chain'],
              message: t('errors.max-wallets-per-chain', { max: MAX_WALLETS_PER_CHAIN }),
            });
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
