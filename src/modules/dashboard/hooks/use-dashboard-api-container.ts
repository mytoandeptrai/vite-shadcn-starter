import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateOptions } from './config';
import type { ChartConfig } from '@/components/ui/chart';
import { monthChartData } from './config';

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

  /** TODO: Request API with selectedValue */
  const chartData = useMemo(() => monthChartData(Number(selectedValue)), [selectedValue])

  return {
    t,
    options,
    selectedValue,
    chartData,
    chartConfig,
    onSelect,
  };
};