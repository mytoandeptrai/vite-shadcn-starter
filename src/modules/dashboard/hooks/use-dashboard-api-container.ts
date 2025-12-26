import type { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateOptions } from './config';
import { useGetDashboardApiUsage } from '@/apis/dashboard';

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

  const { data, isLoading } = useGetDashboardApiUsage(
    {
      period: selectedValue,
    },
    {
      placeholderData: (prev) => prev,
    }
  );

  const chartData = useMemo(() => {
    const rawData = data?.data?.chartData ?? [];
    
    if (rawData.length === 0) {
      return [];
    }

    const groupedMap = new Map<string, { date: string; success: number; failure: number }>();

    rawData.forEach((item) => {
      // Extract date only from date-time string (YYYY-MM-DD)
      const dateOnly = new Date(item.date).toISOString().split('T')[0];
      const existing = groupedMap.get(dateOnly);

      if (existing) {
        // Sum success and failure for the same date
        existing.success += item.success ?? 0;
        existing.failure += item.failure ?? 0;
      } else {
        groupedMap.set(dateOnly, {
          date: dateOnly,
          success: item.success ?? 0,
          failure: item.failure ?? 0,
        });
      }
    });

    // Convert map to array and sort by date (ascending)
    const groupedArray = Array.from(groupedMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return groupedArray;
  }, [data?.data?.chartData]);

  return {
    t,
    options,
    selectedValue,
    chartData,
    chartConfig,
    isLoading,
    onSelect,
  };
};
