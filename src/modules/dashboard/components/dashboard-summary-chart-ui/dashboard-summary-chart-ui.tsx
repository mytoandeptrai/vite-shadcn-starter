import type { ChartDaum3 } from '@/apis/dashboard';
import { useTranslation } from '@/integrations/i18n';
import { formatNaturalNumber } from '@/utils';
import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DashboardSummaryChartUiProps = {
  data: ChartDaum3[];
  isLoading: boolean;
};

const DashboardSummaryChartUi = ({ data, isLoading }: DashboardSummaryChartUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={isLoading ? [] : data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis dataKey='date' className='text-xs' />
        <YAxis className='text-xs' />
        <Tooltip
          content={({ payload, label }) => (
            <div className='rounded-md border border-border bg-card px-4 py-1'>
              <p className='font-medium text-sm'>{label}</p>
              <p className='text-primary text-sm'>
                {t('summary-chart.orders')}: {formatNaturalNumber(Number(payload?.[0]?.value ?? 0))}
              </p>
            </div>
          )}
        />
        <Bar dataKey='orders' fill='var(--color-primary)' radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default memo(DashboardSummaryChartUi);
