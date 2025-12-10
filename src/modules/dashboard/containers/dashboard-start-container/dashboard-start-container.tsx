import { Accordion } from '@/components/ui/accordion';
import { useTranslation } from '@/integrations/i18n';
import { useMemo, useState } from 'react';
import DashboardStartInfoUi from '../../components/dashboard-start-info-ui';

const DashboardStartContainer = () => {
  const [completed] = useState({ wallet: false, apiKeys: false, sdk: false });
  const [activeItem, setActiveItem] = useState('wallet');
  const { t } = useTranslation('dashboard-page');

  const listMemo = useMemo(() => {
    return [
      {
        value: 'wallet',
        label: t('start-guide.labels.add-wallet-address'),
        description: t('start-guide.descriptions.add-wallet-address'),
        subLabel: t('start-guide.sub-labels.connect-wallet'),
        completed: completed.wallet,
        onClick: () => {},
      },
      {
        value: 'apiKeys',
        label: t('start-guide.labels.generate-apiKeys'),
        description: t('start-guide.descriptions.generate-apiKeys'),
        subLabel: t('start-guide.sub-labels.create-api-keys'),
        completed: completed.apiKeys,
        onClick: () => {},
      },
      {
        value: 'sdk',
        label: t('start-guide.labels.download-sdk'),
        description: t('start-guide.descriptions.download-sdk'),
        subLabel: t('start-guide.sub-labels.download-sdk'),
        completed: completed.sdk,
        onClick: () => {},
      },
    ];
  }, [t, completed.apiKeys, completed.sdk, completed.wallet]);

  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <h2 className='mb-2 font-semibold text-foreground text-xl'>Get started with PWC Merchant</h2>
      <p className='mb-6 text-muted-foreground text-sm'>Complete these steps to start accepting payments</p>
      <Accordion type='single' value={activeItem} onValueChange={setActiveItem} collapsible>
        {listMemo.map((item) => (
          <DashboardStartInfoUi key={item.value} item={item} />
        ))}
      </Accordion>
    </div>
  );
};

export default DashboardStartContainer;
