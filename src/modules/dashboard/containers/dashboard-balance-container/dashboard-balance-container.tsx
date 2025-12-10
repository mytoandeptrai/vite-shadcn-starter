import DashboardChartUi from '../../components/dashboard-chart-ui';
import DashboardHeaderUi from '../../components/dashboard-header-ui/dashboard-header-ui';
import { useDashboardBalanceContainer } from '../../hooks';

const DashboardBalanceContainer = () => {
  const { onSelect, options, selectedValue, t, chartData, chartConfig } = useDashboardBalanceContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-balance.title')}
        description={t('dashboard-balance.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardChartUi data={chartData} chartConfig={chartConfig} />
    </div>
  );
};

export default DashboardBalanceContainer;
