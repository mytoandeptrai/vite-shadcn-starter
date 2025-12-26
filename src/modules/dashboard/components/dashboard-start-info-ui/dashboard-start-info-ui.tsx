import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';

type DashboardStartInfoUiProps = {
  isLoading: boolean;
  item: {
    value: string;
    label: string;
    description: string;
    subLabel: string;
    completed: boolean;
    onClick: () => void;
  };
};

const DashboardStartInfoUi = ({ isLoading, item }: DashboardStartInfoUiProps) => {
  const { t } = useTranslation('');
  return (
    <AccordionItem value={item.value}>
      <AccordionTrigger className='hover:no-underline'>
        <div className='flex flex-1 items-center gap-3'>
          <div className='text-left'>
            <p className='font-medium text-foreground'>{item.label}</p>
            <p className='text-muted-foreground text-xs'>{item.subLabel}</p>
          </div>
        </div>
        <Badge variant={item.completed ? 'default' : 'secondary'}>{item.completed ? 'Completed' : 'Not started'}</Badge>
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex items-center justify-between border-border border-t pt-4 pb-4'>
          <p className='text-muted-foreground text-sm'>{item.description}</p>
          <Button className='w-fit' size='sm' type='button' disabled={item.completed} onClick={item.onClick}>
            <Show when={isLoading}> 
              <Spinner />
            </Show>
            {t('buttons.continue')}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DashboardStartInfoUi;
