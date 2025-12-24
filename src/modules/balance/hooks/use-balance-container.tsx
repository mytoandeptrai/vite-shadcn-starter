import { useTranslation } from '@/integrations/i18n';
import { useCallback, useMemo, useState } from 'react';
import { generateTokenOptions } from './config';
import { useAuthContext } from '@/integrations/auth/auth-provider';
import { toast } from 'sonner';
import { EUserType, PAGE_SIZE_OPTIONS, PROTOCOL_CHAIN_MAPPING, ROUTES } from '@/constant';
import { Link } from '@tanstack/react-router';
import { useCurrencyStore } from '@/stores/use-base-store';
import { useGetBalanceMarketplace, useGetMerchantBalance } from '@/apis/balances';
import { useGetMerchantExchangeRates } from '@/apis/merchants';
import { useGetWalletAddressList } from '@/apis/wallet-address';

const ONE_MINUTES = 1000 * 60 * 1;
const TEN_SECONDS = 1000 * 10;
const FIFTY_SECONDS = 1000 * 50;

export const useBalanceContainer = () => {
  const { t } = useTranslation('balance-page');
  const { user } = useAuthContext();
  const { currency } = useCurrencyStore();

  const userType = user?.type;

  const tokenOptions = useMemo(() => generateTokenOptions(t), [t]);
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0].value);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const payload = {
    chain: PROTOCOL_CHAIN_MAPPING[selectedToken.split('-')[1]],
    token: selectedToken.split('-')[0],
  };

  const { data: walletAddressesData, isLoading: isLoadingWalletAddresses } = useGetWalletAddressList({
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[2],
    chain: [payload.chain],
    crypto: [payload.token],
  });

  const { data: balanceData, isLoading: isLoadingBalance } = useGetMerchantBalance(
    {},
    {
      staleTime: TEN_SECONDS,
      refetchInterval: FIFTY_SECONDS,
      enabled: userType === EUserType.INDEPENDENT_MERCHANT,
    }
  );

  const { data: balanceMarketplaceData, isLoading: isLoadingBalanceMarketplace } = useGetBalanceMarketplace(
    {},
    {
      staleTime: TEN_SECONDS,
      refetchInterval: FIFTY_SECONDS,
      enabled: userType === EUserType.MARKETPLACE && !!user?.id,
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

  const finalBalanceData = useMemo(() => {
    const chain = PROTOCOL_CHAIN_MAPPING[selectedToken.split('-')[1]];
    const crypto = selectedToken.split('-')[0];
    const balances =
      userType === EUserType.INDEPENDENT_MERCHANT ? (balanceData?.data ?? []) : (balanceMarketplaceData?.data ?? []);

    if (!balances)
      return {
        balanceAvailable: 0,
        balanceIncoming: 0,
      };

    const existedBalances = balances.find((balance) => balance.chain === chain && balance.crypto === crypto);
    if (existedBalances)
      return {
        balanceAvailable: Number(existedBalances.balance_available),
        balanceIncoming: Number(existedBalances.balance_incoming),
      };

    return {
      balanceAvailable: 0,
      balanceIncoming: 0,
    };
  }, [userType, selectedToken, balanceData?.data, balanceMarketplaceData?.data]);

  const walletTokenOptions = useMemo(() => {
    if (isLoadingWalletAddresses || !walletAddressesData?.data?.length) return [];

    return walletAddressesData?.data.map((wallet) => ({
      label: wallet.address,
      value: String(wallet.id),
    }));
  }, [isLoadingWalletAddresses, walletAddressesData]);

  const isEnabledTwoFa = user?.twoFAEnabled ?? false;
  const exchangeRate = exchangeRatesData?.data?.rate ? Number(exchangeRatesData?.data?.rate) : 0;
  const isLoading = isLoadingBalance || isLoadingExchangeRates || isLoadingBalanceMarketplace;
  const hasWallets = walletTokenOptions.length > 0;

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    if (+finalBalanceData.balanceAvailable === 0) {
      toast.error(t('messages.no-balance'));
      return;
    }

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
            orderBy: 'desc',
            search: '',
            forceAddWallet: true,
            chain: [],
            crypto: [],
          }}
          className='hover:underline'
        >
          {t('messages.require-add-wallet', { ns: 'common' })}
        </Link>
      );
      return;
    }

    setIsOpenDialog(true);
  }, [hasWallets, isEnabledTwoFa, t, finalBalanceData.balanceAvailable]);

  const onSelectToken = useCallback((value: string) => {
    setSelectedToken(value);
  }, []);

  return {
    t,
    tokenOptions,
    selectedToken,
    balanceAvailable: finalBalanceData.balanceAvailable,
    balanceIncoming: finalBalanceData.balanceIncoming,
    isOpenDialog,
    walletTokenOptions,
    isLoading,
    exchangeRate,
    onCloseDialog,
    onOpenDialog,
    onSelectToken,
  };
};
