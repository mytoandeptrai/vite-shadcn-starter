import { PageContainer } from '@/components/containers';
import { useMerchantContainer } from '../../hooks';
import MerchantInfoContainer from '../merchant-info-container';
import MerchantWalletContainer from '../merchant-wallet-container';

const MerchantDetailsContainer = () => {
  const { t, merchantId, isLoading, error, merchant, onRefetch } = useMerchantContainer();

  return (
    <PageContainer
      pageTitle={t('title')}
      pageDescription={t('description')}
      isLoading={isLoading}
      errorMessage={error?.message}
    >
      <div className='space-y-6'>
        <MerchantInfoContainer merchant={merchant} onRefetch={onRefetch} />
        <MerchantWalletContainer
          merchantId={merchantId}
          walletAddresses={merchant?.walletAddresses || []}
          onRefetch={onRefetch}
        />
      </div>
    </PageContainer>
  );
};

export default MerchantDetailsContainer;
