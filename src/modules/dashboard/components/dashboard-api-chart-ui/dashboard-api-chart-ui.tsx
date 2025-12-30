import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useTranslation } from '@/integrations/i18n';
import type { ChartDaum } from '@/apis/dashboard';
import { formatNaturalNumber } from '@/utils';
import { memo } from 'react';

type DashboardApiChartUiProps = {
  data: ChartDaum[];
  isLoading: boolean;
};

const DashboardApiChartUi = ({ data, isLoading }: DashboardApiChartUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={isLoading ? [] : data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis dataKey='date' className='text-xs' />
        <YAxis className='text-xs' />
        <Tooltip
          content={({ payload, label }) => (
            <div className='rounded-md border border-border bg-card px-4 py-1'>
              <p className='font-medium text-sm'>{label}</p>
              <p className='text-[#22c55e] text-sm'>
                {t('api-chart.success')}: {formatNaturalNumber(Number(payload?.[0]?.value ?? 0))}
              </p>
              <p className='text-red-500 text-sm'>
                {t('api-chart.failure')}: {formatNaturalNumber(Number(payload?.[1]?.value ?? 0))}
              </p>
            </div>
          )}
        />
        <Legend
          formatter={(value) => {
            if (value === 'success') return t('api-chart.success');
            if (value === 'failure') return t('api-chart.failure');
            return value;
          }}
        />
        <Line
          type='monotone'
          dataKey='success'
          name={t('api-chart.success')}
          stroke='#22c55e'
          strokeWidth={2}
          dot={{ fill: '#22c55e', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type='monotone'
          dataKey='failure'
          name={t('api-chart.failure')}
          stroke='#ef4444'
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default memo(DashboardApiChartUi);
