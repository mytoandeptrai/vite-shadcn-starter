import type { TFunction } from 'i18next';

export const generateTokenOptions = (t: TFunction) => {
  return [
    { value: 'USDT-BEP20', label: t('chains-token.USDT-BEP20', { ns: 'common' }), disabled: false },
    { value: 'USDC-BEP20', label: t('chains-token.USDC-BEP20', { ns: 'common' }), disabled: false },
    { value: 'USDT-ERC20', label: t('chains-token.USDT-ERC20', { ns: 'common' }), disabled: true },
    { value: 'USDC-ERC20', label: t('chains-token.USDC-ERC20', { ns: 'common' }), disabled: true },
  ];
};
