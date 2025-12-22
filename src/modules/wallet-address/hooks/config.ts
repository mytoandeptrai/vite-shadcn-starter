import type { TFunction } from 'i18next';

export const generateOptions = (t: TFunction) => {
  return [
    { value: 'bsc', label: t('chains.BNB', { ns: 'common' }), disabled: false },
    { value: 'ethereum', label: t('chains.ETH', { ns: 'common' }), disabled: false },
  ];
};

export const generateTokenOptions = (t: TFunction) => {
  return [
    { value: 'USDT', label: t('tokens.USDT', { ns: 'common' }) },
    { value: 'USDC', label: t('tokens.USDC', { ns: 'common' }) },
  ];
};
