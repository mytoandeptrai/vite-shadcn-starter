import { useTranslation } from '@/integrations/i18n';
import { formatNaturalNumber } from '@/utils';

type DashboardBalanceInfoUiProps = {
  totalBalance?: number;
  currency?: string;
};

const DashboardBalanceInfoUi = ({ totalBalance, currency }: DashboardBalanceInfoUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <div className='grid grid-cols-2 gap-4 border-muted border-t pt-4'>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.current-balance')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(totalBalance || 0)}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.currency')}</p>
        <p className='font-bold text-base'>{currency}</p>
      </div>
    </div>
  );
};

export default DashboardBalanceInfoUi;
