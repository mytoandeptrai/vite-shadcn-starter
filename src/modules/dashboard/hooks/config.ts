import type { TFunction } from 'i18next';

export const generateOptions = (t: TFunction) => {
  return [
    { value: 'today', label: t('options.today') },
    { value: '7days', label: t('options.7-days') },
    { value: '30days', label: t('options.30-days') },
  ];
};

export const generateCryptoOptions = (t: TFunction) => {
  return [
    { value: 'usdt-erc20', label: t('options.usdt-erc20') },
    { value: 'usdc-erc20', label: t('options.usdc-erc20') },
    { value: 'usdt-bsc', label: t('options.usdt-bep20') },
    { value: 'usdc-bsc', label: t('options.usdc-bep20') },
  ];
};

export const monthChartData = (value: number) =>
  Array.from({ length: value }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      month: date.toLocaleString('en-US', { month: 'long' }),
      desktop: Math.floor(Math.random() * 500) + 100,
      mobile: Math.floor(Math.random() * 100) + 20,
    };
  });
