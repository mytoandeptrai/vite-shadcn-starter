import type { IMerchant } from '@/apis/marketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormWrapper } from '@/components/ui/form';
import MerchantDetailInfoFormUi from '../../components/merchant-detail-info-form-ui';
import { useMerchantInfoContainer } from '../../hooks';

export interface MerchantInfoContainerProps {
  merchant?: IMerchant;
  onRefetch: () => void;
}

const MerchantInfoContainer = (props: MerchantInfoContainerProps) => {
  const { t, form, isLoading, isUpdated, onSubmit, onCancel, setIsUpdated } = useMerchantInfoContainer(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('merchant-info.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormWrapper className='space-y-6' form={form} onSubmit={onSubmit}>
          <MerchantDetailInfoFormUi
            isLoading={isLoading}
            isUpdated={isUpdated}
            onCancel={onCancel}
            onEdit={() => setIsUpdated(true)}
          />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default MerchantInfoContainer;
