import { Modal } from '@/components/ui/modal';
import { FormWrapper } from '@/components/ui/form';
import { FormInput } from '@/components/form-fields/form-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { Show } from '@/components/utilities';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/integrations/i18n';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useCreateMarketplaceMerchantWallet, KEYS } from '@/apis/marketplace';
import { useUpdateWalletAddress, type IWalletAddress } from '@/apis/wallet-address';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import z from 'zod';
import type { WalletActionType } from '../hooks';

const merchantWalletFormSchema = (t: any) =>
  z.object({
    label: z.string().min(1, { message: t('errors.common.field-required', { ns: 'common', field: 'Label' }) }),
    address: z.string().min(1, { message: t('errors.common.field-required', { ns: 'common', field: 'Address' }) }),
    chain: z.string().min(1, { message: t('errors.common.field-required', { ns: 'common', field: 'Chain' }) }),
    crypto: z.string().min(1, { message: t('errors.common.field-required', { ns: 'common', field: 'Crypto' }) }),
    id: z.string().optional(),
  });

type MerchantWalletFormData = z.infer<ReturnType<typeof merchantWalletFormSchema>>;

type MerchantWalletFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<IWalletAddress>;
  actionType: WalletActionType;
  merchantId: string;
};

export const MerchantWalletForm = ({
  open,
  onClose,
  onSuccess,
  initialData,
  actionType,
  merchantId,
}: MerchantWalletFormProps) => {
  const { t } = useTranslation('merchants-page');
  const { queryClient } = getContext();

  const chainOptions = useMemo(() => CHAIN_OPTIONS(t), [t]);
  const cryptoOptions = useMemo(() => CRYPTO_OPTIONS(t), [t]);

  const createMutation = useCreateMarketplaceMerchantWallet();
  const updateMutation = useUpdateWalletAddress();

  const defaultValue = useMemo(
    () => ({
      label: '',
      address: '',
      chain: chainOptions[0]?.value || '',
      crypto: cryptoOptions[0]?.value || '',
      id: '',
    }),
    [chainOptions, cryptoOptions]
  );

  const form = useForm<MerchantWalletFormData>({
    resolver: zodResolver(merchantWalletFormSchema(t)),
    defaultValues: defaultValue,
    mode: 'onChange',
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const onCloseDialog = () => {
    form.reset(defaultValue);
    onClose();
  };

  const onSubmit = async (data: MerchantWalletFormData) => {
    if (actionType === 'create') {
      await createMutation.mutateAsync({
        merchantId,
        label: data.label,
        address: data.address,
        chain: data.chain,
        crypto: data.crypto,
      });
      toast.success(t('details.messages.wallet-added'));
    } else if (actionType === 'update' && data.id) {
      await updateMutation.mutateAsync({
        id: data.id,
        label: data.label,
        address: data.address,
        chain: data.chain,
        crypto: data.crypto,
      });
      toast.success(t('details.messages.wallet-updated'));
    }
    queryClient.invalidateQueries({ queryKey: [KEYS.MERCHANT_DETAIL] });
    onCloseDialog();
    onSuccess?.();
  };

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        address: initialData.address ?? '',
        chain: initialData.chain ?? chainOptions[0]?.value,
        id: initialData.id ? String(initialData.id) : '',
        crypto: initialData.crypto ?? cryptoOptions[0]?.value,
        label: initialData.label ?? '',
      });
    } else if (open) {
      form.reset(defaultValue);
    }
  }, [initialData, open, chainOptions, cryptoOptions, defaultValue, form]);

  return (
    <Modal
      title={t(`details.wallet-management.dialogs.${actionType}.title`)}
      description={t(`details.wallet-management.dialogs.${actionType}.description`)}
      isOpen={open}
      onClose={onCloseDialog}
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormSelect
              control={form.control}
              name='chain'
              label={t('details.wallet-management.fields.chain.label')}
              placeholder={t('details.wallet-management.fields.chain.placeholder')}
              options={chainOptions}
              disabled={isLoading || actionType === 'update'}
              required
              selectClassName='w-full'
            />
            <FormSelect
              control={form.control}
              name='crypto'
              label={t('details.wallet-management.fields.crypto.label')}
              placeholder={t('details.wallet-management.fields.crypto.placeholder')}
              options={cryptoOptions}
              disabled={isLoading || actionType === 'update'}
              required
              selectClassName='w-full'
            />
          </div>
          <FormInput
            control={form.control}
            name='label'
            label={t('details.wallet-management.fields.label.label')}
            placeholder={t('details.wallet-management.fields.label.placeholder')}
            required
            disabled={isLoading}
          />
          <FormInput
            control={form.control}
            name='address'
            label={t('details.wallet-management.fields.address.label')}
            placeholder={t('details.wallet-management.fields.address.placeholder')}
            required
            disabled={isLoading || actionType === 'update'}
          />
          <div className='flex items-center justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={onCloseDialog} disabled={isLoading}>
              {t('buttons.cancel', { ns: 'common' })}
            </Button>
            <Button type='submit' disabled={isLoading}>
              <Show when={isLoading}>
                <Spinner />
              </Show>
              {t(`buttons.${actionType}`, { ns: 'common' })}
            </Button>
          </div>
        </div>
      </FormWrapper>
    </Modal>
  );
};
