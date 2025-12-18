import { cn } from '@/lib/utils';
import type { Option } from '@/types';

type DashboardBalanceTabsUiProps = {
  selectedCrypto: string;
  cryptoOptions: Option<string>[];
  onSelectCrypto: (value: string) => void;
};

const DashboardBalanceTabsUi = ({ selectedCrypto, cryptoOptions, onSelectCrypto }: DashboardBalanceTabsUiProps) => {
  return (
    <div className='my-6 flex gap-2 border-muted border-b'>
      {cryptoOptions.map((crypto) => (
        <button
          key={crypto.value}
          type='button'
          onClick={() => onSelectCrypto(crypto.value)}
          className={cn('border-transparent border-b-2 px-4 py-2 font-medium text-sm transition-colors', {
            'border-primary border-b-2 text-primary': selectedCrypto === crypto.value,
            'text-muted-foreground hover:text-foreground': selectedCrypto !== crypto.value,
          })}
        >
          {crypto.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardBalanceTabsUi;
