import type { IWalletAddress } from '@/apis/wallet-address';
import { DataTable } from '@/components/ui/data-table';
import { useMemo } from 'react';
import { createColumns } from './create-columns';
import { useTranslation } from '@/integrations/i18n';
import type { WalletActionType } from '../../hooks';

type MerchantDetailWalletTableContainerProps = {
  onAction: (walletAddress: IWalletAddress, actionType: WalletActionType) => void;
  isLoading: boolean;
  isFetching: boolean;
  data: IWalletAddress[];
};

const MerchantDetailWalletTableContainer = ({
  isLoading,
  isFetching,
  data,
  onAction,
}: MerchantDetailWalletTableContainerProps) => {
  const { t } = useTranslation('merchant-detail-page');

  const columns = useMemo(() => createColumns({ t, onAction }), [t, onAction]);

  return <DataTable columns={columns} data={data} isInitialLoading={isLoading} isDataFetching={isFetching} />;
};

export default MerchantDetailWalletTableContainer;

