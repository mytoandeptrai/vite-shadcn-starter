import type { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateCryptoOptions, generateOptions } from './config';

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

  const chartData = useMemo(
    () =>
      Array.from({ length: +selectedValue }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const baseAmount = Math.random() * 50000 + 10000;
        return {
          date: date.toISOString().split('T')[0],
          [selectedCrypto]: Number.parseFloat((baseAmount + Math.sin(i / 5) * 5000).toFixed(2)),
        };
      }),
    [selectedCrypto, selectedValue]
  );

  return {
    t,
    options,
    cryptoOptions,
    selectedValue,
    selectedCrypto,
    chartData,
    chartConfig,
    onSelect,
    onSelectCrypto,
  };
};
