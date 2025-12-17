import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useKBar } from 'kbar';
import { SearchIcon } from 'lucide-react';

export default function SearchKbarInput() {
  const { query } = useKBar();
  const { t } = useTranslation();
  return (
    <div className='w-full space-y-2'>
      <Button
        variant='outline'
        className='relative h-9 w-full justify-start rounded-[0.5rem] bg-background font-normal text-muted-foreground text-sm shadow-none sm:pr-12 md:w-40 lg:w-80'
        onClick={query.toggle}
      >
        <SearchIcon className='mr-2 size-4' />
        {t('labels.search-kbar')}
        <kbd className='pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
