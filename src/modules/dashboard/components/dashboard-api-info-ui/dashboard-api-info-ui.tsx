import { useTranslation } from '@/integrations/i18n';
import { formatNaturalNumber } from '@/utils';

type DashboardApiInfoUiProps = {
  successRate?: number;
  totalCalls?: number;
  totalFailure?: number;
  totalSuccess?: number;
};

const DashboardApiInfoUi = ({ successRate, totalCalls, totalFailure, totalSuccess }: DashboardApiInfoUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <div className='grid grid-cols-2 gap-4 border-muted border-t pt-4 md:grid-cols-4'>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.success-rate')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(successRate || 0)}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.total-calls')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(totalCalls || 0)}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.total-failure')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(totalFailure || 0)}</p>
      </div>
      <div>
        <p className='text-muted-foreground text-sm'>{t('labels.total-success')}</p>
        <p className='font-bold text-base'>{formatNaturalNumber(totalSuccess || 0)}</p>
      </div>
    </div>
  );
};

export default DashboardApiInfoUi;
