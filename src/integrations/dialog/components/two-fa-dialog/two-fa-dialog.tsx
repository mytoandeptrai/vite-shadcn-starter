import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import type * as React from 'react';
import { useTwoFaDialog } from '../../hooks';

export type TwoFaDialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  onSubmit?: (code?: string) => void;
  onClose?: () => void;
  skipInitVerification?: boolean;
  closeOnSubmit?: boolean;
  isLoading?: boolean;
};

const TwoFaDialog = (props: TwoFaDialogProps) => {
  const { open, onClose } = props;
  const { t, form, isGenerating2FaOtpCode, isLoading, submit } = useTwoFaDialog(props);

  return (
    <Modal
      title={t('dialogs.two-fa.title')}
      description={t('dialogs.two-fa.description')}
      isOpen={!!open}
      onClose={onClose ?? (() => {})}
    >
      <FormWrapper className='space-y-4' form={form} onSubmit={submit}>
        <FormInput
          control={form.control}
          disabled={isLoading || isGenerating2FaOtpCode}
          name='code'
          label={t('dialogs.two-fa.fields.code.label')}
          placeholder={t('dialogs.two-fa.fields.code.placeholder')}
          required
        />
        <Button className='w-full' size='lg' type='submit' disabled={isLoading || isGenerating2FaOtpCode}>
          <Show when={isLoading || isGenerating2FaOtpCode}>
            <Spinner />
          </Show>
          {t('buttons.continue')}
        </Button>
      </FormWrapper>
    </Modal>
  );
};

export default TwoFaDialog;
