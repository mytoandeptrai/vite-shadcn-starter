import { Accordion } from '@/components/ui/accordion';
import { PAGE_SIZE_OPTIONS, ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import DashboardStartInfoUi from '../../components/dashboard-start-info-ui';

const DashboardStartContainer = () => {
  const [completed] = useState({ wallet: false, apiKeys: false, sdk: false });
  const [activeItem, setActiveItem] = useState('wallet');
  const { t } = useTranslation('dashboard-page');
  const navigate = useNavigate();

  const listMemo = useMemo(() => {
    return [
      {
        value: 'wallet',
        label: t('start-guide.labels.add-wallet-address'),
        description: t('start-guide.descriptions.add-wallet-address'),
        subLabel: t('start-guide.sub-labels.connect-wallet'),
        completed: completed.wallet,
        onClick: () => {
          return navigate({
            to: ROUTES.WALLET_ADDRESS,
            search: {
              page: 1,
              pageSize: PAGE_SIZE_OPTIONS[0],
              sortBy: 'created_at',
              orderBy: 'desc',
              forceAddWallet: true,
              search: '',
              chain: [],
              crypto: [],
            },
          });
        },
      },
      {
        value: 'apiKeys',
        label: t('start-guide.labels.generate-apiKeys'),
        description: t('start-guide.descriptions.generate-apiKeys'),
        subLabel: t('start-guide.sub-labels.create-api-keys'),
        completed: completed.apiKeys,
        onClick: () => {
          return navigate({
            to: ROUTES.DEVELOPER,
          });
        },
      },
      {
        value: 'sdk',
        label: t('start-guide.labels.download-sdk'),
        description: t('start-guide.descriptions.download-sdk'),
        subLabel: t('start-guide.sub-labels.download-sdk'),
        completed: completed.sdk,
        onClick: () => {
          return navigate({
            to: ROUTES.DEVELOPER,
          });
        },
      },
    ];
  }, [t, completed.apiKeys, completed.sdk, completed.wallet, navigate]);

  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <h2 className='mb-2 font-semibold text-foreground text-xl'>{t('start-guide.title')}</h2>
      <p className='mb-6 text-muted-foreground text-sm'>{t('start-guide.description')}</p>
      <Accordion type='single' value={activeItem} onValueChange={setActiveItem} collapsible>
        {listMemo.map((item) => (
          <DashboardStartInfoUi key={item.value} item={item} />
        ))}
      </Accordion>
    </div>
  );
};

export default DashboardStartContainer;
