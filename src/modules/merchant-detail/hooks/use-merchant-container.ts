import { useGetDetailsMarketplaceMerchant } from '@/apis/marketplace';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/merchants/$merchantId';
import { useCallback } from 'react';

export const useMerchantContainer = () => {
  const { t } = useTranslation('merchant-detail-page');
  const { merchantId } = Route.useParams();

  const { data, isLoading, error, refetch } = useGetDetailsMarketplaceMerchant(
    { id: merchantId },
    { enabled: !!merchantId, placeholderData: (prev) => prev }
  );

  const merchant = data?.data;

  const onRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    t,
    merchantId,
    merchant,
    isLoading,
    error,
    onRefetch,
  };
};