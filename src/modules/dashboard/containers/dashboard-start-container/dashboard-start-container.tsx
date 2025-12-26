import { Accordion } from '@/components/ui/accordion';
import DashboardStartInfoUi from '../../components/dashboard-start-info-ui';
import { useDashboardStartContainer } from '../../hooks';

const DashboardStartContainer = () => {
  const { t, isLoading, listMemo, activeItem, setActiveItem } = useDashboardStartContainer();

  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <h2 className='mb-2 font-semibold text-foreground text-xl'>{t('start-guide.title')}</h2>
      <p className='mb-6 text-muted-foreground text-sm'>{t('start-guide.description')}</p>
      <Accordion type='single' value={activeItem} onValueChange={setActiveItem} collapsible>
        {listMemo.map((item) => (
          <DashboardStartInfoUi key={item.value} item={item} isLoading={isLoading} />
        ))}
      </Accordion>
    </div>
  );
};

export default DashboardStartContainer;
