import type { TFunction } from 'i18next';

export const generateTokenOptions = (t: TFunction) => {
  return [
    { value: 'USDT-BRC20', label: t('chains-token.USDT-BRC20', { ns: 'common' }), disabled: false },
    { value: 'USDC-BRC20', label: t('chains-token.USDC-BRC20', { ns: 'common' }), disabled: false },
    { value: 'USDT-ERC20', label: t('chains-token.USDT-ERC20', { ns: 'common' }), disabled: true },
    { value: 'USDC-ERC20', label: t('chains-token.USDC-ERC20', { ns: 'common' }), disabled: true },
  ];
};
