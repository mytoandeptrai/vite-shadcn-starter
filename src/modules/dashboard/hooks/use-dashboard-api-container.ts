import type { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateOptions } from './config';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export const useDashboardApiContainer = () => {
  const { t } = useTranslation('dashboard-page');
  const options = useMemo(() => generateOptions(t), [t]);

  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const onSelect = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const chartData = useMemo(() => {
    return Array.from({ length: +selectedValue }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const totalCalls = Math.floor(Math.random() * 1000) + 500;
      const successCalls = Math.floor(totalCalls * (0.92 + Math.random() * 0.08));
      return {
        date: date.toISOString().split('T')[0],
        success: successCalls,
        failure: totalCalls - successCalls,
      };
    });
  }, [selectedValue]);

  return {
    t,
    options,
    selectedValue,
    chartData,
    chartConfig,
    onSelect,
  };
};
