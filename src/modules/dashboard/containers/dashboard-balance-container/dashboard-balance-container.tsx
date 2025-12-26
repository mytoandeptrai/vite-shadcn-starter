import DashboardBalanceChartUi from '../../components/dashboard-balance-chart-ui';
import DashboardBalanceInfoUi from '../../components/dashboard-balance-info-ui';
import DashboardBalanceTabsUi from '../../components/dashboard-balance-tabs-ui';
import DashboardHeaderUi from '../../components/dashboard-header-ui/dashboard-header-ui';
import { useDashboardBalanceContainer } from '../../hooks';

const DashboardBalanceContainer = () => {
  const { onSelect, onSelectCrypto, options, isLoading, selectedValue, t, chartData, selectedCrypto, cryptoOptions } =
    useDashboardBalanceContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-balance.title')}
        description={t('dashboard-balance.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardBalanceTabsUi
        selectedCrypto={selectedCrypto}
        cryptoOptions={cryptoOptions}
        onSelectCrypto={onSelectCrypto}
      />
      <DashboardBalanceChartUi isLoading={isLoading} data={chartData.chartData} selectedCrypto={selectedCrypto} />
      <DashboardBalanceInfoUi totalBalance={chartData.totalBalance} currency={chartData.currency} />
    </div>
  );
};

export default DashboardBalanceContainer;
