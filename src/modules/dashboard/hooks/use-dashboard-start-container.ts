import { useGetDashboardStartGuide } from '@/apis/dashboard';
import { PAGE_SIZE_OPTIONS, ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const useDashboardStartContainer = () => {
  const { data, isLoading } = useGetDashboardStartGuide();
  const [activeItem, setActiveItem] = useState('wallet');
  const { t } = useTranslation('dashboard-page');
  const navigate = useNavigate();

  const listMemo = useMemo(() => {
    const startGuideData = data?.data;
    return [
      {
        value: 'wallet',
        label: t('start-guide.labels.add-wallet-address'),
        description: t('start-guide.descriptions.add-wallet-address'),
        subLabel: t('start-guide.sub-labels.connect-wallet'),
        completed: startGuideData?.wallet?.completed ?? false,
        onClick: () => {
          return navigate({
            to: ROUTES.WALLET_ADDRESS,
            search: {
              page: 1,
              pageSize: PAGE_SIZE_OPTIONS[0],
              sortBy: 'createdAt',
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
        completed: startGuideData?.apiKeys?.completed ?? false,
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
        completed: startGuideData?.sdk?.completed ?? false,
        onClick: () => {
          return navigate({
            to: ROUTES.DEVELOPER,
          });
        },
      },
    ];
  }, [t, data?.data, navigate]);

  return {
    t,
    isLoading,
    listMemo,
    activeItem,
    setActiveItem,
  };
};