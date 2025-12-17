import DateRangePicker from '@/components/ui/date-range-picker';
import MultiSelectPicker from '@/components/ui/multi-select-picker';
import { HStack, Show } from '@/components/utilities';
import { addDays } from 'date-fns';
import { useTableFilterContainer } from '../../hooks';
import { DebouncedInput } from '@/components/ui/debounced-input';

const TableFilterContainer = () => {
  const {
    t,
    options,
    searchValue,
    selectedStatuses,
    selectedTab,
    selectedTypes,
    selectedDateRange,
    onSearchValueChange,
    onStatusValueChange,
    onTypeValueChange,
    onDateRangeChange,
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
          title={t('labels.status')}
          options={options.status}
          multiple
          value={selectedStatuses}
          onChange={(value) => {
            onStatusValueChange(value ?? []);
          }}
        />

        <Show when={selectedTab === 'all'}>
          <MultiSelectPicker
            title={t('labels.type')}
            options={options.type}
            multiple
            value={selectedTypes}
            onChange={(value) => {
              onTypeValueChange(value ?? []);
            }}
          />
        </Show>

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
