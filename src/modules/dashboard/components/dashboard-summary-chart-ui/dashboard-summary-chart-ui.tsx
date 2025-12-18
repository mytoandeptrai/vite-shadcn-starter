import { useTranslation } from '@/integrations/i18n';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DashboardSummaryChartUiProps = {
  data: {
    date: string;
    orders: number;
  }[];
};

const DashboardSummaryChartUi = ({ data }: DashboardSummaryChartUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis dataKey='date' className='text-xs' />
        <YAxis className='text-xs' />
        <Tooltip
          content={({ payload, label }) => (
            <div className='rounded-md border border-border bg-card px-4 py-1'>
              <p className='font-medium text-sm'>{label}</p>
              <p className='text-primary text-sm'>
                {t('summary-chart.orders')}: {payload?.[0]?.value}
              </p>
            </div>
          )}
        />
        <Bar dataKey='orders' fill='var(--color-primary)' radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardSummaryChartUi;
