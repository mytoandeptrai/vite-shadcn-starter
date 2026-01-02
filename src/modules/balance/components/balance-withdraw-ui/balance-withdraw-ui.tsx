import { FormNumberInput } from '@/components/form-fields/form-number-input';
import { FormSelect } from '@/components/form-fields/form-select';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';
import { useBalanceWithdraw } from '../../hooks';
import type { Option } from '@/types';

export type BalanceWithdrawUiProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  onSubmit?: (code?: string) => void;
  onClose?: () => void;
  max: number;
  selectedToken: string;
  walletTokenOptions: Option<string>[];
  balanceId?: number;
};

const BalanceWithdrawUi = (props: BalanceWithdrawUiProps) => {
  const { open, onClose, max, walletTokenOptions, selectedToken } = props;
  const { t, form, isLoading, submit } = useBalanceWithdraw(props);

  return (
    <Modal
      title={t('dialogs.balance-withdraw.title')}
      description={t('dialogs.balance-withdraw.description')}
      isOpen={!!open}
      onClose={onClose ?? (() => {})}
    >
      <FormWrapper className='space-y-4' form={form} onSubmit={submit}>
        <div className='flex items-start gap-1'>
          <FormNumberInput
            control={form.control}
            disabled={isLoading}
            name='amount'
            label={t('dialogs.balance-withdraw.fields.amount.label')}
            placeholder={t('dialogs.balance-withdraw.fields.amount.placeholder')}
            className='flex-1'
            required
            suffix={selectedToken ? ` ${selectedToken}` : undefined}
            decimalScale={2}
            thousandSeparator
          />
          <Button
            className='mt-8 w-fit'
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => form.setValue('amount', max, { shouldValidate: true })}
          >
            {t('buttons.max', { ns: 'common' })}
          </Button>
        </div>
        <FormSelect
          control={form.control}
          name='address'
          options={walletTokenOptions}
          label={t('dialogs.balance-withdraw.fields.address.label')}
          placeholder={t('dialogs.balance-withdraw.fields.address.placeholder')}
          selectClassName='h-12! w-full'
        />
        <div className='flex items-center justify-between gap-2'>
          <Button className='w-1/2' size='lg' type='button' variant='outline' disabled={isLoading} onClick={onClose}>
            {t('buttons.cancel', { ns: 'common' })}
          </Button>
          <Button className='w-1/2' size='lg' type='submit' disabled={isLoading}>
            <Show when={isLoading}>
              <Spinner />
            </Show>
            {t('buttons.ok', { ns: 'common' })}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
};

export default BalanceWithdrawUi;
