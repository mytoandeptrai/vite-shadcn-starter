import type { TFunction } from 'i18next';

export const generateTokenOptions = (t: TFunction) => {
  return [
    { value: 'BNB-USDT', label: t('chains-token.BNB-USDT', { ns: 'common' }), disabled: false },
    { value: 'BNB-USDC', label: t('chains-token.BNB-USDC', { ns: 'common' }), disabled: false },
    { value: 'ETH-USDT', label: t('chains-token.ETH-USDT', { ns: 'common' }), disabled: true },
    { value: 'ETH-USDC', label: t('chains-token.ETH-USDC', { ns: 'common' }), disabled: true },
  ];
};
