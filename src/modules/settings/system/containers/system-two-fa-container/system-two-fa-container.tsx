import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Show } from '@/components/utilities';
import { useSystemTwoFaContainer } from '../../hooks';
import SystemTwoFaStepsContainer from '../system-two-fa-steps-container';
import SystemTwoFaRemoveModal from '../../components/system-two-fa-steps/system-two-fa-remove-modal';

const SystemTwoFaContainer = () => {
  const {
    t,
    isEnabledTwoFa,
    isOpenSteps,
    isRemovedTwoFa,
    onBack,
    onClick,
    isLoading,
    onSubmitRemoveTwoFa,
    onResetTwoFa,
  } = useSystemTwoFaContainer();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle className='text-base'>{t('system.labels.two-fa.title')}</CardTitle>
          <CardDescription>{t('system.labels.two-fa.description')}</CardDescription>
        </div>
      </CardHeader>
      <Show when={!isOpenSteps}>
        <CardFooter>
          <Button onClick={onClick} className='w-32'>
            {isEnabledTwoFa ? t('system.buttons.remove-two-fa') : t('system.buttons.enable-two-fa')}
          </Button>
        </CardFooter>
      </Show>
      <Show when={isOpenSteps}>
        <SystemTwoFaStepsContainer onBack={onBack} />
      </Show>
      <Show when={isRemovedTwoFa}>
        <SystemTwoFaRemoveModal
          open={isRemovedTwoFa}
          onClose={onResetTwoFa}
          isLoading={isLoading}
          onSubmit={onSubmitRemoveTwoFa}
        />
      </Show>
    </Card>
  );
};

export default SystemTwoFaContainer;