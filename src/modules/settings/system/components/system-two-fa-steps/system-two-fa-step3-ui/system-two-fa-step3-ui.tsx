import CopyButton from '@/components/ui/copy-button';
import { Paragraph } from '@/components/ui/typography';
import { useTranslation } from '@/integrations/i18n';
import HtmlReactParser from 'html-react-parser';

type SystemTwoFaStep3UiProps = {
  authenticatorCode: string;
};

const SystemTwoFaStep3Ui = ({ authenticatorCode }: SystemTwoFaStep3UiProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <div className='flex flex-col justify-center gap-4'>
      <Paragraph className='text-center text-sm'>{t('system.labels.two-fa.labels.instruction3')}</Paragraph>
      <div className='bg-secondary p-4'>
        <Paragraph className="max-w-md whitespace-normal break-all text-center font-bold text-sm">
          {authenticatorCode}
          <CopyButton className='ml-2' value={authenticatorCode} />
        </Paragraph>
      </div>
      <Paragraph className='text-center text-muted-foreground text-sm'>
        {HtmlReactParser(t('system.labels.two-fa.labels.step3-message'))}
      </Paragraph>
    </div>
  );
};

export default SystemTwoFaStep3Ui;
