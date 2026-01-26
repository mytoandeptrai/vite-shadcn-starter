import { useGetTransactionDetail } from '@/apis/transactions';
import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/transactions/$transactionId';
import { useCallback } from 'react';

export const useTransactionDetailContainer = () => {
  const { t } = useTranslation('transaction-detail-page');
  const { transactionId } = Route.useParams();

  const { data, isLoading, error, refetch } = useGetTransactionDetail(
    { id: transactionId! },
    { enabled: !!transactionId, placeholderData: (prev) => prev }
  );

  const transaction = data?.data;

  const onRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    t,
    transactionId,
    transaction,
    isLoading,
    error,
    onRefetch,
  };
};