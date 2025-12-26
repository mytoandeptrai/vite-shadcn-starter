import type { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateOptions } from './config';
import { useGetDashboardOrderSummary } from '@/apis/dashboard';

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

export const useDashboardSummaryContainer = () => {
  const { t } = useTranslation('dashboard-page');
  const options = useMemo(() => generateOptions(t), [t]);

  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const onSelect = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const { data, isLoading } = useGetDashboardOrderSummary(
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
      return {
        data: [],
        totalOrders: 0,
        averageOrdersPerDay: 0,
      };
    }
    const groupedMap = new Map<string, { date: string; orders: number }>();

    rawData.forEach((item) => {
      const dateOnly = new Date(item.date).toISOString().split('T')[0];
      const existing = groupedMap.get(dateOnly);

      if (existing) {
        existing.orders += item.orders ?? 0;
      } else {
        groupedMap.set(dateOnly, {
          date: dateOnly,
          orders: item.orders ?? 0,
        });
      }
    });

    const groupedArray = Array.from(groupedMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return {
      data: groupedArray,
      totalOrders: data?.data?.totalOrders,
      averageOrdersPerDay: data?.data?.averageOrdersPerDay,
    };
  }, [data?.data?.chartData, data?.data?.averageOrdersPerDay, data?.data?.totalOrders]);

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
