import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useTranslation } from '@/integrations/i18n';
import type { ChartDaum2 } from '@/apis/dashboard';
import { formatNaturalNumber } from '@/utils';
import { memo } from 'react';

type DashboardBalanceChartUiProps = {
  data: ChartDaum2[];
  selectedCrypto: string;
  isLoading: boolean;
};

const CRYPTO_ASSETS: Record<string, string> = {
  'usdt-erc20': '#26A69A',
  'usdc-erc20': '#2E7D32',
  'usdt-bep20': '#F57C00',
  'usdc-bep20': '#1565C0',
};

const DashboardBalanceChartUi = ({ isLoading, data, selectedCrypto }: DashboardBalanceChartUiProps) => {
  const { t } = useTranslation('dashboard-page');
  return (
    <>
      <ResponsiveContainer width='100%' height={350}>
        <AreaChart data={isLoading ? [] : data}>
          <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
          <XAxis dataKey='date' className='text-xs' />
          <YAxis className='text-xs' />
          <Tooltip
            content={({ payload, label }) => (
              <div className='rounded-md border border-border bg-card px-4 py-1'>
                <p className='font-medium text-sm'>{label}</p>
                <p className='text-sm' style={{ color: CRYPTO_ASSETS[selectedCrypto] }}>
                  {t('balance-chart.value')}: {formatNaturalNumber(Number(payload?.[0]?.value ?? 0))}
                </p>
              </div>
            )}
          />
          <Area
            type='monotone'
            dataKey='amount'
            stroke={CRYPTO_ASSETS[selectedCrypto]}
            fillOpacity={1}
            fill='url(#colorBalance)'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(DashboardBalanceChartUi);
