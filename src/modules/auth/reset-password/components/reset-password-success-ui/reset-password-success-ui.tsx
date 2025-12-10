import CircledCheckIcon from '@/assets/icons/circled-check-icon.svg?react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/typography';
import { HStack, VStack } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';
import HtmlReactParser from 'html-react-parser';
type Props = {
  onClick?: () => void;
};

const ResetPasswordSuccessUi = ({ onClick }: Props) => {
  const { t } = useTranslation('reset-password-page');
  return (
    <HStack spacing={20} align='center' justify='center'>
      <VStack spacing={10} align="center" justify="center" className='w-full px-0'>
        <CircledCheckIcon className='size-16' />
        <Heading className='text-center text-base'>{HtmlReactParser(t('labels.success-msg'))}</Heading>
      </VStack>
      <Button className='w-full' size='lg' type='button' onClick={onClick}>
        {t('buttons.login-page')}
      </Button>
    </HStack>
  );
};

export default ResetPasswordSuccessUi;
