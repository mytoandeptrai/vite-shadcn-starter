import type { TFunction } from 'i18next';

export const generateOptions = (t: TFunction) => {
  return [
    { value: 'ETH', label: t('chains.ETH', { ns: 'common' }) },
    { value: 'BNB', label: t('chains.BNB', { ns: 'common' }) },
  ];
};

export const generateTokenOptions = (t: TFunction) => {
  return [
    { value: 'USDT', label: t('tokens.USDT', { ns: 'common' }) },
    { value: 'USDC', label: t('tokens.USDC', { ns: 'common' }) },
  ];
};