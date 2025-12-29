import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/integrations/i18n';
import SDKGridItemUi from '../sdk-grid-item-ui';
import type { ISDK } from '../../types/sdk.types';

type SDKGridListUiProps = {
  sdks: ISDK[];
  onSDKClick: (sdk: ISDK) => void;
};

const SDKGridListUi = ({ sdks, onSDKClick }: SDKGridListUiProps) => {
  const { t } = useTranslation('developer-page');

  if (sdks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('sdks.title')}</CardTitle>
        <CardDescription>{t('sdks.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {sdks.map((sdk) => (
            <SDKGridItemUi key={sdk.id} sdk={sdk} onClick={() => onSDKClick(sdk)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SDKGridListUi;
