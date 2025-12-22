import type { TFunction } from 'i18next';
import z from 'zod';

/** Validate Ethereum address format (0x followed by 40 hex characters) */
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const walletAddressCreateFormSchema = (t: TFunction) => {
  return z
    .object({
      address: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.wallet-address.label', { ns: 'wallet-address-page' }),
          ns: 'common',
        }),
      }),
      chain: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.chain.label', { ns: 'wallet-address-page' }),
          ns: 'common',
        }),
      }),
      label: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.label.label', { ns: 'wallet-address-page' }),
          ns: 'common',
        }),
      }),
      crypto: z.string().min(1, {
        message: t('errors.common.field-required', {
          field: t('fields.crypto.label', { ns: 'wallet-address-page' }),
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
};

type WalletAddressCreateFormData = z.infer<ReturnType<typeof walletAddressCreateFormSchema>>;

const initialWalletAddressCreateFormData: WalletAddressCreateFormData = {
  label: '',
  address: '',
  chain: '',
  id: '',
  crypto: '',
};

export { initialWalletAddressCreateFormData, walletAddressCreateFormSchema, type WalletAddressCreateFormData };
