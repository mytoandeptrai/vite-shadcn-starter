import { useTranslation } from '@/integrations/i18n';
import { DebouncedInput } from '@/modules/demo-table/components/debounced-input';
import { useState } from 'react';

const AppHeaderSearch = () => {
  const {t} = useTranslation()
  const [searchValue, setSearchValue] = useState<string | number>('');
  return (
    <div>
      <DebouncedInput placeholder={t('labels.search')} className='h-8! md:w-80' value={searchValue} onChange={(val) => setSearchValue(val)} />
    </div>
  );
};

export default AppHeaderSearch;