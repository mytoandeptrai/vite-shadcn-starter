import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import { useCurrencyStore, type Currency } from '@/stores/use-base-store';
import { useMemo } from 'react';

/**
 * Mock currency options
 */
const CURRENCY_OPTIONS: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    decimalPlaces: 2,
  },
  {
    code: 'THB',
    symbol: '฿',
    locale: 'th-TH',
    decimalPlaces: 2,
  },
  {
    code: 'VND',
    symbol: '₫',
    locale: 'vi-VN',
    decimalPlaces: 0,
  },
];

const SystemCurrencyUi = () => {
  const { t } = useTranslation('settings-page');
  const { currency, setCurrency } = useCurrencyStore();

  const currencyOptions = useMemo(() => {
    return CURRENCY_OPTIONS.map((curr) => ({
      value: curr.code,
      label: `${curr.code} (${curr.symbol})`,
      currency: curr,
    }));
  }, []);

  const handleCurrencyChange = (code: string) => {
    const selectedCurrency = CURRENCY_OPTIONS.find((curr) => curr.code === code);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle className='text-base'>{t('system.labels.currencies.title')}</CardTitle>
          <CardDescription>{t('system.labels.currencies.description')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Select value={currency.code} onValueChange={handleCurrencyChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('system.labels.currencies.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default SystemCurrencyUi;
