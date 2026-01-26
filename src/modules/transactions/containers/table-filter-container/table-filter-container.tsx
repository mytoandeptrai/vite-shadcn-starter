import DateRangePicker from '@/components/ui/date-range-picker';
import MultiSelectPicker from '@/components/ui/multi-select-picker';
import { HStack } from '@/components/utilities';
import { addDays } from 'date-fns';
import { useTableFilterContainer } from '../../hooks';
import DebouncedInput from '@/components/ui/debounced-input';

const TableFilterContainer = () => {
  const {
    t,
    options,
    searchValue,
    selectedStatuses,
    selectedDateRange,
    selectedChains,
    selectedCryptos,
    selectedNetworks,
    onSearchValueChange,
    onStatusValueChange,
    onDateRangeChange,
    onChainValueChange,
    onCryptoValueChange,
    onNetworkValueChange,
  } = useTableFilterContainer();

  return (
    <div className='mt-4'>
      <HStack spacing={12}>
        <DebouncedInput
          placeholder={t('placeholder.search')}
          value={searchValue ?? ''}
          onChange={(val) => {
            onSearchValueChange?.(String(val));
          }}
          className='h-10! w-60 md:w-80'
        />

        <MultiSelectPicker
          title={t('filters.status.label')}
          options={options.status}
          value={selectedStatuses}
          onChange={(value) => {
            onStatusValueChange(value ?? []);
          }}
        />

        <MultiSelectPicker
          title={t('filters.chain.label')}
          options={options.chain}
          value={selectedChains}
          onChange={(value) => {
            onChainValueChange(value);
          }}
        />

        <MultiSelectPicker
          title={t('filters.crypto.label')}
          options={options.crypto}
          value={selectedCryptos}
          onChange={(value) => {
            onCryptoValueChange(value);
          }}
        />

        <MultiSelectPicker
          title={t('filters.network.label')}
          options={options.network}
          value={selectedNetworks}
          onChange={(value) => {
            onNetworkValueChange(value);
          }}
        />

        <DateRangePicker
          placeholder={t('placeholder.dateRange')}
          dateRange={selectedDateRange}
          onOK={(value) => onDateRangeChange(value)}
          maxDate={addDays(new Date(), 1)}
        />
      </HStack>
    </div>
  );
};

export default TableFilterContainer;
