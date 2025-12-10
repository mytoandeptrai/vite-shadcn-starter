import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Paragraph, SectionHeading } from '@/components/ui/typography';
import { Show } from '@/components/utilities';
import { useTranslation } from '@/integrations/i18n';

type Option = {
  value: string;
  label: string;
};

type DashboardHeaderUiProps = {
  title: string;
  description: string;
  descriptionNode?: React.ReactNode;
  selectedValue: string;
  onSelect: (value: string) => void;
  options: Option[];
};

const DashboardHeaderUi = ({
  title,
  description,
  descriptionNode,
  selectedValue,
  onSelect,
  options,
}: DashboardHeaderUiProps) => {
  const { t } = useTranslation('dashboard-page');

  return (
    <div className='mb-4 flex items-start justify-between'>
      <div>
        <Show when={!!title}>
          <SectionHeading>{title ?? ''}</SectionHeading>
        </Show>
        {descriptionNode ?? (
          <Show when={!!description}>
            <Paragraph className='mt-2 text-muted-foreground' size='sm'>
              {description ?? ''}
            </Paragraph>
          </Show>
        )}
      </div>
      <Select value={selectedValue} onValueChange={onSelect}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={t('options.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('options.label')}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DashboardHeaderUi;
