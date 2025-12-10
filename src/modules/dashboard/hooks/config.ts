import type { TFunction } from 'i18next';

export const generateOptions = (t: TFunction) => {
  return [
    { value: '2', label: t('options.today') },
    { value: '7', label: t('options.7-days') },
    { value: '30', label: t('options.30-days') },
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