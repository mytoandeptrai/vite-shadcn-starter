import { FormSelect } from '@/components/form-fields/form-select';
import { useTranslation } from '@/integrations/i18n';
import type { WalletAddressCreateFormData } from '@/modules/wallet-address/hooks/schema';
import type { Option } from '@/types';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/form-fields/form-input';

type MerchantFormAddressUiProps = {
  onClose: () => void;
  options: Option<string>[];
  tokenOptions: Option<string>[];
};

const MerchantFormAddressUi = ({ options, tokenOptions, onClose }: MerchantFormAddressUiProps) => {
  const { t } = useTranslation('wallet-address-page');
  const { control } = useFormContext<WalletAddressCreateFormData>();

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 items-start gap-4 md:grid-cols-2'>
        <FormSelect
          control={control}
          name='chain'
          label={t('fields.chain.label')}
          placeholder={t('fields.chain.placeholder')}
          options={options}
          required
          selectClassName='w-full'
        />
        <FormSelect
          control={control}
          name='crypto'
          label={t('fields.crypto.label')}
          placeholder={t('fields.crypto.placeholder')}
          options={tokenOptions}
          required
          selectClassName='w-full'
        />
      </div>
      <FormInput
        control={control}
        name='label'
        label={t('fields.label.label')}
        placeholder={t('fields.label.placeholder')}
        required
      />
      <FormInput
        control={control}
        name='address'
        label={t('fields.wallet-address.label')}
        placeholder={t('fields.wallet-address.placeholder')}
        required
      />
      <div className='flex items-center justify-between gap-2 pt-2'>
        <Button className='w-1/2' size='lg' type='button' variant='outline' onClick={onClose}>
          {t('buttons.cancel', { ns: 'common' })}
        </Button>
        <Button className='w-1/2' size='lg' type='submit'>
          {t('buttons.ok', { ns: 'common' })}
        </Button>
      </div>
    </div>
  );
};

export default MerchantFormAddressUi;
