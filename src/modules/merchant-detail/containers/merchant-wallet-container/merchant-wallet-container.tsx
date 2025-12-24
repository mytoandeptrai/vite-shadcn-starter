import type { IWalletAddress } from '@/apis/wallet-address';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchantWalletContainer } from '../../hooks';
import MerchantDetailWalletFormContainer from '../merchant-detail-wallet-form-container';
import MerchantDetailWalletTableContainer from '../merchant-detail-wallet-table-container';

interface MerchantWalletContainerProps {
  merchantId: string;
  walletAddresses: IWalletAddress[];
  onRefetch: () => void;
}

const MerchantWalletContainer = ({ merchantId, walletAddresses, onRefetch }: MerchantWalletContainerProps) => {
  const { t, actionType, selectedWallet, onAdd, onClose, onSuccess, onAction } = useMerchantWalletContainer({
    merchantId,
    onRefetch,
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{t('wallet-management.title')}</CardTitle>
          <Button onClick={onAdd} size='lg'>
            {t('wallet-management.buttons.add')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MerchantDetailWalletTableContainer
          isFetching={false}
          isLoading={false}
          data={walletAddresses}
          onAction={onAction}
        />
      </CardContent>
      <MerchantDetailWalletFormContainer
        open={!!actionType}
        onClose={onClose}
        onSuccess={onSuccess}
        initialData={selectedWallet}
        actionType={actionType}
        merchantId={merchantId}
      />
    </Card>
  );
};

export default MerchantWalletContainer;
