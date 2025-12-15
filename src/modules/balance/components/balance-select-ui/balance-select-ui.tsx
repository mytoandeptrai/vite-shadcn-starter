import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import type { Option } from '@/types';

type BalanceSelectUiProps = {
  selectedValue: string;
  onSelect: (value: string) => void;
  options: Option<string>[];
};

const BalanceSelectUi = ({ selectedValue, onSelect, options }: BalanceSelectUiProps) => {
  const { t } = useTranslation('balance-page');
  return (
    <Select value={selectedValue} onValueChange={onSelect}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={t('options.placeholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('options.label')}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BalanceSelectUi;
