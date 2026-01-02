import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Show } from '@/components/utilities';
import { STABLE_TOKEN } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useCurrencyStore } from '@/stores/use-base-store';
import { formatCurrencyWithDecimals, formatNaturalNumber } from '@/utils';
import BigNumber from 'bignumber.js';
import { Clock4Icon, EqualApproximatelyIcon, Wallet } from 'lucide-react';

type BalanceSectionUiProps = {
  title: string;
  description: string;
  onClick?: () => void;
  type: 'available' | 'incoming' | 'processing';
  amount: number;
  selectedToken: string;
  isLoading: boolean;
  exchangeRate: number;
};

const calculateBalance = (amount: number, exchangeRate: number) => {
  const _amount = new BigNumber(amount);
  const _exchangeRate = new BigNumber(exchangeRate);
  return _amount.multipliedBy(_exchangeRate).toNumber();
};

const BalanceSectionUi = ({
  title,
  description,
  amount,
  selectedToken,
  type,
  isLoading,
  exchangeRate,
  onClick,
}: BalanceSectionUiProps) => {
  const { t } = useTranslation('balance-page');
  const { currency } = useCurrencyStore();
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle className='text-base'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {type === 'available' && <Wallet className='h-8 w-8 text-primary' />}
        {type === 'incoming' && <Clock4Icon className='h-8 w-8 text-muted-foreground' />}
      </CardHeader>
      <CardContent>
        <div className='text-balance font-bold text-xl'>
          {formatNaturalNumber(amount)}
          <span className='ml-1'>{STABLE_TOKEN[selectedToken.split('-')[0]] ?? '-'}</span>
        </div>
        <div className='flex items-center gap-0.5'>
          <EqualApproximatelyIcon className='h-4 w-4 text-muted-foreground' />
          <div className='flex items-center gap-1 text-base text-muted-foreground'>
            {formatCurrencyWithDecimals({ num: calculateBalance(amount, exchangeRate) })}
            <span>{currency.code}</span>
            <Show when={isLoading}>
              <Spinner className='size-3' />
            </Show>
          </div>
        </div>
        <Show when={type === 'available'}>
          <div className='mt-4 flex items-center gap-2'>
            <Button type='button' onClick={onClick}>
              {t('actions.with-draw')}
            </Button>
          </div>
        </Show>
      </CardContent>
    </Card>
  );
};

export default BalanceSectionUi;
