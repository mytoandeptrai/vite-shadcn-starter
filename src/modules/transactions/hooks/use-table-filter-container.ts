import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/transactions';
import type { Option } from '@/types';
import { CHAIN_OPTIONS, CRYPTO_OPTIONS, NETWORK_OPTIONS } from '@/utils';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { DateRange } from 'react-day-picker';

const STATUS_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('status.pending'), value: 'PENDING' },
  { label: t('status.confirming'), value: 'CONFIRMING' },
  { label: t('status.confirmed'), value: 'CONFIRMED' },
  { label: t('status.failed'), value: 'FAILED' },
];

const TYPE_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('types.PAYMENT'), value: 'PAYMENT' },
  { label: t('types.PAYOUT'), value: 'PAYOUT' },
];

const generateSelectedDateRange = (fromDate?: string, toDate?: string) => {
  if (fromDate && toDate) {
    return { from: new Date(fromDate), to: new Date(toDate) };
  }

  if (fromDate) {
    return { from: new Date(fromDate), to: undefined };
  }

  if (toDate) {
    return { from: undefined, to: new Date(toDate) };
  }

  return {
    from: undefined,
    to: undefined,
  };
};

export const useTableFilterContainer = () => {
  const { t } = useTranslation('transactions-page');
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const options = useMemo(
    () => ({
      status: STATUS_OPTIONS(t),
      type: TYPE_OPTIONS(t),
      chain: CHAIN_OPTIONS(t),
      crypto: CRYPTO_OPTIONS(t),
      network: NETWORK_OPTIONS(t),
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value, page: 1 },
      replace: true,
    });
  };

  const onStatusValueChange = (status: string[]) => {
    navigate({
      search: { ...search, status: status ?? undefined, page: 1 },
      replace: true,
    });
  };

  const onTypeValueChange = (type: string[]) => {
    navigate({
      search: { ...search, type: type ?? undefined, page: 1 },
      replace: true,
    });
  };

  const onDateRangeChange = (dateRange?: DateRange) => {
    if (!dateRange) {
      navigate({
        search: { ...search, fromDate: undefined, toDate: undefined, page: 1 },
        replace: true,
      });
      return;
    }
    navigate({
      search: {
        ...search,
        fromDate: dateRange.from?.toISOString(),
        toDate: dateRange.to?.toISOString(),
        page: 1,
      },
      replace: true,
    });
  };

  const onChainValueChange = (chain?: string[]) => {
    navigate({
      search: { ...search, chain: chain ?? undefined, page: 1 },
      replace: true,
    });
  };

  const onCryptoValueChange = (crypto?: string[]) => {
    navigate({
      search: { ...search, crypto: crypto ?? undefined, page: 1 },
      replace: true,
    });
  };

  const onNetworkValueChange = (network?: string[]) => {
    navigate({
      search: { ...search, network: network ?? undefined, page: 1 },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedStatuses: search.status,
    selectedTypes: search.type,
    selectedDateRange: generateSelectedDateRange(search.fromDate, search.toDate),
    selectedChains: search.chain,
    selectedCryptos: search.crypto,
    selectedNetworks: search.network,
    selectedTab: search.tab,
    onSearchValueChange,
    onStatusValueChange,
    onTypeValueChange,
    onDateRangeChange,
    onChainValueChange,
    onCryptoValueChange,
    onNetworkValueChange,
  };
};
