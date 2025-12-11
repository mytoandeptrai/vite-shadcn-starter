import type { TFunction } from 'i18next';

export const generateOptions = (t: TFunction) => {
  return [
    { value: 'ETH', label: t('blockchains.eth') },
    { value: 'BNB', label: t('blockchains.bnb') },
  ];
};