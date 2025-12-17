import { useTranslation } from '@/integrations/i18n';
import { useLayoutEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Paragraph } from '@/components/ui/typography';
import { Show } from '@/components/utilities';
import CopyButton from '@/components/ui/copy-button';
import HtmlReactParser from 'html-react-parser';

type SystemTwoFaStep2UiProps = {
  otpUrl: string;
  authenticatorCode: string;
};

const SystemTwoFaStep2Ui = ({ authenticatorCode, otpUrl }: SystemTwoFaStep2UiProps) => {
  const { t } = useTranslation('settings-page');
  const [imgData, setImgData] = useState('');

  useLayoutEffect(() => {
    QRCode.toDataURL(otpUrl, (_, image_data) => {
      setImgData(image_data);
    });
  }, [otpUrl]);

  return (
    <div className='flex flex-col justify-center gap-4'>
      <Paragraph className='text-center text-sm'>{t('system.labels.two-fa.labels.instruction2')}</Paragraph>
      <Show when={!!imgData}>
        <div className='flex justify-center'>
          <img src={imgData} alt='QR Code' />
        </div>
      </Show>
      <Paragraph className='text-center text-muted-foreground text-sm'>
        {HtmlReactParser(t('system.labels.two-fa.labels.step2-message'))}
      </Paragraph>
      <Paragraph className='max-w-md whitespace-normal break-all text-center font-bold text-sm'>
        {authenticatorCode}
        <CopyButton className='ml-2' value={authenticatorCode} />
      </Paragraph>
    </div>
  );
};

export default SystemTwoFaStep2Ui;
