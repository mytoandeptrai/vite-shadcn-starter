import { useTranslation } from '@/integrations/i18n';
import { Route } from '@/routes/(private)/transactions';
import type { Option } from '@/types';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { DateRange } from 'react-day-picker';

const STATUS_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('status.pending'), value: 'pending' },
  { label: t('status.confirming'), value: 'confirming' },
  { label: t('status.confirmed'), value: 'confirmed' },
  { label: t('status.failed'), value: 'failed' },
];

const TYPE_OPTIONS = (t: TFunction): Option<string>[] => [
  { label: t('types.PAYMENT'), value: 'PAYMENT' },
  { label: t('types.PAYOUT'), value: 'PAYOUT' },
];

const generateSelectedDateRange = (dateFrom?: string, dateTo?: string) => {
  if (dateFrom && dateTo) {
    return { from: new Date(dateFrom), to: new Date(dateTo) };
  }

  if (dateFrom) {
    return { from: new Date(dateFrom), to: undefined };
  }

  if (dateTo) {
    return { from: undefined, to: new Date(dateTo) };
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
    }),
    [t]
  );

  const onSearchValueChange = (value: string) => {
    navigate({
      search: { ...search, search: value },
      replace: true,
    });
  };

  const onStatusValueChange = (status: string[]) => {
    navigate({
      search: { ...search, status: status.length ? status : undefined },
      replace: true,
    });
  };

  const onTypeValueChange = (type: string[]) => {
    navigate({
      search: { ...search, type: type.length ? type : undefined },
      replace: true,
    });
  };

  const onDateRangeChange = (dateRange?: DateRange) => {
    if (!dateRange) {
      navigate({
        search: { ...search, dateFrom: undefined, dateTo: undefined },
        replace: true,
      });
      return;
    }
    navigate({
      search: {
        ...search,
        dateFrom: dateRange.from?.toISOString(),
        dateTo: dateRange.to?.toISOString(),
      },
      replace: true,
    });
  };

  return {
    t,
    options,
    searchValue: search.search,
    selectedStatuses: search.status,
    selectedTypes: search.type,
    selectedDateRange: generateSelectedDateRange(search.dateFrom, search.dateTo),
    selectedTab: search.tab,
    onSearchValueChange,
    onStatusValueChange,
    onTypeValueChange,
    onDateRangeChange,
  };
};
