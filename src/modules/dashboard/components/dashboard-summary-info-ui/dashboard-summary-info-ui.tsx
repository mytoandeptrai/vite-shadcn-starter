import { useTranslation } from '@/integrations/i18n';
import { formatNaturalNumber } from '@/utils';

type DashboardSummaryInfoUiProps = {
  totalOrders?: number;
  averageOrdersPerDay?: number;
};

const DashboardSummaryInfoUi = ({ totalOrders, averageOrdersPerDay }: DashboardSummaryInfoUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <div className='grid grid-cols-2 gap-4 border-muted border-t pt-4'>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.total-orders')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(totalOrders || 0)}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.average-orders-per-day')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(averageOrdersPerDay || 0)}</p>
      </div>
    </div>
  );
};

export default DashboardSummaryInfoUi;
