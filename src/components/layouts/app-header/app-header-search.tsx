import DebouncedInput from '@/components/ui/debounced-input';

import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';

const AppHeaderSearch = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string | number>('');
  return (
    <div>
      <DebouncedInput
        placeholder={t('labels.search')}
        className='h-8! md:w-80'
        value={searchValue}
        onChange={(val) => setSearchValue(val)}
      />
    </div>
  );
};

export default AppHeaderSearch;
