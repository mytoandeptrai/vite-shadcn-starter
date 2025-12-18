import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateTokenOptions } from './config';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { toast } from 'sonner';
import { PAGE_SIZE_OPTIONS, PROTOCOL_CHAIN_MAPPING, ROUTES } from '@/constant';
import { Link } from '@tanstack/react-router';
import type { Option } from '@/types';
import { useGetMerchantBalance, useGetMerchantExchangeRates } from '@/apis/merchants';
import { useCurrencyStore } from '@/stores/use-base-store';

const ONE_MINUTES = 1000 * 60 * 1;
const TEN_SECONDS = 1000 * 10;
const FIFTY_SECONDS = 1000 * 50;

export const useBalanceContainer = () => {
  const { t } = useTranslation('balance-page');

  const { user } = useAuthContext();
  const { currency } = useCurrencyStore();

  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);

  const [selectedToken, setSelectedToken] = useState(tokenOptions[0].value);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { data: balanceData, isLoading: isLoadingBalance } = useGetMerchantBalance(
    {
      chain: PROTOCOL_CHAIN_MAPPING[selectedToken.split('-')[1]],
      token: selectedToken.split('-')[0],
    },
    {
      staleTime: TEN_SECONDS,
      refetchInterval: FIFTY_SECONDS,
    }
  );

  const { data: exchangeRatesData, isFetching: isLoadingExchangeRates } = useGetMerchantExchangeRates(
    {
      currency: currency?.code ?? 'USD',
      token: selectedToken.split('-')[0],
    },
    {
      staleTime: ONE_MINUTES,
      refetchInterval: ONE_MINUTES,
    }
  );

  const isEnabledTwoFa = user?.twoFAEnabled ?? false;
  const exchangeRate = exchangeRatesData?.data?.rate ? Number(exchangeRatesData?.data?.rate) : 0;
  const availableBalance = balanceData?.data?.availableBalance ? Number(balanceData?.data?.availableBalance) : 0;
  const incomingBalance = balanceData?.data?.incomingBalance ? Number(balanceData?.data?.incomingBalance) : 0;
  const isLoading = isLoadingBalance || isLoadingExchangeRates;
  const hasWallets = (user?.wallets?.length ?? 0) > 0;

  /** TODO: Filter wallet based on selected token here */
  const walletTokenOptions: Option<string>[] = useMemo(() => {
    if (!user || !user?.wallets?.length) return [];
    return (
      user?.wallets?.map((wallet) => ({
        label: wallet?.address,
        value: String(wallet?.id),
      })) ?? []
    );
  }, [user]);

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    if (!isEnabledTwoFa) {
      toast.error(
        <Link to={ROUTES.SYSTEM} className='hover:underline'>
          {t('messages.require-enable-two-fa', { ns: 'common' })}
        </Link>
      );
      return;
    }

    if (!hasWallets) {
      toast.error(
        <Link
          to={ROUTES.WALLET_ADDRESS}
          search={{
            page: 1,
            pageSize: PAGE_SIZE_OPTIONS[0],
            sortBy: 'createdAt',
            sortOrder: 'desc',
            search: '',
            forceAddWallet: true,
            chain: [],
          }}
          className='hover:underline'
        >
          {t('messages.require-add-wallet', { ns: 'common' })}
        </Link>
      );
      return;
    }

    setIsOpenDialog(true);
  }, [hasWallets, isEnabledTwoFa, t]);

  const onSelectToken = useCallback((value: string) => {
    setSelectedToken(value);
  }, []);

  return {
    t,
    tokenOptions,
    selectedToken,
    availableBalance,
    incomingBalance,
    isOpenDialog,
    walletTokenOptions,
    isLoading,
    exchangeRate,
    onCloseDialog,
    onOpenDialog,
    onSelectToken,
  };
};
