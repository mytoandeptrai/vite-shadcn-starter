import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/wallet-address';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS } from '@/utils';
import { useMemo } from 'react';

export const useTableFilterContainer = () => {
  const { t } = useTranslation('wallet-address-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const options = useMemo(
    () => ({
      chain: CHAIN_OPTIONS(t),
      crypto: CRYPTO_OPTIONS(t),
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value },
      replace: true,
    });
  };

  const onChainValueChange = (chain?: string[]) => {
    navigate({
      search: { ...search, chain: chain ?? undefined },
      replace: true,
    });
  };

  const onCryptoValueChange = (crypto?: string[]) => {
    navigate({
      search: { ...search, crypto: crypto ?? undefined },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedChain: search.chain,
    selectedCrypto: search.crypto,
    onSearchValueChange,
    onChainValueChange,
    onCryptoValueChange,
  };
};
