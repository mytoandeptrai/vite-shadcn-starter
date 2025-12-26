import type { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateCryptoOptions, generateOptions } from './config';
import { useGetDashboardBalance } from '@/apis/dashboard';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export const useDashboardBalanceContainer = () => {
  const { t } = useTranslation('dashboard-page');
  const options = useMemo(() => generateOptions(t), [t]);
  const cryptoOptions = useMemo(() => generateCryptoOptions(t), [t]);

  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0].value);

  const onSelect = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  const onSelectCrypto = useCallback((value: string) => {
    setSelectedCrypto(value);
  }, []);

  const { data, isLoading } = useGetDashboardBalance(
    {
      period: selectedValue,
      crypto: selectedCrypto,
    },
    {
      placeholderData: (prev) => prev,
    }
  );

  const chartData = useMemo(() => {
    const rawData = data?.data?.chartData ?? [];

    if (rawData.length === 0) {
      return {
        chartData: [],
        totalBalance: 0,
        currency: '',
      };
    }

    const groupedMap = new Map<string, { date: string; amount: number }>();

    rawData.forEach((item) => {
      const dateOnly = new Date(item.date).toISOString().split('T')[0];
      const existing = groupedMap.get(dateOnly);

      if (existing) {
        existing.amount += item.amount ?? 0;
      } else {
        groupedMap.set(dateOnly, {
          date: dateOnly,
          amount: item.amount ?? 0,
        });
      }
    });

    const groupedArray = Array.from(groupedMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return {
      chartData: groupedArray,
      totalBalance: data?.data?.totalBalance,
      currency: data?.data?.currency,
    };
  }, [data?.data?.chartData, data?.data?.currency, data?.data?.totalBalance]);

  return {
    t,
    options,
    cryptoOptions,
    selectedValue,
    selectedCrypto,
    chartData,
    isLoading,
    chartConfig,
    onSelect,
    onSelectCrypto,
  };
};
