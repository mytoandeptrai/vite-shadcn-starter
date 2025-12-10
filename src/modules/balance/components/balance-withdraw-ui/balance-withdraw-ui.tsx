import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';
import { useBalanceWithdraw } from '../../hooks';

export type BalanceWithdrawUiProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  onSubmit?: (code?: string) => void;
  onClose?: () => void;
  max: number;
};

const BalanceWithdrawUi = (props: BalanceWithdrawUiProps) => {
  const { open, onClose, max } = props;
  const { t, form, isLoading, submit } = useBalanceWithdraw({ onClose, max });

  return (
    <Modal
      title={t('dialogs.balance-withdraw.title')}
      description={t('dialogs.balance-withdraw.description')}
      isOpen={!!open}
      onClose={onClose ?? (() => {})}
    >
      <FormWrapper className='space-y-4' form={form} onSubmit={submit}>
        <FormInput
          control={form.control}
          disabled={isLoading}
          name='amount'
          type="number"
          label={t('dialogs.balance-withdraw.fields.amount.label')}
          placeholder={t('dialogs.balance-withdraw.fields.amount.placeholder')}
          required
        />
        <div className='flex items-center justify-between gap-2'>
        <Button className='w-1/2' size='lg' type='button' variant='outline' disabled={isLoading} onClick={onClose}>
          {t('buttons.cancel', {ns: "common"})}
        </Button>
        <Button className='w-1/2' size='lg' type='submit' disabled={isLoading}>
          <Show when={isLoading}>
            <Spinner />
          </Show>
          {t('buttons.ok', {ns: "common"})}
        </Button>
        </div>
      </FormWrapper>
    </Modal>
  );
};

export default BalanceWithdrawUi;
