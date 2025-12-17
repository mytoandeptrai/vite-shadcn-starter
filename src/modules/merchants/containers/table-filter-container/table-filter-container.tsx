import MultiSelectPicker from '@/components/ui/multi-select-picker';
import { HStack } from '@/components/utilities';
import { DebouncedInput } from '@/modules/demo-table/components/debounced-input';
import { useTableFilterContainer } from '../../hooks';

const TableFilterContainer = () => {
  const { t, options, searchValue, selectedStatus, onSearchValueChange, onStatusChange } = useTableFilterContainer();

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
          value={selectedStatus}
          onChange={(value) => {
            onStatusChange(value);
          }}
        />
      </HStack>
    </div>
  );
};

export default TableFilterContainer;
